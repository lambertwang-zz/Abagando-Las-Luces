class KillBoxBehavior extends HazardBehavior {
  awake() {
    super.awake();
    this.isDeadly = true;
  }
}
Sup.registerBehavior(KillBoxBehavior);
