// Rocket prefab

//// NOTES ///////////

//////////////////////

class Rocket extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, player01 = true, player02 = false, frame) {

        super(scene, x, y, texture, frame);

        console.log("from Rocket.js: from constructor(): starting up...");

        this.sfxRocket = scene.sound.add('sfx_rocket');

        // add object to existing scene
        scene.add.existing(this);       // add to existing
        this.moveSpeed = 5;             // pixels to move per frame
        this.airSpeed = 10;

        // jump
        this.jumpPower = 20;
        this.smallJumpPower = 15;
        this.smallJumpDef = 15;
        this.yVel = this.jumpPower;

            // going up
        this.yDrag = 1.0;
        this.defDrag = 1.0;
        this.yAcc = 0.99;
        this.defAcc = 0.99;     // default

            // going down
        this.yBoost = 1.0;
        this.defBoost = 1.0;
        this.yDec = 0.99;
        this.defDec = 0.99;     // dafault

            // bouncing
        this.bounceAcc = 0.95;
        this.bounceDec = 0.95;
        this.timeMultiplier = 0.0;
        this.timeMultiplierDef = 0.0;
        this.pointMultiplier = 1;
        this.pointMultiplierDef = 1;


            // states
        this.peaked = false;    // start deceleration
        this.grounded = true;   // fell back down; reset
        this.jumping = false;   // is in process of jumping
        this.bouncing = false;  // is BOUNCING from collidee to collidee
        this.bonked = false;    // hit underside of collidee
        this.dropping = false;  // player executed ground-pound

        this.onPlatform = false;
        
        // this.mouseActivated = false;
        this.downAvailable = false;

        this.score = 0;

