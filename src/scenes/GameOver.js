class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    preload() {
        this.load.image('background', './assets/Background/title.png'); // sky background image
    }

    create() {
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setScale(1.25).setOrigin(0, 0);


        let titleConfig = {
            fontFamily: 'vinegarStroke', // set font
            fontSize: '60px',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                right: 5,
                left: 5
            }
        };

        // show menu text
        var title = this.add.text(game.config.width/2, game.config.height/2 - 100, 'Game Complete!', titleConfig).setOrigin(0.5);
        title.setShadow(4, 4, '#424130');


        let subConfig = {
            fontFamily: 'vinegarStroke',
            fontSize: '30px',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                right: 5,
                left: 5
            }
        };

        var text = this.add.text(game.config.width/2, game.config.height - 200, 'You collected           coins', subConfig).setOrigin(0.5);
        text.setShadow(4, 4, '#424130');

        subConfig.fontSize = '45px';
        subConfig.color = '#f27516';
        var coins = this.add.text(game.config.width/2 + 65, game.config.height - 200, score, subConfig).setOrigin(0.5);
        // coins.setShadow(4, 4, '#424130');
    }

    update() {

    }
}