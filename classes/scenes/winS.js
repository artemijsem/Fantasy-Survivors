class winS extends Phaser.Scene {
    constructor()
    {
        super('winS');
    }

    preload()
    {
        this.load.image('blank_canvas','assets/MyAssets/Canvas.png');
        this.load.image('menu_button', 'assets/MyAssets/Button.png');
    }

    create()
    {
        // Add background image
        this.canvas = this.add.image(GAMEWIDTH / 2, GAMEHEIGHT / 2, 'blank_canvas');

        this.death_heading = this.add.text(GAMEWIDTH / 2, this.canvas.y - this.canvas.y / 4, "You win!", {
            font: "26px monospace",
            fill: "ffffff",
        }).setOrigin(0.5);


        // Restart button
        var restart_b = this.add.sprite(GAMEWIDTH / 2 - 80, GAMEHEIGHT / 2 + 80, 'menu_button').setInteractive();

        restart_b.on('pointerdown', ()=> {
            world.eventEmitter.emit('restartGame');
            this.scene.stop();
            soundManager.menu_select_sfx.play();
        })

        this.restart_b_text = this.add.text(restart_b.x, restart_b.y, "Restart",{
            font: "22px monospace",
            color: "white"
        }).setOrigin(0.5);


        // Main Menu button
        var main_menu_b = this.add.sprite(GAMEWIDTH / 2 + 80, GAMEHEIGHT / 2 + 80, 'menu_button').setInteractive();

        main_menu_b.on('pointerdown', ()=> {
            this.scene.switch('menuS');
            this.scene.stop();
            soundManager.menu_select_sfx.play();
        })

        this.main_menu_text = this.add.text(main_menu_b.x, main_menu_b.y, "Main Menu",{
            font: "22px monospace",
            color: "white"
        }).setOrigin(0.5);


    }



}