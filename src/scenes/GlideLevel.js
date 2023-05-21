class GlideLevel extends Phaser.Scene {
    constructor() {
        super("glideLevelScene");

        // this.VEL = 100;
        this.ACCELERATION = 500;
        this.MAX_X_VEL = 200;   // pixels/second
        this.MAX_Y_VEL = 2000;
        this.DRAG = 600;    
        this.JUMP_VELOCITY = -650;
    }

    preload() {
        this.load.path = '/assets/'; //set loading path

        this.load.image('terrainImage', './Terrain/Terrain.png');
        this.load.image('backgroundImage', './Background/Pink.png');

        this.load.tilemapTiledJSON('glideLevelJSON', 'glideLevel.json');
        this.load.atlas("yellow", "yellow.png", "yellow.json");
    }

    create() {
        this.physics.world.gravity.y = 3000;

        //creating tilemap
        const map = this.add.tilemap('glideLevelJSON');

        //adding tileset images
        const terrainTileSet = map.addTilesetImage('Terrain', 'terrainImage');
        const backgroundTileSet = map.addTilesetImage('Pink', 'backgroundImage');

        //creating layers
        const bgLayer = map.createLayer('Background', backgroundTileSet, 0, 0);
        this.terrainLayer = map.createLayer('Terrain', terrainTileSet, 0, 0);

        //enable collision
        this.terrainLayer.setCollisionByProperty({collides: true});
        // terrainLayer.collide = true;

        //spawn location = where player starts
        const blobSpawn = map.findObject('Spawn', obj => obj.name === 'Blob');

        //adding player
        //this.p1 = this.physics.add.sprite(blobSpawn.x, blobSpawn.y, 'yellow', 'yellow1').setScale(0.35); 

        this.p1 = new Player(this, blobSpawn.x, blobSpawn.y, "yellow", "yellow1").setScale(0.35); 
        // this.player = this.physics.add.sprite(blobSpawn.x, blobSpawn.y, 'yellow', 0).setScale(0.25);

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
        this.terrainLayer.renderDebug(debugGraphics, {
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
        //change physics world bounds to follow camera
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, 600);

        //physics collision
        this.physics.add.collider(this.p1, this.terrainLayer);

        //user input
        this.cursors = this.input.keyboard.createCursorKeys();

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F); 
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    }

    update() {
        // this.p1.update();

        /* if(this.cursors.left.isDown) {
            this.p1.body.setAccelerationX(-this.ACCELERATION);
            this.p1.play('walk', true);
            this.p1.setFlip(true, false);
        } else if(this.cursors.right.isDown) {
            this.p1.body.setAccelerationX(this.ACCELERATION);
            this.p1.play('walk', true);
            this.p1.resetFlip();
        } else {
            // set acceleration to 0 so DRAG will take over
            // this.p1.play('idle');
            this.p1.body.setAccelerationX(0);
            this.p1.body.setDragX(this.DRAG);
        }
        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!this.p1.body.blocked.down) {
            // this.p1.anims.play('jump');
        }
        if(this.p1.body.blocked.down && Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.p1.body.setVelocityY(this.JUMP_VELOCITY);
        }*/

        this.p1.update();

    }

}