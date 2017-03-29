class PlayerBehavior extends Sup.Behavior {
  speed = 0.025;
  jumpSpeed = 0.4;
  throwSpeed = 0.3;
  max_speed = 0.25;
  friction = 0.891; // 6 = log base n of .5
  skull_height_offset = .6;
  
  holding_skull: boolean = false;
  skullDelay: number = -1;
  facing_right: boolean = true;
  is_dead: boolean = false;
  skull: Sup.Actor;
  last_checkpoint: Sup.Actor = null;
  the_end: Sup.Actor;
  game_won = false;
  
  // Tutorial Flag
  skull_help = false;
  
  emitter: Sup.Actor = null;
  
  default_checkpoint: Sup.Math.XY;
  
  solids: Sup.ArcadePhysics2D.Body[] = [];
  checkpoints: Sup.Actor[] = [];
  hazards: Sup.Actor[] = [];
  
  bg_music;
  
  awake() { 
    this.actor.arcadeBody2D.setCustomGravityY(-0.02);
    this.skull = Sup.getActor("Skull");
    this.the_end = Sup.getActor("end");
    
    let solids = Sup.getActor("Solids").getChildren();
    for (let actor of solids) this.solids.push(actor.arcadeBody2D);
    
    let checkpoints = Sup.getActor("Checkpoints").getChildren();
    for (let actor of checkpoints) this.checkpoints.push(actor);
    
    let hazards = Sup.getActor("Hazards").getChildren();
    for (let actor of hazards) this.addAllChildren(actor, this.hazards);
    
    this.default_checkpoint = { x: this.actor.getX(), y: this.actor.getY() };
    
    this.bg_music = new Sup.Audio.SoundPlayer("levels/shared/bg_music", 0.4, { loop: true });

    this.bg_music.play();
  }
  
  addAllChildren(base: Sup.Actor, list: Sup.Actor[]) {
    list.push(base);
    for (let item of base.getChildren()) {
      this.addAllChildren(item, list);
    }
  }

  update() {
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, this.solids);
    let ground = this.actor.arcadeBody2D.getTouches().bottom;
    
    // Calculate all inputs first
    let touches = {
      any: false,
      up: false,
      down: false,
      left: false,
      right: false,
      movement: 0
    };
    
    /*
    for (let i = 0; i < 5; i++) {
      try {
        if (Sup.Input.isTouchDown(i)) {
          let touch: Sup.Math.XY = Sup.Input.getTouchPosition(i);
          let touch_angle = Math.atan2(touch.y, touch.x);
          if (!touches.right && Math.abs(touch_angle) < Math.PI / 4.0) {
            touches.right = true;
            touches.movement += touch.x;
          } else if (!touches.left && Math.abs(touch_angle) > Math.PI * 3.0 / 4.0) {
            touches.left = true;
            touches.movement += touch.x;
          } else if (touch_angle > 0) {
            touches.up = true;
          } else {
            touches.down = true;
          }
        }
      } catch (e) {
        break;
      }
    }
    */

    for (let i = 0; i < 5; i++) {
      try {
        if (Sup.Input.isTouchDown(i)) {
          touches.any = true;
          let touch: Sup.Math.XY = Sup.Input.getTouchPosition(i);
          if (touch.x > .5) {
            touches.right = true;
            touches.movement += touch.x;
          } else if (touch.x < -0.5) {
            touches.left = true;
            touches.movement += touch.x;
          } else if (touch.y > 0) {
            touches.up = true;
          } else {
            touches.down = true;
          }
        }
      } catch (e) {
        break;
      }
    }

    let jumped = Sup.Input.wasKeyJustPressed("SPACE") || 
                 Sup.Input.wasKeyJustPressed("W") || 
                 Sup.Input.wasKeyJustPressed("UP") ||
                 Sup.Input.wasKeyJustPressed("Z") ||
                 Sup.Input.wasGamepadButtonJustPressed(0, 0) ||
                 touches.up,
        thrown = Sup.Input.wasKeyJustPressed("E") ||
                 Sup.Input.wasKeyJustPressed("X") ||
                 Sup.Input.wasGamepadButtonJustPressed(0, 1) ||
                 Sup.Input.wasGamepadButtonJustPressed(0, 7) ||
                 touches.down,
        restart = Sup.Input.wasKeyJustPressed("R") || 
                  Sup.Input.wasGamepadButtonJustPressed(0, 9),
        movement = Math.max(-1.0, Math.min(1.0, 
                     ((Sup.Input.isKeyDown("A") || Sup.Input.isKeyDown("LEFT")) ? -1 : 0) +
                     ((Sup.Input.isKeyDown("D") || Sup.Input.isKeyDown("RIGHT")) ? 1 : 0) + 
                     Sup.Input.getGamepadAxisValue(0, 0) + 
                     touches.movement
                   ));

    if (this.game_won) {
      return;
    }
    if (this.is_dead) {
      if (restart || touches.any) {
        this.respawn();
      }
      if (ground)
        this.actor.arcadeBody2D.setVelocityX(this.actor.arcadeBody2D.getVelocityX() * 0.97);
      return;
    }
    
    let velocity = this.actor.arcadeBody2D.getVelocity();

    let moving = true;
    if (movement < -0.01) {
      velocity.x = Math.min(0, velocity.x);
      velocity.x = Math.max(velocity.x + movement * this.speed, movement * this.max_speed);
      this.actor.spriteRenderer.setHorizontalFlip(true);
      this.facing_right = false;
    } else if (movement > 0.01) {
      velocity.x = Math.max(0, velocity.x);
      velocity.x = Math.min(velocity.x + movement * this.speed, movement * this.max_speed);
      this.actor.spriteRenderer.setHorizontalFlip(false);
      this.facing_right = true;
    } else {
      moving = false;
      velocity.x *= this.friction;
      if (Math.abs(velocity.x) < this.max_speed / 2) {
        velocity.x = 0;
      }
    }

    if (ground) {
      if (jumped) {
        Sup.Audio.playSound("characters/player/jump");
        velocity.y = this.jumpSpeed;
        this.actor.spriteRenderer.setAnimation("Jump");
      } else {
        if (!moving) this.actor.spriteRenderer.setAnimation("Idle");
        else this.actor.spriteRenderer.setAnimation("Run");
      }
    } else {
      if (velocity.y >= 0) this.actor.spriteRenderer.setAnimation("Jump");
      else {
        this.actor.spriteRenderer.setAnimation("Fall");
      }
    }

    this.actor.arcadeBody2D.setVelocity(velocity);
    
    if (this.actor.getY() < -64) {
      this.die();
    }
    
    if (!this.holding_skull) {
      if (Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, this.skull.arcadeBody2D)) {
        if (this.skullDelay == -1) {
          Sup.Audio.playSound("characters/player/skull_pickup");
          this.holding_skull = true;
          if (!this.skull_help) {
            this.skull_help = true;
            this.actor.textRenderer.setText("X TO THROW\n");
          }
        }
      }
    } else {
      if (thrown) {
        Sup.Audio.playSound("characters/player/throw");
        let skull_vel = velocity;
        skull_vel.y += this.throwSpeed;
        if(this.facing_right){
          skull_vel.x += 0.05;
         }
         else{
          skull_vel.x -= 0.05;   
         }
        this.skull.arcadeBody2D.warpPosition(this.actor.getX(), this.actor.getY());
        this.skull.arcadeBody2D.setVelocity(skull_vel);
        this.holding_skull = false;
        this.actor.textRenderer.setText("");

        Sup.clearTimeout(this.skullDelay);
        this.skullDelay = Sup.setTimeout(400, this.resetSkull.bind(this));
      } else {
        this.skull.arcadeBody2D.warpPosition(this.actor.getX(), this.actor.getY() + + this.skull_height_offset);
      }
    }

    if (restart) {
      this.die();
    }
    
    this.collideCheckpoint();
    this.collideHazard();
    this.collideEnd();
  }
  
  collideCheckpoint() {
    if(this.holding_skull){
      for (let actor of this.checkpoints) {
        if (Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, actor.arcadeBody2D)) {
          if (this.last_checkpoint != null) {
            this.last_checkpoint.spriteRenderer.setAnimation("Inactive");
          }
          this.last_checkpoint = actor;
          this.last_checkpoint.spriteRenderer.setAnimation("Active");
        }
      }
    }
  }
  
  
  collideHazard() {
    for (let i = this.hazards.length - 1; i >= 0; i--) {
      let actor = this.hazards[i];
      if (!actor.isDestroyed()) {
        let hazardBehavior = actor.getBehavior(HazardBehavior);
        if (Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, actor.arcadeBody2D)) {
          hazardBehavior.obj_touching["player"] = true;
          if (hazardBehavior.isDeadly) {
            this.die();
          }
        }
      }
    }
  }
  
  collideEnd() {
    if(this.holding_skull){
      if (Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, this.the_end.arcadeBody2D)) {
        this.win();
      }
    }
  }
  
  
  die() {
    Sup.Audio.playSound("characters/player/death");
    this.is_dead = true;
    //this.actor.arcadeBody2D.setVelocity(0, 0);
    this.actor.arcadeBody2D.setCustomGravityY(-0.01);
    this.actor.textRenderer.setText("YOU DIED\nR TO RESTART\n");
    this.actor.spriteRenderer.setSprite("characters/player/sprite_player_death");
    this.actor.spriteRenderer.setAnimation("Spin", false);
    this.holding_skull = false;

    if (!this.emitter || this.emitter.isDestroyed()) {
      this.emitter = new Sup.Actor("emitter");
      this.emitter.addBehavior(EmitterBehavior, { 
        source: this.actor,
        particleSprite: "particles/blood/sprite_blood",
        lifetime: 60,
        particleLife: 60,
        emitterFrequency: 4
      });
    }
  }
  
  respawn() {
    this.actor.textRenderer.setText("");
    this.actor.spriteRenderer.setSprite("characters/player/sprite_player_walk");
    this.actor.arcadeBody2D.setCustomGravityY(-0.02);
    this.is_dead = false;
    if (this.last_checkpoint) {
      this.actor.arcadeBody2D.warpPosition(this.last_checkpoint.getX(), this.last_checkpoint.getY() + 1);
    } else {
      this.actor.arcadeBody2D.warpPosition(this.default_checkpoint.x, this.default_checkpoint.y);
    }
    this.skull.arcadeBody2D.warpPosition(this.actor.getX(), this.actor.getY());
    this.actor.arcadeBody2D.setVelocity({ x: 0, y: 0 });
    
    if (!this.emitter.isDestroyed()) {
      this.emitter.destroy();
    }
  }
  
  win() {
    this.game_won = true;
    this.actor.arcadeBody2D.setVelocity(0, 0);
    this.actor.arcadeBody2D.setCustomGravityY(0);
    this.actor.textRenderer.setText("YOU HAVE ESCAPED!\n");
    this.actor.spriteRenderer.setAnimation("Idle");
  }
  
  resetSkull() {
    this.skullDelay = -1;
  }
}
Sup.registerBehavior(PlayerBehavior);
