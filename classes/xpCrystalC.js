class XPCrystal extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, xp)
    {
        super(scene, x, y, texture);
        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.xp = xp;
        this.setDepth(1);

    }
}