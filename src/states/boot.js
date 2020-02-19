import Phaser from 'phaser';
import detect from 'detect-browser';

class Boot extends Phaser.State {

  preload() {
    const browser = detect.detect();
    // In Firefox Linux, the right stick keys are different for some reason
    if (browser.name === 'firefox' && browser.os === 'Linux') {
      Phaser.Gamepad.XBOX360_STICK_RIGHT_X = 3;
      Phaser.Gamepad.XBOX360_STICK_RIGHT_Y = 4;
      Phaser.Gamepad.XBOX360_START = 7;
    }
  }

  create() {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    // this.game.physics.p2.restitution = 0.9;
    this.game.state.start('Preload');

    // Keep focus when activating fullscreen
    window.onclick = () => { window.focus(); };
  }

}

export default Boot;
