import faker from "./faker.min";
import tmi from "tmi.js";

export const game = {
	wordElement: null,
	word: "",
	isAlive: true,
	isGameInProgress: false,
	isWon: false,
	letters: {
		correct: [],
		incorrect: []
	},
	bodyParts: {
		head: false,
		torso: false,
		lArm: false,
		rArm: false,
		lLeg: false,
		rLeg: false
	},
	numberOfGuesses: 6,
}

export function clientSay(message = "") {
	console.log(message);
	client.say("#gacbl", message);
}

export function generateWord() {
	return faker.lorem.word();
}

export function getWord() {
	let word = "";

	do {
		word = generateWord();
	} while (word.length < 5);

	return word;
}

export function guess(letter = "", user = {}) {
	letter = letter.toLowerCase();

	if (game.isWon || !game.isAlive || !game.isGameInProgress) {
		clientSay(`Hey ${user.username}, the game has ended. You can start a new one by typing !play hangman in chat!`);
		gameWon("");
	}

	if (game.letters.correct.includes(letter)) {
		clientSay(`Hey ${user.username}, the letter ${letter} was already guessed`);
		return;
	}
	if (game.letters.incorrect.includes(letter)) {
		clientSay(`Hey ${user.username}, the letter ${letter} was already guessed`, user);
		return;
	}

	if (!letter.match(/[a-zA-Z]/)) {
		clientSay(`Hey ${user.username}, only letters are allowed!`, user);
		return false;
	}

	if (letter.length > 1 && game.word.toLowerCase() === letter) {
		game.isWon = true;
		return false;
	}

	if (game.word.toLowerCase().includes(letter)) {
		game.letters.correct = [...game.letters.correct, letter];
		clientSay(`Hey ${user.username}, the letter '${letter}' does exist.`, user);
	} else {
		clientSay(`Hey ${user.username}, sorry but the letter '${letter}' doesn't exist.`, user);
		game.letters.incorrect = [...game.letters.incorrect, letter];

		for (const part in game.bodyParts) {
			if (!game.bodyParts[part]) {
				game.bodyParts[part] = true;
				break;
			}
		}
	}
	game.isAlive = isAlive();
}

//TODO: Make it pretty
export function isAlive() {
	let isAlive = false;
	for (const part in game.bodyParts) {
		if (!game.bodyParts[part]) {
			isAlive = true;
		}
	}

	return isAlive;
}

export function startGame(user = {}) {
	if (game.isGameInProgress) {
		clientSay(`Hey ${user.username}, the game is already in progress.`);
		return;
	}

	game.isGameInProgress = true;
	game.isAlive = true;
	game.isWon = false;
	game.word = getWord();

	console.log(`Word is: ${game.word}`);

	Object.keys(game.bodyParts).forEach(part => game.bodyParts[part] = false);
	game.letters.correct = [];
	game.letters.incorrect = [];
}

export function gameOver() {
	if (!game.isAlive) {
		game.wordElement.innerText = `GAME OVER! The correct word was: ${game.word}`;
		game.isGameInProgress = false;
		game.isAlive = false;
	}
}

export function gameWon(username = "") {
	if (!game.isAlive) {
		return;
	}

	let message = `CORRECT! The word was ${game.word}.`;
	if (username !== "") {
		message += `${username} guessed it right. :)`;
	}

	clientSay(message);
	game.wordElement.innerText = message;
	game.isGameInProgress = false;
	game.isWon = true;
}

export const client = new tmi.Client({
	options: {debug: true},
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: process.env.BOT_NAME,
		password: process.env.BOT_TOKEN
	},
	channels: ["#gacbl"]
});

client.connect().catch(err => console.error(err));
client.on('message', (channel, tags, message, self) => {
	if (self) {
		return;
	}

	if (message.toLowerCase() === '!play hangman') {
		window.start(tags);
	}

	if (message.toLowerCase().startsWith("!attempt")) {
		const arg = message.split(" ")[1];
		guess(arg, tags);
	}
});
