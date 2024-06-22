class Enemy extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x,y, texture, animation_str, moveSpeed, health, damage, xp)
    {
        super(scene,x,y,texture);
        scene.physics.add.existing(this);
        scene.add.existing(this);

        this._animation_str = animation_str;
        this._health = health;
        this._damage = damage;
        this._xp = xp;
        this._moveSpeed = moveSpeed;
        this._knockBack = false;
        this._hit_time = 0;

        this.initMe();
    }

    initMe()
    {
        this.setActive(true).setVisible(true);
        this.anims.load(this._animation_str);
        this.anims.play(this._animation_str);

        this.setCollideWorldBounds(true);
        this.setDrag(10 * this._moveSpeed);
        this.setDepth(2);
        this.setSize(10, 10, true);
        // If enemy is boss then resize the box collider and move animation to it
        if(this._animation_str == 'enemy_boss_anim')
        {
            this.setSize(30, 30, true);
            this.anims.y = this.anims.y - 100;
        } 
        this.scale = 2.5;
    }

    getHit(damage)
    {
        this._health -= damage;
        this._knockBack = true;
        this._hit_time = this.scene.time.now;
    }


    updateMe(target)
    {
        // Chase algorithm presented by David Dorrington in CI516 Artificial Intelligence for Games labs
        let dX = target.x - this.x;
        let dY = target.y - this.y;
        let angle = Math.atan2(dY, dX);

        this._velX = Math.round(1.4 * Math.cos(angle)) * this._moveSpeed;
        this._velY = Math.round(1.4 * Math.sin(angle)) * this._moveSpeed;

        // Upon receiving damage make the enemy move back for a bit
        if(this._knockBack == true)
        {
            if(this.scene.time.now < this._hit_time + 100)
            {
                this.setVelocity(-this._velX * 3, -this._velY * 3);
            }
            else{
                this._knockBack = false;
            }
        }
        else{
            this.setVelocity(this._velX, this._velY);
        }
    }


    killMe(itemGroup)
    {
        // If enemy is the Boss and its killed switch to Win scene
        if(this._animation_str == 'enemy_boss_anim')
        {
            this.scene.scene.start('winS');
            this.scene.scene.stop();
        }
        else{
            // Drop an XP crystal upon enemy dying
            let crystal_img_arr = ['xp_c_red', 'xp_c_blue', 'xp_c_green'];
            let random_c_img = crystal_img_arr[Math.floor(Math.random() * 3)];
            itemGroup.add(new XPCrystal(this.scene, this.x, this.y, random_c_img, this._xp), true);
            this.destroy(true);
        }

    }
}