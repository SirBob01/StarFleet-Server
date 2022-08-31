import { Entity } from './Entity';

/**
 * All ship class types
 */
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

/**
 * Ship entity
 */
class Ship extends Entity {
  // Ship class
  type: string;

  constructor(
    x: number,
    y: number,
    ownerId: string,
    angle: number,
    type: ShipType
  ) {
    super(x, y, shipTypes[type].size, angle, shipTypes[type].health, ownerId);
    this.type = type;
  }
}

export { Ship };
