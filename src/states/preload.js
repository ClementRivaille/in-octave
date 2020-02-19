import Phaser from 'phaser';
import Instrument from '../instruments/instrument';
import MusicManager from '../instruments/music-manager';
import SoundManager from '../instruments/sound-manager';
import CONSTANTS from '../utils/constants';

import WebFont from 'webfontloader';

class Preload extends Phaser.State {

  preload() { 
    /* Preload required assets */ 
    this.load.image('pad', './assets/icons/pad.png'); 
    this.load.image('keyboard', './assets/icons/keyboard.png'); 
  }

  async create() {
    // Init background
    const background = this.game.add.bitmapData(this.game.width, this.game.height);
    background.addToWorld();
    const backgroundColor = CONSTANTS.LEVELS_COLORS[0];
    background.rect(0, 0, this.game.width, this.game.width,
      `rgb(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`);
    
    const loadingText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Loading…', {
      align: 'center',
      fill: 'white'
    });
    loadingText.anchor.x = 0.5;
    loadingText.anchor.y = 0.5;

    try {
      const musicManager = new MusicManager();
      const soundManager = new SoundManager();

      const fontPromise = new Promise((resolve) => {
        const wfconfig = {
          custom: {
            families: ['springsteel'],
          },
          active: resolve
        };

        WebFont.load(wfconfig);
      });

      const data = {
        instruments: [
          new Instrument()
        ],
        musicManager,
        soundManager,
        background
      };

      const promises = [
        data.instruments[0].load(),
        musicManager.load(),
        soundManager.load(),
        fontPromise
      ];

      await Promise.all(promises);
      this.game.state.start('Main', true, false, data);
    }
    catch(err) {
      loadingText.text = 'Error: Unable to load the game!\nYou might need to try another browser.';
      throw err;
    }
  }

}

export default Preload;