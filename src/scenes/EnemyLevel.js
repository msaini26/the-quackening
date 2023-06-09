class EnemyLevel extends Phaser.Scene {
    constructor() {
        super("enemyLevelScene");
    }

    preload() {
        this.load.path = '/assets/'; //set loading path

        this.load.image('terrainImage', './Terrain/Terrain.png');
        this.load.image('brownImage', './Background/Brown.png');
        // this.load.atlas('ghost', 'yellow.png', 'yellow.json');
        this.load.image('ghost', 'enemy.png');

        this.load.tilemapTiledJSON('enemyJSON', 'enemy.json');
        this.load.atlas("yellow", "yellow.png", "yellow.json");

        this.load.audio('squeak', './assets/audio/squeaky.mp3');
        this.load.audio('collect', './assets/audio/collectcoin.mp3');
        this.load.audio('pop', './assets/audio/pop.mp3');
    }

    create() {
        this.physics.world.gravity.y = 3000;

        //creating tilemap
        const map = this.add.tilemap('enemyJSON');

        //adding tileset images
        const terrainTileSet = map.addTilesetImage('Terrain', 'terrainImage');
        const backgroundTileSet = map.addTilesetImage('Brown', 'brownImage');

        //creating layers
        const bgLayer = map.createLayer('Background', backgroundTileSet, 0, 0);
        const terrainLayer = map.createLayer('Terrain', terrainTileSet, 0, 0);

        //enable collision
        terrainLayer.setCollisionByProperty({collides: true});
        // terrainLayer.collide = true;

        //spawn location = where player starts
        const blobSpawn = map.findObject('Objects', obj => obj.name === 'Blob');

        //adding player
        // this.quackRadius = this.add.image(blobSpawn.x, blobSpawn.y, 'quack')
        this.p1 = new Player(this, blobSpawn.x, blobSpawn.y, "yellow", "yellow1", this.quackRadius).setScale(0.35); 


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


        //spawn location = where player starts
        const enemySpawn = map.findObject('Objects', obj => obj.name === 'Enemy');

        // this.enemy = this.physics.add.sprite(enemySpawn.x, enemySpawn.y, 'ghost'); 
        this.enemy = this.physics.add.sprite(enemySpawn.x, enemySpawn.y, 'ghost').setScale(1); 


        
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

        this.enemy.body.setCollideWorldBounds(true); // so enemy can't exit screen/bounds

        // add physics collider between player and enemy
        // this.physics.add.collider(this.p1, this.enemy);



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
        this.physics.add.collider(this.enemy, terrainLayer);

        //user input
        // this.cursors = this.input.keyboard.createCursorKeys();

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F); 
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // this.add.rectangle(0, 0, 100, 50, 0xffffff);

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
        this.add.text(10, 10, "Jump to destroy enemy", controlConfig);

        this.mapWidth = map.widthInPixels;

        this.nextScene = 'gameOverScene';

        this.isDead = false;

    }

    update() {
        
        this.checkEnemy();

        if(!this.isDead){
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

    checkEnemy(){
        this.physics.add.collider(this.p1, this.enemy, (player, enemy) =>{
            if(this.p1.body.touching.down){
                this.currScore += 3;
                enemy.destroy();
                this.sound.play('pop');
            } else {
                this.p1.destroy(); // remove player
                this.scene.restart("enemyLevelScene");
                this.currScore = 0;
                this.isDead = true;
            }
        });
    }

}