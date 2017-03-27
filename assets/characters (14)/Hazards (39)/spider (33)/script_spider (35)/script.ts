class SpiderBehavior extends HazardBehavior {
  is_clockwise: boolean = true;
  speed = 0.03;
  
  // 0123 = NESW
  wall_stuck: number;
  free: boolean;
  
  solids: Sup.ArcadePhysics2D.Body[] = [];
  player: Sup.Actor;
  emitter: Sup.Actor = null;

  awake() {
    super.awake();
    this.isDeadly = false;
    this.wall_stuck = 2;
    this.free = true;
    
    this.player = Sup.getActor("Player");

    let solids = Sup.getActor("Solids").getChildren();
    for (let actor of solids) this.solids.push(actor.arcadeBody2D);
  }

  update() {
    super.update();
    
    if (!this.isDeadly) {
      return;
    }
    
    if (!Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, this.solids)) {
      if (!this.free) {
        this.free = true;
        if (this.is_clockwise) {
          this.wall_stuck = (this.wall_stuck + 1) % 4;
        } else {
          this.wall_stuck = (this.wall_stuck + 3) % 4;
        }
      }
    } else {
      this.free = false;
    }
    
    let touches = this.actor.arcadeBody2D.getTouches();
    
    if (this.is_clockwise) {
      switch(this.wall_stuck) {
        case 0:
          if (touches.left) {
            this.wall_stuck = (this.wall_stuck + 3) % 4;
          }
          break
        case 1:
          if (touches.top) {
            this.wall_stuck = (this.wall_stuck + 3) % 4;
          }
          break;
        case 2:
          if (touches.right) {
            this.wall_stuck = (this.wall_stuck + 3) % 4;
          }
          break
        case 3:
          if (touches.bottom) {
            this.wall_stuck = (this.wall_stuck + 3) % 4;
          }
          break
      }
    } else {
      switch(this.wall_stuck) {
        case 0:
          if (touches.right) {
            this.wall_stuck = (this.wall_stuck + 3) % 4;
          }
          break
        case 1:
          if (touches.bottom) {
            this.wall_stuck = (this.wall_stuck + 3) % 4;
          }
          break;
        case 2:
          if (touches.left) {
            this.wall_stuck = (this.wall_stuck + 3) % 4;
          }
          break
        case 3:
          if (touches.top) {
            this.wall_stuck = (this.wall_stuck + 3) % 4;
          }
          break
      }
    }
    
    if (this.is_clockwise) {
      switch(this.wall_stuck) {
        case 0:
          this.actor.arcadeBody2D.setVelocity(-this.speed, this.speed / 2);
          this.actor.setEulerZ(Math.PI);
          break
        case 1:
          this.actor.arcadeBody2D.setVelocity(this.speed / 2, this.speed);
          this.actor.setEulerZ(Math.PI / 2);
          break
        case 2:
          this.actor.arcadeBody2D.setVelocity(this.speed, -this.speed / 2);
          this.actor.setEulerZ(0);
          break
        case 3:
          this.actor.arcadeBody2D.setVelocity(-this.speed / 2, -this.speed);
          this.actor.setEulerZ(-Math.PI / 2);
          break
      }
    } else {
      this.actor.spriteRenderer.setHorizontalFlip(true);
      switch(this.wall_stuck) {
        case 0:
          this.actor.arcadeBody2D.setVelocity(this.speed, this.speed / 2);
          this.actor.setEulerZ(Math.PI);
          break
        case 1:
          this.actor.arcadeBody2D.setVelocity(this.speed / 2, -this.speed);
          this.actor.setEulerZ(Math.PI / 2);
          break
        case 2:
          this.actor.arcadeBody2D.setVelocity(-this.speed, -this.speed / 2);
          this.actor.setEulerZ(0);
          break
        case 3:
          this.actor.arcadeBody2D.setVelocity(-this.speed / 2, this.speed);
          this.actor.setEulerZ(-Math.PI / 2);
          break
      }
    }
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
        particleLife: 40,
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
Sup.registerBehavior(SpiderBehavior);
