var Projectile = function(from, destination, owner) {
  this.type = "Projectile";
  this.position = {x:from.x, y:from.y};
  this.destination = {x:destination.x, y:destination.y};
  this.facing = d_to(this.position, this.destination);
  this.turn_rate = 0;
  this.acceleration = 0;
  this.friction = 0.0000001;
  this.max_speed = 5
  this.size = {l:2, w:2, m:2};
  this.owner = owner;
  this.speed = {x:1, y:1, t:this.max_speed};
  this.color = "#ff0000";
}

Projectile.prototype = new Agent();
Projectile.prototype.destination_update = function() { }
Projectile.prototype.act = function() {};
Projectile.prototype.react = function() {};
Projectile.prototype.meet = function(target, game) {
  if (this.is_at(target.position, target.target_size) && target != this.owner) {
    target.active--;
    if (target.active < 0)
      target.active = 0;
  }
    
}
Projectile.prototype.draw = function(ctx) {
  if (this.speed.t <= this.max_speed / 3) {
    this.active = 0;
  }
  if (!this.active)
    return;
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.rect(this.position.x - this.size.m, this.position.y - this.size.m, this.size.m, this.size.m);
  ctx.closePath();
  ctx.fill();
}