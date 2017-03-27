class FloaterBehavior extends HazardBehavior {
  speed = 0.03;
  radius = 10;
  fade = 0.0;
  
  start_position = null;
  
  solids: Sup.ArcadePhysics2D.Body[] = [];
  player: Sup.Actor;
  skull: Sup.Actor;
  emitter: Sup.Actor = null;

  awake() {
    super.awake();
    this.isDeadly = false;
    
    this.player = Sup.getActor("Player");
    this.skull = Sup.getActor("Skull");
    
    this.start_position = this.actor.getPosition();

    let solids = Sup.getActor("Solids").getChildren();
    for (let actor of solids) this.solids.push(actor.arcadeBody2D);
  }

  update() {
    super.update();
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, this.solids);
    
    if (!this.isDeadly) {
      return;
    }
    
    let d_x = this.actor.getY() - this.skull.getY(),
        d_y = this.actor.getX() - this.skull.getX();
    let skull_dist = Math.sqrt(d_x*d_x + d_y*d_y);
    if (skull_dist < this.radius) {
      if (skull_dist < 0.2) {
        this.actor.arcadeBody2D.warpPosition(this.start_position);
      }
      let dir_to_player = Math.atan2(d_y, d_x);
      let chase_player = -1;
      if (this.player.getBehavior(PlayerBehavior).holding_skull) {
        chase_player = 1;
      }
      let vel_x = chase_player * this.speed * Math.sin(dir_to_player);
      this.actor.arcadeBody2D.setVelocity(vel_x,
                                          chase_player * this.speed * Math.cos(dir_to_player));
      if (vel_x < 0) {
        this.actor.spriteRenderer.setHorizontalFlip(true);
      } else {
        this.actor.spriteRenderer.setHorizontalFlip(false);
      }
      this.fade = Math.min(1.0, this.fade + 0.02);
    } else {
      this.actor.arcadeBody2D.setVelocity(0, 0);
      this.fade = Math.max(0.0, this.fade - 0.02);
    }
    this.actor.spriteRenderer.uniforms.setFloat("fade", this.fade);
    
    this.collideHazard();
  }

  onDestroy() {
    Sup.Audio.playSound("characters/Hazards/monster_death");
    if (!this.emitter) {
      this.emitter = new Sup.Actor("emitter");
      this.emitter.addBehavior(EmitterBehavior, { 
        source: this.actor,
        particleSprite: "particles/blood/sprite_blood",
        lifetime: 30,
        particleLife: 30,
        emitterFrequency: 3
      });
    }
  }

  collideHazard() {
    for (let actor of this.player.getBehavior(PlayerBehavior).hazards) {
      if (!actor.isDestroyed()) {
        let hazardBehavior = actor.getBehavior(HazardBehavior);
        if (hazardBehavior != this) {
          if (Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, actor.arcadeBody2D)) {
            if (hazardBehavior.isDeadly) {
              this.actor.destroy();
              this.destroy();
            }
          }
        }
      }
    }
  }

  activate() {
    this.isDeadly = true;
  }
}

Sup.registerBehavior(FloaterBehavior);
