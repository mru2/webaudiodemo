/** @jsx React.DOM */

(function(global){

  // Button definition
  var Button = React.createClass({

    handleClick: function(){
      // Good enough for now
      switch (this.props.state) {
        case 'idle':
          window.audio.startStem(this.props.id);
          break;
        case 'starting':
          window.audio.stopStem(this.props.id);
          break;
        case 'active':
          window.audio.stopStem(this.props.id);
          break;
        case 'stopping':
          window.audio.startStem(this.props.id);
          break;
      }
    },

    render: function(){
      var className = "button " + ( this.props.state || '' );
      return (
        <button className={className} disabled={this.props.state === 'empty'} onClick={this.handleClick}>
          {this.props.name || '\u00a0'}
        </button>
      );
    }
  });


  // Board definition
  var Board = React.createClass({

    getInitialState: function() {
      return {
        stems: this.props.audio.stems
      };
    },

    componentDidMount: function() {
      var self = this;

      this.props.audio.changed(function(stems){
        self.setState({
          stems: stems
        });
      });
    },

    render: function() {

      var rows = _.map(this.state.stems, function(row){
        var buttons = _.map(row, function(stem){
          return (
            <Button name={stem.name} state={stem.state} id={stem.id} key={stem.id} />
          );
        });

        return (
          <div className="button-row">
            {buttons}
          </div>
        );
      });

      return (
        <div className="board">
          {rows}
        </div>
      );
    }
  });

  global.Board = Board;

})(window);
