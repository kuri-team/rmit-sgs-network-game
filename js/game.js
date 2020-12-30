let config = {
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
            gravity: { y: 1000 },
            debug: false
        }
    },
    // physics: {
    //     default: "matter",
    //     matter: {
    //         enableSleeping: true,
    //         gravity: {
    //             y: 1000
    //         },
    //         debug: {
    //             showBody: true,
    //             showStaticBody: true
    //         }
    //     }
    // },
    backgroundColor: "#ffffff",
    scene: [
        PreloadGame, CreateGame, UpdateGame
    ],
    pixelArt: true
}

let game = new Phaser.Game(config);
