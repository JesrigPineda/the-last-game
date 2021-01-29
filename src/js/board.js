import Player from './player.js';
import Game from './game.js';
import { allistar, dark, darkSword, sword } from './assets';

Game.mapGenerator();
let audio = document.getElementById('startAudio');
const newGame = () => {
    
    audio.play();
    audio.volume = 0.3;

// The addClass () method adds one or more class names to the selected elements.
    $('header').addClass("animation");

// The css () method sets or returns one or more style properties for the selected elements.
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

// With on () we can assign events to the DOM elements
// assign the button newGame
$('#newGame').on('click', newGame);

$('#gameOverModal button').on('click', newGame);

$('#rulesBtn').on('click', () => {
    $('#rulesModal').addClass('open');
});

$('#closeRules').on('click', () => {
    $('#rulesModal').removeClass('open');
})

$('#playSound').on('click', () => {

    if(audio.paused){
        audio.play();
        audio.volume = 0.5;
        document.getElementById("sound").src="https://icongr.am/material/volume-high.svg?size=17&color=ffffff";
    }else{
        audio.pause();
        document.getElementById("sound").src="https://icongr.am/material/volume-low.svg?size=17&color=ffffff";
    }
})



