class WalkerBehavior extends HazardBehavior {
  speed = 0.03;
  
  direction: number = 1;  

  solids: Sup.ArcadePhysics2D.Body[] = [];
  player: Sup.Actor;
  emitter: Sup.Actor = null;

  awake() {
    super.awake();
    this.actor.arcadeBody2D.setCustomGravityY(-0.02);
    this.isDeadly = false;
    
    this.player = Sup.getActor("Player");

    let solids = Sup.getActor("Solids").getChildren();
    for (let actor of solids) this.solids.push(actor.arcadeBody2D);
  }

  update() {
    super.update();
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, this.solids);
    
    if (!this.isDeadly) {
      return;
    }
    
    
    let touches = this.actor.arcadeBody2D.getTouches();

    if (this.direction == 1) {
      if (touches.right) {
        this.direction = -1;
        this.actor.spriteRenderer.setHorizontalFlip(true);
      }
    } else {
      if (touches.left) {
        this.direction = 1;
        this.actor.spriteRenderer.setHorizontalFlip(false);
      }  
    }
    
    this.actor.arcadeBody2D.setVelocityX(this.speed * this.direction);

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
            hazardBehavior.obj_touching["walker"] = true;
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
Sup.registerBehavior(WalkerBehavior);
