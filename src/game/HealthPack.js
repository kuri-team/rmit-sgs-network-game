import GAMESETTINGS from "../settings.js";


export default class HealthPack extends Phaser.Physics.Matter.Sprite {
    /***
     * Create a health pack at the specified position already scaled according to settings.js.
     * @param {Phaser.Physics.Matter.World} world
     * @param {number} x
     * @param {number} y
     * @return {HealthPack}
     */
    constructor(world, x, y) {
        super(world, x, y, 'health-pack');
        this.setScale(GAMESETTINGS.scaleFactor, GAMESETTINGS.scaleFactor);
        this.setSensor(true);
        this.setIgnoreGravity(true);
        this.setDepth(-1);
        this.scene.add.existing(this);
        return this;
    }

    /** @type {boolean} **/
    collected = false;
}