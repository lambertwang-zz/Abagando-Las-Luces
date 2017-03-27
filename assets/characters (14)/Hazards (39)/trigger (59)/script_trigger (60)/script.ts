class TriggerBehavior extends HazardBehavior {
  touched() {
    for (let hazard of this.actor.getChildren()) {
      hazard.getBehavior(HazardBehavior).activate();
    }
  }
  
  activate() {
    this.touched();
  }
}
Sup.registerBehavior(TriggerBehavior);
