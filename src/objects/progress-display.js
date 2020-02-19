import CONSTANTS from '../utils/constants';

class ProgressDisplay {
  constructor(game, background) {
    this.game = game;
    this.background = background;

    // Initialise display
    this.createImage();
    this.position = 0;
    this.stage = 0;

    // Animation state
    this.animation = {
      active: false,
      level: 0,
      target: 0,
      start: 0,
      // Async will be use for animating background asynchronously
      async: {
        color: {},
      }
    };
    // Fading is for animation between two stage
    this.fading = {active: false};
  }

  render() {
    if (this.animation.active) {
      // Calculate positions
      this.animation.level += 1/(60 * (this.animation.forward ? CONSTANTS.PROGRESS_DRAW_TIME : CONSTANTS.PROGRESS_CLEAR_TIME));
      const nextPosition = this.animation.forward ?
        Math.max(this.position, this.animation.start + Math.sin((Math.PI/2) * this.animation.level) * Math.abs(this.animation.target - this.animation.start)) :
        Math.min(this.position, this.animation.start - Math.abs(this.animation.start - this.animation.target) * this.animation.level);

      // Draw animation
      this.drawArc(nextPosition);
      // Don't update background if animation is not forward and an asynchronous fading is active
      if (!(!this.forward && this.animation.async.fading)) {
        this.drawBackground(nextPosition, this.stage);
      }

      // Move position
      this.position = nextPosition;

      // End animation
      if (this.animation.level >= 1) {
        // Set position to target
        this.animation.active = false;
        this.position = this.animation.target;
        // Clear arc if target is 0 (chrome)
        if (this.animation.target === 0) {
          this.bmd.clear();
        }
      }
    }

    // Fade previous completed circle
    if (this.fading.active) {
      if (this.fading.level > 0) {
        this.fade();
      }
      else {
        // End fading
        this.fading.image.destroy();
        this.fading.active = false;
      }
    }
  }

  drawArc(level) {
    // Calculate angles
    const angleTo = - Math.PI / 2 + Math.max(0, level * 2 * Math.PI);
    // Draw
    this.bmd.clear();
    if (level !== 0) {
      this.bmd.ctx.beginPath();
      this.bmd.ctx.arc(this.game.world.centerX, this.game.world.centerY, CONSTANTS.PROGRESS_RADIUS, - Math.PI / 2, angleTo);
      this.bmd.ctx.stroke();
    }
  }

  drawBackground(balance, stage, completion, reset) {
    // Calculate colors for gradient
    const nextLevel = (reset ? 0 : stage + 1) % CONSTANTS.LEVELS_COLORS.length;
    const colorFrom = CONSTANTS.LEVELS_COLORS[stage];
    const colorTo = CONSTANTS.LEVELS_COLORS[nextLevel];

    // Center color (between current stage and next stage)
    const nbal = 1 - balance;
    for (const idx of ['r', 'g', 'b']) {
      this.animation.async.color[idx] = Math.floor(colorFrom[idx]*nbal + colorTo[idx] * balance);
    }
    // Update async
    this.animation.async.completion = completion;

    // We use timeout so that render doesn't slow down the game
    setTimeout(() => {
      // If an async fading has been stopped, don't draw it
      if (this.stage !== stage && !this.animation.async.fading) {
        return;
      }
      if (!reset) {
        // Build radial gradient
        const radius0 = (this.animation.async.completion || 0) * (this.game.width * Math.sqrt(2)) / 2;
        const radius1 = (this.game.width * Math.sqrt(2)) / 2 + radius0;
        const gradient = this.background.ctx.createRadialGradient(this.game.world.centerX, this.game.world.centerY, radius0, this.game.world.centerX, this.game.world.centerY, radius1);
        gradient.addColorStop(0, `rgb(${this.animation.async.color.r}, ${this.animation.async.color.g}, ${this.animation.async.color.b})`);
        gradient.addColorStop(1, `rgb(${colorFrom.r}, ${colorFrom.g}, ${colorFrom.b})`);
        // Draw gradient
        this.background.ctx.fillStyle = gradient;
      }
      else {
        // Regular fade
        this.background.ctx.fillStyle = `rgb(${this.animation.async.color.r}, ${this.animation.async.color.g}, ${this.animation.async.color.b})`;
      }
      this.background.ctx.fillRect(0, 0, this.game.width, this.game.height);
      
      // For a fading, once complete, end the async drawing
      if (completion && completion >= 1) {
        this.animation.async.fading = false;
      }
    });
  }

