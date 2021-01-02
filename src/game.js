import PreloadGame from "./scenes/PreloadGame.js";
import RunGame from "./scenes/RunGame.js";


let config = {
    backgroundColor: "#ffffff",
    pixelArt: true,
    type: Phaser.AUTO,
    scale: {
        parent: 'game-wrapper',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        width: 304,
        height: 160
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene: [
        PreloadGame, RunGame
    ]
}

let game = new Phaser.Game(config);


export default {
    game,
    config
};
