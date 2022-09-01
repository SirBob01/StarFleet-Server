import { Entity } from './Entity';

/**
 * Defines ship statistics
 */
interface ShipStatistics {
  size: number;
  health: number;
}

/**
 * Defines base statistics for each ship
 */
interface ShipTypes {
  scout: ShipStatistics;
  fighter: ShipStatistics;
  carrier: ShipStatistics;
}

/**
 * Base ship statistics
 */
const shipTypes: ShipTypes = {
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
class Ship<Type extends keyof ShipTypes> extends Entity {
  // Ship class
  type: Type;

  constructor(
    x: number,
    y: number,
    ownerId: string,
    angle: number,
    type: Type
  ) {
    super(x, y, shipTypes[type].size, angle, shipTypes[type].health, ownerId);
    this.type = type;
  }
}

export { Ship };
export type { ShipTypes };
