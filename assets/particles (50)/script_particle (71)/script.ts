class ParticleBehavior extends Sup.Behavior {
  gravity: number = -0.005;
  source: Sup.Actor;
  lifetime: number = 0;
  velocity: { x: number, y: number };

  awake() {
    this.actor.setPosition(this.source.getPosition());
    this.actor.setZ(11);
  }

  update() {
    if (this.lifetime-- <= 0) {
      this.actor.destroy();
    }
    let position = this.actor.getPosition();
    position.x += this.velocity.x;
    position.y += this.velocity.y;
    this.velocity.y += this.gravity;
    this.actor.setPosition(position);
  }
}

Sup.registerBehavior(ParticleBehavior);
