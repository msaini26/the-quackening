class JumpLevel extends Phaser.Scene {
    constructor() {
        super("jumpLevelScene");
    }

    preload() {
        this.load.path = '/assets/'; //set loading path

        this.load.image('terrainImage', './Terrain/Terrain.png');
        this.load.image('greenImage', './Background/Green.png');

        this.load.tilemapTiledJSON('jumpLevelJSON', 'jumpLevel.json');
        this.load.atlas("yellow", "yellow.png", "yellow.json");
    }

    create() {
        this.physics.world.gravity.y = 3000;

        //creating tilemap
        const map = this.add.tilemap('jumpLevelJSON');

        //adding tileset images
        const terrainTileSet = map.addTilesetImage('Terrain', 'terrainImage');
        const backgroundTileSet = map.addTilesetImage('Green', 'greenImage');

        //creating layers
        const bgLayer = map.createLayer('Background', backgroundTileSet, 0, 0);
        const terrainLayer = map.createLayer('Platform', terrainTileSet, 0, 0);

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

        //setting collision
        this.p1.body.setCollideWorldBounds(true); //so player can't exit screen/bounds


        // define a render debug so we can see the tilemap's collision bounds
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        terrainLayer.renderDebug(debugGraphics, {
            tileColor: null,    // color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),    // color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)                // color of colliding face edges
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

    }

    update() {
        
        this.p1.update();

        if(this.p1.x >= this.mapWidth - 20){
            this.scene.start('glideLevelScene');
        }
    
    }

}