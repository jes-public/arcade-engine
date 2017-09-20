var Agent = function() {
  this.type = "Agent";

  this.position = {x: 0, y: 0};
  this.size = {l: 10, w:5, m: Math.random() * 30};
  this.speed = {x: 2, y: 1, t: 5};
  this.facing = 35;
  
  this.friction = 0.1;
  this.acceleration = 0.17;
  this.turn_rate = 4;
  this.max_speed = Math.random() * 9;
  this.derpy = Math.random() * 10;
  
  this.throttle = 0;
  this.torque = 0;
  
  this.destination = {x: 0, y: 0};
  
  this.actions = ["fire"];
  this.action_speed = {"fire": Math.random() * 100};
  this.action_coold = {"fire": 10};
  this.target = 0;
  this.sight_range = Math.random() * 200 + 400;
  this.target_size = 5;
  
  this.active = 1;
 
  this.color = '#aaaaaa';
  this.projectile_color = "#ff0000";
};

Agent.prototype.pick_destination = function() {
  this.destination = {
    x:Math.random() * 800 + this.size.m + 50,
    y:Math.random() * 400 + this.size.m + 50
  };
};

Agent.prototype.is_at = function(position, size) {
  return overlap(this.position, position, this.size.m, size);
  return (
    this.position.x - this.size.m < position.x &&
    this.position.x + this.size.m > position.x &&
    this.position.y - this.size.m < position.y &&
    this.position.y + this.size.m > position.y
  );
};

Agent.prototype.destination_update = function() {
 var destination_angle = d_to(this.position, this.destination);
    var dest_size = this.target ? this.target.size.m : this.size.m;
    if (this.is_at(this.destination, dest_size)) {
      this.pick_destination();
      this.throttle -= 0.1;
    } else if (this.facing - this.derpy >= destination_angle) {
      var change = this.facing - destination_angle;
      if (change > this.turn_rate)
        change = this.turn_rate;
      this.facing -= change;
      
      if (this.speed > 0)
        this.throttle = -1;
      else 
        this.throttle = 0;
    } else if (this.facing + this.derpy <= destination_angle){
      var change = destination_angle - this.facing;
      if (change > this.turn_rate)
        change = this.turn_rate;
      this.facing += change;
      
      if (this.speed > 0)
        this.throttle = -1;
      else 
        this.throttle = 0;
    } else {
      this.throttle = 1;
      
    }
}
Agent.prototype.react = function(game) {
  this.target = 0;
  for(var i = 0; i < game.objects.length; i++) {
    var t = game.objects[i];
    if (dist(this.position, t.position) > this.sight_range)
      continue;
    
    if (t != this && (t.type == "Agent" || t.type == "Predator") && t.active) {
      if (!this.target || t.type == "Predator")
        this.target = t;
    }
  }
}
Agent.prototype.meet = function(target, game) {

}
Agent.prototype.act = function(game) {
  for (var i = 0; i < this.actions.length; i++) {
    var act = this.actions[i];
    if (this.action_coold[act] <= 0) {
      this.action_coold[act] = this.action_speed[act];
      this[act](game);
    } else {
      this.action_coold[act]--;
    }
  }
}
Agent.prototype.fire = function(game) {
  if (this.target != 0) {
    var p = new Projectile(this.position, this.target.position, this);
    p.max_speed = Math.random() * 3 + 5;
    p.speed.t = p.max_speed;
    p.color = this.projectile_color;
    //p.move_forward(p.speed * 2);
    game.objects.push(p);
    
    if (this.size.m > 25) {
    p.friction = 0.01;
    p.target = this.target;
    p.destination_update = Agent.prototype.destination_update;
    p.turn_rate = 2.5;
    p.size.m = this.size.m / 5;
    
    var p = new Projectile({x:this.position.x+10, y:this.position.y+10}, this.target.position, this);
    p.friction = 0.01;
    p.target = this.target;
    p.destination_update = Agent.prototype.destination_update;
    p.turn_rate = 2.5;
    
    p.size.m = this.size.m / 5;
    p.max_speed = Math.random() * 3 + 5;
    p.speed.t = p.max_speed;
    p.color = this.projectile_color;
    //p.move_forward(p.speed * 2);
    game.objects.push(p);     
    }
  }
}
Agent.prototype.move_forward = function(distance) {
  this.position.x += distance * Math.cos(r(this.facing));
  this.position.y += distance * Math.sin(r(this.facing));
}
Agent.prototype.update = function(game) {
    if (this.active == 0)
      return;

    this.move_forward(this.speed.t);
    
    this.speed.t += this.acceleration * this.throttle;
    
    if (this.speed.t >= this.max_speed)
      this.speed.t = this.max_speed;
      
    if (this.speed.t >= this.friction)
      this.speed.t -= this.friction;
    else
      this.speed.t = 0;
    
    this.facing += this.turn_rate * this.torque;
    
    this.destination_update();
    this.act(game);
    this.react(game);
    
    
    for (var i = 0; i < game.objects.length; i++)
      if (this != game.objects[i] && this.is_at(game.objects[i].position, game.objects[i].size.m))
        this.meet(game.objects[i],game);

};
Agent.prototype.draw = function(ctx) {
    if (!this.active)
      return;

    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(r(this.facing));
    
    ctx.fillStyle = '#aaaaaa';
    ctx.strokeStyle = '#aaaaaa';

    
    // facing
    ctx.strokeStyle = '#aaaaff';
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(this.speed.t * 3 + this.size.m, 0);
    ctx.closePath();
    ctx.stroke();

    // circle
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.size.m / 3, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.stroke();
    
    // shield
    ctx.save();
    for (var i = 1; i < this.active; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, this.size.m / 3 + i * 3, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
    
    ctx.rotate(-1 * r(this.facing));
    ctx.translate(-1 * this.position.x, -1 * this.position.y);
    
    // mark destination
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.rect(this.destination.x-2, this.destination.y-2,5,5);
    ctx.closePath();
    ctx.stroke();

};