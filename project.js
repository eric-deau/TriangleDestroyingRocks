var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
const height = 750;
const width = 1000;
let laserLimit = 3;
let currentLasers = 0;
let highScore = 0;
let currentScore = 0;
let randX = Math.floor(Math.random() * 1000) + 5;
let asteroidSpeed = 3;
let survivalTime = 0;
let survivalTimer;
var startGame = false;
let asteroidSpawn = false;
var keyState = {};

let starArr = new Array();
let blasterArr = new Array();
asteroidArray = new Array()

function setUp() {
	spaceShip = new Ship(500, 700);
	spaceShip.draw();
	setInterval(moveStuff, 10);

	for (i = 0; i <= 100; i++) {
		let star = new Star(Math.floor(Math.random() * width), Math.floor(Math.random() * height), Math.floor(Math.random() * 5));
		starArr.push(star);
		star.draw();
	}

	addEventListener("keydown", function (e) {
		keyState[e.keyCode] = true;
	}, true)
	addEventListener("keyup", function (e) {
		keyState[e.keyCode] = false;
	}, true)


	moveLoop();
	addEventListener("keyup", function (e) {
		if (startGame == true) {
			if (e.keyCode == 32) { // laser
				if (currentLasers < laserLimit) {
					let laser = new Blaster(spaceShip.x, spaceShip.y);
					currentLasers++;
					blasterArr.push(laser);
				}
				ctx.clearRect(0, 0, width, height);
				spaceShip.draw();

				//redraw laser
				for (i = 0; i < blasterArr.length; i++) {
					blasterArr[i].draw();
	
				}
				//redraw stars
				for (i = 0; i < starArr.length; i++) {
					starArr[i].draw();
				}
				//redraw asteroids
				for (let g = 0; g < asteroidArray.length; g++) {
					asteroidArray[g].y += asteroidSpeed;
					asteroidArray[g].draw();
				}
			}
		
		}
	})
	canvas.style.visibility = 'hidden';
}

// ship movement
function moveLoop() {
	if (startGame == true) {
		//left
		if (keyState[37]) {
			spaceShip.x -= 3;
			if (spaceShip.x < 0)
				spaceShip.x = 0;
		}
		//right
		if (keyState[39]) {
			spaceShip.x += 3;
			if (spaceShip.x > width)
				spaceShip.x = width;
		}
		//up
		if (keyState[38]) {
			spaceShip.y -= 3;
			if (spaceShip.y < 0)
				spaceShip.y = 0;;
		}
		//down
		if (keyState[40]) {
			spaceShip.y += 3;
			if (spaceShip.y > height - 25)
				spaceShip.y = height - 25;
		}
	}
		setTimeout(moveLoop, 10);
}

// draw loop
function moveStuff() {
	ctx.clearRect(0, 0, width, height);
	spaceShip.draw();

	// blaster collision detection
	for (let i = 0; i < asteroidArray.length; i++) {
		for (let i = 0; i < asteroidArray.length; i++) {
			for (let b = 0; b < blasterArr.length; b++) {
				const asteroid = asteroidArray[i];
				const blaster = blasterArr[b];
				if (
					asteroid.x < blaster.x + blaster.w &&
					asteroid.x + asteroid.w > blaster.x &&
					asteroid.y < blaster.y + blaster.h &&
					asteroid.y + asteroid.h > blaster.y
				) {
					asteroidArray.splice(i, 1);
					blasterArr.splice(b, 1);
					currentLasers--;
					currentScore++;
					i--; // decrement i to account for the removed asteroid
					break; // exit the inner loop since a collision has occurred
				}
			}
		}
	}

	//ship collision detection
	for (let i = 0; i < asteroidArray.length; i++) {
		const asteroid = asteroidArray[i];

		if (
			asteroid.x < spaceShip.x + 15 &&
			asteroid.x + asteroid.w > spaceShip.x &&
			asteroid.y < spaceShip.y + 25 &&
			asteroid.y + asteroid.h > spaceShip.y
		) {
			lose();
			break;
		}
	}
	//redraw score
	redrawScore();

	//redraw laser
	for (i = 0; i < blasterArr.length; i++) {
		blasterArr[i].y -= 5;
		blasterArr[i].draw();
		spaceShip.draw();
		if (blasterArr[i].y < -5) {
			currentLasers--;
			blasterArr.splice(i, 1);
		}
	}

	//redraw stars
	for (i = 0; i < starArr.length; i++) {
		starArr[i].y -= 1;
		starArr[i].draw();
		spaceShip.draw();
		if (starArr[i].y < -5) {
			starArr[i].y = height + 5;
		}
	}
	//Remove asteroid from array if leave canvas
	for (let i = 0; i < asteroidArray.length; i++) {
		asteroidArray[i].draw()
		if (asteroidArray[i].y >= 800) {
			asteroidArray.splice(i, 1);
		}
	}

	//Redraw asteroids	
	for (let g = 0; g < asteroidArray.length; g++) {
		asteroidArray[g].y += asteroidSpeed;
		asteroidArray[g].draw();
	}


}

