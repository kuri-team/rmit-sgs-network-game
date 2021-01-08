/***
 * IMPORTANT: Only adjust game balance via this object
 * ***/
const GAMESETTINGS = {
    backgroundColor: '#c2c2c2',
    nativeWidth: 160,
    nativeHeight: 90,
    scaleFactor: 10,  // Scale the pixel art sprites up for smoother graphics
    player: {
        mass: 0.15,
        initialForce: {
            x: 0,
            y: 0
        },
        initialX: 40,
        initialY: 50,
        webOverhead: 10,  // Spider web shooting distance (Set 0 to shoot at the anchor directly above the player)
        webColor: 0xffffff  // Color of the spider web
    },
    gameplay: {
        scoreFactor: 1000,
        startingHealth: 3,
        initialSafeZone: 160,  // The initial zone where no obstacles will be generated
        obstacleOverhead: 10,  // Number of obstacles rendered ahead of time. Heavily affect performance
        distanceBetweenObstacles: 32,  // TODO: Find out why 32 works?
        minimumGap: 48,
        maximumGap: 90
    },
    gravity: {
        x: 0,
        y: 0.15
    },
    controlSensitivity: 0.00015,
    gameOverDelay: 500,  // Delay before displaying game over screen
    debug: true
};

export default GAMESETTINGS;
