// ================================================================================================
// Global variables
// ================================================================================================
var sword_arr;
var enemy_arr;
var item_arr;
var itemGroup;

class gameS extends Phaser.Scene {

    

    constructor () 
    {
        super('gameS');

        // ================================================================================================
        // Local variables
        // ================================================================================================

        this.cursors;
        this.fireButton;
        this.player;
        this.swordGroup;
        this.enemyGroup;
        this.enemySpawnDelay = 5000;
        this.nextEnemySpawn = 0;
        this.mainCamera;
        this.enemy_anim_str = 'enemy_blue_slime_anim';
        this.game_time;
        this.game_time_delay = 0;
        this.game_restarted = true;
        this.time_min = 0;
        this.time_sec = 1;
        this.health_bar;
        // ================================================================================================

    }

    // ================================================================================================
    //    Preload Function
    // ================================================================================================
    preload()
    {

        this.load.image('sword_png', 'assets/Sword.png');
        this.load.image('xp_c_red', 'assets/MyAssets/XP_Crystal_Red.png');
        this.load.image('xp_c_green', 'assets/MyAssets/XP_Crystal_Green.png');
        this.load.image('xp_c_blue', 'assets/MyAssets/XP_Crystal_Blue.png');
        this.load.image('forest_ts_png', 'assets/Forest_TS.png');
        this.load.tilemapTiledJSON('forest_map','assets/Forest_Level_01.json');

        this.load.spritesheet('pc_sps', 'assets/SwordsmanRed.png',{
        frameWidth: 16,
        frameHeight: 16
        });

        this.load.spritesheet('efc_sps', 'assets/EFC_SPS.png', {
        frameWidth: 32,
        frameHeight: 32
        
        
        });


        this.load.spritesheet('axe_sps', 'assets/Axe.png', {
        frameWidth: 16,
        frameHeight: 16
        });

        this.load.spritesheet('MVS_sps', 'assets/AllAssetsPreview.png',
        {
        frameWidth: 16,
        frameHeight: 16,
        
        });

        this.load.spritesheet('efc_boss', 'assets/Boss_sps.png', {
            frameWidth: 64,
            frameHeight: 48
        });

    };
    // ================================================================================================



    // ================================================================================================
    //    Create Function
    // ================================================================================================
    create()
    {

    // Create event emitter and set up game events
    world.eventEmitter = new Phaser.Events.EventEmitter();
    world.eventEmitter.on('restartGame', this.restartGame, this);
    world.eventEmitter.on('strength_upgrade', this.strengthUpgrade, this);
    world.eventEmitter.on('agility_upgrade', this.agilityUpgrade, this);
    world.eventEmitter.on('health_upgrade', this.healthUpgrade, this);

    
    // Set up controls
    this.cursors = this.input.keyboard.createCursorKeys();

    this.fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Create world based on Tiled map
    this.buildWorld(this, world);
    
    // Set up world borders
    this.physics.world.setBounds(0, 0, world.map.widthInPixels, world.map.heightInPixels);


    // Create animations
    this.createAnimations(this);

    // Create Player object
    this.player = new Player(this, 'pc_sps');

    
    // Create sprite groups
    
    this.swordGroup = this.add.group();

    this.enemyGroup = this.physics.add.group();

    itemGroup = this.add.group();


    // Camera set up
    const camera = this.cameras.main;
    this.mainCamera = camera;

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, world.map.widthInPixels, world.map.heightInPixels);
    
    // Make camera follow the player
    camera.startFollow(this.player);

    
    

    // Arcade physics collider set up
    this.physics.add.overlap(this.player, this.enemyGroup, this.playerEnemyOverlap);
    this.physics.add.overlap(this.swordGroup, this.enemyGroup, this.swordOverlap);
    this.physics.add.overlap(this.player, itemGroup, this.itemOverlap);
    this.physics.add.collider(this.enemyGroup);




