import Player from './player.js';
import Game from './game.js';
import { allistar, dark, knife, sword } from './assets';

const playerOne = new Player('Allistar', allistar, knife).generate();
const playerTwo = new Player('Dark', dark, sword, playerOne.id).generate();

Game.mapGenerator();

const game = new Game([playerOne, playerTwo]);

// to start new game
document.querySelector('#newGame').addEventListener('click', game.newGame);

document.querySelector('#rulesBtn').addEventListener('click', () => {
    document.querySelector('#rulesModal').classList.add('open');
});

document.querySelector('#closeRules').addEventListener('click', () => {
    document.querySelector('#rulesModal').classList.remove('open');
});


