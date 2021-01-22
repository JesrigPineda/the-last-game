import { shield, tower, ancientSword, mace, axe} from './assets';

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

    // I use a for loop to assign them their position in each of the boxes until reaching 9 columns to start over in the next row
    for (let index = 0; index < 81; index++) {
      column++;
      output += `<div data-row="${row}" data-column="${column}"></div>`;

      if(column === 9) {
        column = 0;
        row++;
      }
    }

    // insert the boxes
    document.querySelector('#map').innerHTML = output;

  }
  
   // Reset the game to initial values
  reset = () => {

    // el ciclo inserta los obstaculos, llama a placeItem
    for (let index = 0; index < 12; index++) {
      this.placeItem(`<img src="${tower}"/>`, 'obstacle')
    }

    //ciclo para insertar jugadores
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

    // Insertar armas
    this.placeItem(`<img src="${axe}" data-damage="20" />`, 'weapon');
    this.placeItem(`<img src="${ancientSword}" data-damage="30" />`, 'weapon');
    this.placeItem(`<img src="${mace}" data-damage="35" />`, 'weapon')
  
  }

  // start a new game
  newGame = () => {
    // call reset
    this.reset();

    // The turn is assigned randomly
    this.currentPlayer = this.players[Math.floor(Math.random()*this.players.length)]

    // call detectTurn
    this.detectTurn();

  }

  /* verifies the position in which said item will be inserted, if it is occupied,
  then call placeItem again to assign another place number to it
  if the type is a player, it will check if player 1 has already been inserted
  if player 1 is inserted then we verify that the assigned position does not
  is neither the same nor close to player 1
  */
  placeItem = (item, type) => {
  
    const randomNumber = Math.floor(Math.random()*81);
    const {row, column} = this.mapTiles[randomNumber].dataset;

    
    if( this.mapTiles[randomNumber].classList.contains("occupied")) {
      
      this.placeItem(item,type);

    }else {
       
      if(type === 'player') {

        if(this.players[0].position.row > 0) {
          if(this.detectPlayerDistance(Number(row), Number(column))) {
            
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
            
            return this.placeItem(item, type);
          } 
        }
        this.mapTiles[randomNumber].innerHTML = item;
        this.mapTiles[randomNumber].classList.add("occupied")
        this.mapTiles[randomNumber].classList.add(type)
      }
    }
  }

  /* verifies that the positions assigned to the players
  are not around */
  detectPlayerDistance = (row, column) => {

    const p1r = Number(this.players[0].position.row);
    const p1c = Number(this.players[0].position.column);

    // The Math.abs () function returns the absolute value of a number
    const yDistance = Math.abs(p1r - row);
    const xDistance = Math.abs(p1c - column)

    // Check if P1 is in same column and less than 4 steps away from P2
    if(p1c === column && yDistance <= 4) {
      // Check if there's a obstacle between two players
      for (let i = 1; i <= yDistance; i++) {
        if(p1r > row) {
          const y = document.querySelector(`[data-row="${p1r - i}"][data-column="${p1c}"]`);

          if(y && y.classList.contains("obstacle")) return false  
        }else{
          const y = document.querySelector(`[data-row="${p1r + i}"][data-column="${p1c}"]`);

          if(y && y.classList.contains("obstacle")) return false
        }
      }

      return true;
    }

    // Check if P1 is in same row and less than 4 steps away from P2
    if(p1r === row && xDistance <= 4) {

      // Check if there's a obstacle between two players
      for (let i = 1; i <= xDistance; i++) {
        if(p1c > column) {
          const x = document.querySelector(`[data-row="${p1r}"][data-column="${p1c - i}"]`);

          if(x && x.classList.contains("obstacle")) return false
        }else{
          const x = document.querySelector(`[data-row="${p1r}"][data-column="${p1c + i}"]`);

          if(x && x.classList.contains("obstacle")) return false
        }
      }

      return true;
    }

    if((xDistance === 1 && yDistance <= 3) || (yDistance === 1 && xDistance <= 3)) return true;
  }

  /* verifies that the positions assigned to the obstacles
  don't be around */
  detectObstacle = (row, column) => {

    // I check the corners
    const northWest = document.querySelector(`[data-row="${row - 1}"][data-column="${column - 1}"]`);
    const northEast = document.querySelector(`[data-row="${row - 1}"][data-column="${column + 1}"]`);
    const southWest = document.querySelector(`[data-row="${row + 1}"][data-column="${column - 1}"]`);
    const southEast = document.querySelector(`[data-row="${row + 1}"][data-column="${column + 1}"]`);

    if(northWest && northWest.classList.contains("obstacle") || northEast && northEast.classList.contains("obstacle") || southWest && southWest.classList.contains("obstacle") || southEast && southEast.classList.contains("obstacle")) 
    {
      return true;
    }

    // I check around each obstacle so they are not close
    const up = document.querySelector(`[data-row="${row - 1}"][data-column="${column}"]`);
    const left = document.querySelector(`[data-row="${row}"][data-column="${column - 1}"]`);
    const down = document.querySelector(`[data-row="${row + 1}"][data-column="${column}"]`);
    const right = document.querySelector(`[data-row="${row}"][data-column="${column + 1}"]`);

    if( up && up.classList.contains("obstacle") || left && left.classList.contains("obstacle") || down && down.classList.contains("obstacle") || right && right.classList.contains("obstacle")){
        return true;   
      }

            return false;

  }

  /* It is responsible for showing the user the change of the player's turn */
  detectTurn = () =>{

    if(document.querySelector(`.panel.current`)){
      document.querySelector(`.panel.current`).classList.remove("current");
    }
    document.querySelector(`#player${this.currentPlayer.id}`).classList.add("current");

    this.playerMoves();
  
  }

  /* Responsible for changing the player's turn */
  changeTurn = () => {
    if(this.currentPlayer.id === 1) {
      this.currentPlayer = this.players[1];
    }else{
      this.currentPlayer = this.players[0];
    }

    this.detectTurn()
  }

  /* He is in charge of painting the movements that each player has on the map */
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

  /* receives the click event, of which it is verified if there is a weapon in the position where it will click
  and if so, pick it up and change it both in the object and in the interface */
  movePlayer = (e) => {

    // I get the current position of the player
    const oldPos = document.querySelector(`[data-row="${this.currentPlayer.position.row}"][data-column="${this.currentPlayer.position.column}"]`);

     // I get the position that has been selected in the click event and extract the target
     // if nodeName is equal to IMG newPos is equal to the new position 
    const newPos = e.target.nodeName === "IMG" ? e.path[1] : e.target;

    oldPos.removeAttribute('class');

    if(this.currentPlayer.weapon.old) {
     oldPos.innerHTML = this.currentPlayer.weapon.old;
     oldPos.classList.add("weapon");

     this.players[this.currentPlayer.id - 1].weapon.old = null; 
    }else{
     oldPos.innerHTML = '';
    }

    // if nodeName is equal to IMG, the data is added in the object and in the interface
    if(e.target.nodeName === "IMG") {
      this.players[this.currentPlayer.id - 1].weapon = {image: e.target.outerHTML, damage: e.target.dataset.damage, old: this.currentPlayer.weapon.image};
      document.querySelector(`#p${this.currentPlayer.id}-weapon-image`).innerHTML = e.target.outerHTML;
      document.querySelector(`#p${this.currentPlayer.id}-weapon-damage`).innerHTML = e.target.dataset.damage;
    }

    // update the new position on the board
    newPos.innerHTML = this.currentPlayer.avatar;
    newPos.classList.add('player');
    newPos.classList.add('occupied');

    // the player object is updated, its new position
    this.players[this.currentPlayer.id - 1].position = {row: newPos.dataset.row, column: newPos.dataset.column}

    // events and classes that indicate movement to another square are removed
    for (const tile of document.querySelectorAll('.highlight')) {
      tile.classList.remove('highlight');
      tile.removeEventListener('click', this.movePlayer);
      
    };

    // if it detects a fight, fight is activated otherwise it changes the turn
    if(this.detectFight()) {
       
      this.fight();

    }else{
      this.changeTurn();

    }

  }

  /* It is in charge of detecting a battle, that is, it verifies if the other player is in any of its 4 lines, if so, a fight is activated */
  detectFight = () => {

    // I get the current position of the current player
    const row = Number(this.currentPlayer.position.row);
    const column = Number(this.currentPlayer.position.column);

    // get the adjacent player positions
    const north = document.querySelector(`[data-row="${row - 1}"][data-column="${column}"]`);
    const south = document.querySelector(`[data-row="${row + 1}"][data-column="${column}"]`);
    const east = document.querySelector(`[data-row="${row}"][data-column="${column + 1}"]`);
    const west = document.querySelector(`[data-row="${row}"][data-column="${column - 1}"]`);

     // if the other player is in any of these positions, a battle is activated
    if(north && north.classList.contains("player")) return true;

    if(south && south.classList.contains("player")) return true;
   
    if(east && east.classList.contains("player")) return true;
   
    if(west && west.classList.contains("player")) return true;
  }

  /* Take care of the fight, retreat, defend, attack */
  fight = () => {

    // start fight audio
    document.getElementById('startAudio').pause();
    document.getElementById('fightAudio').play();
    document.getElementById('fightAudio').volume = 0.2;

    // the attacker and opponent variables are assigned
    const attacker = this.currentPlayer;
    const opponent = attacker.id === 1 ? this.players[1] : this.players[0];

    document.querySelector(`#player${attacker.id}`).classList.remove("current");
    document.querySelector(`#player${opponent.id}`).classList.add("current");

    const fightModal = document.querySelector('#fightModal');

    // open the fight modal
    setTimeout(() => {fightModal.classList.add('open')}, 500);

    // data to display in the modal
    document.querySelector('#avatar').innerHTML = opponent.avatar;
    document.querySelector('#attacker').innerHTML = attacker.name;
    document.querySelector('#avatar-name').innerHTML = opponent.name;
    document.querySelector('#avatar-health').innerHTML = opponent.health;

    /* if you want to withdraw from the fight, the modal is closed and the player receives an attack from the opponent
    this is reflected in your table and registered in the object
     wondering if the player's life equals zero
     fight audio is paused
     the player who decided to withdraw from the fight can move again */
    const retreat = () => {

      // we remove the active events
      document.querySelector('#defend').removeEventListener('click', defend);
      document.querySelector('#attack').removeEventListener('click', attack);

      fightModal.classList.remove('open'); 

      const health = attacker.health - opponent.weapon.damage;
      
      this.players[attacker.id -1].health = health;

      document.querySelector(`#p${attacker.id}-health`).innerHTML = health; 

      if(this.gameOver(attacker, opponent)) return;

      document.getElementById('fightAudio').pause();
      document.getElementById('fightAudio').currentTime = 0;
      document.getElementById('startAudio').play();

      this.playerMoves();

    }

    /* if the player defends himself, his protection shield will be activated and he will receive 50% damage in the next turn
    change the turn and return to the fight */
    const defend = () => {

      // we remove the active events
      document.querySelector('#retreat').removeEventListener('click', retreat);
      document.querySelector('#attack').removeEventListener('click', attack);

      fightModal.classList.remove('open'); 
      
      document.querySelector(`#p${attacker.id}-shield-status`).innerHTML = 'Protected';
      document.querySelector(`#p${attacker.id}-shield-image`).classList.add('protecting');

      this.currentPlayer = attacker.id === 1 ? this.players[1] : this.players[0];
      this.fight()


    }

    /* if the player attacks, if the attacker has the active shield this will be deactivated, if the opponent has the active shield
    The attack will be% 50 damage, if not, it will receive% 100, life is verified if it has not fallen to zero, it changes shifts
    and the fight is called again */
    const attack = () => {

       // we remove the active events
      document.querySelector('#retreat').removeEventListener('click', retreat);
      document.querySelector('#defend').removeEventListener('click', defend);

      fightModal.classList.remove('open'); 
     
      document.querySelector(`#p${attacker.id}-shield-status`).innerHTML = 'Unprotected';
      document.querySelector(`#p${attacker.id}-shield-image`).classList.remove('protecting');
      
      let health = opponent.health;
      
      if(document.querySelector(`#p${opponent.id}-shield-image`).classList.contains("protecting"))
      {
        health = health - attacker.weapon.damage/2;
      }else
      {
         health = health - attacker.weapon.damage;
      }

      this.players[opponent.id -1].health = health;

      document.querySelector(`#p${opponent.id}-health`).innerHTML = health; 

      if(this.gameOver(attacker, opponent)) return;

      this.currentPlayer = attacker.id === 1 ? this.players[1] : this.players[0];
      this.fight();

    }

    // I add option "once" in method options object to perform event callback and run only once
    document.querySelector('#retreat').addEventListener('click', retreat,{once: true})

    document.querySelector('#defend').addEventListener('click', defend, {once: true})

    document.querySelector('#attack').addEventListener('click', attack,{once: true})
    
  }

  /* It is responsible for showing a modal at the end of the game, that is, one of the 2 players his life reached 0 */
  gameOver = (attacker, opponent) => {

// if the opponent's life is equal to zero, the gamer over modal is activated and it shows who won and who lost also
     // of a button for a new game
    if(opponent.health <= 0) {

      document.getElementById('fightAudio').pause();
      document.getElementById('fightAudio').currentTime = 0;

      const gameOverModal = document.querySelector('#gameOverModal');
      gameOverModal.classList.add('open');

      document.querySelector('#gameOverModal p:first-of-type').innerHTML = `${attacker.name}, you have won the game :)`;
      document.querySelector('#gameOverModal p:last-of-type').innerHTML = `${opponent.name}, you have lost the game :(`;

      return true
    }

    // if the attacker's life is equal to zero, the gamer over modal is activated and it shows who won and who lost
    if(attacker.health <= 0) {
      document.getElementById('fightAudio').pause();
      document.getElementById('fightAudio').currentTime = 0;

      const gameOverModal = document.querySelector('#gameOverModal');
      gameOverModal.classList.add('open');

      document.querySelector('#gameOverModal p:first-of-type').innerHTML = `${opponent.name}, you have won the game :)`;
      document.querySelector('#gameOverModal p:last-of-type').innerHTML = `${attacker.name}, you have lost the game :(`;

      return true
    }
  }

}
