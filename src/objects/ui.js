import CONSTANTS from '../utils/constants';

class UI {

  constructor(game) {
    this.game = game;

    // Title screen
    this.title = this.game.add.group();
    this.title.x = this.game.world.centerX;
    this.title.y = this.game.world.centerY;
    const octave = this.game.make.text(0, 0, 'OCTAVE', {
      align: 'center',
      fill: 'white',
      font: `${CONSTANTS.TITLE_OCTAVE_SIZE}px 'springsteel'`
    });
    octave.anchor.x = 0.5;
    octave.anchor.y = 0.5;
    const titleIn = this.game.make.text(0, CONSTANTS.TITLE_IN_POSITION, 'IN', {
      align: 'center',
      fill: 'white',
      font: `${CONSTANTS.TITLE_IN_SIZE}px 'springsteel'`
    });
    titleIn.anchor.x = 0.5;
    titleIn.anchor.y = 0.5;
    this.title.add(octave);
    this.title.add(titleIn);
    
    // Press start
    this.pressStart = this.game.add.text(this.game.world.centerX, this.game.world.centerY + CONSTANTS.TITLE_START_POSITION, 'START / ENTER', {
      align: 'center',
      fill: 'white',
      font: `${CONSTANTS.TITLE_START_SIZE}px 'springsteel'`
    });
    this.pressStart.anchor.x = 0.5;
    this.pressStart.anchor.y = 0.5;
    this.pressStart.alpha = CONSTANTS.UI_OPACITY;

    // Control display
    this.controls = this.game.add.group();
    this.controls.x = this.game.world.centerX;
    const padIcon = this.game.make.image(-CONSTANTS.CONTROLS_POSITION.x, CONSTANTS.CONTROLS_POSITION.y, 'pad');
    padIcon.alpha = CONSTANTS.UI_OPACITY;
    padIcon.anchor.x = 0.5;
    this.controls.add(padIcon);
    const keyboardIcon = this.game.make.image(CONSTANTS.CONTROLS_POSITION.x, CONSTANTS.CONTROLS_POSITION.y, 'keyboard');
    keyboardIcon.alpha = CONSTANTS.UI_OPACITY;
    keyboardIcon.anchor.x = 0.5;
    this.controls.add(keyboardIcon);

    // Score
    this.scoreLabels = {};
    this.score = this.game.add.group();
    this.score.x = this.game.world.centerX;
    this.score.y = this.game.world.centerY;
    this._makeScoreDisplay('time', CONSTANTS.SCORE_TIME_POSITION);
    this._makeScoreDisplay('hits', CONSTANTS.SCORE_HITS_POSITION);
    this.score.visible = false;
  }

  hideTitle() {
    this.title.visible = false;
    this.pressStart.visible = false;
    this.score.visible = false;
    this.scoreLabels.time.new.visible = false;
    this.scoreLabels.hits.new.visible = false;
    this.scoreLabels.hits.perfect.visible = false;
  }

  hideControls() {
    this.controls.visible = false;
  }

  showTitle() {
    this.title.visible = true;
    this.score.visible = true;
    this.game.world.bringToTop(this.title);
    this.game.world.bringToTop(this.score);
  }

  updateScore(time, hits) {
    this.scoreLabels.time.value.text = this._writeTime(time);
    let bestTime = localStorage.getItem('inoctave.time');
    if (!bestTime || time < bestTime) {
      localStorage.setItem('inoctave.time', time);
      this.scoreLabels.time.new.visible = !!bestTime;
      bestTime = time;
    }
    this.scoreLabels.time.best.text = this._writeTime(bestTime);
    
    this.scoreLabels.hits.value.text = `${hits}`;
    let bestHits = localStorage.getItem('inoctave.hits');
    if (!bestHits || hits < bestHits) {
      localStorage.setItem('inoctave.hits', hits);
      this.scoreLabels.hits.new.visible = !!bestHits;
      bestHits = hits;
    }
    this.scoreLabels.hits.best.text = bestHits;
    this.scoreLabels.hits.perfect.visible = hits === 0;
  }

  _writeTime(time) {
    const minutes = Math.floor(time / (60 * 1000));
    const seconds = Math.floor(time / 1000) % 60;
    const milliseconds = Math.round((time % 1000) / 10);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${milliseconds < 10 ? '0' : ''}${milliseconds}`;
  }

  _makeScoreDisplay(name, position) {
    const scoreDisplay = this.game.add.group();
    scoreDisplay.y = position;
    this.score.add(scoreDisplay);
    
    scoreDisplay.add(this._makeText(0, CONSTANTS.SCORE_LABEL_POSITION, CONSTANTS.SCORE_LABEL_SIZE, name.toUpperCase(), true));
    
    this.scoreLabels[name] = {};
    this.scoreLabels[name].value = this._makeText(-CONSTANTS.SCORE_VALUE_POSITION.x, CONSTANTS.SCORE_VALUE_POSITION.y, CONSTANTS.SCORE_VALUE_SIZE, '', true);
    this.scoreLabels[name].best = this._makeText(CONSTANTS.SCORE_VALUE_POSITION.x, CONSTANTS.SCORE_VALUE_POSITION.y, CONSTANTS.SCORE_VALUE_SIZE, '', true, CONSTANTS.SCORE_BEST_COLOR);
    this.scoreLabels[name].new = this._makeText(0, CONSTANTS.SCORE_NEW_POSITION, CONSTANTS.SCORE_NEW_SIZE, 'NEW RECORD', true, CONSTANTS.SCORE_BEST_COLOR);
    this.scoreLabels[name].perfect = this._makeText(0, CONSTANTS.SCORE_PERFECT_POSITION, CONSTANTS.SCORE_NEW_SIZE, 'PERFECT', true, CONSTANTS.SCORE_BEST_COLOR);
    
    scoreDisplay.add(this.scoreLabels[name].value);
    scoreDisplay.add(this.scoreLabels[name].best);
    scoreDisplay.add(this.scoreLabels[name].new);
    scoreDisplay.add(this.scoreLabels[name].perfect);

    this.scoreLabels[name].new.visible = false;
    this.scoreLabels[name].perfect.visible = false;
  }

  _makeText(x, y, size, value, alpha=false, color='white') {
    const text = this.game.make.text(x, y, value, {
      align: 'center',
      fill: color,
      font: `${size}px 'springsteel'`
    });
    text.anchor.x = 0.5;
    text.anchor.y = 0.5;
    text.alpha = alpha ? CONSTANTS.UI_OPACITY : 1;
    return text;
  }
  
}

export default UI;
