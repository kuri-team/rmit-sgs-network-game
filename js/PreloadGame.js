class PreloadGame extends Phaser.Scene {
    constructor() {
        super("preloadGame");
    }

    preload() {
        // Load player sprite
        this.load.spritesheet("player", "./assets/spritesheets/player.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("player_explode", "./assets/spritesheets/player_explode.png", {
            frameWidth: 32,
            frameHeight: 32
        });

        // Load obstacle sprite
        this.load.image("obstacle", "./assets/images/obstacle.png");
    }

    create() {
        let loadingCue = this.add.text(config.width / 2, config.height / 2, "Loading, please wait...");
        loadingCue.setOrigin(0.5);

        // this.scene.start("createGame");
    }
}