/*

ISSUES: fix glide so when player hits ground, it doesn't bounce back up again. 

*/



'use strict';

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    render: {
        pixelArt: true
    },
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
    scene: [GlideLevel, Play], //add menu later
}

// define the keys
let keyF, keyR, keyLEFT, keyRIGHT, keyUP; 


let game = new Phaser.Game(config);