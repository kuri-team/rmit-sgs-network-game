// Enable adaptive scaling on multiple screen sizes
let aspectRatio = window.innerHeight / window.innerWidth;
if (aspectRatio > 0.75) {
    aspectRatio = 0.75;  // Default aspect ratio 4:3 for horizontal mode
}
if (screen.availWidth < screen.availHeight) {
    aspectRatio = 0.5625;  // Default aspect ratio 16:9 for horizontal mode
}


/***
 * IMPORTANT: Only adjust game balance via this object
 * ***/
const GAMESETTINGS = {
    backgroundColor: '#cdcdcd',
    nativeWidth: 160,
    nativeHeight: 160 * aspectRatio,
    scaleFactor: 10,  // Scale the pixel art sprites up for smoother graphics
    player: {
        mass: 0.15,
        bounce: 0.95,
        initialForce: {
            x: 0,
            y: 0
        },
        initialX: 40,
        initialY: 160 * aspectRatio * 0.55,
        webOverhead: 10,  // Spider web shooting distance (Set 0 to shoot at the anchor directly above the player)
        webColor: 0xffffff  // Color of the spider web
    },
    gameplay: {
        scoreFactor: 1000,
        scalingDifficultyFactor: 2,  // Cannot be larger than maximumGap
        startingHealth: 3,
        initialSafeZone: 0,  // The initial zone where no obstacles will be generated
        obstacleOverhead: 10,  // Number of obstacles rendered ahead of time. Heavily affect performance
        distanceBetweenObstacles: 32,  // 32 is the width of the obstacle sprite TODO: more scalable approach?
        minimumGap: 68,
        maximumGap: 160 * aspectRatio * 1.1,
        obstaclesYDeviation: 160 * aspectRatio * 0.1
    },
    gravity: {
        x: 0,
        y: 0.15
    },
    controlSensitivity: 0.00015,
    gameOverDelay: 500,  // Delay before displaying game over screen
    debug: false
};

export default GAMESETTINGS;
