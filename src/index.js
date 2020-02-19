import 'pixi';
import 'p2';
import Phaser from 'phaser';

import Boot from './states/boot';
import Preload from './states/preload';
import Main from './states/main';

import './style.css';

class Game extends Phaser.Game {
  constructor() {
    super(800, 800, Phaser.CANVAS);
    this.state.add('Boot', Boot, false);
    this.state.add('Preload', Preload, false);
    this.state.add('Main', Main, false);

    this.state.start('Boot');
  }
}
new Game();
