class EmitterBehavior extends Sup.Behavior {
  source: Sup.Actor;
  particleSprite: string;
  lifetime: number = 0;
  particleLife: number = 0;
  emitterFrequency: number = 0;
  velocity: number = .05;
  
  awake() {
    
  }

  update() {
    if (this.lifetime-- <= 0) {
      this.actor.destroy();
      return;
    }
    
    for (let i = 0; i < this.emitterFrequency; i++) {
      this.emit();
    }
    if (!this.source.isDestroyed()) {
      this.actor.setPosition(this.source.getPosition());
    }
  }
  
  emit() {
    let newParticle = new Sup.Actor("particle");
    new Sup.SpriteRenderer(newParticle, this.particleSprite);
    let random_angle = Math.random() * 2 * Math.PI;
    newParticle.addBehavior(ParticleBehavior, {
      source: this.actor,
      lifetime: this.particleLife,
      velocity: { x: Math.sin(random_angle) * this.velocity,  
                  y: Math.cos(random_angle) * this.velocity }
    });
  }
  
  onDestroy() {
    this.lifetime = 0;
  }
}

Sup.registerBehavior(EmitterBehavior);
