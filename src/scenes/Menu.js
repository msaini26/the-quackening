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
        this.load.audio('background_music', './assets/audio/menu.mp3');

    }

    // create objects and instances in phaser canvas
    create () {
        // display title image
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setScale(1.25).setOrigin(0, 0); // place background tile sprite

        // set menu configurations
        let menuConfig = {
            fontFamily:'ducko', // set font
            fontStyle: 'bold', // bold font
            fontSize: '28px', // set font size
            backgroundColor: '#F3B141', // set score background color
            color: '#843605', // set text color
            align: 'center', // align score to the center
            padding: { // set padding around text
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0 // set max width
        };

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
            fontSize: '28px',
            align: 'center',
        };

       
        // show menu text
        var title = this.add.text(game.config.width/30, game.config.height/4 - borderUISize - borderPadding, ' The', titleConfig);
        var title_2 = this.add.text(game.config.width/30, game.config.height/2.5 - borderUISize - borderPadding, 'Quackening', titleConfig);
        title.setShadow(4, 4, '#2d4e3f');
        title_2.setShadow(4, 4, '#2d4e3f');

        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        var level_mode = this.add.text(game.config.width/3.5, game.config.height/1.5, 'Press ← to continue', subConfig).setOrigin(0.5);
        level_mode.setShadow(4, 4, '#2d4e3f');


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
        this.music = this.sound.add('background_music', musicConfig);
        this.music.play(musicConfig); // play music with config settings

    }

    // updates per frame
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx_select'); // play background music
            this.scene.start('playScene');
            this.music.stop();
        }
    }
}