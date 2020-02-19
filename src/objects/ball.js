import Phaser from 'phaser';
import CONSTANTS from '../utils/constants';

class Ball {
  
  constructor(state, x, y, direction, type) {
    this.state = state;
    this.game = state.game;
    this.state.addBall(this);

    // Sprite
    const circleBPM = this.game.make.bitmapData(CONSTANTS.BALL_SIZE, CONSTANTS.BALL_SIZE);
    circleBPM.circle(CONSTANTS.BALL_SIZE/2, CONSTANTS.BALL_SIZE/2, CONSTANTS.BALL_SIZE/2, `rgb(${CONSTANTS.BALL_TYPES[type].color.r}, ${CONSTANTS.BALL_TYPES[type].color.g}, ${CONSTANTS.BALL_TYPES[type].color.b})`);
    this.sprite = this.game.add.sprite(x, y, circleBPM );
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    // Body
    this.game.physics.p2.enable(this.sprite);
    this.sprite.body.setCircle(CONSTANTS.BALL_SIZE/2);
    this.sprite.body.damping = 0;
    state.collisionManager.setMaterial(this.sprite.body, 'ball');
    state.collisionManager.setCollisions(this.sprite.body, 'ball');
    this.sprite.body.onBeginContact.add(this.collide, this);

    // Particles
    const particleBmd = this.game.make.bitmapData(CONSTANTS.PARTICLE_SIZE, CONSTANTS.PARTICLE_SIZE);
    const particleColor = {};
    for (const idx of ['r', 'g', 'b']) {
      particleColor[idx] = Math.floor(CONSTANTS.BALL_TYPES[type].color[idx]*0.3 + 255 * 0.7);
    }
    const gradient = particleBmd.ctx.createRadialGradient(CONSTANTS.PARTICLE_SIZE / 2, CONSTANTS.PARTICLE_SIZE / 2, 2, CONSTANTS.PARTICLE_SIZE / 2, CONSTANTS.PARTICLE_SIZE / 2, CONSTANTS.PARTICLE_SIZE / 2);
    gradient.addColorStop(0, `rgba(${particleColor.r}, ${particleColor.g}, ${particleColor.b}, 0.6)`);
    gradient.addColorStop(1, `rgba(${particleColor.r}, ${particleColor.g}, ${particleColor.b}, 0)`);
    particleBmd.ctx.fillStyle = gradient;
    particleBmd.ctx.fillRect(0, 0, CONSTANTS.PARTICLE_SIZE, CONSTANTS.PARTICLE_SIZE);
    this.emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 100);
    this.emitter.gravity = 0;
    this.emitter.maxParticleSpeed = 0;
    this.emitter.minRotation = 0;
    this.emitter.maxRotation = 0;
    this.emitter.setAlpha(1, 0, CONSTANTS.BALL_TYPES[type].trail);
    this.emitter.setScale(1,0,1,0,CONSTANTS.BALL_TYPES[type].trail,Phaser.Easing.Linear.None);
    this.emitter.makeParticles(particleBmd);
    this.emitter.x = this.sprite.x;
    this.emitter.y = this.sprite.y;
    this.emitter.start(false,CONSTANTS.BALL_TYPES[type].trail,0);
    this.state.addToBackground(this.emitter);

    // Collision data
    this.sprite.data.type = 'ball';
    this.sprite.data.ball = this;
    this.sprite.data.color = CONSTANTS.BALL_TYPES[type].color;

    // Initial velocity
    const velocity = Phaser.Point.multiplyAdd(new Phaser.Point(), direction, CONSTANTS.BALL_TYPES[type].velocity);
    this.sprite.body.velocity.x = velocity.x;
    this.sprite.body.velocity.y = velocity.y;

    this.type = type;
  }

  collide() {}

  update() {
    if (this.type === 'curved') {
      let gravity = new Phaser.Point(this.game.world.centerX - this.sprite.x, this.game.world.centerY - this.sprite.y).normalize();
      gravity = Phaser.Point.multiplyAdd(new Phaser.Point(), gravity, - 225);
      this.sprite.body.force.x = gravity.x;
      this.sprite.body.force.y = gravity.y;
    }
  }

  render() {
    this.emitter.x = this.sprite.x;
    this.emitter.y = this.sprite.y;
  }

  destroy(reset) {
    if (!reset) {
      this.state.removeBall(this);
    }
    this.emitter.on = false;
    this.sprite.destroy();

    // Wait for particles to disappear before destroying emitter
    setTimeout(() => {
      this.emitter.destroy();
    }, CONSTANTS.BALL_TYPES[this.type].trail);
  }
}

export default Ball;
