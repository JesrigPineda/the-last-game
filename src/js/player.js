export default class Player {
  constructor(name, avatar, weapon, lastId = 0) {
    this.name = name;
    this.avatar = avatar;
    this.weapon = weapon;
    this.lastId = lastId;
  }

  generate = () => {
    return {
      id: this.lastId + 1,
      name: this.name,
      avatar: `<img src="${this.avatar}"/>`,
      health: 100,
      position: { row: 0, colum: 0 },
      weapon: { image: `<img src="${this.weapon}" data-damage="10" />`, damage: 10, old: null},
      shield: false,
    };
  };
}
