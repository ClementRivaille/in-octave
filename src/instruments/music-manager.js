import Tone from 'tone';
import CONSTANTS from '../utils/constants';

class MusicManager {
  constructor() {
    this.tracks = {};
    this.requests = [];

    for (let level = 1 ; level <= 9 ; level++) {
      this.tracks[level] = {};
      if (level > 1) {
        this.addPlayer(level, 'bg');
        this.addPlayer(level, 'trans');
      }
      if (level < 9) {
        this.addPlayer(level, 'evol');
      }
    }

    this.context = Tone.context;
    this.gains = {};
    this.levelStarted = 0;
  }

  addPlayer(level, name) {
    const config = name !== 'trans' ?
      {loop: true, fadeIn: CONSTANTS.BG_FADE_IN } :
      {volume: -2};
    const player = new Tone.Player(config);
    this.tracks[level][name] = player;
    this.requests.push(player.load(`./assets/music/${level}-${name}.ogg`));
  }

  load() {
    return Promise.all(this.requests);
  }

  startLevel(level) {
    if (level > 1) {
      this.gains.bg = new Tone.Gain(1);
      Tone.connectSeries(this.tracks[level].bg, this.gains.bg, Tone.Master);
      Tone.connectSeries(this.tracks[level].trans, Tone.Master);
      this.tracks[level].bg.start();
      this.tracks[level].trans.start();
    }
    if (level < 9) {
      this.gains.evol = new Tone.Gain(0);
      Tone.connectSeries(this.tracks[level].evol, this.gains.evol, Tone.Master);
      this.tracks[level].evol.start();
    }

    this.levelStarted = level;
  }

  stopLevel(level) {
    if (level > 1) {
      this.gains.bg.gain.setTargetAtTime(0, this.context.currentTime, CONSTANTS.BG_FADE_OUT);
      const bgGain = this.gains.bg;
      delete this.gains.bg;
      setTimeout(() => {
        this.tracks[level].bg.stop();
        bgGain.disconnect();
      }, CONSTANTS.BG_FADE_OUT * 10000);
    }
    if (level < 9) {
      this.gains.evol.gain.setTargetAtTime(0, this.context.currentTime, CONSTANTS.EVOL_FADE_OUT);
      const evolGain = this.gains.evol;
      setTimeout(() => {
        if (this.levelStarted !== level) {
          this.tracks[level].evol.stop();
        }
        evolGain.disconnect();
      }, CONSTANTS.EVOL_FADE_OUT * 10000);
    }
  }

  progress(value) {
    const evolvalue = CONSTANTS.EVOL_MIN + value * (1 - CONSTANTS.EVOL_MIN);
    this.gains.evol.gain.setTargetAtTime(evolvalue, this.context.currentTime, CONSTANTS.EVOL_FADE_IN);
    if (this.gains.bg) {
      const bgvalue = CONSTANTS.BG_MIN + (1 - value) * (1 - CONSTANTS.BG_MIN);
      this.gains.bg.gain.setTargetAtTime(bgvalue, this.context.currentTime, CONSTANTS.EVOL_FADE_IN);
    }

  }

  clear() {
    this.gains.evol.gain.setTargetAtTime(0, this.context.currentTime, CONSTANTS.PROGRESS_CLEAR_TIME);
    if (this.gains.bg) {
      this.gains.bg.gain.setTargetAtTime(1, this.context.currentTime, CONSTANTS.PROGRESS_CLEAR_TIME);
    }
  }

}

export default MusicManager;
