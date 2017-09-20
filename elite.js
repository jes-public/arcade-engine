
var Elite = function() {
  this.max_speed = 5;
  this.turn_rate = 7;
  this.acceleration = 0.4;
  this.size.m = 9;
  this.color = "#ff69b4";
  this.sight_range = 800;
  this.derpy = 3;
  this.projectile_color = "#ff69b4";
  this.action_speed = {"fire": 10};
}
Elite.prototype = new Agent();
Elite.prototype.pick_destination = function() {
  this.destination = {
    x:Math.random() * 800 + this.size.m + 50,
    y:Math.random() * 400 + this.size.m + 50
  };

}
Elite.prototype.react = function(game) {
  this.target = 0;
  for(var i = 0; i < game.objects.length; i++) {
    var t = game.objects[i];
    if (dist(this.position, t.position) > this.sight_range)
      continue;
    
    if (t != this && (t.owner != this && t.type == "Projectile") && t.active) {
      if (dist(this.position, t.position) > dist(this.position, forward(t.position, t.speed.t, t.facing)))
          this.target = t;
    }
  }
}
Elite.prototype.fire = function(game) {
  if (this.target != 0) {
    var p = new Disperser(this.position, this.target.position, this);
    p.max_speed = Math.random() * 3 + 5;
    p.speed.t = p.max_speed;
    p.color = this.projectile_color;
    p.size.m = 5;
    game.objects.push(p);
    
  }
}
Elite.prototype.react = function(game) {
  this.target = 0;
  for(var i = 0; i < game.objects.length; i++) {
    var t = game.objects[i];
    if (dist(this.position, t.position) > this.sight_range)
      continue;
    
    if (t != this && (t.type == "Projectile") && t.active) {
      if (!this.target || dist(this.position, this.target.position) > dist(this.position, t.position))
        if (dist(this.position, t.position) > dist(this.position, forward(t.position, t.speed.t, t.facing)))
        this.target = t;
    }
  }
}
Elite.prototype.is_at = function(position) {
  return dist(this.position, this.destination) < 20 ||
          (this.target && dist(this.position, this.target.position) < 20);
};
Elite.prototype.destination_update = function() {
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