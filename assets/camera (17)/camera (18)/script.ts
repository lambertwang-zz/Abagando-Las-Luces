class CameraBehavior extends Sup.Behavior {
  shake_decay = -0.9;
  
  player: Sup.Actor;
  
  shake: Sup.Math.XY;
  buttons_mashed = 0;
  navy_seal = "What did you just say about me? I’ll have you know I graduated top of my class in the Navy Seals, and I’ve been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I’m the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you out with precision the likes of which has never been seen before on this Earth, mark my words. You think you can get away with saying that to me over the Internet? Think again. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You’re dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that’s just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe you off the face of the continent. If only you could have known what unholy retribution your little “clever” comment was about to bring down upon you, maybe you would have held your tongue. But you couldn’t, you didn’t, and now you’re paying the price, you idiot. I will rain fury all over you and you will drown in it. You’re dead, kiddo."
  
  awake() {
    this.player = Sup.getActor("Player");  
    this.shake = { x: 0, y: 0 };
  }
  
  update() {
    this.actor.setX(this.player.getX() + this.shake.x);
    this.actor.setY(this.player.getY() + 2 + this.shake.y);
    
    this.shake.x *= this.shake_decay;
    this.shake.y *= this.shake_decay;
    
    // Stupid rule
    for (let character of Sup.Input.getTextEntered()) {
      if (character === 'w' || 
          character === 'W' || 
          character === 'a' || 
          character === 'A' || 
          character === 'e' || 
          character === 'E' || 
          character === 'd' || 
          character === 'D' || 
          character === 'r' || 
          character === 'R' || 
          character === 'z' || 
          character === 'Z' ||
          character === 'x' ||
          character === 'X') {
        continue;
      } else {
        let ord = character.charCodeAt(0);
        if ((ord >= 'a'.charCodeAt(0) && ord <= 'z'.charCodeAt(0)) || 
            (ord >= 'A'.charCodeAt(0) && ord <= 'Z'.charCodeAt(0)) ||
            (ord >= '0'.charCodeAt(0) && ord <= '9'.charCodeAt(0))){
          this.shake.x += Math.random() - 0.5;
          this.shake.y += Math.random() - 0.5;
          this.buttons_mashed = (this.buttons_mashed + 1) % this.navy_seal.length;
          this.player.textRenderer.setText(this.navy_seal.substring(Math.max(0, this.buttons_mashed - 32), this.buttons_mashed));
        }
      }
    }
  }
}
Sup.registerBehavior(CameraBehavior);
