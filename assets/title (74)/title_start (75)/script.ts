class TitleBehavior extends Sup.Behavior {
  
  textOpacity = 1.0;
  fade_vel = 0.01;
  
  title_music;
  
  awake() {
    this.title_music = new Sup.Audio.SoundPlayer("title/title_music", 0.4, { loop: true });

    this.title_music.play();
  }

  update() {
    
    for (let character of Sup.Input.getTextEntered()) {
      let ord = character.charCodeAt(0);
      if ((ord >= 'a'.charCodeAt(0) && ord <= 'z'.charCodeAt(0)) || 
          (ord >= 'A'.charCodeAt(0) && ord <= 'Z'.charCodeAt(0)) ||
          (ord >= '0'.charCodeAt(0) && ord <= '9'.charCodeAt(0))){
        this.start_game();
        return;
      }
    }
    try {
      for (let i = 0; i < 24; i++) {
        if(Sup.Input.wasGamepadButtonJustPressed(0, i)) {
          this.start_game();
          return;
        }
      }
    } catch (e) {
      // Do nothing
    }
    
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
  
  start_game() {
    this.title_music.stop();
    Sup.loadScene("Scene");
  }
}
Sup.registerBehavior(TitleBehavior);
