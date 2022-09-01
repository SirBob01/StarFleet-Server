import { Color } from 'dynamojs-engine';
import { Socket } from 'socket.io';
import { EmitEvents, ListenEvents } from '../ServerTypes';
import { ShipTypes } from './Entities';
import { Game } from './Game';

/**
 * Defines the keyboard input data format from the client
 */
interface KeyInputData {
  /**
   * Key code
   */
  key: string;

  /**
   * Pressed or released?
   */
  pressed: boolean;
}

/**
 * Defines the mouse input data format from the client
 */
interface MouseInputData {
  /**
   * Mouse0 - Left mouse
   * Mouse1 - Middle mouse
   * Mouse2 - Right mouse
   */
  button: number;

  /**
   * Pressed or released?
   */
  pressed: boolean;
}

/**
 * Defines the pixel data received
 */
interface PixelData {
  /**
   * Total number of pixels = size * size
   */
  size: number;

  /**
   * Array of colors corresponding to the individual pixels
   */
  colors: Color[];
}

/**
 * Defines the sprite set of a player
 */
type SpriteSet = {
  [T in keyof ShipTypes]: PixelData;
};

/**
 * Generate a random name from the name word bank
 *
 * @returns new name
 */
function randomName() {
  const names = [
    'Dynamo',
    'Iron',
    'Spider',
    'Proto',
    'Neutron',
    'Star',
    'Saber',
    'Optimal',
    'Mega',
    'Zord',
    'Fighter',
    'Scout',
    'Master',
    'Padawan',
    'Wing',
    'Plasmic',
    'Sonic',
    'Transformer',
    'Bot',
    'Robot',
    'Man',
    'Core',
    'Figure',
    'Actor',
  ];
  const n1 = Math.floor(Math.random() * names.length);
  const n2 = Math.floor(Math.random() * names.length);
  return names[n1] + names[n2];
}

/**
 * Represents a player in the game
 */
class Player {
  socket: Socket<ListenEvents, EmitEvents>;

  game: Game | null;

  name: string;

  sprites: SpriteSet;

  resources: number;

  constructor(socket: Socket<ListenEvents, EmitEvents>) {
    this.socket = socket;
    this.game = null;

    this.name = randomName();
    this.sprites = {
      scout: {
        size: 0,
        colors: [],
      },
      fighter: {
        size: 0,
        colors: [],
      },
      carrier: {
        size: 0,
        colors: [],
      },
    };
    this.resources = 0;
  }

  /**
   * Handle mouse input
   *
   * @param mousedata
   */
  public handleMouse(mousedata: MouseInputData) {}

  /**
   * Handle keyboard input
   * @param keydata
   */
  public handleKeys(keydata: KeyInputData) {}
}

export { Player };
export type { KeyInputData, MouseInputData, PixelData, SpriteSet };
