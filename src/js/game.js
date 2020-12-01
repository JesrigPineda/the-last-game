import { shield, tower, gun, axe} from './assets';

export default class Game {

  constructor(players) {
    this.players = players;
    this.mapTiles = document.querySelectorAll('#map > div')
    this.currentPlayer = null;
    
  }

  static mapGenerator = () => {
    let column = 0;
    let row = 1;

    for (let index = 0; index < 81; index++) {
      column++;
      document.querySelector('#map').innerHTML += `<div data-row="${row}" data-column="${column}"></div>`;

      if(column === 9) {
        column = 0;
        row++;
      }
    }
  }

  newGame = () => {
    this.reset();


    for (const player of this.players) {
      
      document.querySelector(`#p${player.id}-avatar`).innerHTML = player.avatar;
      document.querySelector(`#p${player.id}-name`).innerHTML = player.name;
      document.querySelector(`#p${player.id}-health`).innerHTML = player.health;
      document.querySelector(`#p${player.id}-weapon-image`).innerHTML = player.weapon.image;
      document.querySelector(`#p${player.id}-weapon-damage`).innerHTML = player.weapon.damage;
      document.querySelector(`#p${player.id}-shield-image`).innerHTML = `<img src="${shield}"/>`;
      document.querySelector(`#p${player.id}-shield-status`).innerHTML = player.shield ? "Protected" : "Unprotected";
     
      this.placeItem(player, 'player')
    
    }
    
    for (let index = 0; index < 15; index++) {
      this.placeItem(`<img src="${tower}"/>`, 'obstacle')
    }
    this.placeItem(`<img src="${axe}" data-damage="15" />`, 'weapon')
    this.placeItem(`<img src="${gun}" data-damage="20" />`, 'weapon')

    this.currentPlayer = this.players[Math.floor(Math.random()*this.players.length)]

    this.detectTurn();

  }

  detectTurn = () =>{
    //console.log(this.currentPlayer);
    //document.querySelector(`.panel.current`).classList.remove("current");

    if(document.querySelector(`.panel.current`)){
      document.querySelector(`.panel.current`).classList.remove("current");
    }
    document.querySelector(`#player${this.currentPlayer.id}`).classList.add("current");

    this.playerMoves();
    

  }

  changeTurn = () => {
    if(this.currentPlayer.id === 1) {
      this.currentPlayer = this.players[1];
    }else{
      this.currentPlayer = this.players[0];
    }

    this.detectTurn()
  }

  playerMoves = () => {

    const row = Number(this.currentPlayer.position.row);
    const column = Number(this.currentPlayer.position.column);

    //loop to display movable spots
    // north
    for (let i = 1; i <= 3; i++) {
      let north = document.querySelector(`[data-row="${row - i}"][data-column="${column}"]`);
      if(row < 0){
        break;//Break loop if we are out of the map, that is less than 0
      }
      if(north) {
        if(north.classList.contains("obstacle") || north.classList.contains("player")) {
          break;
        }else{
          north.classList.add('highlight');
          north.addEventListener('click', this.movePlayer);
        }
      }
    }
    
    //south
    for (let i = 1; i <= 3; i++) {
      let south = document.querySelector(`[data-row="${row + i}"][data-column="${column}"]`);
      if(row < 0){
        break;
      }
      if(south) {
        if(south.classList.contains("obstacle") || south.classList.contains("player")) {
          break;
        }else{
          south.classList.add('highlight');
          south.addEventListener('click', this.movePlayer);
        }
      }
    }
    
    //east 
    for (let i = 1; i <= 3; i++) {
      let east = document.querySelector(`[data-row="${row}"][data-column="${column + i}"]`);
      if(row < 0){
        break;
      }
      if(east) {
        if(east.classList.contains("obstacle") || east.classList.contains("player")) {
          break;
        }else{
          east.classList.add('highlight');
          east.addEventListener('click', this.movePlayer);

        }
      }
    }

    //west
    for (let i = 1; i <= 3; i++) {
      let west = document.querySelector(`[data-row="${row}"][data-column="${column - i}"]`);
      if(row < 0){
        break;
      }
      if(west) {
        if(west.classList.contains("obstacle") || west.classList.contains("player")) {
          break;
        }else{
          west.classList.add('highlight');
          west.addEventListener('click', this.movePlayer);
        }
      }
    } 


  } 

  movePlayer = (e) => {
    console.log(e);

    const oldPos = document.querySelector(`[data-row="${this.currentPlayer.position.row}"][data-column="${this.currentPlayer.position.column}"]`);

    const newPos = e.target.nodeName === "IMG" ? e.path[1] : e.target;

    oldPos.removeAttribute('class');
    if(this.currentPlayer.weapon.old) {
     oldPos.innerHTML = this.currentPlayer.weapon.old;
     oldPos.classList.add("weapon");

     this.players[this.currentPlayer.id - 1].weapon.old = null; 
    }else{
     oldPos.innerHTML = '';
    }

    if(e.target.nodeName === "IMG") {
      this.players[this.currentPlayer.id - 1].weapon = {image: e.target.outerHTML, damage: e.target.dataset.damage, old: this.currentPlayer.weapon.image};
      document.querySelector(`#p${this.currentPlayer.id}-weapon-image`).innerHTML = e.target.outerHTML;
      document.querySelector(`#p${this.currentPlayer.id}-weapon-damage`).innerHTML = e.target.dataset.damage;
    }

  


    newPos.innerHTML = this.currentPlayer.avatar;
    newPos.classList.add('player');
    newPos.classList.add('occupied');

    this.players[this.currentPlayer.id - 1].position = {row: newPos.dataset.row, column: newPos.dataset.column}

    for (const tile of document.querySelectorAll('.highlight')) {
      tile.classList.remove('highlight');
      tile.removeEventListener('click', this.movePlayer);
      
    };

    if(this.detectFight()) {
      console.log('Start a fight...');
      this.changeTurn();

    }else{
      this.changeTurn();

    }

  }

  detectFight = () => {
    if(true) return true;
  }

  reset = () => {
    for (const tile of this.mapTiles) {
      tile.innerHTML = "";
      tile.removeAttribute("class");
    }
  }
  
  placeItem = (item, type) => {
    // console.log(this.mapTiles)
    
    const randomNumber = Math.floor(Math.random()*81);
    if( this.mapTiles[randomNumber].classList.contains("occupied"))
    {
      this.placeItem(item,type);
    }else {
      if(type === 'player') {
        this.mapTiles[randomNumber].innerHTML = item.avatar;

        const {row, column} = this.mapTiles[randomNumber].dataset

        this.players[item.id - 1].position = {row, column};

      }else{
       this.mapTiles[randomNumber].innerHTML = item;

      }
       this.mapTiles[randomNumber].classList.add("occupied")
       this.mapTiles[randomNumber].classList.add(type)
    }
  }
}
