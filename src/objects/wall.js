import CONSTANTS from '../utils/constants';

function radianToDegrees(r) {
  return r * 180 / Math.PI;
}

class Wall {

  constructor(state, length, angle, radius, note, instrument) {
    this.game = state.game;
    this.state = state;

    const outLength = length + Math.cos((Math.PI *3)/8) * CONSTANTS.WALL_WIDTH;
    this.bpm = this.game.make.bitmapData(outLength, CONSTANTS.WALL_WIDTH);
    this.bpm.ctx.fillStyle = this.getColor(CONSTANTS.WALL_COLOR);
    this.bpm.ctx.beginPath();
    this.bpm.ctx.moveTo(0, 0);
    this.bpm.ctx.lineTo(outLength, 0);
    this.bpm.ctx.lineTo(length, CONSTANTS.WALL_WIDTH);
    this.bpm.ctx.lineTo(Math.cos((Math.PI *3)/8) * CONSTANTS.WALL_WIDTH, CONSTANTS.WALL_WIDTH);
    this.bpm.ctx.closePath();
    this.bpm.ctx.fill();

    this.radius = radius;
    this.angle = angle;
    const x = this.game.world.centerX + radius * Math.sin(angle);
    const y = this.game.world.centerY - radius * Math.cos(angle);

    this.sprite = this.game.add.sprite(x, y, this.bpm);
    this.sprite.angle = radianToDegrees(angle);
    this.sprite.anchor.y = 0.5;
    this.sprite.anchor.x = 0.5;

    this.game.physics.p2.enable(this.sprite);
    this.sprite.body.setRectangle(length, 20);
    this.sprite.body.static = true;
    this.sprite.body.angle = radianToDegrees(angle);
    this.sprite.data.type = 'wall';
    // this.sprite.body.debug = true;

    this.sprite.body.onBeginContact.add(this.collide, this);

    this.note = note;
    this.instrument = instrument;

    this.gradient = {
      level: 1,
      color: CONSTANTS.WALL_COLOR
    };

    this.debug = '';
  }

  collide(body) {
    // this.debug = `wall ${this.note} collided with ${body.sprite.data.type}`;
    if (body.sprite.data.type === 'ball') {
      this.bpm.ctx.fillStyle = this.getColor(body.sprite.data.color);
      this.bpm.ctx.fill();

      this.gradient.color = body.sprite.data.color; 
      this.gradient.level = 0;

      this.instrument.play(this.note, CONSTANTS.INSTRUMENTS[body.sprite.data.ball.type]);

      this.state.hitWall();
    }
  }

  render() {
    if (this.debug) {
      this.game.debug.text(this.debug, 32, 32);
    }

    if (this.gradient.level < 1) {
      this.gradient.level = this.gradient.level + CONSTANTS.WALL_GRADIENT_SPEED;
      this.bpm.ctx.fillStyle = this.getGradientColor(this.gradient.color, this.gradient.level);
      this.bpm.ctx.fill();
    }
    else {
      this.gradient.level = 1;
      this.bpm.ctx.fillStyle = this.getColor(CONSTANTS.WALL_COLOR);
      this.bpm.ctx.fill();
    }
  }

  rotate(diff) {
    this.angle = (this.angle + diff) % (2 * Math.PI);
    this.sprite.body.x = this.game.world.centerX + this.radius * Math.sin(this.angle);
    this.sprite.body.y = this.game.world.centerY - this.radius * Math.cos(this.angle);
    this.sprite.body.angle = radianToDegrees(this.angle);
  }

  getColor(color) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  getGradientColor(colorFrom, balance) {
    var nbal = 1 - balance;
    const color = {};
    for (const idx of ['r', 'g', 'b']) {
      color[idx] = Math.floor(colorFrom[idx]*nbal + CONSTANTS.WALL_COLOR[idx] * balance);
    }
    return this.getColor(color);
  }
  
}

export default Wall;
