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

        this.load.audio('squeak', './assets/audio/squeaky.mp3');
        this.load.audio('collect', './assets/audio/collectcoin.mp3');

        this.load.audio('sfx_select', './assets/audio/quack.mp3');
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

        this.currScore = 0;

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
            // console.log(score);
        });

        // background music configurations
        let levelMusicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            loop: true,
            delay: 0,
        }

        // create sound instance
        gameMusic = this.sound.add('background_music', levelMusicConfig);
        gameMusic.play(levelMusicConfig); // play music with config settings

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

        // this.add.rectangle(0, 0, 300, 170, 0xffffff);

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
        this.add.text(10, 10, "⬆️ or W to jump", controlConfig);
        this.add.text(10, 40, "⬅️ ➡️ or (A) and (D) to move", controlConfig);
        // this.add.text(10, 70, "Press ⬆️ and ⬅️ / ➡️ to glide", controlConfig);


        this.mapWidth = map.widthInPixels;

        // clock
        // this.clock = new Phaser.Time.Clock(this);

        // TIMER: to see how fast you can make it to the end

        // display score
        let scoreConfig = {
            fontFamily:'ducko', // set font
            fontSize: '28px', // set font size
            backgroundColor: '#e7c9ff', // set score background color
            color: '#FFFFFF', // set text color
            align: 'center', // align score to the center
            padding: { // set padding around text
                top: 5,
                bottom: 5,
            },
            fixedWidth: 70 // set max width
        }

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        // this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
        //     // move to gameover scene
        //     this.scene.stop();
        //     this.scene.start('gameOverScene');
        // }, null, this);

        // display timer
        // let clockConfig = {
        //     fontFamily:'chicken-pie', // set font
        //     fontSize: '28px', // set font size
        //     backgroundColor: '#e7c9ff', // set score background color
        //     color: '#FFFFFF', // set text color
        //     align: 'center', // align score to the center
        //     padding: { // set padding around text
        //         top: 5,
        //         bottom: 5,
        //     },
        //     fixedWidth: 50 // set max width
        // };
  
        // timer
        // this.timer = this.add.text(10, 80, 60, clockConfig);
        // this.timer.setShadow(2, 2, '#6b74bd');
        // clockConfig.fixedWidth = 0;
    }

        

    update() {

        // update the timer as the player continues
        // this.timer.text = Math.floor(this.clock.getRemainingSeconds());
        
        // player updates
        this.p1.update();

        // when player restarts level, restart the scene
        if(this.p1.restart){
            gameMusic.stop();
            this.scene.restart();
            this.currScore = 0;
        }

        // when player makes it to the end, move to next scene
        if(this.p1.nextScene){
            score = this.currScore;
            this.scene.start(this.nextScene);
        }

        // squeak sound when the player jumps
        if(this.p1.isJumping){
            this.sound.play('squeak'); 
        }
    
    }

}