var Disperser = function(from, destination, owner) {
  this.type = "Disperser";
  this.position = {x:from.x, y:from.y};
  this.destination = {x:destination.x, y:destination.y};
  this.facing = d_to(this.position, this.destination);
  this.turn_rate = 0;
  this.acceleration = 0;
  this.friction = 0.1;
  this.max_speed = 5
  this.size = {l:2, w:2, m:100};
  this.owner = owner;
  this.speed = {x:1, y:1, t:this.max_speed};
  this.color = "#ff0000";
  this.derpy = 70;
}

Disperser.prototype = new Agent();
Disperser.prototype.destination_update = function() { }
Disperser.prototype.act = function() {};
Disperser.prototype.react = function() {};
Disperser.prototype.meet = function(target, game) {

  if (target.type == "Projectile")
    target.size.m-=2;
  if (target.size.m <= 0)
    target.active =0 ;
    
}
Disperser.prototype.is_at = function(position, size) {
  return (
    this.position.x - this.size.m < position.x &&
    this.position.x + this.size.m > position.x &&
    this.position.y - this.size.m < position.y &&
    this.position.y + this.size.m > position.y
  );
};
Disperser.prototype.draw = function(ctx) {
  if (this.speed.t <= 0) {
    this.active = 0;
  }
  if (!this.active)
    return;
  ctx.strokeStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.position.x, this.position.y, this.size.m * 3, r(this.facing - this.size.m * 10), r(this.facing + this.size.m * 10), false);

  ctx.stroke();
}