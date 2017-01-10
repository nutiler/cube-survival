var setEventHandlers = function() {
  socket.on('disconnect', onDisconnect);
  socket.on('spawn', onSpawn)
  socket.on('remove player', onRemovePlayer);
  socket.on('new player', onNewPlayer);

  // socket.on('player up', onPlayerUp);
  // socket.on('player left', onPlayerLeft);
  // socket.on('player right', onPlayerRight);
  // socket.on('player shoot', onPlayerShoot);

  socket.on('destroy player', onDestroyPlayer);
  socket.on('new bullet', onNewBullet);
  socket.on('update bullet', onUpdateBullet);
  socket.on('destroy bullet', onDestroyBullet);
  socket.on('new pixel', onNewPixel);
  socket.on('update pixel', onUpdatePixel);
  socket.on('destroy pixel', onDestroyPixel);
}

function onDisconnect(id) {
  var removePlayer = playerById(id);

  // Player not found
  if (!removePlayer) {
    console.error('Player with', id, 'is not found!')
    return;
  }

  removePlayer.player.kill();
  players.splice(players.indexOf(removePlayer), 1);
}

var firstLoad = true;

function onSpawn(spawn) {
  spawnPlayer = new Player(game, spawn);
  player = spawnPlayer;
  players.push(spawnPlayer);
  setKeys();

  // Camera follows player
  // game.camera.follow(player.player);
  // game.camera.focusOnXY(0, 0);
  cameraPos.x = player.x;
  cameraPos.y = player.y;

  if(firstLoad) {
    socket.on('update player', onUpdatePlayer);
    firstLoad = !firstLoad;
  }
}

function onNewPlayer(player) {
  console.log('new player connected', player);

  var newPlayer = new RemotePlayer(game, player);
  players.push(newPlayer);
}

function onUpdatePlayer(player) {
  var updatePlayer = playerById(player.id);
  updatePlayer.update(player);
}

function onRemovePlayer(id) {
  console.log('player left', id);

  var removePlayer = playerById(id);

  // Player not found
  if(!removePlayer) {
    console.log('Player not found: ', id);
    return;
  }

  clearInterval(removePlayer.trailSpawner);
  removePlayer.text.kill();
  removePlayer.player.kill();

  // Remove player from array
  players.splice(players.indexOf(removePlayer), 1);
}
function onDestroyPlayer(id) {
  var destroyPlayer = playerById(id);

  if(!destroyPlayer) {
    console.log('Player not found:', id);
  }

  if(destroyPlayer === player) {
    unsetKeys();
    displayStartScreen();
  }

  clearInterval(destroyPlayer.trailSpawner);
  destroyPlayer.text.kill();
  destroyPlayer.player.kill();
  players.splice(players.indexOf(destroyPlayer), 1);
}

function onNewBullet(bullet) {
  var newBullet = new Bullet(bullet.id, game, bullet.x, bullet.y, bullet.angle, bullet.speed);
  bullets.push(newBullet);
}

function onUpdateBullet(bullet) {
  var updateBullet = bulletById(bullet.id);
  updateBullet.update(bullet);
}

function onDestroyBullet(id) {
  var destroyBullet = bulletById(id);
  if(!destroyBullet) {
    console.log('bullet not found:', id);
    return;
  }

  destroyBullet.bullet.kill();
  bullets.splice(bullets.indexOf(destroyBullet), 1);
}

function onNewPixel(pixel) {
  var newPixel = new Pixel(pixel.id, game, pixel.x, pixel.y, pixel.angle, pixel.speed, pixel.hue);
  pixels.push(newPixel);
}

function onUpdatePixel(pixel) {
  var updatePixel = pixelById(pixel.id);
  updatePixel.update(pixel);
}

function onDestroyPixel(id) {
  var destroyPixel = pixelById(id);
  if(!destroyPixel) {
    console.log('pixel not found:', id);
    return;
  }
  destroyPixel.pixel.kill();
  pixels.splice(pixels.indexOf(destroyPixel), 1);
}
