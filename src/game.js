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


let customFonts = [
    'Kenney Blocks',
    'Kenney Future',
    'Kenney Future Narrow',
    'Kenney High',
    'Kenney High Square',
    'Kenney Mini',
    'Kenney Mini Square',
    'Kenney Pixel',
    'Kenney Pixel Square',
    'Kenney Rocket',
    'Kenney Rocket Square'
];


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
            gravity: { x: GAMESETTINGS.gravity.x * GAMESETTINGS.scaleFactor, y: GAMESETTINGS.gravity.y * GAMESETTINGS.scaleFactor },
            debug: debug
        }
    },
    scene: [
        PreloadGame, RunGame, GameOver
    ]
};

// Run the game if the device is in landscape mode
let game;
if (screen.availWidth > screen.availHeight) {
    game = new Phaser.Game(config);
} else {
    const MESSAGE = document.querySelector('.portrait-mode-message');
    MESSAGE.setAttribute('style', 'display: block;')
}


export default {
    game,
    config,
    customFonts
};
