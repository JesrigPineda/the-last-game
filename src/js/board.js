import Player from './player.js';
import Game from './game.js';
import { allistar, dark, darkSword, sword } from './assets';

Game.mapGenerator();

const newGame = () => {
    
    document.getElementById('startAudio').play();
    document.getElementById('startAudio').volume = 0.3;

    $('header').addClass("animation");
    $("#board").css("display","block");

    Game.mapGenerator();

    // If there are modal windows, close them
    for (const modal of document.querySelectorAll('.modal')) {
        modal.classList.remove('open')
    }


    // instantiate player 1 and 2
    const playerOne = new Player('Allistar', allistar, sword).generate();
    const playerTwo = new Player('Dark', dark, darkSword, playerOne.id).generate();

    new Game([playerOne, playerTwo]).newGame();

}

// to start new game
$('#newGame').on('click', newGame);

$('#gameOverModal button').on('click', newGame);

$('#rulesBtn').on('click', () => {
    $('#rulesModal').addClass('open');
});

$('#closeRules').on('click', () => {
    $('#rulesModal').removeClass('open');
})

$('#playSound').on('click', () => {

    if(document.getElementById('startAudio').paused){
        document.getElementById('startAudio').play();
        document.getElementById('startAudio').volume = 0.5;
        document.getElementById("sound").src="https://icongr.am/material/volume-high.svg?size=17&color=ffffff";
    }else{
        document.getElementById('startAudio').pause();
        document.getElementById("sound").src="https://icongr.am/material/volume-low.svg?size=17&color=ffffff";
    }
})



