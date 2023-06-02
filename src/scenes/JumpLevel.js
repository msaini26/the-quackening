// notes
// each template, update lines that start with "//////////"
// update as needed

class JumpLevel extends Phaser.Scene {
    constructor() {
        super("jumpLevelScene");
    }

    preload() {
        this.load.path = '/assets/'; //set loading path

        this.load.image('terrainImage', './Terrain/Terrain.png');
        this.load.image('greenImage', './Background/Green.png');
        this.load.image('coin', 'coin.png');

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

        //spawn location = where player starts
        const blobSpawn = map.findObject('Spawn', obj => obj.name === 'Blob');

        //adding player
        this.quackRadius = this.add.image(blobSpawn.x, blobSpawn.y, 'quack')
        this.p1 = new Player(this, blobSpawn.x, blobSpawn.y, "yellow", "yellow1", this.quackRadius).setScale(0.35); 
        
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
        this.p1.body.setCollideWorldBounds(true); //so player can't exit screen/bounds

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
        // this.cursors = this.input.keyboard.createCursorKeys();

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F); 
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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

        this.coins = this.add.group();

        // create a random amount of coins
        let num_coins = Phaser.Math.Between(1, 50);

        let line = this.add.line(200, 150,100,100,500,100,0xff0000);

        // create coins group
        this.coin_one = this.physics.add.sprite(line.x, line.y + 100, 'coin'); // create coin
        this.coin_one.body.immovable = true; // don't move coin
        this.coin_one.body.allowGravity = false; // don't fall coin
        this.coins.add(this.coin_one);

        this.coin_two = this.physics.add.sprite(line.x + 100, line.y + 100, 'coin'); // create coin
        this.coin_two.body.immovable = true; // don't move coin
        this.coin_two.body.allowGravity = false; // don't fall coin
        this.coins.add(this.coin_two);
        
        this.coin_three = this.physics.add.sprite(line.x + 200, line.y + 100, 'coin'); // create coin
        this.coin_three.body.immovable = true; // don't move coin
        this.coin_three.body.allowGravity = false; // don't fall coin
        this.coins.add(this.coin_three);
        
        Phaser.Actions.PlaceOnLine(this.coins, line);
        line.alpha = 0; // hide coin line

        // collider when player hits coin
        this.physics.add.collider(this.p1, this.coins);

        

        // init player score
        this.p1Score = 0;

    }

    update() {
        
        this.p1.update();
        //console.log("from JumpLevel: from update(): time elapsed:", this.time.now);

        // check if player hits coin
        this.hitCoinDown = this.p1.body.touching.down;
        this.hitCoinUp = this.p1.body.touching.up;
        this.hitCoinLeft = this.p1.body.touching.left;
        this.hitCoinRight = this.p1.body.touching.right;

        // player collided with a coin
        if (this.hitCoinDown || this.hitCoinUp || this.hitCoinLeft || this.hitCoinRight) {
            this.p1Score += 1;
            console.log("coin is destroyed");
            // TODO: remove coin when destroyed

        }
    
    }

}