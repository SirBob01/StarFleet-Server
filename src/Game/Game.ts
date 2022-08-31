import { Vec2D } from 'dynamojs-engine';
import { Socket } from 'socket.io';
import { Entity, Ship } from './Entities';
import { Player } from './Player';

/**
 * Runs the simulation logic for an individual game
 */
class Game {
  // Unique key associated with the game
  key: string;

  // Host player socket
  host: Socket;

  // List of players in this game
  players: Player[];

  // Is running?
  running: boolean;

  // Timestamp for last time a player disconnected
  lastDisconnect: number;

  // List of entities
  entities: Entity[];

  // Size of the map
  mapSize: Vec2D;

  constructor(key: string, host: Socket) {
    this.key = key;
    this.host = host;
    this.players = [];
    this.running = false;
    this.lastDisconnect = Date.now();
    this.mapSize = new Vec2D(0, 0);

    this.entities = [];
  }

  /**
   * Handle host input
   */
  public handleHostInput() {
    this.host.on('start', () => {
      if (!this.running) {
        this.generate();
        this.sendStartData();
        this.running = true;
      }
    });
    this.host.on('stop', () => {
      this.running = false;
    });
  }

  /**
   * Let a new player join
   *
   * @param player
   */
  public join(player: Player) {
    this.players.push(player);
    player.game = this;

    // Set the host
    if (this.host === null) {
      this.host = player.socket;
      this.handleHostInput();
    }
  }

  /**
   * Disconnect a player
   *
   * @param id
   */
  public disconnect(id: string) {
    let newHost = false;
    for (let i = 0; i < this.players.length; i++) {
      const playerId = this.players[i].socket.id;
      if (playerId === id) {
        this.players[i].game = null;
        this.players.splice(i, 1);
        if (playerId === this.host.id) {
          newHost = true;
        }
        break;
      }
    }

    // Delete entities owned by that player
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const entity = this.entities[i];
      if (entity.ownerId === id) this.entities.splice(i, 1);
    }

    // Host left, get a new host
    if (newHost && this.players.length > 0) {
      this.host = this.players[0].socket;
      this.handleHostInput();
    }

    this.lastDisconnect = Date.now();
  }

  /**
   * Send lobby information to the players
   */
  public sendLobbyData() {
    const data: any = {
      players: [],
    };
    this.players.forEach((player) => {
      data.players.push({
        id: player.socket.id,
        name: player.name,
        host: player.socket.id === this.host.id,
      });
    });
    for (const player of this.players) {
      data.name = player.name;
      data.isHost = player.socket.id === this.host.id;
      player.socket.emit('lobby', data);
    }
  }

  /**
   * Randomly generate the planets, asteroids, and stars of this map
   */
  public generate() {
    this.mapSize = new Vec2D(2000, 2000).scale(this.players.length);

    // TODO: Randomly allocate each player a sector
    // Ensure assigned sectors are evenly spaced
    const sectors = Math.pow(this.players.length, 2);

    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      this.entities.push(
        new Ship(
          100 + Math.random() * 300,
          100 + Math.random() * 300,
          player.socket.id,
          0,
          'scout'
        )
      );
    }
  }

  /**
   * Send initial data to member players
   */
  public sendStartData() {
    const pixelData: any = {};
    for (const player of this.players) {
      pixelData[player.socket.id] = player.pixelData;
    }
    for (const player of this.players) {
      player.socket.emit('start', {
        key: this.key,
        pixelData,
        mapSize: this.mapSize,
      });
    }
  }

  /**
   * Broadcast players the relevant game state
   */
  public broadcast() {
    for (const player of this.players) {
      player.socket.emit('broadcast', {
        entities: this.entities.map((e) => {
          return {
            class: e.constructor.name,
            ...e,
          };
        }),
      });
    }
  }
  
  /**
   * Update simulation state per frame
   * 
   * @param delta (ms)
   */
  public update(delta: number) {
    // Fetch the list of all entities and update them
    for (const entity of this.entities) {
      entity.update(delta);
      entity.move(delta);
    }

    // Handle collisions and interactions
    const n = this.entities.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = this.entities[i];
        const b = this.entities[j];
        if (a.isColliding(b)) {
          a.interact(b);
          b.interact(a);
        }
      }
    }
  }
}

export { Game };
