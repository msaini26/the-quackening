'use strict';

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Play], //add menu later
}

// define the keys
let keyF, keyR, keyLEFT, keyRIGHT; 


let game = new Phaser.Game(config);