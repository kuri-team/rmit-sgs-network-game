import GAMESETTINGS from "../settings.js";


/***
 * Gameplay class
 */
export default class RunGame extends Phaser.Scene {
    constructor() {
        super("runGame");
    }


    /*
    *************************************
    * ---------CUSTOM PROPERTIES------- *
    *************************************
     */
    /** @type {string} **/
    debugText;

    /** @type {Phaser.GameObjects.Text} **/
    debugTextObj;

    /** @type {Boolean} **/
    gameOver;

    /** @type {number} **/
    score;

    /** @type {Phaser.Physics.Matter.Sprite} **/
    ceilingCollision;

    /** @type {MatterJS.BodyType} **/
    ceilingAnchor;

    /** @type {Phaser.Physics.Matter.Sprite} **/
    player;

    /** @type {MatterJS.BodyType} **/
    playerPivot;

    /** @type {MatterJS.ConstraintType} **/
    web;

    /** @type {boolean} **/
    webExist;

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} **/
    cursor;

    /** @type {Phaser.Input.Pointer} **/
    pointer;

    /** @type {Phaser.Cameras.Scene2D.Camera} **/
    viewport;
    /* End of custom properties */


    init() {
        this.debugText = "";
        this.matter.set60Hz();
        this.gameOver = false;
        this.score = 0;
    }

    create() {
        this.createBackground();
        this.ceilingCollision = this.createCeilingCollision();
        this.ceilingAnchor = this.createCeilingAnchor();
        this.player = this.createPlayer(GAMESETTINGS.player.initialX, GAMESETTINGS.player.initialY);
        this.playerPivot = this.createPlayerPivot(this.player);
        this.web = this.playerShootWeb(GAMESETTINGS.player.initialX);

        // Enable player control via keyboard
        this.cursor = this.input.keyboard.createCursorKeys();

        // Enable camera following
        this.setupCamera();

        // Create and render debug info if specified in game settings object
        if (GAMESETTINGS.debug) { this.createDebugInfo(); }
    }

    update(time, delta) {
        super.update(time, delta);  // Default code suggestion, don't know why it works yet, maybe consult Phaser documentation?
        this.updateCeilingCollision();
        this.updatePlayer();
        this.renderPlayerWeb();

        // Update debug information if specified in game settings object
        if (GAMESETTINGS.debug) { this.updateDebugInfo(); }
    }


    /*
    ************************************
    * ----------CUSTOM METHODS-------- *
    ************************************/
    /***
     * Create the background
     * @returns {Phaser.GameObjects.Image}
     */
    createBackground() {
        return this.add.image(this.game.scale.width / 2, this.game.scale.height / 2, 'background')
            .setScale(GAMESETTINGS.scaleFactor)
            .setScrollFactor(1, 1);
    }

    /***
     * Create a player sprite at the specified xy coordinates
     * @param {number} x
     * @param {number} y
     * @returns {Phaser.Physics.Matter.Sprite && Phaser.GameObjects.GameObject}
     */
    createPlayer(x, y) {
        let player = this.matter.add.sprite(x, y, 'player')
            .setScale(GAMESETTINGS.scaleFactor)
            .setOrigin(0.5, 0)
            .setMass(GAMESETTINGS.player.mass);
        player.body.force = GAMESETTINGS.player.initialForce;
        player.body.collideWorldBounds = true;

        // Readjust collision box yOffset
        for (let i = 0; i < player.body.vertices.length; i++) {
            player.body.vertices[i].y += player.displayHeight / 2;
        }

        // Exclude legs from collision box
        player.body.vertices[0].x += 3 * GAMESETTINGS.scaleFactor;
        player.body.vertices[1].x -= 3 * GAMESETTINGS.scaleFactor;
        player.body.vertices[2].x -= 3 * GAMESETTINGS.scaleFactor;
        player.body.vertices[3].x += 3 * GAMESETTINGS.scaleFactor;

        return player;
    }

    /***
     * Create a pivot where the player sprite will shoot the spider web from
     * @param {Phaser.Physics.Matter.Sprite} playerObj
     * @returns {MatterJS.BodyType}
     */
    createPlayerPivot(playerObj) {
        let pivot = this.matter.add.circle(playerObj.x, playerObj.y, GAMESETTINGS.scaleFactor);
        let joint = this.matter.add.joint(playerObj, pivot, 0, 0.7);
        joint.pointA = {
            x: 0,
            y: -GAMESETTINGS.scaleFactor
        };

        // Turn off collision between player and pivot
        pivot.collisionFilter = { group: -1 };
        playerObj.collisionFilter = { group: -1 };

        return pivot;
    }

    /***
     * Create the ceiling collision box
     * @returns {Phaser.Physics.Matter.Sprite}
     */
    createCeilingCollision() {
        let ceilingX = this.game.scale.width;
        let ceilingY = -GAMESETTINGS.scaleFactor / 2;
        let ceilingWidth = this.game.scale.width * 2;  // For indefinite scrolling implementation. See function: updateCeilingCollision()
        let ceilingHeight = GAMESETTINGS.scaleFactor;

        /** @type {Phaser.Physics.Matter.Sprite} **/
        let ceiling = this.matter.add.sprite(ceilingX, ceilingY, 'ceiling');
        ceiling.setScale(ceilingWidth, ceilingHeight);
        ceiling.body.ignoreGravity = true;
        ceiling.body.isStatic = true;

        return ceiling;
    }

    /***
     * Create and return a ceiling anchor
     * @returns {MatterJS.BodyType}
     */
    createCeilingAnchor() {
        /** @type {MatterJS.BodyType} **/
        let anchor = this.matter.add.rectangle(
            0, -GAMESETTINGS.scaleFactor / 2, GAMESETTINGS.scaleFactor, GAMESETTINGS.scaleFactor
        );
        anchor.ignoreGravity = true;
        anchor.isStatic = true;

        return anchor;
    }

    /***
     * Configure the viewport to follow the player's character
     */
    setupCamera() {
        let offsetX = -(this.game.scale.width / 2) + GAMESETTINGS.player.initialX;
        let offsetY = -(this.game.scale.height / 2) + GAMESETTINGS.player.initialY;

        this.viewport = this.cameras.main;
        this.viewport.startFollow(
            this.player,
            true,
            1, 0,
            offsetX, offsetY
        );
    }

    /***
     * Create a player web (type MatterJS constraint) between the player character and a specified point on the ceiling
     * @param {number} anchorOffset
     * @returns {MatterJS.ConstraintType}
     */
    playerShootWeb(anchorOffset) {
        this.webExist = true;
        let webLength = Math.sqrt(GAMESETTINGS.player.webOverhead ** 2 + this.player.y ** 2);
        let webObj = this.matter.add.constraint(this.playerPivot, this.ceilingAnchor, webLength);
        webObj.pointB = {
            x: anchorOffset,
            y: 0
        };
        return webObj;
    }

    /***
     * Destroy the specified player web (type MatterJS constraint)
     * @param {MatterJS.ConstraintType} playerWebObject
     * @returns {Phaser.Physics.Matter.World}
     */
    playerCutWeb(playerWebObject) {
        this.webExist = false;
        return this.matter.world.removeConstraint(playerWebObject, true);
    }

    /***
     * Show the web on screen if it exists
     */
    renderPlayerWeb() {
        if (!this.graphics) {
            this.graphics = this.add.graphics();
        }
        this.graphics.clear();

        if (this.webExist) {
            let lineThickness = GAMESETTINGS.scaleFactor
            this.matter.world.renderConstraint(
                this.web, this.graphics,
                -1, 1, lineThickness, 0, -1, 0
            );
        }
    }

    /***
     * Update the ceiling collision box for indefinite scrolling (from left to right)
     */
    updateCeilingCollision() {
        this.ceilingCollision.setPosition(
            this.viewport.scrollX + this.game.scale.width,
            this.ceilingCollision.y
        );
    }

    /***
     * Update the player character's properties according to player input
     */
    updatePlayer() {
        let control = {
            left: false,
            right: false,
            toggleWeb: false
        };

        // -------------------------------- Categorize inputs -------------------------------- //
        if (
            this.cursor.left.isDown && this.webExist
        ) { control.left = true; }
        if (
            this.cursor.right.isDown && this.webExist
        ) { control.right = true; }
        if (
            Phaser.Input.Keyboard.JustDown(this.cursor.space)
        ) { control.toggleWeb = true; }

        // -------------------------------- Apply input to player character -------------------------------- //
        if (control.left) {  // Left movement
            this.matter.applyForce(this.player.body, { x: -GAMESETTINGS.controlSensitivity, y: 0 });
        }
        if (control.right) {  // Right movement
            this.matter.applyForce(this.player.body, { x: GAMESETTINGS.controlSensitivity, y: 0 });
        }
        if (control.toggleWeb && this.webExist) {  // Cut web
            this.playerCutWeb(this.web);
        } else if (control.toggleWeb && !this.webExist) {  // Shoot web
            let playerX = Math.floor(this.player.x);
            let targetAnchorOffset;  // Set at undefined to catch errors when targetAnchorIdx is not set

            if (this.player.body.velocity.x > 0) {
                targetAnchorOffset = playerX + GAMESETTINGS.player.webOverhead;
            } else if (this.player.body.velocity.x < 0) {
                targetAnchorOffset = playerX - GAMESETTINGS.player.webOverhead;
            } else {
                targetAnchorOffset = playerX;
            }

            try {
                this.web = this.playerShootWeb(targetAnchorOffset);
            } catch (TypeError) {
                console.log("Can't find ceiling anchors! Restarting")
                this.scene.start('runGame');
            }  // Restart game TODO: This is only to catch errors! Need replacement later.
        }
    }

    // =========================================== FOR DEBUGGING PURPOSES =========================================== //

    createDebugInfo() {
        this.debugTextObj = this.add.text(
            GAMESETTINGS.scaleFactor, GAMESETTINGS.scaleFactor, this.debugText, { color: "#0f0" }
        ).setScrollFactor(0);
    }

    updateDebugInfo() {
        this.debugText = "STATS FOR NERDS\n\n"
            + `gameOver = ${this.gameOver}\n`
            + '\n'
            + `player.x = ${this.player.x}\n`
            + `player.y = ${this.player.y}\n`
            + `webExist = ${this.webExist}\n`
            + `webLength = ${this.web.length}\n`
            + `ceilingAnchorOffset = ${this.web.pointB.x}\n`
            + '\n'
            + `viewport.scrollX ${this.viewport.scrollX}\n`
            + `viewport.scrollY ${this.viewport.scrollY}\n`
        ;
        this.debugTextObj.text = this.debugText;
    }
    /* End of custom methods */
}
