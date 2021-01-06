/***
 * Game Over screen
 */
export default class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }

    /** @type {Phaser.GameObjects.Text} **/
    restart;

    /***
     *
     * @param {Object} data
     */
    create(data) {
        this.sound.add('game-over-audio').play();
        this.add.text(20, 20, `Game Over. Score: ${data.score}`, { fontSize: 90, fontFamily: 'Arial', backgroundColor: '#000' });
        this.restart = this.add.text(20, 150, 'Restart', { fontSize: 90, fontFamily: 'Arial', backgroundColor: '#000' });
        this.restart.setInteractive();
        this.input.on('gameobjectdown', () => { this.scene.start('runGame') }, this);
    }
}
