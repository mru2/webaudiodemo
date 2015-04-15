'use strict';

// Setup state
window.audio = new StemsController([
  [ 'drums1' ,  null    ,'bass1' , 'bass2' ],
  [ null     ,  null    , null   , null    ],
  [ 'synth1' , 'synth2' , null   , null    ],
  [ 'pluck1' , 'pluck2' , null   , null    ]
]);

// Render App
React.render(
  React.createElement(Board, {audio: audio}),
  document.getElementById('app')
);

