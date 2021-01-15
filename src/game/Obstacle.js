import GAMESETTINGS from "../settings.js";


class Obstacle extends Phaser.Physics.Matter.Image {
    /***
     * Create an obstacle at the specified position already scaled according to settings.js
     * @param {number} x
     * @param {number} y
     * @return {Obstacle}
     */
    constructor(x, y) {
        super(x, y, 'obstacle');
        this.setScale(GAMESETTINGS.scaleFactor, GAMESETTINGS.scaleFactor);
        this.setPosition(this.x + this.displayWidth / 2, this.y - this.displayHeight / 2);  // Adjust center offset
        this.setStatic(true);
        return this;
    }
}


class Obstacles extends Array {
    /***
     * Generate and return a specified number of obstacles using settings provided by the parameters
     * @param {number} obstacleNumber
     * @param {number} minimumGap
     * @param {number} maximumGap
     * @return {Obstacles}
     */
    constructor(obstacleNumber, minimumGap, maximumGap) {
        super(obstacleNumber);
        this.obstaclesInfo = [];  // Initialization
        for (let i = 0; i < obstacleNumber; i++) {
            // Generate random height and gap according to settings.js
            let randomObstacleY = this.genRandomObstacleY(
                minimumGap,
                maximumGap,
            );

            // Generate 2 obstacle objects and place them at the generated random height and gap
            /** @type {Obstacle} **/
            let obstacle1 = new Obstacle(
                (GAMESETTINGS.gameplay.initialSafeZone + i * GAMESETTINGS.gameplay.distanceBetweenObstacles) * GAMESETTINGS.scaleFactor,
                randomObstacleY.y1 * GAMESETTINGS.scaleFactor
            );
            /** @type {Obstacle} **/
            let obstacle2 = new Obstacle(obstacle1.x, randomObstacleY.y2 * GAMESETTINGS.scaleFactor);

            // Append them to this array and add their info to this.obstacleInfo
            this.obstacles[i] = {
                ceilingObstacle: obstacle1,
                floorObstacle: obstacle2
            };
            this.obstaclesInfo.push({
                x: obstacle1.body.vertices[0].x,
                index: i
            });
        }
        return this;
    }

    /** @type {Array} **/
    obstaclesInfo;  // Containing objects { x: obstacle x position, index: obstacle index in this array }

    /***
     * Generate a random pair of Y coordinates for use of Obstacles generation
     * @param {number} minGap
     * @param {number} maxGap
     * @return {{y1: number, y2: number}}
     */
    genRandomObstacleY(minGap, maxGap) {
        let result = {
            y1: 0,
            y2: 0
        }
        result.y1 = Phaser.Math.Between(0, GAMESETTINGS.nativeHeight - minGap);
        result.y2 = result.y1 + Phaser.Math.Between(minGap, maxGap);

        return result;
    }

    /***
     * Return the ceiling obstacle above the player with specified x offset
     * @param {Phaser.Physics.Matter.Sprite} sprite
     * @param {number} xOffset
     * @return {Phaser.Physics.Matter.Image}
     */
    getObstacleAbove(sprite, xOffset) {
        let sortedObstacleInfo = this.sortObstaclesInfo();
        let resultObstacleIdx;
        for (let i = 0; i < sortedObstacleInfo.length; i++) {
            if (sortedObstacleInfo[i].x <= sprite.x + xOffset) {
                resultObstacleIdx = sortedObstacleInfo[i].index;
            }
        }
        return this[resultObstacleIdx][0];
    }

    /***
     * Return the unsorted obstaclesInfo
     * @return {Array}
     */
    getObstacleInfo() {
        return [...this.obstaclesInfo];
    }

    /***
     * Insertion sort this.obstacleInfo
     * @return {Array}
     */
    getSortedObstaclesInfo() {
        let result = [ ...this.obstaclesInfo ];
        for (let i = 0; i < result.length; i++) {
            while (i > 0 && result[i].x < result[i - 1].x) {
                // Swap using JS destructure assignment
                [
                    result[i], result[i - 1]
                ] = [
                    result[i - 1], result[i]
                ];
                i--;
            }
        }
        return result;
    }
}


export default {
    Obstacle,
    Obstacles,
};
