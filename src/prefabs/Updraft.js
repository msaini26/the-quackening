class Updraft extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, speed = 7, frame) {

        super(scene, x, y, texture, frame);
        this.parentScene = scene;

        // physics activate

        this.parentScene.add.existing(this);            // first add to scene
        this.parentScene.physics.add.existing(this);    // then add to PHYSICS scene

        // physics configurations

        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.body.onOverlap = true;

        this.speed = speed;

    }

    update() {}

}