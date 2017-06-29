// Enemies our player must avoid
var Enemy = function() {

    //Set Random Initial Values for each Enemy
    this.setInitialValues();
   
    //Sprite Image
    this.sprite = 'images/enemy-bug.png';

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;

    if (this.detectCollision()) {
        player.setInitialValues();
    }

    this.outOfScreenDetection();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Detect if Enemy is off screen to restart running
Enemy.prototype.outOfScreenDetection = function() {
    if (this.x > ctx.canvas.width) {
        this.setInitialValues();
    }
};

Enemy.prototype.setInitialValues = function() {
    // Always offscreen left
    this.x = -101;

    //Randomize de lines (1, 2 or 3)
    this.runningLine = Math.floor(Math.random() * 3);

    //TESTING
    this.runningLine = 2;

    //Assign y value according to line assigned
    this.y = 60 + (83 * this.runningLine);

    //Random speed
    this.speed = (Math.floor(Math.random() * 3) + 1)  * 100;

    //TESTING
    this.speed = 100;
};


Enemy.prototype.detectCollision = function() {
    if (player.runningLine == this.runningLine) {
        if ((player.x + 84) >= this.x && (player.x + 17) <= (this.x + 101)) {
            return true;
        }
    }
    return false;
};

//Player Class
var Player = function() {
    
    this.setInitialValues();
    this.sprite = 'images/char-boy.png';
};


Player.prototype.update = function() {};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(direction) {
    //CONSTANTS
    var PLAYER_MOVEMENT_X_PIXELS = 101;
    var PLAYER_MOVEMENT_Y_PIXELS = 83;

    switch (direction) {
        case 'left':
            if (this.x > 0) {
                this.x -= PLAYER_MOVEMENT_X_PIXELS;
            }
            break;
        case 'right':
            if (this.x < PLAYER_MOVEMENT_X_PIXELS * 4) {
                this.x += PLAYER_MOVEMENT_X_PIXELS;
            }
            break;
        case 'up':
            if (this.y > 380 - (PLAYER_MOVEMENT_Y_PIXELS * 5)) {
                this.y -= PLAYER_MOVEMENT_Y_PIXELS;
                this.runningLine -= 1
            }
            break;
        case 'down':
            if (this.y < 380) {
                this.y += PLAYER_MOVEMENT_Y_PIXELS;
                this.runningLine += 1
            }
            break;
    }

};

Player.prototype.setInitialValues = function() {
    this.x = 202;
    this.y = 380;
    this.runningLine = 4;
};



    

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var numberOfEnemies = 5;

//TESTING
var numberOfEnemies = 1;



for (i = 0; i < numberOfEnemies; i++){
    allEnemies.push(new Enemy);
}

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
