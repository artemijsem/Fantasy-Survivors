

const GAMEHEIGHT = 720;
const GAMEWIDTH = 1280;

var world = {
  map: null,
  tileSet: null,
  firstLayer: null,
  secondLayer: null,
  eventEmitter: null
};

var soundManager = {
    dagger_sfx: null,
    enemy_hit_sfx: null,
    game_over_sfx: null,
    player_hit_sfx: null,
    menu_select_sfx: null,
    xp_pickup_sfx: null,
    bg_music: null
};



let config = {
    type: Phaser.AUTO,
    width: GAMEWIDTH,
    height: GAMEHEIGHT,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    },
    scene: [menuS, gameS, deadS, lvlupS, winS]
    
};



var game = new Phaser.Game(config);
