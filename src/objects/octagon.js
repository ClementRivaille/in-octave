import Wall from './wall';
import teoria from 'teoria';
import CONSTANTS from '../utils/constants';

class Octagon {

  constructor(state, instruments) {
    this.game = state.game;

    // Length of walls
    const length = CONSTANTS.OCTAGON_SIZE * (0.414);
    // Musical scale
    const scale = teoria.scale('G3', 'minor').notes();
    scale.push(scale[0].interval('P8'));

    // Wall angle and notes
    const wallParameters = [
      {angle:  0,                note: 7},
      {angle:  Math.PI / 4,      note: 6},
      {angle:  Math.PI / 2,      note: 4},
      {angle:  3 * Math.PI / 4,  note: 3},
      {angle:  Math.PI,          note: 0},
      {angle: -3 * Math.PI / 4,  note: 1},
      {angle: - Math.PI / 2,     note: 2},
      {angle: - Math.PI / 4,     note: 5}
    ];
    // Possible note orders:
    // 7 6 4 2 0 1 3 5
    // 7 6 4 3 0 1 2 5
    // 4 1 7 3 0 5 2 6


    this.walls = [];
    // Build walls
    for (const wallParam of wallParameters) {
      const wall = new Wall(state, length, wallParam.angle, CONSTANTS.OCTAGON_SIZE / 2, scale[wallParam.note].scientific(), instruments[0]);
      // Set material and collisions for walls
      state.collisionManager.setMaterial(wall.sprite.body, 'wall');
      state.collisionManager.setCollisions(wall.sprite.body, 'wall');
      
      this.walls.push(wall);
    }
  }

  render() {
    for (const wall of this.walls) {
      wall.render();
    }
  }

  update() {
    for (const wall of this.walls) {
      wall.rotate(CONSTANTS.OCTAGON_ROTATION_SPEED);
    }
  }  
}

export default Octagon;
