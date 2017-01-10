var Trail = function(game, startX, startY, angle, tint) {
  this.game = game;

  this.trail = game.add.sprite(startX, startY, 'trail');
  this.trail.angle = angle;

  this.trail.anchor.setTo(0.5, 0.5);

  this.trail.tint = tint;

  setTimeout(function() {
    this.trail.kill();
  }.bind(this), 1500);
}
