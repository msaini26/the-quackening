// Notes and Questions /////////
//
// Changes from fern:
//  - player behavior and physics in Player.js
//  - player construction in Play.js
//
// Questions:
//  - why only bottom collision?
//  - what is our aim for overall GREATER feel of level design?
//      - this ties directly into feel of player
//
////////////////////////////////

class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    // preload assets
    preload() {
        this.load.atlas("yellow", "./assets/yellow.png", "./assets/yellow.json");
        this.load.image("brick", "./assets/greenBrick.png");
        
        // load background music
        this.load.audio('background_music', './assets/audio/background.mp3');
    }

    // create objects and instances in phaser canvas
    create() {
        //setting variables to track speed of platforms and jump/walk speed
        this.ACCELERATION = 600;
        this.DRAG = 700; 
        this.JUMP_VELOCITY = -700;
        this.MAX_JUMPS = 3;
        // this.SCROLL_SPEED = 4;
        this.physics.world.gravity.y = 3000;
        this.platformSpeed = -200;
        this.platformSpeedMax = -700;

        // ground tiles
        this.ground = this.add.group();
        for(let i = 0; i < game.config.width; i += 193) {
            let groundTile = this.physics.add.sprite(i, game.config.height - 23, 'brick').setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        // setting up player
        this.player = new Player(this, 75, game.config.height/2 - 30, "yellow", "yellow1").setScale(0.5);   // new player class
        //setting it so only the bottom of player checks for collision
        // // why only bottom?
        this.player.body.checkCollision.up = false; 
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;

        this.physics.add.collider(this.player, this.ground);

        // background music configurations
        let musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            loop: true,
            delay: 0,
        }

        // create sound instance
        var music = this.sound.add('background_music', musicConfig);
        music.play(musicConfig); // play music with config settings



        //creating walking animation (when player moves left and right)
        this.walk = this.anims.create({
            key: 'walk',
            frameRate: 15,
            frames: this.anims.generateFrameNames("yellow", { 
                prefix: "yellow",
                start: 1, 
                end: 6 }),
            repeat: -1
        });

        //creating idle animation (when the player isn't moving)
        this.idle = this.anims.create({
            key: 'idle',
            defaultTextureKey: "yellow",
            frames: [
                { frame: "yellow1" }
            ],
            repeat: -1
        });

        // keyboard controls
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F); 
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        }

    // updates every frame
    update() {
        
        this.player.update();
        
    }
}