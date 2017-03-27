class LightBehavior extends Sup.Behavior {
  max_radius = 0.3;
  min_radius = 0.15;
  radius_vel = 0.003;
  check_radius = 0.125;
  
  light_radius: number;
  
  player: Sup.Actor;
  camera: Sup.Camera;
  camera_actor: Sup.Actor;
  skull: Sup.Actor;
  view_height: number;
  y_scale: number;
  
  awake() {
    this.light_radius = this.max_radius;
    
    this.player = Sup.getActor("Player");  
    this.skull = Sup.getActor("Skull");  
    this.camera_actor = Sup.getActor("Camera");  
    this.camera = Sup.getActor("Camera").camera;
    this.y_scale = 2 * this.actor.spriteRenderer.getSprite().getPixelsPerUnit() * this.camera.getOrthographicScale() / this.actor.spriteRenderer.getSprite().getGridSize().width;
    this.actor.setLocalScale(this.y_scale, this.y_scale, 1.0);

    this.actor.spriteRenderer.uniforms.setVector3("light_color", new Sup.Math.Vector3(0.022, 0.005, 0.02));
    this.actor.spriteRenderer.uniforms.setVector3("glow_color", new Sup.Math.Vector3(0.46, 1.000, 0.66));
  }
  
  update() {
    let window_height = this.camera.getOrthographicScale();
    
    this.actor.setX(this.skull.getX());
    this.actor.setY(this.skull.getY());
    this.actor.setX(this.camera_actor.getX());
    this.actor.setY(this.camera_actor.getY());
    
    if (this.player.getBehavior(PlayerBehavior).holding_skull) {
      this.light_radius = Math.max(this.light_radius - this.radius_vel, this.min_radius);
    } else {
      this.light_radius = Math.min(this.light_radius + this.radius_vel, this.max_radius);
    }
    this.actor.spriteRenderer.uniforms.setFloat("light_radius", this.light_radius);
    this.actor.spriteRenderer.uniforms.setVector2("light_pos", new Sup.Math.Vector2(
      (this.skull.getX() - this.camera_actor.getX()) / (window_height * 2) + 0.5, 
      (this.skull.getY() - this.camera_actor.getY()) / (window_height * 2) + 0.5));
    
    if (this.player.getBehavior(PlayerBehavior).last_checkpoint) {
      let last_checkpoint = this.player.getBehavior(PlayerBehavior).last_checkpoint;
      
      this.actor.spriteRenderer.uniforms.setFloat("check_radius", this.check_radius);
      this.actor.spriteRenderer.uniforms.setVector2("check_pos", new Sup.Math.Vector2(
        (last_checkpoint.getX() - this.camera_actor.getX()) / (window_height * 2) + 0.5, 
        (last_checkpoint.getY() - this.camera_actor.getY()) / (window_height * 2) + 0.5));
    } else {
      this.actor.spriteRenderer.uniforms.setFloat("check_radius", 0.0);
    }
  }
}
Sup.registerBehavior(LightBehavior);
