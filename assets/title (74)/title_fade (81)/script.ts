class FadeBehavior extends Sup.Behavior {
  
  textOpacity = 1.0;
  fade_vel = 0.01;
  
  awake() {
  }

  update() {
    this.textOpacity += this.fade_vel;
    
    if (this.textOpacity > 1.0) {
      this.textOpacity = 1.0;
      this.fade_vel *= -1;
    }
    
    if (this.textOpacity < 0.0) {
      this.textOpacity = 0.0;
      this.fade_vel *= -1;
    }
    
    this.actor.textRenderer.setOpacity(this.textOpacity);
  }
}
Sup.registerBehavior(FadeBehavior);
