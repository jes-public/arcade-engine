
var Predator = function() {
  this.max_speed = 5;
  this.turn_rate = 7;
  this.acceleration = 0.4;
  this.size = {w:9, h:9, m: 9};
  this.color = "#ffff00";
  this.sight_range = 800;
  this.derpy = 3;
  this.projectile_color = "#aaaa00";
}
Predator.prototype = new Agent();
Predator.prototype.pick_destination = function() {
  this.destination = {
    x:Math.random() * 800 + this.size.m + 50,
    y:Math.random() * 400 + this.size.m + 50
  };
  if (this.target && this.target.active) {
    this.destination = { x: this.target.position.x + Math.random() * 30,
    y: this.target.position.y + Math.random() * 30};
    if (Math.random() > 0.5)
      this.destination.x -= 45;
    if (Math.random() > 0.5)
      this.destination.y -= 45;                  
  }
}
Predator.prototype.is_at = function(position) {
  return dist(this.position, this.destination) < 100 ||
          (this.target && dist(this.position, this.target.position) < 100);
};
Predator.prototype.destination_update = function() {
 var destination_angle = d_to(this.position, this.destination);
    
    if (this.is_at(this.destination)) {
      this.pick_destination();
      this.throttle = 0;
    } else if (this.facing - this.derpy >= destination_angle) {
      var change =  this.facing - destination_angle;
      if (change > this.turn_rate)
        change = this.turn_rate;
      this.facing -= change;
            
      
      this.throttle = 0;
    } else if (this.facing + this.derpy <= destination_angle){
      var change = destination_angle - this.facing;
      if (change > this.turn_rate)
        change = this.turn_rate;
      this.facing += change;
      
      this.throttle = 0;
    }
    
    if (Math.abs(Math.abs(this.facing) - Math.abs(destination_angle)) < this.derpy * 2) {
      this.throttle = 1;
      
    }
}