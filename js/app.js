/**
* Game Parameters Object
*/
var gameParameters = {
    score: 0,
    speedDifficulty: 50;
};


/**
* Enemies our player mus avoid
*/
var Enemy = function() {
    //Set Random Initial Values for each Enemy
    this.setInitialValues();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    //Detect Collision with player
    //called with already rendered values to improve visualization
    if (this.detectCollision()) {
        player.setDead();
    }

    //Detect if enemy is out of screen to restart running
    //called with already rendered values to improve visualization
    this.outOfScreenDetection();

    //Moves x variable according to speed, ready to render
    this.x += this.speed * dt; 
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Detect if Enemy is offscreen (right) to restart running with another set of random values
Enemy.prototype.outOfScreenDetection = function() {
    if (this.x > ctx.canvas.width) {
        this.setInitialValues();
    }
};

//Set initial random values for enemies to start running
Enemy.prototype.setInitialValues = function() {
    //Sprite Image
    this.sprite = 'images/enemy-bug.png';

    // Always start offscreen left
    this.x = -101;

    //Randomize de line where enemy is going to run (0, 1, 2)
    this.runningLine = Math.floor(Math.random() * 3);

    //Assign "y" value according to line assigned
    this.y = 60 + (83 * this.runningLine);

    //Random speed according to difficulty level
    this.speed = (Math.floor(Math.random() * 3) + 1)  * gameParameters.speedDifficulty;
};

//Colision Detection for each enemy with the player
Enemy.prototype.detectCollision = function() {
    if (player.runningLine == this.runningLine && !player.isDead) {
        if ((player.x + 84) >= this.x && (player.x + 17) <= (this.x + 101)) {
            return true;
        }
    }
    return false;
};



//Player Class
var Player = function() {
    this.setInitialValues();
};


Player.prototype.update = function() {
    this.detectWin();
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(direction) {
    if (!player.canMove) {
        return;
    }

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
    this.isDead = false;
    this.isWinner = false;
    this.canMove = true;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.setDead = function() {
    this.isDead = true;
    this.canMove = false;
    this.sprite = 'images/char-boy-dead.png';
    setTimeout(function() {
        player.setInitialValues();
    }, 400);
};

Player.prototype.detectWin = function() {
    if (this.runningLine < 0 && !this.isWinner) {
        this.sprite = 'images/char-boy-winner.png';
        this.canMove = false;
        this.isWinner = true;
        gameParameters.score += 10;
        setTimeout(function() {
            player.setInitialValues();
        }, 1000);

    }
};

//Gem Class
var Gem = function() {
    this.x = 100;
    this.y = 100;
    this.sprite = 'images/gem-orange.png'
}

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
 

// Instantiate objects.
var allEnemies = [];
var numberOfEnemies = 3;

//Create an instance for each enemy 
for (i = 0; i < numberOfEnemies; i++){
    allEnemies.push(new Enemy);
}

//Instantiate player
var player = new Player();




//-*-*-*-*-* Listeners *-*-*-*-*-

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
