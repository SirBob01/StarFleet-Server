import { Server as SocketServer } from 'socket.io';
import http from 'http';
import { Game, Player } from './Game';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { ListenEvents, EmitEvents } from './ServerTypes';

/**
 * Generate a random string of a certain length
 *
 * @param length Length of the random string
 * @returns
 */
const generateRandomString = (length: number) => {
  const alphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let string = '';
  for (let i = 0; i < length; i++) {
    string += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return string;
};

/**
 * Server instance that coordinates the simulation of multiple concurrent games
 */
class Server {
  private io: SocketServer<ListenEvents, EmitEvents, DefaultEventsMap>;

  private players: Map<string, Player>;

  private games: Map<string, Game>;

  constructor(server: http.Server) {
    this.io = new SocketServer(server, {
      cors: {
        origin: '*',
      },
    });
    this.players = new Map();
    this.games = new Map(); // Users are grouped into lobbies that play games

    // Handle the initial connection
    this.io.on('connection', (socket) => {
      const player = new Player(socket);
      this.players.set(socket.id, player);

      // Create a new lobby
      socket.on('create', (callback) => {
        const keylen = 6;
        let key = generateRandomString(keylen);
        while (key in this.games) {
          key = generateRandomString(keylen);
        }
        const game = new Game(key, player.socket);
        game.join(player);
        game.sendLobbyData();
        this.games.set(key, game);

        // Share the key with friends to join lobby
        callback(key);
      });

      // Join an existing game
      socket.on('join', (key, callback) => {
        const game = this.games.get(key);
        if (game && !game.running) {
          const joined = game.players
            .map((player) => player.socket.id)
            .includes(socket.id);
          if (!joined) game.join(player);
          game.sendLobbyData();
          callback(true);
        } else {
          callback(false);
        }
      });

      // Set player name
      socket.on('setName', (name) => {
        player.name = name;
        player.game?.sendLobbyData();
      });

      // Set player pixel data
      socket.on('setPixelData', (data) => {
        player.sprites.scout = data.scout;
        player.sprites.fighter = data.fighter;
        player.sprites.carrier = data.carrier;
      });

      // Handle key input
      socket.on('keystate', player.handleKeys);

      // Handle mouse input
      socket.on('mousestate', player.handleMouse);

      // Kicking a player
      socket.on('kick', (id) => {
        const target = this.players.get(id);
        if (target && target.game) {
          const game = target.game;
          game.disconnect(id);
          game.sendLobbyData();
          target.socket.emit('kick');
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        if (player.game) {
          const game = player.game;
          game.disconnect(socket.id);
          game.sendLobbyData();
        }
        this.players.delete(socket.id);
      });
    });
  }

  /**
   * Broadcast the game data to its member players
   */
  public broadcast() {
    this.games.forEach((game) => {
      if (game.running) {
        game.broadcast();
      }
    });
  }

  /**
   * Execute simulation logic
   *
   * @param delta {ms}
   */
  public update(delta: number) {
    this.games.forEach((game, key) => {
      // A game can exist for up to 1 hour after everyone has left
      if (
        game.players.length === 0 &&
        Date.now() - game.lastDisconnect > 1000 * 60 * 60
      ) {
        this.games.delete(key);
      } else if (game.running) {
        game.update(delta);
      }
    });
  }
}

export { Server };
