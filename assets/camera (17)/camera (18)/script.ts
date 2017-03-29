class CameraBehavior extends Sup.Behavior {
  shake_decay = -0.9;
  
  player: Sup.Actor;
  
  shake: Sup.Math.XY;
  buttons_mashed = 0;

  awake() {
    this.player = Sup.getActor("Player");  
    this.shake = { x: 0, y: 0 };
  }
  
  update() {
    this.actor.setX(this.player.getX() + this.shake.x);
    this.actor.setY(this.player.getY() + 2 + this.shake.y);
    
    this.shake.x *= this.shake_decay;
    this.shake.y *= this.shake_decay;
  }
}
Sup.registerBehavior(CameraBehavior);
