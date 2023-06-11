class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/audio/quack.mp3');

        // title screen background
        this.load.image('background', './assets/Background/title.png');
    }

    create() {
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setScale(1.75).setOrigin(0, 0);

        let titleConfig = {
            fontFamily: 'ducko', // set font
            fontSize: '50px',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                right: 5,
                left: 5
            }
        };

         // show menu text
         var title = this.add.text(game.config.width/2, 100, 'Credits', titleConfig).setOrigin(0.5);
         title.setShadow(4, 4, '#424130');

         let subConfig = {
            fontFamily: 'vinegarStroke',
            fontSize: '30px',
            color: '#ad9165',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                right: 5,
                left: 5
            }
        };

        let subTitle = {
            fontFamily: 'vinegarStroke',
            fontSize: '30px',
            color: '#78664a',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                right: 5,
                left: 5
            }
        };

         
        this.add.text(200, 200, 'Music:', subTitle);
        this.add.text(340, 200, 'Mansi, Rebecca, https://pixabay.com/sound-effects/ ', subConfig);

        this.add.text(200, 250, 'Tileset:', subTitle);
        this.add.text(340, 250, 'https://pixelfrog-assets.itch.io/pixel-adventure-1', subConfig);

        this.add.text(200, 300, 'Artwork:', subTitle);
        this.add.text(340, 300, 'Rebecca and Thanh', subConfig);

        this.add.text(200, 350, 'Physics:', subTitle);
        this.add.text(340, 350, 'Fern', subConfig);

        this.add.text(200, 400, 'Coding:', subTitle);
        this.add.text(340, 400, 'Everyone', subConfig);
        
        this.add.text(200, 450, 'Fonts:', subTitle);
        this.add.text(340, 450, 'https://www.1001freefonts.com/vinegar-stroke.font', subConfig);

        subConfig.color = '#FFFFFF';
        this.back = this.add.text(30, 30, 'Press ← to go Back', subConfig);
        this.back.setShadow(3, 3, '#424130');

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx_select'); // play selector sound
            this.scene.start('menuScene'); // begin first level
            introMusic.stop();
        }
    }
}