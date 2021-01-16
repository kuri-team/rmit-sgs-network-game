import GAMESETTINGS from "../settings.js";


export default class Player extends Phaser.Physics.Matter.Sprite {
    /***
     *
     * @param {Phaser.Physics.Matter.World} world
     * @param {number} x
     * @param {number} y
     * @return {Player}
     */
    constructor(world, x, y) {
        super(world, x, y, 'player');
        this.scene.add.existing(this);

        this.setScale(GAMESETTINGS.scaleFactor)
            .setOrigin(0.5, 0)
            .setVelocity(0, 0)
            .setMass(GAMESETTINGS.player.mass * GAMESETTINGS.scaleFactor);
        this.body.force = GAMESETTINGS.player.initialForce;
        this.body.restitution = GAMESETTINGS.player.bounce;  // Enable bouncing

        // Readjust collision box yOffset
        for (let i = 0; i < this.body.vertices.length; i++) {
            this.body.vertices[i].y += this.displayHeight / 2;
        }

        // Exclude legs from collision box
        this.body.vertices[0].x += 3 * GAMESETTINGS.scaleFactor;
        this.body.vertices[1].x -= 3 * GAMESETTINGS.scaleFactor;
        this.body.vertices[2].x -= 3 * GAMESETTINGS.scaleFactor;
        this.body.vertices[3].x += 3 * GAMESETTINGS.scaleFactor;

        return this;
    }


    /***
     * Player collision logic
     * @param {Phaser.Physics.Matter.Matter.Pair} pair
     * @return {Phaser.Physics.Matter.Matter.Pair}
     */
    playerCollisionHandler(pair) {
        this.SFX.dead.play();

        if (this.webExist) {
            this.playerCutWeb(this.web);
        }

        if (--this.health < 1) {
            this.matter.pause();
            this.player.play('player-dead-anim');
            this.player.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.time.delayedCall(GAMESETTINGS.gameOverDelay, () => { this.gameOver = true });
            }, this);
        } else {
            this.player.play('player-hurt-anim');
            this.player.setTexture('player');
        }

        return pair;  // Provide streamlining of collision data. Read more about pair in MatterJS documentation.
    }
}
