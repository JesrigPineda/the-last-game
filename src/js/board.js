import Player from './player.js';
import Game from './game.js';
import { allistar, dark, knife, sword } from './assets';

Game.mapGenerator();

const newGame = () => {

    for (const modal of document.querySelectorAll('.modal')) {
        modal.classList.remove('open')
    }


    const playerOne = new Player('Allistar', allistar, knife).generate();
    const playerTwo = new Player('Dark', dark, sword, playerOne.id).generate();


    new Game([playerOne, playerTwo]).newGame();

}

// to start new game
document.querySelector('#newGame').addEventListener('click', newGame);
document.querySelector('#gameOverModal button').addEventListener('click', newGame);

document.querySelector('#rulesBtn').addEventListener('click', () => {
    document.querySelector('#rulesModal').classList.add('open');
});

document.querySelector('#closeRules').addEventListener('click', () => {
    document.querySelector('#rulesModal').classList.remove('open');
});


