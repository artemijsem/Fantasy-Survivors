var current_faceDir;

class Player extends Phaser.Physics.Arcade.Sprite {

    

    constructor(scene,x,y,texture) {

        super(scene, GAMEWIDTH / 2, GAMEHEIGHT / 2,texture);

        scene.physics.add.existing(this);
        scene.add.existing(this);
        
        // Private variables
        this._isMoving = false;
        this._animStarted = false;
        this._faceDirection = "down";
        this._nextSwordTime = 0;
        this._isAlive = true;
        this._enableHealthUpdate = true;
        this._lastHealthUpdate = 0;
        this._health = 100;
        this._xp = 0;

        // Global variables
        this.level = 1;
        this.damage = 10;
        this.moveSpeed = 100;
        this.throwDelay = 600;
        this.maxHelath = 100;
        this.xp_threshold = 25;

        this.createMe();

    };

    createMe()
    {
        this.setActive(true);
        this.setVisible(true);
        this.anims.load('pc_idle_anim');
        this.anims.play('pc_idle_anim');
        this.anims.load('pc_move_up_anim');
        this.anims.load('pc_move_down_anim');
        this.anims.load('pc_move_left_anim');
        this.anims.load('pc_move_right_anim');
        this.setCollideWorldBounds(true);
        this.setDrag(10 * this.moveSpeed);
        this.body.setSize(this.texture.width / 2, this.texture.height / 2);
        this.scale = 2.5;
    }

    throwSword(swordGroup)
    {
        if(this.scene.time.now > this._nextSwordTime)
        {
            swordGroup.add(new Sword(this.scene, this.x, this.y, 'sword_png', this._faceDirection,
             this.damage), true);
            soundManager.dagger_sfx.play();
            this._nextSwordTime = this.scene.time.now + this.throwDelay;
        }
    }

    getHit(damage)
    {
        if(this.scene.time.now > this._lastHealthUpdate)
        {
            this._enableHealthUpdates();
            this._lastHealthUpdate = this.scene.time.now + 1000;
        }
        if(this._enableHealthUpdate == true)
        {
            soundManager.player_hit_sfx.play();
            this._enableHealthUpdate = false;
            this._health = this._health - damage;
        }
    }

    _enableHealthUpdates()
    {
        this._enableHealthUpdate = true;
    }

    healMe(health)
    {
        this._health += health;
    }

    get health()
    {
        return this._health;
    }

    getXP(xp)
    {
        this._xp = this._xp + xp;
    }

    resetXP()
    {
        this._xp = 0;
    }


    get xp()
    {
        return this._xp;
    }

    updateMe(cursors)
    {
        if(this._isAlive == true)
        {
            if (cursors.left.isDown)
            {
                this.setVelocityX(-this.moveSpeed);
                this._isMoving = true;
                this._faceDirection = "left";
            }
            if (cursors.up.isDown)
            {
                this._isMoving = true;
                this.setVelocityY(-this.moveSpeed);
                this._faceDirection = "up";
            }
            if (cursors.right.isDown)
            {
                this.setVelocityX(this.moveSpeed);
                this._isMoving = true;
                this._faceDirection = "right";
            }
            if (cursors.down.isDown)
            {
                this.setVelocityY(this.moveSpeed);
                this._isMoving = true;
                this._faceDirection = "down";
            }
            // Check if any arrow key is Up to
            if(cursors.left.isUp && cursors.up.isUp && cursors.right.isUp && cursors.down.isUp)
            {
                this._isMoving = false;
                this.anims.stop();
            }
            // If PC have changed the moving direction then play matching animation

            if(this._isMoving == true)
            {
                if(current_faceDir !== this._faceDirection)
                {
                    current_faceDir = this._faceDirection;
                    switch(this._faceDirection)
                    {
                        case "up":
                            this.anims.play('pc_move_up_anim');
                            break;

                        case "left":
                            this.anims.play('pc_move_left_anim');
                            break;
                        case "right":
                            this.anims.play('pc_move_right_anim');
                            break;
                        case "down":
                            this.anims.play('pc_move_down_anim');
                            break;
                    }
                }
            }
        }
        if(this.health > this.maxHelath)
        {
            this._health = this.maxHelath;
        }
        if(this.health <= 0)
        {
            this._isAlive = false;
        }

    }
}