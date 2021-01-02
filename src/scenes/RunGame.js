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
    /** @type {number} **/
    score;
    /** @type {[{MatterJS.BodyType}]} **/
    ceiling;
    /** @type {Phaser.Physics.Matter.Sprite} **/
    player;
    /* End of custom properties */


    init() {
        this.matter.set60Hz();
        this.score = 0;
    }

    create() {
        // this.debugCreate();  // For debugging purposes only
        this.createBackground();
        this.ceiling = this.createCeilingAnchors();
        this.player = this.createPlayer(this.game.scale.width / 3, this.game.scale.height / 2);
        // this.matter.add.constraint(this.player.body, this.ceiling[20].body);
        console.log(this.player);
    }

    update(time, delta) {
        super.update(time, delta);
    }


    /*
    ************************************
    * ----------CUSTOM METHODS-------- *
    ************************************
     */
    // /***
    //  * For debugging purposes only
    //  */
    // debugCreate() {
    //     this.add.sprite(this.game.scale.width / 2, this.game.scale.height / 2, 'background')
    //         .setScrollFactor(0, 0);
    //     this.add.sprite(25, 45, 'ui-health', 0);
    //     this.add.sprite(50, 45, 'ui-health', 1);
    //     this.add.sprite(75, 45, 'player');
    //     this.add.sprite(100, 45, 'player-dead').play('player-dead-anim');
    //     this.add.sprite(125, 45, 'booster-health').play('booster-health-anim');
    // }

    createBackground() {
        return this.add.image(this.game.scale.width / 2, this.game.scale.height / 2, 'background')
            .setScrollFactor(0, 0);
    }

    /***
     * Create a player sprite at the specified xy coordinates
     * @param {number} x
     * @param {number} y
     * @returns {Phaser.Physics.Matter.Sprite}
     */
    createPlayer(x, y) {
        // TODO: Re-adjust collision box to exclude the legs
        return this.matter.add.sprite(x, y, 'player');
    }

    /***
     * Create and return an array of the ceiling anchors
     * @returns {[{MatterJS.BodyType}]}
     */
    createCeilingAnchors() {
        let anchors = [];
        for (let i = 0; i < this.game.scale.width; i++) {
            /** @type {MatterJS.BodyType} **/
            let anchor = this.matter.add.rectangle(i, -1, 1, 2);
            anchor.ignoreGravity = true;
            anchors.push(anchor);
        }
        return anchors;
    }
    /* End of custom methods */
}
