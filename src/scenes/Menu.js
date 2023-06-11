// initialize menu class and inherit properties of phaser
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    // preload assets
    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/audio/quack.mp3');

        // title screen background
        this.load.image('background', './assets/Background/title.png'); // sky background image

        // credit: pixabay - AudioCoffee: Song of the little ducks
        // load background music
        this.load.audio('menu', './assets/audio/menu.mp3');

    }

    // create objects and instances in phaser canvas
    create () {
        // display title image
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setScale(1.25).setOrigin(0, 0); // place background tile sprite

        // // set menu configurations
        // let menuConfig = {
        //     fontFamily:'ducko', // set font
        //     fontStyle: 'bold', // bold font
        //     fontSize: '28px', // set font size
        //     backgroundColor: '#F3B141', // set score background color
        //     color: '#843605', // set text color
        //     align: 'center', // align score to the center
        //     padding: { // set padding around text
        //         top: 5,
        //         bottom: 5,
        //     },
        //     fixedWidth: 0 // set max width
        // };

        // title font configurations
        let titleConfig = {
            fontFamily: 'ducko', // set font
            fontSize: '60px',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                right: 5,
                left: 5
            }
        };

        // subtitle font configuration
        let subConfig = {
            fontFamily: 'ducko',
            fontSize: '30px',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                right: 5,
                left: 5
            }
        };

        // show menu text
        var title = this.add.text(game.config.width/2, game.config.height/2 - 100, 'The Quackening', titleConfig).setOrigin(0.5);
        title.setShadow(4, 4, '#424130');

        // menuConfig.backgroundColor = '#eeecd0';
        // menuConfig.color = '#000';
        var level_mode = this.add.text(game.config.width/2, game.config.height/1.5, 'Press → to continue', subConfig).setOrigin(0.5);
        level_mode.setShadow(3, 3, '#424130');

        subConfig.fontFamily = 'vinegarStroke';
        var name_credits=this.add.text(game.config.width/2, game.config.height - 50, 'Created By : Fernando Alcazar, Mansi Saini, Thanh To, Rebecca Zhao', subConfig).setOrigin(0.5);
        name_credits.setShadow(3, 3, '#424130');


        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

         // background music configurations
         let musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            loop: true,
            delay: 0,
        }

        // create sound instance
        this.music = this.sound.add('menu', musicConfig);
        this.music.play(musicConfig); // play music with config settings

    }

    // updates per frame
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.sound.play('sfx_select'); // play selector sound
            this.scene.start('jumpLevelScene'); // begin first level
            this.music.stop(); // stop music
        }
    }
}