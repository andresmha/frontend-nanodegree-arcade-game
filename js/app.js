/**
* GENERAL GAME PARAMETERS OBBJECT
*/
var gameParameters = {
    score: 0,
    difficulty: 0,
    enemySpeed: 60,
    numberOfEnemies: 4,
    gemsActive: false
};

/**
* ENEMY CLASS AND ASSOCIATED METHODS
*/
var Enemy = function() {
    //Set Random Initial Values for each Enemy
    this.setInitialValues();
};

// Update the enemy's position
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
    this.speed = (Math.floor(Math.random() * 3) + 1)  * gameParameters.enemySpeed;
};

//Colision Detection for each enemy with the player
Enemy.prototype.detectCollision = function() {
    if (player.runningLine == this.runningLine && !player.isDead) {
        if ((player.x + 74) >= this.x && (player.x + 27) <= (this.x + 101)) {
            return true;
        }
    }
    return false;
};



/**
* PLAYER CLASS AND ASSOCIATED METHODS
*/
var Player = function() {
    this.setInitialValues();
};

//Updates Player
Player.prototype.update = function() {
    //detects if player is in winning area
    this.detectWin();
};

//Renders the player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Handle input arrow keys
Player.prototype.handleInput = function(direction) {
    //Detect if player is in a state that cannot move to ignore input
    if (!player.canMove) {
        return;
    }

    //CONSTANTS
    var PLAYER_MOVEMENT_X_PIXELS = 101;
    var PLAYER_MOVEMENT_Y_PIXELS = 83;

    //Moves accorging to input key, validating boundaries
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

//Sets initial values for the player 
Player.prototype.setInitialValues = function() {
    //Location on scrren
    this.x = 202;
    this.y = 380;

    //Water is no runningLine, the other ones start at 0 so 4 is the last running line of the game
    this.runningLine = 4;

    //Player state variables
    this.isDead = false;
    this.isWinner = false;
    this.canMove = true;

    //Sprite
    this.sprite = 'images/char-boy.png';
};

//When met an enemy, player should be temporarily dead
Player.prototype.setDead = function() {
    //Set deda status
    this.isDead = true;

    //Avoid player movement
    this.canMove = false;

    //Change sprite to show dead player
    this.sprite = 'images/char-boy-dead.png';

    //Sets a little time with this states before restarting values, this was made to give some feedback to the player
    setTimeout(function() {
        player.setInitialValues();
    }, 400);
};

//Detects if player won
Player.prototype.detectWin = function() {
    //Running lines start from top to bottom and from number 0 to 4.
    //if player is above those lines it is a winner
    if (this.runningLine < 0 && !this.isWinner) {
        //Changes sprite
        this.sprite = 'images/char-boy-winner.png';

        //Avoid moving with input keys
        this.canMove = false;

        //Set winner status temprarily
        this.isWinner = true;

        //Increases score and checks for difficulty 
        increaseScore(10);

        //Sets a little time with this state before restarting value. Meant to give feedback to player.
        setTimeout(function() {
            player.setInitialValues();
        }, 800);

    }
};


/**
* GENERAL FUNCTIONS
*/

//Create an instance for each enemy 
var addEnemies = function(enemiesToAdd) {
    //Create array if needed
    allEnemies = ( typeof allEnemies != 'undefined' && allEnemies instanceof Array ) ? allEnemies : [];

    //Add enemies to array
    for (i = 0; i < enemiesToAdd; i++){
        allEnemies.push(new Enemy);
    }
};

//Senses when to change difficulty depending on score and current difficulty level
var difficultySensor = function() {
    switch (true) {
        case (gameParameters.score >= 50 && gameParameters.score < 80 && gameParameters.difficulty == 0):
            gameParameters.difficulty += 1;
            gameParameters.enemySpeed += 25;
            break;
        case (gameParameters.score >= 80 && gameParameters.score < 110 && gameParameters.difficulty == 1):
            gameParameters.difficulty += 1;
            gameParameters.numberOfEnemies += 1;
            addEnemies(1);
            break;
        case (gameParameters.score >= 110 && gameParameters.score < 140 && gameParameters.difficulty == 2):
            gameParameters.difficulty += 1;
            gameParameters.enemySpeed += 25;
            break;
        case (gameParameters.score >= 140 && gameParameters.score < 170 && gameParameters.difficulty == 3):
            gameParameters.difficulty += 1;
            gameParameters.enemySpeed += 25;
            break;
        case (gameParameters.score >= 140 && gameParameters.score < 170 && gameParameters.difficulty == 4):
            gameParameters.difficulty += 1;
            gameParameters.numberOfEnemies += 1;
            addEnemies(1);
            break;
    }
};


//Changes score and checks if difficulty needs to be updated
var increaseScore = function(scoreToIncrease) {
    gameParameters.score += scoreToIncrease;
    difficultySensor();
};


/**
* EXECUTION
*/


//Instantiate Enemies and Player

//Add enemies
addEnemies(gameParameters.numberOfEnemies);

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
