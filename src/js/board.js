import Player from './player.js';
import Game from './game.js';
import { allistar, dark, darkSword, sword } from './assets';

Game.mapGenerator();


const newGame = () => {
    document.getElementById('startAudio').play();
    document.getElementById('startAudio').volume = 0.3;

    document.querySelector('header').classList.add("animation");
    document.getElementById("board").style.display = "block";

    Game.mapGenerator();

    for (const modal of document.querySelectorAll('.modal')) {
        modal.classList.remove('open')
    }


    const playerOne = new Player('Allistar', allistar, sword).generate();
    const playerTwo = new Player('Dark', dark, darkSword, playerOne.id).generate();


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

document.querySelector('#playSound').addEventListener('click', () => {
    
    if(document.getElementById('startAudio').paused){
        document.getElementById('startAudio').play();
        document.getElementById('startAudio').volume = 0.5;
        document.getElementById("sound").src="https://icongr.am/material/volume-high.svg?size=17&color=ffffff";
    }else{
        document.getElementById('startAudio').pause();
        document.getElementById("sound").src="https://icongr.am/material/volume-low.svg?size=17&color=ffffff";
    }
});


