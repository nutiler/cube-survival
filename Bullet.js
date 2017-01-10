var uuid = require('tower-uuid');
var speed = 900;
var drag = 0;
var lifetime = 5;

function Bullet(game, pid, x, y, angle, kills) {
  this.game = game;
  this.x = x;
  this.y = y;
  this.width = 3;
  this.height = 3;
  this.angle = angle;
  this.anchorX = 0.5;
  this.anchorY = 0.5;
  this.id = uuid();
  this.pid = pid;
  this.hit = false;
  this.speed = speed;
  this.age = 0;
  this.minDamage = 2;
  this.damagePercent = 0.10;

  this.getX = function() {
    return this.x - this.width * this.anchorX;
  };
  this.getY = function() {
    return this.y - this.height * this.anchorY;
  }
}

Bullet.prototype.public = function() {
  return {
    id: this.id,
    x: this.x,
    y: this.y,
    angle: this.angle,
    speed: this.speed
  }
}

Bullet.prototype.update = function(delta) {
  this.x += Math.cos(this.angle * Math.PI / 180) * this.speed * delta;
  this.y += Math.sin(this.angle * Math.PI / 180) * this.speed * delta;
  this.age += delta;

  if (this.age > lifetime) {
    this.game.destroyBullet(this.id);
  }
}

Bullet.prototype.collide = function(col) {
  if (this.pid === col.id) {
    // console.log('Collision with Self.');
  }
  else {
    // console.log('Hit Detection.');
    this.game.destroyBullet(this.id);
    if ((col.health * this.damagePercent) > this.minDamage) {
      col.reduceHealth(Math.round(col.health * this.damagePercent));
    }
    else {
      col.reduceHealth(this.minDamage);
    }
  }
}

module.exports = Bullet;
