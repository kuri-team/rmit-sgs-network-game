import GAMESETTINGS from "./settings.js";
import PreloadGame from "./scenes/PreloadGame.js";
import RunGame from "./scenes/RunGame.js";
import GameOver from "./scenes/GameOver.js";


let debug = false;
if (GAMESETTINGS.debug) {
    debug = {
        showVelocity: true,
        showCollisions: true
    }
}

let config = {
    backgroundColor: GAMESETTINGS.backgroundColor,
    pixelArt: true,
    type: Phaser.AUTO,
    scale: {
        parent: 'game-wrapper',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        width: GAMESETTINGS.nativeWidth * GAMESETTINGS.scaleFactor,
        height: GAMESETTINGS.nativeHeight * GAMESETTINGS.scaleFactor
    },
    physics: {
        default: "matter",
        matter: {
            gravity: { x: GAMESETTINGS.gravity.x, y: GAMESETTINGS.gravity.y },
            debug: debug
        }
    },
    scene: [
        PreloadGame, RunGame, GameOver
    ]
};

let game = new Phaser.Game(config);


export default {
    game,
    config,
};
