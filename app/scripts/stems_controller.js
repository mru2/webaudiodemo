/* exported Audio */

'use strict';

// Fix up prefixing
window.AudioContext = window.AudioContext || window.webkitAudioContext;

(function(global){

  var context;

  var onError = console.log;

  try {
    context = new AudioContext();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }


  // Globals
  var BPM = 120;
  var BAR = ( 60 / BPM ) * 16;

  // BPM handling
  window.nextBar = function(){
    return (((context.currentTime / BAR) >> 0) + 1) * BAR;
  };


  // Stem logic
  var Stem = function(name, id){
    if (name) {
      this.name = name;
      this.path = 'stems/' + name + '.wav';
      this.state = 'idle';
      this.id = id;

      this.loadBuffer();
    }
    else {
      this.name = null;
      this.path = null;
      this.state = 'empty';
      this.id = id;
    }
  };

  Stem.prototype.loadBuffer = function(){
    var self = this;
    var buffer;
    var request = new XMLHttpRequest();
    request.open('GET', this.path, true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer){
        self.buffer = buffer;
      }, onError);
    }
    request.send();
  };

  Stem.prototype.enqueue = function(){
    this.source = context.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(context.destination);
    this.source.loop = true;

    var playAt = nextBar();
    this.source.start(playAt);
    return playAt -context.currentTime;
  };

  Stem.prototype.dequeue = function(){
    var stopAt = nextBar();
    this.source.stop(stopAt);
    return stopAt - context.currentTime;
  };

  // Audio controller
  var Controller = function(stemNames){
    console.log('prepping soundtracks');

    // Default state
    this.playing = false;

    // Create stems
    var id = 0;
    this.stems = _.map(stemNames, function(row){
      return _.map(row, function(stemName){
        return new Stem(stemName, id++);
      });
    });
  };

  Controller.prototype.start = function(){
    console.log('starting playback');
    this.playing = true;
  };

  Controller.prototype.startStem = function(stemId){
    var stem = this.getStem(stemId);
    console.log('starting stem', stem);

    stem.state = 'starting';
    var delay = stem.enqueue();
    this.changed();

    setTimeout(_.bind(function(){ stem.state = 'active'; this.changed(); }, this), delay*1000);
  };

  Controller.prototype.stopStem = function(stemId){
    var stem = this.getStem(stemId);
    console.log('stopping stem', stem);

    stem.state = 'stopping';
    var delay = stem.dequeue();
    this.changed();

    setTimeout(_.bind(function(){ stem.state = 'idle'; this.changed(); }, this), delay*1000);
  };

  Controller.prototype.getStem = function(stemId){
    return this.stems[(stemId/4)>>0][stemId%4];
  };

  Controller.prototype.changed = function(cb){
    if (cb) {
      this.onChangeCb = cb;
    }
    else if (this.onChangeCb) {
      this.onChangeCb(this.stems);
    }
  };

  global.StemsController = Controller;

})(window);
