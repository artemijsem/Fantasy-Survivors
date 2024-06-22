class lvlupS extends Phaser.Scene {
    constructor()
    {
        super('lvlupS');
    }

    preload()
    {
        this.load.image('blank_canvas','assets/MyAssets/Canvas.png');
        this.load.image('strength_lvl_up', 'assets/MyAssets/Strength_Upgrade.png');
        this.load.image('agility_lvl_up', 'assets/MyAssets/Agility_Upgrade.png');
        this.load.image('health_lvl_up', 'assets/MyAssets/Health_Upgrade.png');
        
    }

    create()
    {

        // Images and text set up

        this.canvas = this.add.image(GAMEWIDTH / 2, GAMEHEIGHT / 2, 'blank_canvas');

        this.heading = this.add.text(GAMEWIDTH / 2, this.canvas.y - 100, "Level UP !", {
            font: "26px fantasy",
            fill: "ffffff",
        }).setOrigin(0.5);

        this.description = this.add.text(GAMEWIDTH / 2, this.canvas.y - 50, "Level Upgrade Description", {
            font: "22px fantasy",
            color: "white",
        }).setOrigin(0.5);

        var strength_button = this.add.sprite(this.canvas.x - 100, 
        this.canvas.y + this.canvas.y / 5, 'strength_lvl_up');

        var agility_button = this.add.sprite(this.canvas.x, 
        this.canvas.y + this.canvas.y / 5, 'agility_lvl_up');

        var health_button = this.add.sprite(this.canvas.x + 100, 
        this.canvas.y + this.canvas.y / 5, 'health_lvl_up');

        
        // Selector Marker

        this.selector = this.add.graphics();
        this.selector.lineStyle(3, 0xffffff, 1);
        this.selector.strokeRect(0,0, 63,63);
        
        // Button selector set up
        this.selected_button_num = 1
        this.button_arr = [strength_button, agility_button, health_button];
        
        // Controls set up
        this.cursors = this.input.keyboard.createCursorKeys();
        this.confirm_button = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.buttonIsPressed = false;

        
    }


    update()
    {
        
        this.selected_button = this.button_arr[this.selected_button_num];

        // Marker appears on selected button
        this.selector.x = this.selected_button.x - this.selected_button.width / 2;
        this.selector.y = this.selected_button.y - this.selected_button.height / 2;

        // Description text handling
        switch(this.selected_button_num)
        {
            case 0:
                if(this.confirm_button.isDown)
                {
                    soundManager.menu_select_sfx.play();
                    this.scene.stop('lvlupS');
                    this.scene.run('gameS');
                    world.eventEmitter.emit('strength_upgrade');
                }
                this.description.setText("Increase Dagger damage\nIncrease Max Health")
                break;
            case 1:
                if(this.confirm_button.isDown)
                {
                    soundManager.menu_select_sfx.play();
                    this.scene.stop('lvlupS');
                    this.scene.run('gameS');
                    world.eventEmitter.emit('agility_upgrade');
                }
                this.description.setText("Increase Move speed\nThrow daggers faster")
                break;
            case 2:
                if(this.confirm_button.isDown)
                {
                    soundManager.menu_select_sfx.play();
                    this.scene.stop('lvlupS');
                    this.scene.run('gameS');
                    world.eventEmitter.emit('health_upgrade');
                }
                this.description.setText("Full health")
                break;

        }

        // Selection handling
        if(this.cursors.left.isDown & !this.buttonIsPressed)
        {
            soundManager.menu_select_sfx.play();
            this.buttonIsPressed = true;
            // In case selected icon is the most left one, swith selection to the most right one
            if(this.selected_button_num > 0)
            {
                this.selected_button_num -= 1
            }
            else{
                this.selected_button_num = 2;
            }
        }

        if(this.cursors.right.isDown & !this.buttonIsPressed)
        {
            soundManager.menu_select_sfx.play();
            this.buttonIsPressed = true;
            // In case selected icon is the most right one, swith selection to the most left one
            if(this.selected_button_num < 2)
            {
                this.selected_button_num += 1
            }
            else{
                this.selected_button_num = 0;
            }
        }

        // Make only one switch happen upon cursor key press
        if(this.cursors.left.isUp && this.cursors.right.isUp) this.buttonIsPressed = false;



    }
}