    // GUI set up
    this.health_text = this.add.text( GAMEWIDTH / 2 ,16, "Health Text", {
        font: "18px monospace",
        fill: "#ffffff",
        padding: {x: 20, y: 10},
        backgroundColor: "#000000"
    }).setScrollFactor(0);

    this.xp_text = this.add.text( GAMEWIDTH / 2 , 44, "XP Text", {
        font: "18px monospace",
        fill: "#ffffff",
        padding: {x: 20, y: 10},
        backgroundColor: "#000000"
    }).setScrollFactor(0);


    // Play music
    soundManager.bg_music.setLoop(true);
    soundManager.bg_music.play();
    }
    // ================================================================================================



    // ================================================================================================
    //   World Build Function
    // ================================================================================================
    buildWorld(scene, world)
    {
    world.map = scene.make.tilemap({key: 'forest_map'});

    world.tileSet = world.map.addTilesetImage('Forest_Tile_Set', 'forest_ts_png');

    world.firstLayer = world.map.createLayer('Layer_1', world.tileSet, 0, 0);
    world.secondLayer = world.map.createLayer('Layer_2', world.tileSet, 0, 0);
    }

    // ================================================================================================
    //   Update Function
    // ================================================================================================
    update() {
    
    // Update game time
    this.game_time = this.time.now - this.game_time_delay;
    

    // Update game object arrays
    sword_arr = this.swordGroup.getChildren();
    enemy_arr = this.enemyGroup.getChildren();
    item_arr = itemGroup.getChildren();
    

    // Enemy spawning logic
    if(this.game_time > this.nextEnemySpawn)
    {

        if(this.game_time > 0 && this.game_time < 60000) {
        let spawnPos = this.spawnOffScreen();
        this.enemyGroup.add(new Enemy(this, spawnPos.x , spawnPos.y, 'blue_slime_sp', 'enemy_blue_slime_anim', 50, 30, 5, 5));}

        if(this.game_time > 30000 && this.game_time < 130000) {
        let spawnPos = this.spawnOffScreen();
        this.enemyGroup.add(new Enemy(this, spawnPos.x , spawnPos.y, 'mummy_sp', 'enemy_mummy_anim', 40, 50, 10, 15)); }

        if(this.game_time > 60000 && this.game_time < 120000) {
        let spawnPos = this.spawnOffScreen();
        this.enemyGroup.add(new Enemy (this, spawnPos.x, spawnPos.y, 'orc_sp', 'enemy_orc_anim', 30, 70, 20, 30)); }
        
        if(this.game_time > 100000 && this.game_time < 160000) {
        let spawnPos = this.spawnOffScreen();
        this.enemyGroup.add(new Enemy(this, spawnPos.x , spawnPos.y, 's_shroom_sp', 'enemy_m_shroom_anim', 25, 90, 30, 80)); }

        if(this.game_time > 140000 && this.game_time < 200000) {
        let spawnPos = this.spawnOffScreen();
        this.enemyGroup.add(new Enemy(this, spawnPos.x , spawnPos.y, 's_shroom_sp', 'enemy_l_shroom_anim', 20, 120, 40, 100)); }
        
        
        // Boss spawn
        if(this.game_time > 200000) {
        let spawnPos = this.spawnOffScreen();
        this.enemyGroup.add(new Enemy(this, spawnPos.x , spawnPos.y, 'boss_sp', 'enemy_boss_anim', 10, 2000, 60, 0)); 
        this.nextEnemySpawn = 99999999;
        }
        else{
            console.log("Shroom has spawned!");
            this.nextEnemySpawn = this.game_time + this.enemySpawnDelay;
        }
    }


    if(this.fireButton.isDown)
    {
        this.player.throwSword(this.swordGroup);
    }


    // Update game objects

    this.player.updateMe(this.cursors);


    for(let enemy_spr of enemy_arr)
    {
        enemy_spr.updateMe(this.player);
    }


    for (let sword_spr of sword_arr)
    {
        sword_spr.updateMe();
    }


    this.updateGUI(this);


    // Game check if player chracter is alive
    if(this.player._isAlive == false)
    {
        soundManager.game_over_sfx.play();
        this.scene.start('deadS');
        this.scene.stop();
        
    }


    // Game check for level up
    if(this.player.xp >= this.player.xp_threshold)
    {
        this.player.level += 1;
        if(this.player.level %3 == 0) this.enemySpawnDelay -= 1500;
        this.player.resetXP();
        this.player.xp_threshold *= 1.75;
        this.scene.pause('gameS');
        this.scene.run('lvlupS');

    }

    // Reset game scene and important variables
    if(this.game_restarted == true)
    {
        this.game_time_delay = this.time.now;
        this.nextEnemySpawn  = this.time.now - this.game_time_delay;
        this.enemySpawnDelay = 5000;
        this.game_restarted = false;
        this.time_min = 0;
        this.time_sec = 0;
        this.player.level = 0;
    }
    
    }
    
    // ================================================================================================



    // ================================================================================================
    // Animation creation
    // ================================================================================================

    createAnimations(scene)
    {

    // ================================================================================================
    // PC Animations
    scene.anims.create({
        key: 'pc_idle_anim',
        frames: scene.anims.generateFrameNumbers('MVS_sps', {
        start: 12,
        end: 14
        }),
        frameRate: 2,
        repeat: -1
    });

    scene.anims.create({
        key: 'pc_move_up_anim',
        frames: scene.anims.generateFrameNumbers('MVS_sps', {
        start: 83,
        end: 87
        }),
        frameRate: 10,
        repeat: -1
    });

    scene.anims.create({
        key: 'pc_move_down_anim',
        frames: scene.anims.generateFrameNumbers('MVS_sps', {
        start: 12,
        end: 16
        }),
        frameRate: 10,
        repeat: -1
    });

    scene.anims.create({
        key: 'pc_move_right_anim',
        frames: scene.anims.generateFrameNumbers('MVS_sps', {
        start: 154,
        end: 158
        }),
        frameRate: 10,
        repeat: -1
    });

    scene.anims.create({
        key: 'pc_move_left_anim',
        frames: scene.anims.generateFrameNumbers('MVS_sps', {
        start: 225,
        end: 228
        }),
        frameRate: 10,
        repeat: -1
    });

    // ================================================================================================
    // Blue Slime Animations

    scene.anims.create({
        key: 'enemy_blue_slime_anim',
        frames: scene.anims.generateFrameNumbers('MVS_sps', {
        start: 753,
        end: 757
        }),
        frameRate: 5,
        repeat: -1
    });
    
    // =================================================================================================
    // Mummy Animations
    scene.anims.create({
        key: 'enemy_mummy_anim',
        frames: scene.anims.generateFrameNumbers('MVS_sps', {
        start: 622,
        end: 626
        }),
        frameRate: 10,
        repeat: -1
    });

    // =================================================================================================
    // Orc Animations
    scene.anims.create({
        key: 'enemy_orc_anim',
        frames: scene.anims.generateFrameNumbers('MVS_sps', {
            start: 48,
            end: 52
            }),
            frameRate: 5,
            repeat: -1
    });

    // =================================================================================================
    // Shroom Animations
    

    scene.anims.create({
        key: 'enemy_m_shroom_anim',
        frames: scene.anims.generateFrameNumbers('efc_sps', {
        start: 145,
        end: 151
        }),
        frameRate: 8,
        repeat: -1
    });

    // =================================================================================================
    // Big Shroom Animations
    scene.anims.create({
        key: 'enemy_l_shroom_anim',
        frames: scene.anims.generateFrameNumbers('efc_sps', {
        start: 161,
        end: 167
        }),
        frameRate: 8,
        repeat: -1
    });

    // =================================================================================================
    // Boss Animations
    scene.anims.create({
        key: 'enemy_boss_anim',
        frames: scene.anims.generateFrameNumbers('efc_boss', {
        start: 0,
        end: 5
        }),
        frameRate: 6,
        repeat: -1
    });


    }
    // ================================================================================================



    // ================================================================================================
    // GUI Update
    // ================================================================================================
    updateGUI(scene)
    {
        let health_string = "HP: " + Math.floor(this.player.health) + " / " + Math.floor(this.player.maxHelath);
        let xp_string = "XP: " + Math.floor(this.player.xp) + " / " + Math.floor(this.player.xp_threshold);

        this.health_text.setText(health_string);
        this.xp_text.setText(xp_string);
    
    }
    // ================================================================================================



    // ================================================================================================
    //  Sword Enemy Overlap
    // ================================================================================================
    swordOverlap(sword, enemy)
    {
        soundManager.enemy_hit_sfx.play();

        for (let sword_child of sword_arr)
        {
        if(sword_child == sword)
        {
            sword_child.destroy(true);
        }
        }

        

        for (let enemy_child of enemy_arr)
        {
        if(enemy_child == enemy)
        {
            enemy_child.getHit(sword.damage);
            if(enemy_child._health <= 0)
            {
                enemy_child.killMe(itemGroup);
            }

        }
        }
    }


    // ================================================================================================
    //  Player Enemy Overlap
    // ================================================================================================

    playerEnemyOverlap(player, enemy)
    {
    for (let enemy_child of enemy_arr)
    {

        if(enemy_child == enemy)
        {
        player.getHit(enemy._damage)
        enemy_child.getHit(0);

        }
    }
    }


    // ================================================================================================
    //  Player Item Overlap
    // ================================================================================================
    itemOverlap(player, item)
    {
        for (let item_child of item_arr)
        {
            if(item_child == item)
            {
                soundManager.xp_pickup_sfx.play();
                player.getXP(item_child.xp);
                item_child.destroy(true);
            }
        }
    }

    // ================================================================================================
    // Return X and Y position outside of camera view
    // ================================================================================================

    spawnOffScreen()
    {
    let onScreen = true;
    let xSpawnPos, ySpawnPos;
    let spawnPos;
    while(onScreen)
    {
        xSpawnPos = Math.floor(Math.random() * world.map.widthInPixels)
        ySpawnPos = Math.floor(Math.random() * world.map.heightInPixels)

        if(xSpawnPos > this.player.x + this.mainCamera.width / 2 || xSpawnPos < this.player.x - this.mainCamera.width / 2 )
        {
        onScreen = false;
        }
        else if(ySpawnPos < this.player.y - this.mainCamera.height / 2  || ySpawnPos > this.player.y + this.mainCamera.height / 2)
        {
        onScreen = false;
        }
    }

    spawnPos = {x: xSpawnPos, y: ySpawnPos};

    return spawnPos;
    
    
    }
    // ================================================================================================

    // ================================================================================================
    // Restart Game event function
    // ================================================================================================

    restartGame()
    {
        // Restart Game Scene
        this.scene.restart();// restart current scene
        this.game_restarted = true;

    
    }

    // ================================================================================================



    // ================================================================================================
    // Strength Upgrade Event
    // ================================================================================================
    strengthUpgrade()
    {
        this.player.damage *= 1.5;
        this.player.maxHelath *= 1.2;
    }


    // ================================================================================================



    // ================================================================================================
    // Agility Upgrade Event
    // ================================================================================================
    agilityUpgrade()
    {
        this.player.moveSpeed *= 1.2;
        this.player.throwDelay *= 0.9;
    }


    // ================================================================================================



    // ================================================================================================
    // Helath Upgrade Event
    // ================================================================================================
    healthUpgrade()
    {
        this.player.healMe(this.player.maxHelath);
    }


    // ================================================================================================
}

