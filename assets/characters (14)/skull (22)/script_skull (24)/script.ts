class SkullBehavior extends Sup.Behavior {
  
  player: Sup.Actor;
  solids: Sup.ArcadePhysics2D.Body[] = [];
  
  awake() {
    this.player = Sup.getActor("Player");
    this.actor.arcadeBody2D.setCustomGravityY(-0.02);
    this.actor.spriteRenderer.setAnimation("Idle");
    let solids = Sup.getActor("Solids").getChildren();
    for (let actor of solids) this.solids.push(actor.arcadeBody2D);
    
    let checkpoints = Sup.getActor("Checkpoints").getChildren();
    for (let actor of checkpoints) this.solids.push(actor.arcadeBody2D);
  }

  update() {
   if (this.player.getBehavior(PlayerBehavior).is_dead || this.player.getBehavior(PlayerBehavior).game_won) {
      this.actor.arcadeBody2D.setVelocity(0, 0);
      this.actor.arcadeBody2D.setCustomGravityY(0);
      return;
    }
    this.actor.arcadeBody2D.setCustomGravityY(-0.02);
    
    if (!this.player.getBehavior(PlayerBehavior).holding_skull) {
      Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, this.solids);
      let ground = this.actor.arcadeBody2D.getTouches().bottom;

      if (ground) {
        this.actor.arcadeBody2D.setVelocityX(0);
      }
    }
    
    
    if (this.actor.getY() < -64) {
      this.respawn();
    }

    this.collideHazard();
  }
  
  collideHazard() {
    for (let actor of this.player.getBehavior(PlayerBehavior).hazards) {
      if (!actor.isDestroyed()) {
        let hazardBehavior = actor.getBehavior(HazardBehavior);
        if (Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, actor.arcadeBody2D)) {
          hazardBehavior.obj_touching["skull"] = true;
          if (hazardBehavior.isDeadly) {
            this.respawn();
          }
        }
      }
    }
  }
  
  respawn() {
    this.player.getBehavior(PlayerBehavior).holding_skull = false;
    let last_checkpoint = this.player.getBehavior(PlayerBehavior).last_checkpoint;
    if (last_checkpoint) {
      this.actor.arcadeBody2D.warpPosition(last_checkpoint.getX(), last_checkpoint.getY() + 1);
    } else {
      this.actor.arcadeBody2D.warpPosition(this.player.getBehavior(PlayerBehavior).default_checkpoint.x, 
                                           this.player.getBehavior(PlayerBehavior).default_checkpoint.y);
    }
    this.actor.arcadeBody2D.setVelocity(0, 0);
    this.actor.arcadeBody2D.setCustomGravityY(-0.02);
  }
}

Sup.registerBehavior(SkullBehavior);
