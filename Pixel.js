var uuid = require('tower-uuid');

var initialSpeed = 100;
var drag = 0.5;
var lifetime = 60; // in seconds
var immunity = 0.5; // in seconds

function Pixel(game, pid, x, y, hue, health) {
  this.game = game;

  this.x = x;
  this.y = y;
  this.width = 16;
  this.height = 16;
  this.speed = Math.random() * 50 + 50;
  this.immunity = 1;
  this.angle = Math.random() * 360 - 180;
  this.anchorX = 0.5;
  this.anchorY = 0.5;
  this.id = uuid();
  this.pid = pid;
  this.age = 0;
  this.hue = hue;
  this.health = health;

  this.getX = function() {
    return this.x - this.width * this.anchorX;
  };

  this.getY = function() {
    return this.y - this.height * this.anchorY;
  }
}

Pixel.prototype.public = function() {
  return {
    id: this.id,
    x: this.x,
    y: this.y,
    angle: this.angle,
    speed: this.speed,
    hue: this.hue
  };
}

Pixel.prototype.update = function(delta) {
  if(this.speed > 5) {
    this.x += Math.cos(this.angle * Math.PI/180) * this.speed * delta;
    this.y += Math.sin(this.angle * Math.PI/180) * this.speed * delta;
    this.speed *= (1 - (drag * delta));
  } else {
    this.speed = 0;
  }

  this.age += delta;

  if(this.age > lifetime) {
    this.game.destroyPixel(this.id);
  }

  if(this.immunity > 0) {
    this.immunity -= delta;
  }
}

Pixel.prototype.collide = function(col) {
  if(this.immunity <= 0) {
    col.collectPixel(this.health);
    this.game.destroyPixel(this.id);
  }
}

module.exports = Pixel;
