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

        // Set up the player's pivot point
        this.pivot = this.matter.add.circle(playerObj.x, playerObj.y, GAMESETTINGS.scaleFactor);
        this.joint = this.matter.add.joint(playerObj, pivot, 0, 0.7);
        this.joint.pointA = {
            x: 0,
            y: -GAMESETTINGS.scaleFactor
        };

        // Turn off collision between player and pivot
        this.pivot.collisionFilter = { group: -1 };
        this.collisionFilter = { group: -1 };

        // Set up anchor
        this.anchor = this.matter.add.rectangle(
            0, -GAMESETTINGS.scaleFactor * 3, GAMESETTINGS.scaleFactor, GAMESETTINGS.scaleFactor
        );
        this.anchor.ignoreGravity = true;
        this.anchor.isStatic = true;

        // Set up collision logic
        this.setOnCollide(pair => { this.collisionHandler(pair); });

        this.web = this.shootWeb(null, 0);

        return this;
    }


    /***
     * Update the player character's properties according to player input
     */
    updatePlayer() {
        // -------------------------------- Categorize inputs -------------------------------- //
        const control = {
            left:
                this.cursor.left.isDown ||
                (this.pointer.isDown && this.pointer.x < this.scale.width / 2) ||
                (this.touch.isDown && this.touch.x < this.scale.width / 2),
            right:
                this.cursor.right.isDown ||
                (this.pointer.isDown && this.pointer.x > this.scale.width / 2) ||
                (this.touch.isDown && this.touch.x > this.scale.width / 2),
        };

        // -------------------------------- Apply input to player character -------------------------------- //
        if (control.left && !control.right) {  // Left movement (with scaling difficulty)
            this.matter.applyForce(this.body, { x: -(GAMESETTINGS.controlSensitivity * GAMESETTINGS.scaleFactor ** 2 / 8) * (this.score / 20 + 1), y: 0 });  // This formula produces consistent force scaling with scaleFactor
            if (!this.webExist) {
                this.web = this.playerShootWeb(-GAMESETTINGS.player.webOverhead * GAMESETTINGS.scaleFactor);
            }
        } else if (control.right && !control.left) {  // Right movement (with scaling difficulty)
            this.matter.applyForce(this.body, { x: (GAMESETTINGS.controlSensitivity * GAMESETTINGS.scaleFactor ** 2 / 8) * (this.score / 20 + 1), y: 0 });  // This formula produces consistent force scaling with scaleFactor
            if (!this.webExist) {
                this.web = this.shootWeb();
            }
        } else if (!control.left && !control.right && this.webExist && !this.firstPlayerInput) {  // Cut web
            this.cutWeb();
        }

        // Check if this is the first player interaction with the game
        if (this.firstPlayerInput && (
            (this.cursor.left.getDuration() > GAMESETTINGS.controlDelayOnStart && this.cursor.left.isDown) ||
            (this.cursor.right.getDuration() > GAMESETTINGS.controlDelayOnStart && this.cursor.right.isDown) ||
            (this.pointer.getDuration() > GAMESETTINGS.controlDelayOnStart && this.pointer.noButtonDown()) ||
            (this.touch.getDuration() > GAMESETTINGS.controlDelayOnStart && this.touch.noButtonDown()))
        ) {
            this.firstPlayerInput = false;
        }
    }


    /***
     * Create a player web (type MatterJS constraint) between the player character and a specified x offset on the ceiling
     * @param {Obstacles} obstacles
     * @param {number} xOffset
     * @param {boolean} soundOn
     * @returns {MatterJS.ConstraintType}
     */
    shootWeb(obstacles, xOffset=0, soundOn=true) {
        // Sound effect
        if (soundOn) {
            this.SFX.shoot.play();
        }

        // Set up variables and constants for calculations
        const playerX = Math.floor(this.x);
        let anchorOffsetX;
        let anchorOffsetY = 0;

        // Calculate targetAnchorOffsetX and targetAnchorOffsetY
        anchorOffsetX = playerX + xOffset;
        if (obstacles !== null) {
            let obstacleAbovePlayer = obstacles.getObstacleAbove(this, xOffset);
            if (obstacleAbovePlayer !== undefined) {
                anchorOffsetY = obstacleAbovePlayer.body.vertices[3].y + GAMESETTINGS.scaleFactor * 3;  // TODO: find out why this works
            }
        }

        // Shoot the web
        this.webExist = true;
        let webLength = Math.sqrt(xOffset ** 2 + (this.y - anchorOffsetY) ** 2);
        this.web = this.matter.add.constraint(this.pivot, this.anchor, webLength, GAMESETTINGS.player.webStiffness);
        this.web.pointB = {
            x: anchorOffsetX,
            y: anchorOffsetY
        };
        return this.web;
    }

    /***
     * Destroy the player's web
     * @returns {Phaser.Physics.Matter.World}
     */
    cutWeb() {
        this.webExist = false;
        return this.matter.world.removeConstraint(this.web, true);
    }

    /***
     * Show the player's web on screen if it exists
     */
    renderWeb() {
        this.graphics.clear();

        if (this.webExist) {
            let lineThickness = GAMESETTINGS.scaleFactor
            let lineColor = GAMESETTINGS.player.webColor;

            this.graphics.lineStyle(lineThickness, lineColor, 1);
            this.graphics.lineBetween(
                this.web.pointB.x, this.web.pointB.y - GAMESETTINGS.scaleFactor * 3,
                this.x, this.y
            );
        }
    }

    /***
     * Player collision logic
     * @param {Phaser.Physics.Matter.Matter.Pair} pair
     * @return {Phaser.Physics.Matter.Matter.Pair}
     */
    collisionHandler(pair) {
        this.SFX.dead.play();

        if (this.webExist) {
            this.cutWeb();
        }

        if (--this.health < 1) {
            this.matter.pause();
            this.play('player-dead-anim');
            this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.time.delayedCall(GAMESETTINGS.gameOverDelay, () => { this.gameOver = true });
            }, this);
        } else {
            this.play('player-hurt-anim');
            this.setTexture('player');
        }

        return pair;  // Provide streamlining of collision data. Read more about pair in MatterJS documentation.
    }

    resetBody() {
        this.player.body.force = {
            x: 0,
            y: 0,
        };
        this.player.body.velocity = {
            x: 0,
            y: 0
        };
        this.player.body.acceleration = {
            x: 0,
            y: 0
        }
        return this
    }
}
