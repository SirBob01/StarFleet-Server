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
  button: number;
  pressed: boolean;
}

/**
 * Defines the keyboard input data format from the client
 */
interface KeyInputData {
  key: string;
  pressed: boolean;
}

class Player {
  socket: Socket;

  game: Game | null;

  name: string;

  pixelData: { scout: null; fighter: null; carrier: null };

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

  public handleMouse(mousedata: MouseInputData) {}

  public handleKeys(keydata: KeyInputData) {}
}

export { Player };
