import { shield, torre, sword, axe} from './assets';

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
      this.placeItem(`<img src="${torre}"/>`, 'obstacle')
    }
    this.placeItem(`<img src="${sword}"/>`, 'weapon')
    this.placeItem(`<img src="${axe}"/>`, 'weapon')

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

  playerMoves = () => {

    const row = Number(this.currentPlayer.position.row);
    const column = Number(this.currentPlayer.position.column);

    
    // north
    const north1 = document.querySelector(`[data-row="${row - 1}"][data-column="${column}"]`);
    const north2 = document.querySelector(`[data-row="${row - 2}"][data-column="${column}"]`);
    const north3 = document.querySelector(`[data-row="${row - 3}"][data-column="${column}"]`);

    if(north1) {
      if(!north1.classList.contains("obstacle")) {
        north1.classList.add('highlight');

        if(north2) {
          if(!north2.classList.contains("obstacle")) {
            north2.classList.add('highlight');

            if(north3) {
              if(!north3.classList.contains("obstacle")) {
                north3.classList.add('highlight');
              }
            }
          }
        }
      }
    }
    
    

    

    //south
    const south1 = document.querySelector(`[data-row="${row + 1}"][data-column="${column}"]`);
    const south2 = document.querySelector(`[data-row="${row + 2}"][data-column="${column}"]`);
    const south3 = document.querySelector(`[data-row="${row + 3}"][data-column="${column}"]`);
    
    if(south1) {
      if(!south1.classList.contains("obstacle")) {
        south1.classList.add('highlight');

        if(south2) {
          if(!south2.classList.contains("obstacle")) {
            south2.classList.add('highlight');

            if(south3) {
              if(!south3.classList.contains("obstacle")) {
                south3.classList.add('highlight');
              }
            }
          }
        }
      }
    }
    
    
    //east 
    const east1 = document.querySelector(`[data-row="${row}"][data-column="${column + 1}"]`);
    const east2 = document.querySelector(`[data-row="${row}"][data-column="${column + 2}"]`);
    const east3 = document.querySelector(`[data-row="${row}"][data-column="${column + 3}"]`);

    if(east1) {
      if(!east1.classList.contains("obstacle")) {
        east1.classList.add('highlight');

        if(east2) {
          if(!east2.classList.contains("obstacle")) {
            east2.classList.add('highlight');

            if(east3) {
              if(!east3.classList.contains("obstacle")) {
                east3.classList.add('highlight');
              }
            }
          }
        }
      }
    }
    
    
    //west
    const west1 = document.querySelector(`[data-row="${row}"][data-column="${column - 1}"]`);
    const west2 = document.querySelector(`[data-row="${row}"][data-column="${column - 2}"]`);
    const west3 = document.querySelector(`[data-row="${row}"][data-column="${column - 3}"]`);

    if(west1) {
      if(!west1.classList.contains("obstacle")) {
        west1.classList.add('highlight');

        if(west2) {
          if(!west2.classList.contains("obstacle")) {
            west2.classList.add('highlight');

            if(west3) {
              if(!west3.classList.contains("obstacle")) {
                west3.classList.add('highlight');
              }
            }
          }
        }
      }
    }
    
    

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
