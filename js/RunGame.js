class RunGame extends Phaser.Scene {
    constructor() {
        super("runGame");
        this.playerPhysics = {
            initialSpeedX: 100,
            initialSpeedY: -100,
            accelerationX: 1,
            accelerationY: 0,
        }
        this.gameOver = false;
    }

    create() {
        // Create player
        this.player = this.physics.add.sprite(100, 100, "player");
        this.anims.create({
            key: "player_anim",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "player_explode_anim",
            frames: this.anims.generateFrameNumbers("player_explode"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        })
        this.player.play("player_anim");
        this.player.setInteractive();
        this.player.setVelocity(this.playerPhysics.initialSpeedX, this.playerPhysics.initialSpeedY);
        this.player.setAcceleration(this.playerPhysics.accelerationX, this.playerPhysics.accelerationY)

        // Create Obstacles
        this.obstacles = this.physics.add.staticGroup();
        this.obstacles.create(0, config.scale.height + 12, "obstacle").setScale(50, 1).refreshBody();
        this.obstacles.create(0, 12, "obstacle").setScale(50, 1).refreshBody();

        // Physics collider
        this.physics.add.collider(this.player, this.obstacles, this.killPlayer, null, this);

        // Camera configuration
        this.mainCam = this.cameras.main;
        this.mainCam.startFollow(this.player, false, 1, 1, -config.scale.width / 5, 0);
        this.mainCam.setDeadzone(0, config.scale.height);
        this.mainCam.setLerp(1, 0);
    }

    update() {
    }

    killPlayer(gameObject) {
        gameObject.setTexture("player_explode");
        gameObject.play("player_explode_anim");
        this.physics.pause();
        this.gameOver = true;
    }
}