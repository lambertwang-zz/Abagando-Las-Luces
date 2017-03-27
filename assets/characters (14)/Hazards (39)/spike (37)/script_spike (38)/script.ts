class SpikeBehavior extends HazardBehavior {
  delay: number = 400;
  timer: number = -1;
  
  awake() {
    super.awake();
  }

  activate() {
    this.isDeadly = true;
    this.actor.spriteRenderer.setAnimation("Active");
    Sup.clearTimeout(this.timer);
    this.timer = Sup.setTimeout(this.delay, this.retract.bind(this));
  }
  
  retract() {
    this.isDeadly = false;
    this.actor.spriteRenderer.setAnimation("Inactive");
  }
}
Sup.registerBehavior(SpikeBehavior);
