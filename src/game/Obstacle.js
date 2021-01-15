import GAMESETTINGS from "../settings.js";


export default class Obstacle extends Phaser.Physics.Matter.Image {
    /***
     * Create an obstacle at the specified position already scaled according to settings.js.
     * @param {Phaser.Physics.Matter.World} world
     * @param {number} x
     * @param {number} y
     * @return {Obstacle}
     */
    constructor(world, x, y) {
        super(world, x, y, 'obstacle');
        this.setScale(GAMESETTINGS.scaleFactor, GAMESETTINGS.scaleFactor);
        this.setStatic(true);
        this.scene.add.existing(this);
        return this;
    }
}
