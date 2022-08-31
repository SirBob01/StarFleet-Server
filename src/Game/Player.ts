import { Color } from 'dynamojs-engine';
import { Socket } from 'socket.io';
import { Game } from './Game';

const names = [
  'Dynamic',
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
  'Plasma',
  'Transformer',
  'Bot',
  'Robot',
  'Man',
  'Core',
  'Figure',
  'Actor',
];

/**
 * Generate a random name from the name word bank
 *
 * @returns new name
 */
function randomName() {
  const n1 = Math.floor(Math.random() * names.length);
  const n2 = Math.floor(Math.random() * names.length);
  return names[n1] + names[n2];
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

interface PixelData {
  //
  size: number;
  pixelData: Color[];
}

/**
 * Represents a player in the game
 */
class Player {
  socket: Socket;

  game: Game | null;

  name: string;

  pixelData: { scout: null | PixelData; fighter: null | PixelData; carrier: null | PixelData };

  resources: number;

  constructor(socket: Socket) {
    this.socket = socket;
    this.game = null;

    this.name = randomName();
    this.pixelData = {
      scout: null,
      fighter: null,
      carrier: null,
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
