class Sword extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, direction,damage)
    {
        super(scene, x, y, texture);
        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.setCollideWorldBounds(true);
        this._speed = 500;
        this._direction = direction;
        this._lifespan = 1000 + this.scene.time.now;
        this.scale = 1.5;
        this.damage = damage;
    }

    updateMe()
    {
        switch(this._direction)
        {
            case "up":
                this.setVelocityY(-this._speed);
                break;
            case "down":
                this.setVelocityY(this._speed);
                this.flipY = true;
                break;
            case "left":
                this.setVelocityX(-this._speed);
                this.rotation = -Math.PI / 2
                break;
            case "right":
                this.setVelocityX(this._speed);
                this.rotation = Math.PI / 2;
                break;
        }

        if(this.scene.time.now > this._lifespan)
        {
            this.destroy(true);
        }
    }
}