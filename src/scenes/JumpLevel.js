// notes
// each template, update lines that start with "//////////"
// update as needed
//
// FIGURE OUT OVERLAP

class JumpLevel extends Phaser.Scene {
    constructor() {
        super("jumpLevelScene");
    }

    preload() {
        this.load.path = '/assets/'; //set loading path

        this.load.image('terrainImage', './Terrain/Terrain.png');
        this.load.image('greenImage', './Background/Green.png');
        this.load.image('coin', 'coin.png');

        this.load.image('updraft', 'updraft.png');

        this.load.tilemapTiledJSON('jumpLevelJSON', 'jumpLevel.json');
        this.load.atlas("yellow", "yellow.png", "yellow.json");
        this.load.image('quack', 'quack_prelim.png');

         // load background music
        this.load.audio('background_music', './audio/background.mp3');
    }

    create() {

        this.physics.world.gravity.y = 3000;

        //creating tilemap
        const map = this.add.tilemap('jumpLevelJSON');

////////// next level
        this.nextScene = 'glideLevelScene';     // necessary - where to next?

//////////adding tileset images     // update as needed
        const terrainTileSet = map.addTilesetImage('Terrain', 'terrainImage');
        const backgroundTileSet = map.addTilesetImage('Green', 'greenImage');

//////////creating layers           // update as needed
        const bgLayer = map.createLayer('Background', backgroundTileSet, 0, 0);
        const terrainLayer = map.createLayer('Platform', terrainTileSet, 0, 0);

        //enable collision
        terrainLayer.setCollisionByProperty({collides: true});
        // terrainLayer.collide = true;

        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // terrainLayer.renderDebug(debugGraphics, {
        //     tileColor: null,    // color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),    // color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)                // color of colliding face edges
        // });


        //spawn location = where player starts
        const blobSpawn = map.findObject('Objects', obj => obj.name === 'Blob');

        //adding player
        this.p1 = new Player(this, blobSpawn.x, blobSpawn.y, "yellow", "yellow1").setScale(0.35); 
        
        //creating slime animation
        this.anims.create({
            key: 'walk',
            frameRate: 15,
            frames: this.anims.generateFrameNames("yellow", { 
                prefix: "yellow",
                start: 1, 
                end: 6 }),
            repeat: -1
        });

        //play animation
        this.p1.play('walk');

        //setting collision
        // this.p1.body.setCollideWorldBounds(true); //so player can't exit screen/bounds

        this.coins = map.createFromObjects("Objects", {
            name: "coin",
            key: "coin",
            // frame: 214
        });

        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);

        this.coinGroup = this.add.group(this.coins);

        this.physics.add.overlap(this.p1, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
        });

        // background music configurations
        let levelMusicConfig = {
            mute: false,
            volume: 2.5,
            rate: 1,
            loop: true,
            delay: 0,
        }

        // create sound instance
        this.gameMusic = this.sound.add('background_music', levelMusicConfig);
        this.gameMusic.play(levelMusicConfig); // play music with config settings

        //cameras
        this.cameras.main.setBounds(0, 0, map.widthInPixels, 600);

        //parameters player, round pixels, lerp -> how slow or fast camera follows
        this.cameras.main.startFollow(this.p1, true, 0.25, 0.25); //makes camera follow player

        //set physics world gravity
        this.physics.world.gravity.y = 2000;

        //change physics world bounds
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels);   // important not to fill last one
        this.lowerBound = map.heightInPixels + this.p1.height * 5;  // VERY important - player will use for death

//////////physics collision     // update
        this.physics.add.collider(this.p1, terrainLayer);

        //user input
        // cursors = this.input.keyboard.createCursorKeys();

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F); 
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        //controls text configuration
        let controlConfig = {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#000000',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            }
        }

        //creating control instructions
        this.add.text(10, 10, "⬆️ to jump", controlConfig);
        this.add.text(10, 40, "⬅️ ➡️ to move", controlConfig);
        // this.add.text(10, 70, "Press ⬆️ and ⬅️ / ➡️ to glide", controlConfig);

        this.mapWidth = map.widthInPixels;

        // clock
        this.clock = new Phaser.Time.Clock(this);

        // init player score
        this.p1Score = 0;





        // create a random amount of coins
        // let num_coins = Phaser.Math.Between(1, 50);

        // let line = this.add.line(200, 150,100,100,500,100,0xff0000);

        // // create coins group
        // this.coin_one = this.physics.add.sprite(line.x, line.y + 100, 'coin'); // create coin
        // this.coin_one.body.immovable = true; // don't move coin
        // this.coin_one.body.allowGravity = false; // don't fall coin

        // this.coin_two = this.physics.add.sprite(line.x + 150, line.y + 100, 'coin'); // create coin
        // this.coin_two.body.immovable = true; // don't move coin
        // this.coin_two.body.allowGravity = false; // don't fall coin
        
        // this.coin_three = this.physics.add.sprite(line.x + 300, line.y + 100, 'coin'); // create coin
        // this.coin_three.body.immovable = true; // don't move coin
        // this.coin_three.body.allowGravity = false; // don't fall coin
        
        // // Phaser.Actions.PlaceOnLine(this.coins, line);
        // line.alpha = 0; // hide coin line

        // this.p1.body.onOverlap = true;
        // this.physics.add.overlap(this.p1, this.coin_one); // collision between coin and player
        // this.physics.add.overlap(this.p1, this.coin_two); // collision between coin and player
        // this.physics.add.overlap(this.p1, this.coin_three); // collision between coin and player


        // this.physics.world.on('overlap', (player, coin_one) => {
        //     coin_one.destroy();
        //     this.p1Score += 1;
        // });

        // this.physics.world.on('overlap', (player, coin_two) => {
        //     coin_two.destroy();
        //     this.p1Score += 1;
        // });
        // fernie's things
        /*this.updraft = new Updraft(this, this.p1.x + 800, this.p1.y - 200, 'updraft');
        this.updraft.scale = 4.0
        this.physics.add.overlap(this.p1, this.updraft);
        this.physics.world.on('overlap', (gameObject1, gameObject2, body1, body2) =>
        {
            console.log("overlapped");

            if (gameObject1.gliding) {
                gameObject1.y -= 15;
            }

        })*/

        
        // this.physics.world.on('overlap', (player, coin_three) => {
        //     coin_three.destroy();
        //     this.p1Score += 1;
        // });


    }

        

    update() {
        
        this.p1.update();
        //console.log("from JumpLevel: from update(): time elapsed:", this.time.now);

        // check if player hits coin
        /*this.hitCoinDown = this.p1.body.touching.down;
        this.hitCoinUp = this.p1.body.touching.up;
        this.hitCoinLeft = this.p1.body.touching.left;
        this.hitCoinRight = this.p1.body.touching.right;

        // // player collided with a coin
        // if (this.hitCoinDown || this.hitCoinUp || this.hitCoinLeft || this.hitCoinRight) {
        //     this.p1Score += 1;
        //     console.log("coin is destroyed");
        //     // TODO: remove coin when destroyed

        }*/
    
    }

}