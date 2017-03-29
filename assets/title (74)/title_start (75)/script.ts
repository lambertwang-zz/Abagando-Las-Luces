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
      return this.start_game();
    }
    try {
      for (let i = 0; i < 24; i++) {
        if(Sup.Input.wasGamepadButtonJustPressed(0, i)) {
          return this.start_game();
        }
      }
    } catch (e) {
      // Do nothing
    }
    
    for (let i = 0; i < 5; i++) {
      try {
        if (Sup.Input.isTouchDown(i)) {
          this.start_game();
        }
      } catch (e) {
        break;
      }
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
    return true;
  }
}
Sup.registerBehavior(TitleBehavior);