  increment(value, total) {
    this.animation.target = value / total;
    this.animation.active = true;
    this.animation.level = 0;
    this.animation.start = this.position;
    // Cancel async fading
    this.animation.async.fading = false;

    if (this.position <= this.animation.target) {
      this.animation.forward = true;
    }
  }

  clear() {
    this.animation.start = this.position;
    this.animation.target = 0;
    this.animation.active = true;
    this.animation.level = 0;
    this.animation.forward = false;
  }

  createImage() {
    this.bmd = this.game.add.bitmapData(this.game.width, this.game.height);
    this.image = this.game.add.image(0, 0, this.bmd);
    this.bmd.ctx.strokeStyle = `rgba(${CONSTANTS.PROGRESS_DEFAULT_COLOR.r}, ${CONSTANTS.PROGRESS_DEFAULT_COLOR.g}, ${CONSTANTS.PROGRESS_DEFAULT_COLOR.b}, ${CONSTANTS.PROGRESS_OPACITY})`;
    this.bmd.ctx.lineCap = 'round';
    this.bmd.ctx.lineWidth = 4;
  }

  complete() {
    // Put the circle in a object to handle its fading separately
    this.fading = {
      image: this.image,
      bmd: this.bmd,
      level: 1,
      gradient: 0,
      position: this.position,
      stage: this.stage,
      incrementation: (1 - this.position) / (60 * CONSTANTS.PROGRESS_CLEAR_TIME),
      active: true
    };
    this.animation.async.fading = true;

    // Create a new circle
    this.createImage();

    this.animation.active = false;
    this.position = 0;
    this.animation.target = 0;

    this.stage = (this.stage + 1) % CONSTANTS.LEVELS_COLORS.length;
  }

  reset() {
    this.clear();

    if (this.fading.active) {
      this.fading.bmd.clear();
    }

    this.fading = {
      image: this.image,
      bmd: this.bmd,
      level: 1,
      position: 1,
      stage: this.stage,
      active: true,
      reset: true
    };
    this.animation.async.fading = true;
    this.createImage();

    this.stage = 0;
  }

  fade() {
    this.fading.bmd.clear();
    this.fading.bmd.ctx.beginPath();

    if (this.fading.position < 1) {
      // Draw circle and do a gradient
      var nbal = 1 - this.fading.gradient;
      // calculate color
      const color = {};
      for (const idx of ['r', 'g', 'b']) {
        color[idx] = Math.floor(CONSTANTS.PROGRESS_DEFAULT_COLOR[idx] * nbal + CONSTANTS.PROGRESS_COMPLETE_COLOR[idx] * this.fading.gradient);
      }
      this.fading.bmd.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${CONSTANTS.PROGRESS_OPACITY})`;
      // draw arc
      this.fading.position += this.fading.incrementation;
      const angle = - Math.PI / 2 + this.fading.position * 2 * Math.PI;
      this.fading.bmd.ctx.arc(this.game.world.centerX, this.game.world.centerY, CONSTANTS.PROGRESS_RADIUS, - Math.PI / 2, angle);
      
      this.fading.gradient += 1 / (60 * CONSTANTS.PROGRESS_DRAW_TIME);

      this.drawBackground(this.fading.position, this.fading.stage);
    }
    else {
      // Fade circle
      if (!this.fading.reset) {
        this.fading.bmd.ctx.strokeStyle = `rgba(${CONSTANTS.PROGRESS_COMPLETE_COLOR.r}, ${CONSTANTS.PROGRESS_COMPLETE_COLOR.g}, ${CONSTANTS.PROGRESS_COMPLETE_COLOR.b}, ${this.fading.level * CONSTANTS.PROGRESS_OPACITY})`;
        this.fading.bmd.ctx.arc(this.game.world.centerX, this.game.world.centerY, CONSTANTS.PROGRESS_RADIUS, 0, 2 * Math.PI);
      }

      // Change background color
      this.fading.level -= 1 / (60 * CONSTANTS.PROGRESS_FADE_TIME);
      const completion = Math.min(1, 1 - this.fading.level);
      this.drawBackground(this.fading.reset ? completion : 1, this.fading.stage, completion, this.fading.reset);
    }
    this.fading.bmd.ctx.stroke();
  }
}

export default ProgressDisplay;