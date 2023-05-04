class Platform extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.activated = true;

        scene.add.existing(this);
    }

    collision(rocket) {     // standard collision behavior - leave empty if stays static

        
        if (rocket.currPlat == null && !rocket.bonked) {
            console.log("from Platform.js: from collision(): colliding");
            rocket.platformReset();
            rocket.currPlat = this;
        };
        
    }
}