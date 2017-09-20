
var Evader = function() {
  this.max_speed = 5;
  this.turn_rate = 4;
  this.acceleration = 0.3;
  this.size.m = 9;
  this.color = "pink";
  this.sight_range = 800;
  this.derpy = 30;
  this.projectile_color = "#aaaa00";
  this.actions = ["pick_destination", "shield"];
  this.action_speed = {"pick_destination": 40, "shield": 600};
  this.action_coold = {"pick_destination": 10, "shield" : 10};
}
Evader.prototype = new Agent();
Evader.prototype.pick_destination = function() {
  this.destination = {
    x:Math.random() * 800 + this.size.m + 50,
    y:Math.random() * 400 + this.size.m + 50
  };
  if (this.fear && this.fear.active) {

    this.destination = forward(this.position, 200 + Math.random() * 200, d_to(this.position, this.fear.position) * -1);
    if (this.destination.x < 50) this.destination.x = 50;
    if (this.destination.y < 50) this.destination.y = 50;
    if (this.destination.x > 850) this.destination.x = 850;
    if (this.destination.y > 450) this.destination.y = 450;        
  }
}
Evader.prototype.shield = function() {
  this.active++;
}
Evader.prototype.react = function(game) {
  this.target = 0;
  for(var i = 0; i < game.objects.length; i++) {
    var t = game.objects[i];
    if (dist(this.position, t.position) > this.sight_range)
      continue;
    
    if (t != this && (t.type == "Projectile") && t.active) {
      if (!this.target || !this.target.position || dist(this.position, this.target.position) > dist(this.position, t.position))
        this.target = t;
        this.fear = t;
    }
  }
}
Evader.prototype.is_at = function(position) {
  return dist(this.position, this.destination) < 10 ||
          (this.target && this.target.position && dist(this.position, this.target.position) < 100);
};
Evader.prototype.destination_update = function() {
 var destination_angle = d_to(this.position, this.destination);
    
    if (this.is_at(this.destination)) {
      this.pick_destination();
      this.throttle = 0.1;
    } else if (this.facing - this.derpy >= destination_angle) {
      this.facing -= this.turn_rate;
      
      this.throttle = 0.1;
    } else if (this.facing + this.derpy <= destination_angle){
      this.facing += this.turn_rate;
      this.throttle = 0.1;
    }
    
    if (Math.abs(Math.abs(this.facing) - Math.abs(destination_angle)) < this.derpy * 2) {
      this.throttle = 1;
      
    }
}