export default {
  // Octagon
  OCTAGON_SIZE: 700,
  OCTAGON_ROTATION_SPEED: Math.PI / 2 * 1 / (12 * 60),

  // Title
  TITLE_OCTAVE_SIZE: 160,
  TITLE_IN_SIZE: 80,
  TITLE_IN_POSITION: -100,
  TITLE_START_POSITION: 200,
  TITLE_START_SIZE: 40,

  // UI
  UI_OPACITY: 0.5,
  CONTROLS_POSITION: {
    x: 320,
    y: 40
  },
  SCORE_TIME_POSITION: -230,
  SCORE_HITS_POSITION: 180,
  SCORE_LABEL_SIZE: 50,
  SCORE_LABEL_POSITION: -50,
  SCORE_VALUE_POSITION: {x: 100, y: 50},
  SCORE_VALUE_SIZE: 40,
  SCORE_BEST_COLOR: 'yellow',
  SCORE_NEW_SIZE: 30,
  SCORE_NEW_POSITION: 10,
  SCORE_PERFECT_POSITION: 90,

  // Walls
  WALL_WIDTH: 20,
  WALL_COLOR: {r: 255, g: 255, b: 255},
  WALL_GRADIENT_SPEED: 0.02,

  // Player
  PLAYER_SIZE: 50,
  AMMO_ANIM_TIME: 0.1,
  PLAYER_ACTIVATE_ANIM_TIME: 0.3,
  COLLIDE_ANIM_TIME: 0.4,
  PLAYER_VELOCITY: 400,
  CURSOR_SIZE: 10,
  CURSOR_WIDTH: 3,

  // Ball
  BALL_SIZE: 12,
  BALL_TYPES:  {
    default: {
      velocity: 450,
      color: {r: 99, g: 219, b: 239},
      trail: 500
    },
    fast: {
      velocity: 600,
      color: {r: 217, g: 180, b: 112},
      trail: 400
    },
    curved: {
      velocity: 450,
      color: {r: 112, g: 0, b: 118},
      trail: 600,
    }
  },
  PARTICLE_SIZE: 16,

  // Progress
  PROGRESS_RADIUS: 200,
  PROGRESS_DRAW_TIME: 0.25,
  PROGRESS_CLEAR_TIME: 0.15,
  PROGRESS_FADE_TIME: 0.5,
  PROGRESS_DEFAULT_COLOR: {r: 255, g: 255, b: 255},
  PROGRESS_COMPLETE_COLOR: {r: 246, g: 244, b: 77},
  PROGRESS_OPACITY: 0.6,

  // Music
  BG_FADE_IN: 0.2,
  BG_FADE_OUT: 0.4,
  EVOL_FADE_IN: 0.25,
  EVOL_FADE_OUT: 1.4,
  BG_MIN: 0.6,
  EVOL_MIN: 0.1,

  INSTRUMENTS: {
    default: 'piano',
    fast: 'xylophone',
    curved: 'guitar'
  },

  // Background Color
  LEVELS_COLORS: [
    {r: 74, g:176, b:235},
    {r: 44, g:198, b:152},
    {r: 240, g:160, b:90},
    {r: 242, g:114, b:144},
    {r: 154, g:22, b:190},
    {r: 163, g:50, b:108},
    {r: 166, g:117, b:69},
    {r: 112, g:90, b:105},
  ]
};
