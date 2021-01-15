import GAMESETTINGS from "../settings.js";


export default class Obstacle extends Phaser.Physics.Matter.Image {
    /***
     * Create an obstacle at the specified position already scaled according to settings.js
     * @param {Phaser.Physics.Matter.World} world
     * @param {number} x
     * @param {number} y
     * @param {string || Phaser.Textures.Texture} texture
     * @return {Obstacle}
     */
    constructor(world, x, y, texture) {
        super(world, x, y, texture);
        this.setScale(GAMESETTINGS.scaleFactor, GAMESETTINGS.scaleFactor);
        this.setStatic(true);
        this.scene.add.existing(this);
        return this;
    }
}
