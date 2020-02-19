class CollisionManager {
  constructor(game) {
    this.game = game;

    // Materials
    this.materials = {
      ball: this.game.physics.p2.createMaterial('ballMaterial'),
      wall: this.game.physics.p2.createMaterial('wallMaterial')
    };
    // Contact material between balls and walls
    this.materials.ballContactWall = this.game.physics.p2.createContactMaterial(this.materials.wall, this.materials.ball);
    this.materials.ballContactWall.friction = 0;
    this.materials.ballContactWall.restitution = 1.0;

    // Collisions groups
    this.collisions = {
      player: {
        group: this.game.physics.p2.createCollisionGroup(),
        with: ['wall', 'ball']
      },
      wall: {
        group: this.game.physics.p2.createCollisionGroup(),
        with: ['player', 'ball']
      },
      ball: {
        group: this.game.physics.p2.createCollisionGroup(),
        with: ['wall', 'player']
      }
    };
  }

  setMaterial(body, name) {
    this.game.physics.p2.setMaterial(this.materials[name], [body]);
  }

  setCollisions(body, name) {
    body.setCollisionGroup(this.collisions[name].group);
    body.collides(this.collisions[name].with.map(cgName => this.collisions[cgName].group));
  }
}

export default CollisionManager;