// classes
function Star(x, y, size) {
	this.x = x;
	this.y = y;
	this.size = size;

	this.draw = function () {
		ctx.fillStyle = "lightgrey";
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();
	}
}

function Blaster(x, y) {
	this.x = x;
	this.y = y;
	this.w = 1;
	this.h = 10;

	this.draw = function () {
		ctx.fillStyle = "green";
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.beginPath();
		ctx.fillRect(0, -10, this.w, this.h);
		ctx.fill();
		ctx.restore();
	}
}

function Ship(x, y) {
	this.x = x;
	this.y = y;

	this.draw = function () {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(Math.PI / 180);
		ctx.translate(0, 0);
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.rotate(-30 * Math.PI / 180);
		ctx.moveTo(0, 0);
		ctx.lineTo(0, 25);
		ctx.rotate(60 * Math.PI / 180);
		ctx.lineTo(0, 25);
		ctx.lineTo(0, 0);
		ctx.fill();
		ctx.restore();

		ctx.save();
		ctx.fillStyle = "red"; //nose
		ctx.translate(this.x, this.y);
		ctx.rotate(Math.PI / 180);
		ctx.translate(0, 0);
		ctx.beginPath();
		ctx.rotate(-30 * Math.PI / 180);
		ctx.moveTo(0, 0);
		ctx.lineTo(0, 5);
		ctx.rotate(60 * Math.PI / 180);
		ctx.lineTo(0, 5);
		ctx.lineTo(0, 0);
		ctx.fill();

		ctx.fillStyle = "blue"; //eye
		ctx.beginPath();
		ctx.arc(7.5, 12.5, 2.5, 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();
	}
}

// functions
function startTick() {
	canvas.style.visibility = 'visible';
	document.getElementById("insertCoin").style.visibility = 'hidden';
	if (startGame == false) {
		startGame = true;
		asteroidTick = setInterval(drawAsteroid, 500)
		survivalTimer = setInterval(function () {
			survivalTime++;
			if (survivalTime == 20) {
				asteroidSpeed += 0.1;
			} else if (survivalTime == 40) {
				asteroidSpeed += 0.2;
			} else if (survivalTime == 60) {
				asteroidSpeed += 0.3;
			}
			else if (survivalTime == 120) {
				asteroidSpeed += 1;
			}
		}, 1000)
	} else {
		alert("Game already started!");
	}
}

function redrawScore() {
	ctx.font = ("40px Courier New");
	ctx.fillStyle = `rgb(255, 0, 0)`;
	ctx.fillText("High Score: " + highScore, 10, 40);
	ctx.fillText("Current Score: " + currentScore, 10, 80);
	ctx.fillText("Time Survived: " + survivalTime, 10, 120);
}

function drawAsteroid() {
	let a = new asteroid(randX, 15);
	a.draw()
	asteroidArray.push(a);
}

function asteroid(x, y) {
	this.x = x;
	this.y = y;
	this.w = 20;
	this.h = 20

	this.draw = function () {
		randX = Math.floor(Math.random() * 1000) + 5;
		ctx.fillStyle = "gray";
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.beginPath();
		ctx.fillRect(0, -10, this.w, this.h);
		ctx.fill();
		ctx.restore();

	}
}

function lose() {
	if (currentScore > highScore) {
		highScore = currentScore;
	}
	alert("You lost! Your score was: " + currentScore);
	resetGame();
}


function resetGame() {
	ctx.clearRect(0, 0, 400, 400);
	clearInterval(asteroidTick);
	clearInterval(survivalTimer);
	clearInterval(moveStuff);
	currentScore = 0;
	survivalTime = 0;
	currentLasers = 0;
	asteroidArray = [];
	blasterArr = [];
	starArr = [];
	keyState = {};
	startGame = false;
	spaceShip = new Ship(500, 700);


	for (i = 0; i <= 100; i++) {
		let star = new Star(Math.floor(Math.random() * width), Math.floor(Math.random() * height), Math.floor(Math.random() * 5));
		starArr.push(star);
		star.draw();
	}

}

