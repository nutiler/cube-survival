var socket = io(); // Socket connection
var grid;
var player;
var players = [];
var bullets = [];
var pixels = [];
var currentSpeed = 0;
var keys = {};
var startCoords = {};
var game;

socket.on('connect', function() {
  console.log('Socket connection started!');
});

game = new Phaser.Game('100%', '100%', Phaser.AUTO, '', { preload: preload, create: create, update: update, resize: resize});

function preload() {
  game.load.image('cube', 'assets/cube.png');
  game.load.image('bullet', 'assets/bullet.png');
  game.load.image('grid', 'assets/grid.png');
  game.load.image('pixel', 'assets/pixel.png');
  game.load.image('trail', 'assets/trail.png');

  game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
  game.scale.pageAlignVertically = true;
  game.scale.pageAlignHorizontally = true;
}

function create() {
  setEventHandlers();
  updateLeaderboard();

  // Set world bounds & background
  game.world.setBounds(0, 0, 2000, 2000);
  grid = game.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'grid');
  grid.fixedToCamera = true;
  socket.emit('ready');
}

function resize() {
  grid.height = window.innerHeight;
  grid.width = window.innerWidth;
}

var cameraPos = {};
var lerp = 0.1;

function update() {
  // updatePlayers();
  updateBullets();
  updatePixels();

  grid.tilePosition.x = -game.camera.x
  grid.tilePosition.y = -game.camera.y
}

function updatePlayers() {
  for(var i = 0; i < players.length; i++) {
    players[i].update();
  }
}

function updateBullets() {
  for(var i = 0; i < bullets.length; i++) {
    bullets[i].update();
  }
}

function updatePixels() {
  for(var i = 0; i < pixels.length; i++) {
    pixels[i].update();
  }
}

function setKeys() {
  keys.left = game.input.keyboard.addKey(Phaser.Keyboard.A);
  keys.right = game.input.keyboard.addKey(Phaser.Keyboard.D);
  keys.down = game.input.keyboard.addKey(Phaser.Keyboard.S);
  keys.up = game.input.keyboard.addKey(Phaser.Keyboard.W);
  keys.boost = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
  keys.shoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  keys.left.onDown.add(emitLeftStart, this);
  keys.left.onUp.add(emitLeftStop, this);
  keys.right.onDown.add(emitRightStart, this);
  keys.right.onUp.add(emitRightStop, this);
  keys.up.onDown.add(emitUpStart, this);
  keys.up.onUp.add(emitUpStop, this);
  keys.down.onDown.add(emitDownStart, this);
  keys.down.onUp.add(emitDownStop, this);
  keys.boost.onDown.add(emitBoostStart, this);
  keys.boost.onUp.add(emitBoostStop, this);
  keys.shoot.onDown.add(emitShootStart, this);
  keys.shoot.onUp.add(emitShootStop, this);
}

function unsetKeys() {
  keys.left = game.input.keyboard.removeKey(Phaser.Keyboard.A);
  keys.right = game.input.keyboard.removeKey(Phaser.Keyboard.D);
  keys.down = game.input.keyboard.removeKey(Phaser.Keyboard.S);
  keys.up = game.input.keyboard.removeKey(Phaser.Keyboard.W);
  keys.boost = game.input.keyboard.removeKey(Phaser.Keyboard.SHIFT);
  keys.shoot = game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
}

// Server input functions
function emitLeftStart() {
  socket.emit('left', true);
}

function emitLeftStop() {
  socket.emit('left', false);
}

function emitRightStart() {
  socket.emit('right', true);
}

function emitRightStop() {
  socket.emit('right', false);
}

function emitUpStart() {
  socket.emit('up', true);
}

function emitUpStop() {
  socket.emit('up', false);
}

function emitDownStart() {
  // socket.emit('down', true);
}

function emitDownStop() {
  // socket.emit('down', false);
}

function emitBoostStart() {
  // socket.emit('boost', true);
}

function emitBoostStop() {
  // socket.emit('boost', false);
}

function emitShootStart() {
  socket.emit('shoot', true);
}

function emitShootStop() {
  socket.emit('shoot', false);
}

// UI STUFFS

function startGame(e) {
  if (e.keyCode == 13) {
    socket.emit('start', document.getElementById('nick').value.slice(0, 10));
    hideStartScreen();
  }
}

function displayStartScreen() {
  document.getElementById('start-screen').style.display = 'block';
  document.getElementById('nick').focus();
}

function hideStartScreen() {
  document.getElementById('start-screen').style.display = 'none';
}

function updateLeaderboard() {
  var leaders = players.concat().sort(function(a, b) {
    return parseFloat(b.health) - parseFloat(a.health);
  });
  document.getElementById('leaders').innerHTML = '';
  for(var i = 0; i < 5; i++) {
    if(leaders[i]) {
      document.getElementById('leaders').innerHTML += `<li style="color: ${leaders[i].player.tint.replace('0x', '#')}">${leaders[i].player.name} <span class="score">${leaders[i].health}</span></li>`;
    }
  }
}

setInterval(function() {
  updateLeaderboard();
}, 3000);
