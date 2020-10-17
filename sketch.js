import {game, startGame, guess, gameOver, gameWon} from "./hangman";

window.setup = function() {
	frameRate(1);

	const canvas = createCanvas(400, 400);
	canvas.parent("hangman");

	game.wordElement = document.getElementById("word");
	window.game = game;
	startGame();
}
window.draw = function() {
	//background(color(255, 255, 255));
	strokeWeight(2);

	drawBase();
	drawHead();
	drawTorso();
	drawArm('L');
	drawArm('R');
	drawLeg('L');
	drawLeg('R');
	drawWord();
}
window.attempt = guess;
window.start = (user) => {
	frameRate(1);
	startGame(user);
}

//<editor-fold desc="Drawing functions">
function drawBase() {
	push();
	strokeWeight(4);

	line(50, 70, 50, 350);
	line(20, 350, 80, 350);
	line(30, 80, 120, 50);
	line(120, 50, 120, 90);

	pop();
}

function drawHead() {
	if (!game.bodyParts.head) {
		return;
	}

	push();
	noFill();
	ellipse(120, 115, 50, 50);
	pop();
}

function drawTorso() {
	if (!game.bodyParts.torso) {
		return;
	}
	push();
	strokeWeight(3);
	line(120, 140, 120, 220);
	pop();
}

function drawArm(side) {
	push();
	strokeWeight(2);

	if (side === "L" && game.bodyParts.lArm) {
		line(120, 150, 100, 200);
	} else if (side === "R" && game.bodyParts.rArm) {
		line(120, 150, 140, 200);
	}

	pop();
}

function drawLeg(side) {
	push();
	strokeWeight(2);

	if (side === "L" && game.bodyParts.lLeg) {
		line(120, 220, 100, 270);
	} else if (side === "R" && game.bodyParts.rLeg) {
		line(120, 220, 140, 270);
	}

	pop();
}

function drawWord() {
	if(game.isWon) {
		gameWon();
		frameRate(0);
		return false;
	}

	game.wordElement.innerText = "";
	game.word.split("").forEach(letter => {
		letter = letter.toLowerCase();
		if (game.letters.correct.includes(letter)) {
			game.wordElement.innerHTML += `${letter.toUpperCase()} `;
		} else {
			game.wordElement.innerHTML += "_ ";
		}
	});

	//document.getElementById("hint").innerText = game.word;

	if(game.wordElement.innerText.replaceAll(" ", "").toLowerCase() === game.word.toLowerCase()){
		game.isWon = true;
		return false;
	}

	gameOver();
}
//</editor-fold>
