class menuS extends Phaser.Scene {
    constructor ()
    {
        super('menuS');
        this.game_started_once = false;
    }

    preload()
    {
        this.load.image('main_menu_bg', 'assets/MyAssets/Main_Menu.png');
        this.load.image('menu_button', 'assets/MyAssets/Button.png');

        this.load.audio('dagger_sfx', 'assets/Audio/Dagger_Throw.mp3');
        this.load.audio('enemy_hit_sfx', 'assets/Audio/Enemy_Hit.mp3');
        this.load.audio('game_over_sfx', 'assets/Audio/Game_Over.mp3');
        this.load.audio('player_hit_sfx', 'assets/Audio/Player_Hit.mp3');
        this.load.audio('menu_select_sfx', 'assets/Audio/Menu_Select.mp3');
        this.load.audio('xp_pickup_sfx', 'assets/Audio/XP_Pickup.mp3');
        this.load.audio('bg_music', 'assets/Audio/Bg_Music.mp3');
    }

    create()
    {

        // Sound Manager Set Up
        soundManager.dagger_sfx = this.sound.add('dagger_sfx');
        soundManager.enemy_hit_sfx = this.sound.add('enemy_hit_sfx');
        soundManager.game_over_sfx = this.sound.add('game_over_sfx');
        soundManager.player_hit_sfx = this.sound.add('player_hit_sfx');
        soundManager.menu_select_sfx = this.sound.add('menu_select_sfx');
        soundManager.xp_pickup_sfx = this.sound.add('xp_pickup_sfx');
        soundManager.bg_music = this.sound.add('bg_music');
        


        this.canvas = this.add.image(GAMEWIDTH / 2, GAMEHEIGHT / 2, 'main_menu_bg');


        // Start game button
        var start_b = this.add.sprite(GAMEWIDTH / 2 , GAMEHEIGHT / 2 , 'menu_button').setInteractive();

        start_b.on('pointerdown', ()=> {
            if(this.game_started_once == false)
            {
                this.game_started_once = true;
                this.scene.start('gameS');
                this.scene.stop();
            }
            else
            {
                world.eventEmitter.emit('restartGame');
                this.scene.stop();
            }

            soundManager.menu_select_sfx.play();
        })


        this.start_b_text = this.add.text(start_b.x, start_b.y, "Start",{
            font: "22px monospace",
            color: "white"
        }).setOrigin(0.5);
    }

}