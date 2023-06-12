// Notes and Questions /////////
//
// Fern update:
//  - instant of player object
//  - updated glide tutorial
//  - now forces player to use glide
//  - death by falling now possible
//  - updated level (expanded tutorial)
//
////////////////////////////////

class GlideLevel extends Phaser.Scene {
    constructor() {
        super("glideLevelScene");
    }

    preload() {
        this.load.path = '/assets/'; //set loading path

        this.load.image('terrainImage', './Terrain/Terrain.png');
        this.load.image('pinkImage', './Background/Pink.png');

        this.load.tilemapTiledJSON('glideLevelJSON', 'glideLevel.json');
        this.load.atlas("yellow", "yellow.png", "yellow.json");
        this.load.image('quack', 'quack_prelim.png');

        this.load.audio('squeak', './assets/audio/squeaky.mp3');
        this.load.audio('collect', './assets/audio/collectcoin.mp3');
    }

    create() {
        this.physics.world.gravity.y = 3000;

        //creating tilemap
        const map = this.add.tilemap('glideLevelJSON');

        //adding tileset images
        const terrainTileSet = map.addTilesetImage('Terrain', 'terrainImage');
        const backgroundTileSet = map.addTilesetImage('Pink', 'pinkImage');

        //creating layers
        const bgLayer = map.createLayer('Background', backgroundTileSet, 0, 0);
        const terrainLayer = map.createLayer('Terrain', terrainTileSet, 0, 0);

        //enable collision
        terrainLayer.setCollisionByProperty({collides: true});
        // terrainLayer.collide = true;

        //spawn location = where player starts
        const blobSpawn = map.findObject('Spawn', obj => obj.name === 'Blob');

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

        this.currScore = score;

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
            this.currScore += 1;
            this.sound.play('collect');
            obj2.destroy(); // remove coin on overlap
        });

//cameras
        this.cameras.main.setBounds(0, 0, map.widthInPixels, 600);

        //parameters player, round pixels, lerp -> how slow or fast camera follows
        this.cameras.main.startFollow(this.p1, true, 0.25, 0.25); //makes camera follow player

        //set physics world gravity
        this.physics.world.gravity.y = 2000;

        //change physics world bounds
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels);   // important not to fill last one
        this.lowerBound = map.heightInPixels + this.p1.height * 5;  // VERY important - player will use for death

        //physics collision
        this.physics.add.collider(this.p1, terrainLayer);

        //user input
        // this.cursors = this.input.keyboard.createCursorKeys();

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
        this.add.text(10, 10, "Press ⬆️ or (W) while moving to glide", controlConfig);

        this.mapWidth = map.widthInPixels;

        this.nextScene = 'enemyLevelScene';
    }

    update() {
        
        // this.timer.text = Math.floor(this.clock.getRemainingSeconds());
        

        // update player
        this.p1.update();

        if(this.p1.restart){
            this.scene.restart();
            this.currScore = 0;
        }

        if(this.p1.nextScene){
            score = this.currScore;
            this.scene.start(this.nextScene);
        }

        if(this.p1.isJumping){
            this.sound.play('squeak');
        }
    
    }

}