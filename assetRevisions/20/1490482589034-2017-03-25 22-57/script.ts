class LightBehavior extends Sup.Behavior {
  max_radius = 0.2;
  min_radius = 0.08;
  radius_vel = 0.003;
  
  radius: number;
  
  player: Sup.Actor;
  camera: Sup.Camera;
  camera_actor: Sup.Actor;
  skull: Sup.Actor;
  view_height: number;
  y_scale: number;
  
  awake() {
    this.radius = this.max_radius;
    
    this.player = Sup.getActor("Player");  
    this.skull = Sup.getActor("Skull");  
    this.camera_actor = Sup.getActor("Camera");  
    this.camera = Sup.getActor("Camera").camera;
    this.y_scale = 2 * this.actor.spriteRenderer.getSprite().getPixelsPerUnit() * this.camera.getOrthographicScale() / this.actor.spriteRenderer.getSprite().getGridSize().width;
    this.actor.setLocalScale(this.y_scale, this.y_scale, 1.0);

    this.actor.spriteRenderer.uniforms.setVector3("light_color", new Sup.Math.Vector3(0.022, 0.005, 0.02));
  }
  
  update() {
    let window_height = this.camera.getOrthographicScale(),
        window_width = this.camera.getOrthographicScale() * this.camera.getWidthToHeightRatio();
    
    this.actor.setX(this.skull.getX());
    this.actor.setY(this.skull.getY());
    this.actor.setX(this.camera_actor.getX());
    this.actor.setY(this.camera_actor.getY());
    
    if (this.player.getBehavior(PlayerBehavior).holding_skull) {
      this.radius = Math.max(this.radius - this.radius_vel, this.min_radius);
    } else {
      this.radius = Math.min(this.radius + this.radius_vel, this.max_radius);
    }
    this.actor.spriteRenderer.uniforms.setFloat("radius", this.radius);
    this.actor.spriteRenderer.uniforms.setVector2("light_pos", new Sup.Math.Vector2(
      (this.skull.getX() - this.camera_actor.getX()) / (window_height * 2) + 0.5, 
      (this.skull.getY() - this.camera_actor.getY()) / (window_height * 2) + 0.5));
    // this.actor.spriteRenderer.uniforms.setVector2("light_pos", new Sup.Math.Vector2(0.5, 0.5));
  }
}
Sup.registerBehavior(LightBehavior);
