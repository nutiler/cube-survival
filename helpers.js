module.exports = {
  playerById: function(id, players) {
    for (var i = 0; i < players.length; i++) {
      if (players[i].id === id) {
        return players[i];
      }
    }
    return false;
  },
  bulletById: function(id, bullets) {
    for (var i = 0; i < bullets.length; i++) {
      if (bullets[i].id === id) {
        return bullets[i];
      }
    }
    return false;
  }
}
