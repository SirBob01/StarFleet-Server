import { Entity } from './Entity';

type ShipType = 'scout' | 'fighter' | 'carrier';

const shipTypes = {
  scout: {
    size: 32,
    health: 15,
  },
  fighter: {
    size: 48,
    health: 25,
  },
  carrier: {
    size: 96,
    health: 50,
  },
};

class Ship extends Entity {
  ownerId: string;

  type: string;

  constructor(
    x: number,
    y: number,
    owner: string,
    angle: number,
    type: ShipType
  ) {
    super(x, y, shipTypes[type].size, angle, shipTypes[type].health);
    this.ownerId = owner;
    this.type = type;
  }
}

export { Ship };
