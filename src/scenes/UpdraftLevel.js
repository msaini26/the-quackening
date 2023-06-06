class UpdraftLevel extends Phaser.Scene {
    constructor() {
        super("updraftLevelScene");
    }

    preload() {
        this.load.path = '/assets/'; //set loading path

        this.load.image('terrainImage', './Terrain/Terrain.png');
        this.load.image('pinkImage', './Background/Pink.png');

        this.load.image('updraft', 'updraft.png');

        this.load.tilemapTiledJSON('updraftJSON', 'updraftLevel.json');
        this.load.atlas("yellow", "yellow.png", "yellow.json");
    }

    create() {
        this.physics.world.gravity.y = 3000;

        //creating tilemap
        const map = this.add.tilemap('updraftJSON');

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
        const updraftSpawn = map.findObject('ObstacleSpawn', obj => obj.name === 'Updraft');

        //adding player
        this.p1 = new Player(this, blobSpawn.x, blobSpawn.y, "yellow", "yellow1").setScale(0.35); 

        // updraft

        this.updraft = new Updraft(this, updraftSpawn.x, updraftSpawn.y, 'updraft');
        this.updraft.scale = 4.0
        this.updraft.y -= this.updraft.height * 3;
        this.physics.add.overlap(this.p1, this.updraft);
        this.physics.world.on('overlap', (gameObject1, gameObject2, body1, body2) =>
        {
            console.log("overlapped");

            if (gameObject1.gliding) {
                gameObject1.y -= gameObject2.speed;
            }

        })

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
        //this.add.text(10, 10, "Press ⬆️ while moving to glide", controlConfig);
        //this.add.text(10, 40, "Jump to destroy enemy", controlConfig);

        this.mapWidth = map.widthInPixels;

        this.nextScene = 'jumpLevelScene';

    }

    update() {
        
        this.p1.update();
    
    }

}