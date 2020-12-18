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

  
  reset = () => {
    for (const tile of this.mapTiles) {
      tile.innerHTML = "";
      tile.removeAttribute("class");
    }

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

    for (let index = 0; index < 10; index++) {
      this.placeItem(`<img src="${tower}"/>`, 'obstacle')
    }
    this.placeItem(`<img src="${axe}" data-damage="15" />`, 'weapon')
    this.placeItem(`<img src="${gun}" data-damage="20" />`, 'weapon')
  }

  newGame = () => {
    this.reset();


    this.currentPlayer = this.players[Math.floor(Math.random()*this.players.length)]

    this.detectTurn();

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
       
      this.fight();

    }else{
      this.changeTurn();

    }

  }

  detectFight = () => {

    const row = Number(this.currentPlayer.position.row);
    const column = Number(this.currentPlayer.position.column);

    const north = document.querySelector(`[data-row="${row - 1}"][data-column="${column}"]`);
    const south = document.querySelector(`[data-row="${row + 1}"][data-column="${column}"]`);
    const east = document.querySelector(`[data-row="${row}"][data-column="${column + 1}"]`);
    const west = document.querySelector(`[data-row="${row}"][data-column="${column - 1}"]`);


    if(north && north.classList.contains("player")) return true;

    if(south && south.classList.contains("player")) return true;
   
    if(east && east.classList.contains("player")) return true;
   
    if(west && west.classList.contains("player")) return true;
  }

  fight = () => {

    const attacker = this.currentPlayer;
    this.currentPlayer = attacker.id === 1 ? this.players[1] : this.players[0];
    const opponent = this.currentPlayer;

    document.querySelector(`#player${attacker.id}`).classList.remove("current");
    document.querySelector(`#player${opponent.id}`).classList.add("current");


    const fightModal = document.querySelector('#fightModal');
    
    setTimeout(() => {fightModal.classList.add('open')}, 500);

    document.querySelector('#avatar').innerHTML = opponent.avatar




    document.querySelector('#defend').addEventListener('click', () => {

      fightModal.classList.remove('open'); 
      document.querySelector(`#p${opponent.id}-shield-status`).innerHTML = 'Protected';
      document.querySelector(`#p${opponent.id}-shield-image`).classList.add('protecting');


      
      const health = opponent.health - attacker.weapon.damage/2;

      this.players[opponent.id -1].health = health;

      document.querySelector(`#p${opponent.id}-health`).innerHTML = health; 

      if(this.gameOver(attacker, opponent)) return;

      this.playerMoves();

    },{once: true})

    document.querySelector('#attack').addEventListener('click', () => {


      fightModal.classList.remove('open'); 
      document.querySelector(`#p${opponent.id}-shield-status`).innerHTML = 'Unprotected';
      document.querySelector(`#p${opponent.id}-shield-image`).classList.remove('protecting');

      
      const health = opponent.health - attacker.weapon.damage;

      this.players[opponent.id -1].health = health;

      document.querySelector(`#p${opponent.id}-health`).innerHTML = health; 

      if(this.gameOver(attacker, opponent)) return;

      this.fight()

    },{once: true})

  }

  gameOver = (attacker, opponent) => {
    if(opponent.health <= 0) {
      const gameOverModal = document.querySelector('#gameOverModal');
      gameOverModal.classList.add('open');

      document.querySelector('#gameOverModal p:first-of-type').innerHTML = `${attacker.name}, you have won the game :)`;
      document.querySelector('#gameOverModal p:last-of-type').innerHTML = `${opponent.name}, you have lost the game :(`;

      return true
    }
  }

}
