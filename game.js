var gameloop = require('node-gameloop');
var util = require('util');
var helper = require('./helpers');
var Player = require('./Player');
var Bullet = require('./Bullet');
var Pixel = require('./Pixel');
const knex = require('./db/knex');


function Game() {
  this.players = [];
  this.bullets = [];
  this.pixels = [];
  this.worldBounds = {
    x: 2000,
    y: 2000
  };
  this.renderLoop;
  this.physicsLoop;
  this.io;
}

Game.prototype.init = function(io) {
  this.io = io;

  // CLIENT SYNC LOOP
  gameloop.setGameLoop(function(delta) {
    this.syncPlayers();
  }.bind(this), 30);

  // MAIN UPDATE LOOP
  this.renderLoop = gameloop.setGameLoop(function(delta) {
    this.updatePlayers(delta);
  }.bind(this), 30)

  this.physicsLoop = gameloop.setGameLoop(function(delta) {
    this.updateBullets(delta);
    this.updatePixels(delta);
    this.checkCollisions(this.bullets, this.players);
    this.checkCollisions(this.pixels, this.players);
    this.checkCollisions(this.players, this.players);
  }.bind(this), 40);

  gameloop.setGameLoop(function(delta) {
    this.checkBoundaries();
  }.bind(this), 10);

  gameloop.setGameLoop(function(delta) {
    util.log("Players:", this.players.length, "Bullets:", this.bullets.length, "Pixels:", this.pixels.length);
    // for(var i = 0; i < this.pixels.length; i++) {
    //   console.log(this.pixels[i].x, this.pixels[i].y);
    // }
  }.bind(this), 10000);
}

Game.prototype.createPlayer = function(id, name) {
  if (helper.playerById(id, this.players)) {
    console.log(id, "already exists");
    return;
  }

  var newPlayer = new Player(id, name, this);
  this.players.push(newPlayer);
  return newPlayer;

}

Game.prototype.updatePlayers = function(delta) {
  for (var i = 0; i < this.players.length; i++) {
    this.players[i].update(delta);
    this.io.updatePlayer(this.players[i].public());
  }
}

Game.prototype.syncPlayers = function(delta) {
  for (var i = 0; i < this.players.length; i++) {
    this.io.updatePlayer(this.players[i].public());
  }
}

Game.prototype.destroyPlayer = function(id) {
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].id === id) {
      // console.log(this.players[i])
      var userdata = {
        username: this.players[i].name,
        kills: this.players[i].kills,
        shots: this.players[i].shots,
        pixels: this.players[i].pixels,
        damage: this.players[i].damage
      }
        knex('scores')
      .insert( userdata, 'id')
      .then(ids => {
          const id = ids[0];
      });
      this.io.destroyPlayer(id);
      this.kills++;
      this.players[i].kill();
      this.players.splice(i, 1);
    }
  }
}

Game.prototype.createBullet = function(pid, x, y, angle) {
  var newBullet = new Bullet(this, pid, x, y, angle);
  this.bullets.push(newBullet);
  this.io.newBullet(newBullet.public());

  return newBullet;
}

Game.prototype.updateBullets = function(delta) {
  for (var i = 0; i < this.bullets.length; i++) {
    // this.io.updateBullet(this.bullets[i].public());
    this.bullets[i].update(delta);
  }
}

Game.prototype.destroyBullet = function(id) {
  for (var i = 0; i < this.bullets.length; i++) {
    if (this.bullets[i].id === id) {
      this.io.destroyBullet(id);
      this.bullets.splice(i, 1);
    }
  }
}

Game.prototype.createPixel = function(pid, x, y, hue, health) {
  var newPixel = new Pixel(this, pid, x, y, hue, health);
  this.pixels.push(newPixel);
  this.io.newPixel(newPixel.public());
  return newPixel;
}

Game.prototype.updatePixels = function(delta) {
  for (var i = 0; i < this.pixels.length; i++) {
    this.pixels[i].update(delta);
  }
}

Game.prototype.destroyPixel = function(id) {
  for (var i = 0; i < this.pixels.length; i++) {
    if (this.pixels[i].id === id) {
      this.io.destroyPixel(id);
      this.pixels.splice(i, 1);
    }
  }
}

Game.prototype.checkCollisions = function(objects1, objects2) {
  for (var i = 0; i < objects1.length; i++) {
    for (var j = 0; j < objects2.length; j++) {
      if (objects1[i] == objects2[j]) {
        continue;
      }
      if (objects1[i].getX() < objects2[j].getX() + objects2[j].width &&
        objects1[i].getX() + objects1[i].width > objects2[j].getX() &&
        objects1[i].getY() < objects2[j].getY() + objects2[j].height &&
        objects1[i].height + objects1[i].getY() > objects2[j].getY()) {
        objects1[i].collide(objects2[j]);
        break;
      }
    }
  }
}

Game.prototype.checkBoundaries = function() {
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].x < 0 || this.players[i].x > this.worldBounds.x) {
      this.destroyPlayer(this.players[i].id);
    }
    else if (this.players[i].y < 0 || this.players[i].y > this.worldBounds.y) {}
  }
}

module.exports = Game;
