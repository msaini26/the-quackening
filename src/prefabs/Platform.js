class Platform extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.activated = true;

        scene.add.existing(this);
    }

    collision(rocket) {     // standard collision behavior - leave empty if stays static

        console.log("from Platform.js: from collision(): colliding");
        
        if (((rocket.x - rocket.width/2) < (this.x - this.width/2)) || ((rocket.x + rocket.width/2) < (this.x + this.width/2))) {

            rocket.peaked = true;
            rocket.jump()

        } else {
            rocket.platformReset();
            rocket.currPlat = this;
        }
        
    }
}