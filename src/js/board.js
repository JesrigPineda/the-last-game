import Player from './player.js';
import Game from './game.js';
import { allistar, dark, knife } from './assets';

const playerOne = new Player('Allistar', allistar, knife).generate();
const playerTwo = new Player('Dark', dark, knife, playerOne.id).generate();

Game.mapGenerator();

const game = new Game([playerOne, playerTwo]);
// to start new game
document
.querySelector('#newGame')
.addEventListener('click', game.newGame);


