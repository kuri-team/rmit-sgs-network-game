var config = {
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
    backgroundColor: "#ffffff",
    scene: [
        BootGame, RunGame
    ],
    pixelArt: true
}

var game = new Phaser.Game(config);
