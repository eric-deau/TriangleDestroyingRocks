canvas = document.getElementById("myCanvas");
ctx = canvas.getContext("2d");
const height = 800;
const width = 1000;
let laserLimit = 3;
let currentLasers = 0;
let highScore = 0;
let currentScore = 0;
let randX = Math.floor(Math.random() * 1000) + 5;
let asteroidSpeed = 3;
let survivalTime = 0;
let survivalTimer;
let startGame = false;
let asteroidSpawn = false;
var keyState = {};

let starArr = new Array();
let blasterArr = new Array();
asteroidArray = new Array()

function collision(Blaster) {

}

function setUp() {
	spaceShip = new Ship(500, 750);
	spaceShip.draw();
	let Timer = setInterval(moveStuff, 10);
	ctx.font = ("30px Georgia");
	ctx.fillStyle = ("yellow");
	ctx.fillText("High Score: " + highScore, 10, 40);
	ctx.fillText("Current Score: " + currentScore, 10, 80);
	ctx.fillText("Time Survived: " + survivalTime, 10, 120);

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
	function moveLoop() {
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

		setTimeout(moveLoop, 10);
	}
	moveLoop();
	addEventListener("keyup", function (event) {
		if (event.keyCode == 32) { // laser
			if (currentLasers < laserLimit) {
				let laser = new Blaster(spaceShip.x, spaceShip.y);
				currentLasers++;
				blasterArr.push(laser);
			}
			ctx.clearRect(0, 0, width, height);
			spaceShip.draw();
			ctx.font = ("40px Georgia");
			ctx.fillStyle = ("yellow");
			ctx.fillText("High Score: " + highScore, 10, 40);
			ctx.fillText("Current Score: " + currentScore, 10, 80);
			ctx.fillText("Time Survived: " + survivalTime, 10, 120);
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
	})
}


function moveStuff() {
	ctx.clearRect(0, 0, width, height);
	spaceShip.draw();
	for (let i = 0; i < asteroidArray.length; i++) {

		for (let b = 0; b < blasterArr.length; b++) {
			if (asteroidArray[i].x < (blasterArr[b].x + asteroidArray[i].w) && asteroidArray[i].x > (blasterArr[b].x - asteroidArray[i].w) && asteroidArray[i].y < (blasterArr[b].y + blasterArr[b].h) && asteroidArray[i].y > (blasterArr[b].y - asteroidArray[i].y)) {
				console.log("Hit");
				asteroidArray.splice(i, 1);
				blasterArr.splice(b, 1);
				currentLasers--;
				highScore++;
				currentScore++;
			}

		}
		//s1 == asteroid s2 == Blaster
		//asteroid.y + asteroid.x , asteroid.x + asteroid.w, asteroid.y+ asteroid.h
	}
	//redraw score
	ctx.font = ("40px Georgia");
	ctx.fillStyle = ("yellow");
	ctx.fillText("High Score: " + highScore, 10, 40);
	ctx.fillText("Current Score: " + currentScore, 10, 80);
	ctx.fillText("Time Survived: " + survivalTime, 10, 120);

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
		ctx.fillStyle = "yellow";
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
function startTick() {
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
	} else if (startGame == true) {
		console.log("Already started");
	} else {
		console.log("test");
	}
}

function drawAsteroid() {
	let a = new asteroid(randX, 15);
	a.draw()
	asteroidArray.push(a);
	console.log(asteroidArray)
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

function collision(Blaster) {

	for (let i = 0; i < asteroidArray.length; i++) {
		let a = asteroidArray[i];


		if (Blaster.x + Blaster.w >= a.x && Blaster.x <= a.x + a.w && Blaster.y >= a.y && Blaster.y <= a.y + a.h) {
			console.log("Hit")
			asteroidArray.splice(i, 1)
		}
	}
}

function lose() {
	ctx.clearRect(0, 0, width, height);
	for (let g = 0; g < asteroidArray.length; g++) {
		asteroidArray[g].draw();
	}
	for (i = 0; i < starArr.length; i++) {
		starArr[i].y -= 1;
		starArr[i].draw();
		spaceShip.draw();
		if (starArr[i].y < -5) {
			starArr[i].y = height + 5;
		}
	}
	clearInterval(survivalTimer);
	clearInterval(moveStuff);
	currentScore = 0;
	survivalTime = 0;
	asteroidSpeed = 0.1;
}

//s1.x < s2.x < s1.x + s1.w T1
//s2.x + s2.w T2
//same for y, switch X with Y and W with H T3,T4

//asteroid.x < Blaster.x < asteroid.x + asteroid.w
//Blaster.x + Blaster.w

//asteroid.y < Blaster.y < asteroid.y+asteroid.h
//Blaster.y + Blaster.w



//T1									//T2
// if(asteroid.x < Blaster.x < asteroid.x + asteroid.w || Blaster.x + Blaster.w)

//T3									//T4
//if (asteroid.y < Blaster.y < asteroid.y+asteroid.h || Blaster.y + Blaster.w)

//if (T1 || T2) && (T3 || T4) 


function resetGame() {
	ctx.clearRect(0, 0, 400, 400);
	ctx.save();
	ctx.translate(width / 2, height / 2);
	ctx.rotate(-30 * Math.PI / 180);
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(0, 50);
	ctx.rotate(60 * Math.PI / 180);
	ctx.lineTo(0, 50);
	ctx.lineTo(0, 0);
	ctx.stroke();

	ctx.fillStyle = "red"; //nose
	ctx.beginPath();
	ctx.rotate(-60 * Math.PI / 180);
	ctx.moveTo(0, 0);
	ctx.lineTo(0, 10);
	ctx.rotate(60 * Math.PI / 180);
	ctx.lineTo(0, 10);
	ctx.lineTo(0, 0);
	ctx.fill();

	ctx.fillStyle = "blue"; //eye
	ctx.beginPath();
	ctx.arc(15, 25, 5, 0, 2 * Math.PI);
	ctx.fill();
	ctx.restore();
}

