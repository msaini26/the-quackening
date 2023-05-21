//https://pixelfrog-assets.itch.io/pixel-adventure-1
'use strict';

let config = {
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
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