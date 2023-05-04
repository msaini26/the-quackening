class Platform extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height);
        this.activated = true;
    }

    collision(rocket) {     // standard collision behavior - leave empty if stays static
    
    }
}