        // misc
        this.spawning = false;
        this.active = true;
        this.currPlat = null;

    }

    update() {      // update method

        this.checkPlat();

        if (this.jumping && !game.input.activePointer.isDown) { this.downAvailable = true; }

        // left/right movement
        if (keyLEFT.isDown && this.x >= borderUISize + this.width) {

            this.flipX = true;

            if (this.jumping){
                this.x -= this.airSpeed;    // floaty movement in the air
            } else {
                this.x -= this.moveSpeed;
            }

        } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) { //(game.input.mousePointer.x > this.x + 5 && this.mouseActivated)

            this.flipX = false;

            if (this.jumping){
                this.x += this.airSpeed;    // floaty movement in the air
            } else {
                this.x += this.moveSpeed;
            }

        }


        // jump button
        if ((Phaser.Input.Keyboard.JustDown(keySPACE)) && this.grounded) { // keyF.isDown for constant, Phaser.Input.Keyboard.JustDown(keyF) for once
            
            this.grounded = false;
            this.jumping = true;
            this.sfxRocket.play();
            
        }

        if ((Phaser.Input.Keyboard.JustDown(keyDOWN) && !this.grounded)) { // keyDOWN.isDown for constant, Phaser.Input.Keyboard.JustDown(keyDOWN) for once
            
            this.dropping = true;
            this.jumping = false;
            this.bouncing = false;
            
        }
        
        // in the air, two states: jumping or ground-pounding (dropping)
        if (this.jumping) {
            this.jump();
        }

        if (this.dropping) {
            this.drop();
        }

    }

    // reset rocket to "ground"
    groundReset() {

        this.y = game.config.height - borderUISize*2 - borderPadding*2 - 75;     // back to ground
        this.jumping = false;                                           // jumping has stopped
        this.grounded = true;                                           // back on the ground
        this.dropping = false;                                          // can't drop further down
        this.peaked = false;
        this.bouncing = false;

        this.yAcc = this.defAcc;
        this.yDec = this.defDec;
        this.yVel = this.jumpPower;
        this.yDrag = this.defDrag;
        this.yBoost = this.defBoost;
        this.smallJumpPower = this.smallJumpDef;
        this.bonked = false;
        this.timeMultiplier = this.timeMultiplierDef;
        this.pointMultiplier = this.pointMultiplierDef;
        this.downAvailable = false;

        this.spawning = false;

    }

    platformReset() {

        this.jumping = false;                                           // jumping has stopped
        this.grounded = true;                                           // back on the ground
        this.dropping = false;                                          // can't drop further down
        this.peaked = false;
        this.bouncing = false;

        this.yAcc = this.defAcc;
        this.yDec = this.defDec;
        this.yVel = this.jumpPower;
        this.yDrag = this.defDrag;
        this.yBoost = this.defBoost;
        this.smallJumpPower = this.smallJumpDef;
        this.bonked = false;
        this.timeMultiplier = this.timeMultiplierDef;
        this.pointMultiplier = this.pointMultiplierDef;
        this.downAvailable = false;

        this.spawning = false;

    }

    bouncingReset() {

        // part that enables another jump
        this.peaked = false;

        this.yVel = this.smallJumpPower;    // each bounce goes a bit higher
        if (this.smallJumpPower < 18) {     // 20 smallJumpPower is the cap
            this.smallJumpPower += 2;
        }
        if (this.timeMultiplier < 0.50) {
            this.timeMultiplier += 0.25;
        }
        if (this.pointMultiplier < 5) {
            this.pointMultiplier += 1;
        }

        // reset deceleration on way up
        this.yDrag = this.defDrag;
        this.yDec = this.bounceDec;

        // reset acceleration on way down
        this.yBoost = this.defBoost;
        this.yAcc = this.bounceAcc;
        
        // possible to hit another underside now
        this.bonked = false;

    }

    jump() {

        if (this.yVel <= 0) { this.peaked = true; }     // if velocity is at its minimum, jump has hit peak
        
        if (this.peaked) {              // start going down

            this.y += this.yVel;
            this.yVel += this.yBoost;
            this.yBoost *= this.yAcc;

        } else {                        // still going up

            this.y -= this.yVel;
            this.yVel -= this.yDrag;
            this.yDrag *= this.yDec;

        }

        if (this.y >= game.config.height - borderUISize*2 - borderPadding*2 - 75 || this.onPlatform){   // ground hit

            this.groundReset();

        }

    }

    smallJump() {

        this.bouncingReset();
        this.jump();

    }

    bonk() {

        this.peaked = true;     // starts descent
        this.yBoost = 4;        // starts it fast
        this.jump();            // when jump is entered with peaked = true, will go down

    }

    drop() {

        this.peaked = true;     // same story as bonk
        this.yBoost = 6;
        this.jump();

    }

    spawn(up = true){

        this.grounded = false;

        if (up) {

            this.grounded = false;
            this.jumping = true;
            this.sfxRocket.play();

            this.jump();

        this.spawning = true;

        } else {
            this.grounded = false;
            this.jumping = true;
            this.bonk();
        }

    }

    checkCollision(collidee) {

        if (this.active) {

          // simple AABB checking
        if (this.x < collidee.x + collidee.width && 
            this.x + this.width > collidee.x && 
            this.y < collidee.y + collidee.height &&
            this.height + this.y > collidee.y) {  
              if (this.y > collidee.y && !this.peaked){   // if hit collidee's underside
                  this.bonked = true;
              } else {
                  this.bonked = false;
              }
              
              return true && collidee.activated;        // returns true both if objects touching and collisions activated
  
            } else {
              return false;
            }
        
        }
    
    }

    collisionWrapper(collidee){

        if (this.checkCollision(collidee)) {        // if collision actually happened

            if (this.bonked) {
                this.bonk();
            }
  
            collidee.collision(this);
  
        }
  
    }

    checkPlat() {
        
        if (this.currPlat != null) {
        
            if (!this.checkCollision(this.currPlat)) {

                this.grounded = false;
                this.jumping = true;
                this.peaked = true;
                this.currPlat = null;
                console.log("leaving platform...")

            }
        
        }
 
    }

}