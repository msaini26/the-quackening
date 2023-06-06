// Player prefab

//// UPDATES /////////
//
// quack now possible!
//  - quack behavior not yet integrated
//
//////////////////////

//// NOTES ///////////
//
//  GOALS:
//  - decide feel of PHYSICS
//      - what are the affordances of feel?
//      - drawbacks? benefits?
//      - how do they impact greater level design?
//          - macro-goal: feel of GAME
//
//
//  what sort of jump do we want to go for?
//  - floaty, "dream-like"
//  - precise, reactive
//  - other
//
//  as example: precise and reactive means
//  - quick acceleration, quick deceleration
//  - most control
//  - a tight "grace period" (when coming off platform)
//  - celeste, 3D mario, hollow knight
//
//  floaty would mean
//  - slower accelerations
//  - less control
//  - more over-the-top
//  - ori, 2D mario
//
//
//////////////////////

class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, frame) {

        // console.log("from Player.js: constructing...");

        super(scene, x, y, texture, frame);     // inherit or somethin'
        this.parentScene = scene;               // save scene for later

        // activate physics

            this.parentScene.add.existing(this);            // first add to scene
            this.parentScene.physics.add.existing(this);    // then add to PHYSICS scene

            this.body.onOverlap = true;

        // save quack
            // this.quackRadius = quackRadius;

        // physics variables

            this.ACCELERATION = 800;            // rate of change
            this.MAX_X_VEL = 500;              // as fast as it can go on x axis
            this.MAX_Y_VEL = 2000;              // as fast on y axis
            this.GROUND_DRAG = 3000;            // slow-down rate
            this.AIR_DRAG = 500;               // slow-down rate
            this.JUMP_VELOCITY = -1000;         // jump power!
            this.GLIDE_VELOCITY = 150;

            this.activated = false;         // ignore - for own testing

        // set up physics sprite

            this.body.setBounce(0.5);                                       // mutable - just a bit of character - slight reaction to landing
            this.body.setSize(this.width/1.1);                                // physics size
            this.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);       // sets limits to speed
            this.body.setCollideWorldBounds(true);                          // can't exit world


        // checks

            this.glidable = false;      // simple boolean for whether or not glide available
            this.grounded = false;
            this.gliding = false;

            /*this.quackCooldown = 3000;
            this.quackTime = 1000;
            this.quackAvailable = true;

            this.timeNow = this.parentScene.time.now;
            this.timeSince = this.parentScene.time.now;*/
        
        // final check
            // console.log("from Player.js: constructed!");

    }

    update() {      // update method

        // falling death
        
        if (this.y >= this.parentScene.lowerBound) {    // checks lower bound
            
            this.parentScene.scene.restart();           // restarts if hit

        }


        /*// quack

            // quack pos
        this.quackRadius.x = this.x
        this.quackRadius.y = this.y

            // quack key

        this.timeNow = this.parentScene.time.now;

        if (this.quackAvailable && (Phaser.Input.Keyboard.JustDown(keySPACE))) {

            this.quackRadius.alpha = 1;
            this.quackAvailable = false;

            this.timeSince = this.parentScene.time.now;

            console.log("from Player.js: from update(): time quacked:", this.timeSince);

        }

        if ((this.timeNow - this.timeSince) >= this.quackTime && !this.quackAvailable) {
            this.quackRadius.alpha = 0;
            console.log("from Player.js: from update(): quack gone u_u", this.timeSince);
        }

        if ((this.timeNow - this.timeSince) >= this.quackCooldown && !this.quackAvailable) {
            this.quackAvailable = true;
            console.log("from Player.js: from update(): quack available!", this.timeSince);
        } */
        
        // transition to next scene

        if (this.x >= this.parentScene.mapWidth - 30){
            this.parentScene.scene.start(this.parentScene.nextScene);
        }


        // checks

        if (this.body.blocked.down) {   // if on ground..

            this.glidable = false;      // gliding not possible
            this.grounded = true;       // grounded

            this.body.setDragX(this.GROUND_DRAG);   // more immediate deceleration

        } else {                        // otherwise..

            this.grounded = false;      // NOT on ground

            this.body.setDragX(this.AIR_DRAG);  // less control on ground

        }

        // movement

        if (keyLEFT.isDown) {           // moving left

            this.body.setAccelerationX(-this.ACCELERATION);
            this.setFlip(true, false);


        } else if (keyRIGHT.isDown) {   // moving right

            this.body.setAccelerationX(this.ACCELERATION);
            this.resetFlip();

        } else {                        // idle

            this.body.setAccelerationX(0);      // cut acceleration
            
            if (this.grounded) {
                this.body.setDragX(this.GROUND_DRAG);      // but don't cut immediately
            } else {
                this.body.setDragX(this.AIR_DRAG);
            }

        }

        if (this.body.blocked.down && (Phaser.Input.Keyboard.JustDown(keyUP) || Phaser.Input.Keyboard.JustDown(keyF))) {   // if grounded and jump key pressed...

            // console.log("from Player.js: from update(): jumping!");

            this.grounded = false;
            this.body.setVelocityY(this.JUMP_VELOCITY);

        }

        if (this.body.velocity.y >= 0 && !this.grounded) {            // 0 velocity reached when arching

            // console.log("from Player.js: from update(): peaked");

            this.glidable = true;                  // glide enabled
        
        }

        if ((keyUP.isDown || keyF.isDown) && this.glidable) {        // if jump held while glidable...

            // console.log("from Player.js: from update(): should be gliding...");

            this.gliding = true;

            this.body.setVelocityY(this.GLIDE_VELOCITY);    // ..constant descent
            this.body.setDragX(this.AIR_DRAG);
        
        } else {

            this.gliding = false;

        }

    }

    someFunction() {

        console.log("from Player.js: from someFunction(): some event just ended");

    }

}