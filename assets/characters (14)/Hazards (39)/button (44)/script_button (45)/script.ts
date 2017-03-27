class ButtonBehavior extends HazardBehavior {
  releaseDelay = 0;
  releaseTimer: number;

  touched() {
    this.releaseTimer = -1;
    this.actor.spriteRenderer.setAnimation("Down");
    Sup.Audio.playSound("characters/Hazards/button/click");
    for (let hazard of this.actor.getChildren()) {
      hazard.getBehavior(HazardBehavior).activate();
    }
  }
  
  released() {
    if (this.releaseDelay > 0) {
      Sup.clearTimeout(this.releaseTimer);
      this.releaseTimer = Sup.setTimeout(this.releaseDelay, this.actually_released.bind(this));
    } else {
      this.actually_released();
    }
  }
  
  actually_released() {
    for (let hazard of this.actor.getChildren()) {
      hazard.getBehavior(HazardBehavior).deactivate();
    }
    this.actor.spriteRenderer.setAnimation("Up");
  }
  
  activate() {
    this.touched();
  }
  
  deactivate() {
    this.released();
  }
}
Sup.registerBehavior(ButtonBehavior);
