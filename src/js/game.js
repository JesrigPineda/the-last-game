import { shield, tower, ancientSword, mace, gun, axe} from './assets';

export default class Game {

  constructor(players) {
    this.players = players;
    this.mapTiles = document.querySelectorAll('#map > div')
    this.currentPlayer = null;
    
  }

  static mapGenerator = () => {
    let column = 0;
    let row = 1;

    let output = '';

    for (let index = 0; index < 81; index++) {
      column++;
      output += `<div data-row="${row}" data-column="${column}"></div>`

      if(column === 9) {
        column = 0;
        row++;
      }
    }

    document.querySelector('#map').innerHTML = output;

  }
  
  reset = () => {

    for (let index = 0; index < 12; index++) {
      this.placeItem(`<img src="${tower}"/>`, 'obstacle')
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

    this.placeItem(`<img src="${axe}" data-damage="15" />`, 'weapon')
    this.placeItem(`<img src="${ancientSword}" data-damage="20" />`, 'weapon')
    this.placeItem(`<img src="${mace}" data-damage="25" />`, 'weapon')
    this.placeItem(`<img src="${gun}" data-damage="30" />`, 'weapon')
  }

  newGame = () => {
    this.reset();

    this.currentPlayer = this.players[Math.floor(Math.random()*this.players.length)]

    this.detectTurn();

  }

  placeItem = (item, type) => {
    
    const randomNumber = Math.floor(Math.random()*81);
    const {row, column} = this.mapTiles[randomNumber].dataset;

    
    if( this.mapTiles[randomNumber].classList.contains("occupied")) {
      
      this.placeItem(item,type);

    }else {
       
      if(type === 'player') {

        if(this.players[0].position.row > 0) {
          if(this.detectPlayerDistance(Number(row), Number(column))) {
            // console.log('matched.');
            return this.placeItem(item, type);
          }
        }

        this.mapTiles[randomNumber].innerHTML = item.avatar;
        this.players[item.id - 1].position = {row, column};

        
        this.mapTiles[randomNumber].classList.add("occupied")
        this.mapTiles[randomNumber].classList.add(type)

      }else{

        if(type === 'obstacle'){

          if(this.detectObstacle(Number(row), Number(column))) {
            //console.log('detectObstacle: matched.');
            return this.placeItem(item, type);
          } 
        }
        this.mapTiles[randomNumber].innerHTML = item;
        this.mapTiles[randomNumber].classList.add("occupied")
        this.mapTiles[randomNumber].classList.add(type)
      }
    }
  }

  detectPlayerDistance = (row, column) => {


    // const p1r = Number(this.players[0].position.row);
    // const p1c = Number(this.players[0].position.column);

    // Call Stack se llena, y da error por llegar al limite
    // Si el jugador 1 esta en la fila 5 o columna 5 estara intentando posicionar hasta que sea mayor a 4
    // Maximum call stack size exceeded
      // if(Math.abs(p1r - row) <= 4 && Math.abs(p1c - column) <= 4) {
      //   // console.log(p1r, row);
      //   console.log('detectPlayer: row.' + Math.abs(p1r - row));
      //   console.log('detectPlayer: column.' +Math.abs(p1c - column));
      //   return true;
      // }
      // if(Math.abs(p1c - column) <= 4) {
      //   // console.log(p1c, column);
      //   // console.log('detectPlayer: column.' +Math.abs(p1c - column));
      //   return true;
      // }

    // return;

    // Verifico que en las esquinas del jugador 2 no se encuentre el jugador 1
    const northWest = document.querySelector(`[data-row="${row - 1}"][data-column="${column - 1}"]`);
    const northEast = document.querySelector(`[data-row="${row - 1}"][data-column="${column + 1}"]`);
    const southWest = document.querySelector(`[data-row="${row + 1}"][data-column="${column - 1}"]`);
    const southEast = document.querySelector(`[data-row="${row + 1}"][data-column="${column + 1}"]`);

    //console.log(northWest,northEast,southWest,southEast);

    if(northWest && northWest.classList.contains("player") || northEast && northEast.classList.contains("player") || southWest && southWest.classList.contains("player") || southEast && southEast.classList.contains("player")) 
    {
      return true;
    }

    // north
    for (let i = 1; i <= 4; i++) {
      let north = document.querySelector(`[data-row="${row - i}"][data-column="${column}"]`);
      //console.log(north);
      if(north && north.classList.contains("player")) {
          return true;      
      }
    }
    
    //south
    for (let i = 1; i <= 4; i++) {
      let south = document.querySelector(`[data-row="${row + i}"][data-column="${column}"]`);
      //console.log(south);
      if(south && south.classList.contains("player")) {
        return true;      
      }
    }
    
    //east 
    for (let i = 1; i <= 4; i++) {
      let east = document.querySelector(`[data-row="${row}"][data-column="${column + i}"]`);
      //console.log(east);
      if(east && east.classList.contains("player")) {
        return true;      
      }
    }

    //west
    for (let i = 1; i <= 4; i++) {
      let west = document.querySelector(`[data-row="${row}"][data-column="${column - i}"]`);
      //console.log(west);
      if(west && west.classList.contains("player")) {
        return true;      
      }
    } 
  }

  detectObstacle = (row, column) => {

    // for(let i = 1; i <= 2; i++ ){
      
    //   const r1 = document.querySelector(`[data-row="${row - i}"][data-column="${column}"]`);
    //   const r2 = document.querySelector(`[data-row="${row + i}"][data-column="${column}"]`);

    //   const c1 = document.querySelector(`[data-row="${row}"][data-column="${column - i}"]`);
    //   const c2 = document.querySelector(`[data-row="${row}"][data-column="${column + i}"]`);

    //   if(r1 && r1.classList.contains("obstacle") || r2 && r2.classList.contains("obstacle")) {
    //     console.log(r1,r2);
    //     return true
    //   }

    //   if(c1 && c1.classList.contains("obstacle") || c2 && c2.classList.contains("obstacle")) {
    //     console.log(c1,c2);
    //     return true
    //   }
    // }
   

    // return;

    // Verifico las esquinas
    const northWest = document.querySelector(`[data-row="${row - 1}"][data-column="${column - 1}"]`);
    const northEast = document.querySelector(`[data-row="${row - 1}"][data-column="${column + 1}"]`);
    const southWest = document.querySelector(`[data-row="${row + 1}"][data-column="${column - 1}"]`);
    const southEast = document.querySelector(`[data-row="${row + 1}"][data-column="${column + 1}"]`);

    if(northWest && northWest.classList.contains("obstacle") || northEast && northEast.classList.contains("obstacle") || southWest && southWest.classList.contains("obstacle") || southEast && southEast.classList.contains("obstacle")) 
    {
      return true;
    }

    const up = document.querySelector(`[data-row="${row - 1}"][data-column="${column}"]`);
    const left = document.querySelector(`[data-row="${row}"][data-column="${column - 1}"]`);
    const down = document.querySelector(`[data-row="${row + 1}"][data-column="${column}"]`);
    const right = document.querySelector(`[data-row="${row}"][data-column="${column + 1}"]`);

    if( up && up.classList.contains("obstacle") || left && left.classList.contains("obstacle") || down && down.classList.contains("obstacle") || right && right.classList.contains("obstacle")){
        return true;   
      }

            return false;

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

    document.getElementById('startAudio').pause();
    document.getElementById('fightAudio').play();
    document.getElementById('fightAudio').volume = 0.2;

    const attacker = this.currentPlayer;
    const opponent = attacker.id === 1 ? this.players[1] : this.players[0];
    console.log(attacker,opponent);
    //this.currentPlayer = attacker.id === 1 ? this.players[1] : this.players[0];
    //const opponent = this.currentPlayer;

    document.querySelector(`#player${attacker.id}`).classList.remove("current");
    document.querySelector(`#player${opponent.id}`).classList.add("current");


    const fightModal = document.querySelector('#fightModal');
    
    setTimeout(() => {fightModal.classList.add('open')}, 500);

    document.querySelector('#avatar').innerHTML = opponent.avatar;
    document.querySelector('#attacker').innerHTML = attacker.name;
    document.querySelector('#avatar-name').innerHTML = opponent.name;
    document.querySelector('#avatar-health').innerHTML = opponent.health;

    // document.querySelector(`#p${attacker.id}-shield-status`).innerHTML = 'Unprotected';
    // document.querySelector(`#p${attacker.id}-shield-image`).classList.remove('protecting');

    const retreat = () => {

      document.querySelector('#defend').removeEventListener('click', defend);
      document.querySelector('#attack').removeEventListener('click', attack);

      fightModal.classList.remove('open'); 

      const health = attacker.health - (opponent.weapon.damage/2);
      
      this.players[attacker.id -1].health = health;

      document.querySelector(`#p${attacker.id}-health`).innerHTML = health; 

      if(this.gameOver(attacker, opponent)) return;

      document.getElementById('fightAudio').pause();
      document.getElementById('fightAudio').currentTime = 0;
      document.getElementById('startAudio').play();

      this.playerMoves();

    }

    const defend = () => {

      document.querySelector('#retreat').removeEventListener('click', retreat);
      document.querySelector('#attack').removeEventListener('click', attack);

      fightModal.classList.remove('open'); 
      
      document.querySelector(`#p${attacker.id}-shield-status`).innerHTML = 'Protected';
      document.querySelector(`#p${attacker.id}-shield-image`).classList.add('protecting');

      this.currentPlayer = attacker.id === 1 ? this.players[1] : this.players[0];
      this.fight()
      // const health = opponent.health - attacker.weapon.damage/2;

      // this.players[opponent.id -1].health = health;

      // document.querySelector(`#p${opponent.id}-health`).innerHTML = health; 

      // if(this.gameOver(attacker, opponent)) return;

      // document.getElementById('fightAudio').pause();
      // document.getElementById('fightAudio').currentTime = 0;
      // document.getElementById('startAudio').play();

      // this.playerMoves();

    }

    const attack = () => {

      document.querySelector('#retreat').removeEventListener('click', retreat);
      document.querySelector('#defend').removeEventListener('click', defend);

      fightModal.classList.remove('open'); 
     
      document.querySelector(`#p${attacker.id}-shield-status`).innerHTML = 'Unprotected';
      document.querySelector(`#p${attacker.id}-shield-image`).classList.remove('protecting');
      
      let health = opponent.health;
      
      if(document.querySelector(`#p${opponent.id}-shield-image`).classList.contains("protecting"))
      {
        health = health - attacker.weapon.damage/2;
        console.log("Protected");
      }else
      {
         health = health - attacker.weapon.damage;
         console.log("No Protected");
      }

      this.players[opponent.id -1].health = health;

      document.querySelector(`#p${opponent.id}-health`).innerHTML = health; 

      if(this.gameOver(attacker, opponent)) return;

      this.currentPlayer = attacker.id === 1 ? this.players[1] : this.players[0];
      this.fight()

    }

    document.querySelector('#retreat').addEventListener('click', retreat,{once: true})

    document.querySelector('#defend').addEventListener('click', defend, {once: true})

    document.querySelector('#attack').addEventListener('click', attack,{once: true})

  }

  gameOver = (attacker, opponent) => {
    if(opponent.health <= 0) {

      document.getElementById('fightAudio').pause();
      document.getElementById('fightAudio').currentTime = 0;

      const gameOverModal = document.querySelector('#gameOverModal');
      gameOverModal.classList.add('open');

      document.querySelector('#gameOverModal p:first-of-type').innerHTML = `${attacker.name}, you have won the game :)`;
      document.querySelector('#gameOverModal p:last-of-type').innerHTML = `${opponent.name}, you have lost the game :(`;

      return true
    }
  }

}
