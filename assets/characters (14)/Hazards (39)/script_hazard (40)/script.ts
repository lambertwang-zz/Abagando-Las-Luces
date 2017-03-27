class HazardBehavior extends Sup.Behavior {
  isDeadly: boolean = false;
  player: Sup.Actor;
  lastTouched: boolean = false;
  obj_touching: { [name: string]: boolean; } = {};
  
  awake() {
    this.player = Sup.getActor("Player");
  }

  update() {
    let num_touching = 0;
    for (let key in this.obj_touching) {
      if (this.obj_touching[key]) {
        num_touching++;
      }
    }
    this.obj_touching = {};
    if ((num_touching > 0) != this.lastTouched) {
      this.lastTouched = !this.lastTouched;
      if (num_touching) {
        this.touched();
      } else {
        this.released();
      }
    }
  }
  
  // Begin Virtual Methods
  touched() {}
  
  released() {}
  
  activate() {}
  
  deactivate() {}
  // End Virtual Methods
}
