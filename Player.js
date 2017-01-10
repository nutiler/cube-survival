function Player(id, name, game) {
    this.game = game;
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.shoot = false;

    this.id = id;
    this.name = name;
    this.shots = 0;
    this.kills = 0;
    this.pixels = 0;
    this.damage = 0;

    this.x = Math.random() * 2000;
    this.y = Math.random() * 2000;
    this.width = 20;
    this.height = 20;
    this.anchorX = 0.5;
    this.anchorY = 0.5;
    this.angle = Math.random() * 360 - 180;
    this.rotationSpeed = 175;
    this.cruiseSpeed = 0;
    this.maxSpeed = 350;
    this.maxBoostDuration = 1000;
    this.boost = 10;
    this.speed = this.cruiseSpeed;
    this.acceleration = 350;
    this.drag = 2.0;

    this.health = 5;
    this.shootDelay = 0.25;
    this.shootTime = this.shootDelay;

    this.getX = function() {
        return this.x - this.width * this.anchorX;
    };

    this.getY = function() {
        return this.y - this.height * this.anchorY;
    }
}

Player.prototype.public = function() {
    return {
        id: this.id,
        kills: this.kills,
        shots: this.shots,
        pixels: this.pixels,
        damage: this.damage,
        x: this.x,
        y: this.y,
        angle: this.angle,
        health: this.health,
        name: this.name,
        // speed: this.speed,
        // cruiseSpeed: this.cruiseSpeed,
        // maxSpeed: this.maxSpeed,
        // acceleration: this.acceleration,
        // drag: this.drag
        // rotationSpeed: this.rotationSpeed,
    };
}

Player.prototype.update = function(delta) {
    if (this.left) {
        this.angle -= this.rotationSpeed * delta;
    }
    else if (this.right) {
        this.angle += this.rotationSpeed * delta;
    }
    if (this.up && this.boost > 0) {
        this.boost -= delta;
        if (this.speed < this.maxSpeed) {
            this.speed += this.acceleration * delta;
        }
    }
    else {
        if (this.boost < this.maxBoostDuration) {
            this.boost += 0.75 * delta;
        }
        else {
            this.boost = this.maxBoostDuration;
        }

        if (this.speed > this.cruiseSpeed) {
            this.speed *= (1 - (this.drag * delta));
        }
        else {
            this.speed = this.cruiseSpeed;
        }
    }

    this.shootTime += delta;
    if (this.shoot) {
        if (this.shootTime >= this.shootDelay) {
            this.game.createBullet(this.id, this.x, this.y, this.angle);
            this.shootTime = 0;
            this.shots++;
        }
    }
    if (this.speed > 0) {
        this.x += Math.cos(this.angle * Math.PI / 180) * this.speed * delta;
        this.y += Math.sin(this.angle * Math.PI / 180) * this.speed * delta;
    }

}

Player.prototype.collide = function(col) {
    if (col.health > this.health) {
        this.reduceHealth(this.health);
        col.reduceHealth(Math.round(col.health / 2));
        this.damage++;
    }
    else {
        this.reduceHealth(Math.round(this.health / 2));
        col.reduceHealth(col.health);
        this.damage++;
    }
}

Player.prototype.kill = function() {
    for (var i = 0; i < this.health; i++) {
        this.game.createPixel(this.id, this.x, this.y, this.health);
    }
}

Player.prototype.reduceHealth = function(damage) {
    if ((this.health - damage) > 0) {
        if (this.damage > 5) {
            for (var i = 0; i < 5; i++) {
                this.game.createPixel(this.id, this.x, this.y, this.hue, Math.round(damage / 5));
            }
            this.damage++;
        }
        else {
            for (var i = 0; i < damage; i++) {
                this.game.createPixel(this.id, this.x, this.y, 1, 1);
            }
            this.damage++;
        }
    }
    else {
        for (var i = 0; i < this.health; i++) {
            this.game.createPixel(this.id, this.x, this.y, 1, 1);
        }
        this.damage++;
    }
    this.health -= damage;
    if (this.health <= 0) {
        this.damage++;
        this.kills++;
        this.game.destroyPlayer(this.id);
    }
}

Player.prototype.collectPixel = function(health) {
    this.health += health;
    if (this.health > 320) {
        this.health = 320;
    }

    this.maxSpeed = 250 + this.health / 2;
    this.shootDelay = 0.4 - this.health / 1000;
    this.pixels++;
}

module.exports = Player;
