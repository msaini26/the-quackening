/*

ISSUES: fix glide so when player hits ground, it doesn't bounce back up again. 

*/

'use strict';

let config = {
    type: Phaser.AUTO,
    // width: 800,
    width: 1300,
    height: 600,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },

    scene: [Menu, Credits, UpdraftLevel, JumpLevel, GlideLevel, EnemyLevel, GameOver], 
}

let game = new Phaser.Game(config);

// define the keys
let keyF, keyR, keyLEFT, keyRIGHT, keyUP, keySPACE, keyW, keyA, keyS, keyD, keyC; 

// let cursors = null;

// border UI size
let borderUISize = game.config.height / 15; // set UI height
let borderPadding = borderUISize / 3; // set padding around game frame

let score = 0;
let gameMusic, introMusic;

// define the game timer (60 seconds)
game.settings = {
    gameTimer: 61000
}


