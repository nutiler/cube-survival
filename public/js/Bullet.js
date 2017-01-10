var Bullet = function(id, game, startX, startY, angle, speed) {
  this.game = game;
  this.id = id;
  this.speed = speed;
  this.bullet = game.add.sprite(startX, startY, 'bullet');
  this.bullet.angle = angle;
  this.bullet.anchor.setTo(0.5, 0.5);

  // game.physics.enable(this.bullet, Phaser.Physics.ARCADE);
  this.bullet.name = id.toString();
}

Bullet.prototype.update = function(bullet) {
  // this.bullet.body.velocity.x = 0;
  // this.bullet.body.velocity.y = 0;
  var delta = this.game.time.elapsed / 1000;
  // this.game.physics.arcade.velocityFromAngle(this.bullet.angle, this.speed, this.bullet.body.velocity);
  this.bullet.x += Math.cos(this.bullet.angle * Math.PI/180) * this.speed * delta;
  this.bullet.y += Math.sin(this.bullet.angle * Math.PI/180) * this.speed * delta;
}
