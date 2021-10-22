const socketio = require('socket.io')
const { Game } = require('./game')
const { Player } = require('./player')

const generateRandomString = (length) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let string = ''
  for (let i = 0; i < length; i++) {
    string += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return string
}

class Main {
  constructor (server) {
    this.io = socketio(server, {
      cors: {
        origin: '*'
      }
    })
    this.players = {}
    this.games = {} // Users are grouped into lobbies that play games

    // Handle the initial connection
    this.io.on('connection', socket => {
      this.players[socket.id] = new Player(socket)
      const player = this.players[socket.id]

      // Create a new lobby
      socket.on('create', callback => {
        const keylen = 6
        let key = generateRandomString(keylen)
        while (key in this.games) {
          key = generateRandomString(keylen)
        }
        this.games[key] = new Game()
        this.games[key].join(player)
        this.games[key].sendLobbyData()

        // Share the key with friends to join lobby
        callback(key)
      })

      // Join an existing game
      socket.on('join', (key, callback) => {
        if (key in this.games && !this.games[key].running) {
          const joined = this.games[key].players.map(player => player.socket.id).includes(socket.id)
          if (!joined) this.games[key].join(player)
          this.games[key].sendLobbyData()
          callback(true)
        } else {
          callback(false)
        }
      })

      // Set player name
      socket.on('setName', name => {
        player.name = name
        player.game.sendLobbyData()
      })

      // Set player pixel data
      socket.on('setPixelData', data => {
        player.pixelData.scout = data.scout
        player.pixelData.fighter = data.fighter
        player.pixelData.carrier = data.carrier
      })

      // Handle key input
      socket.on('keystate', player.handleKeys)

      // Handle mouse input
      socket.on('mousestate', player.handleMouse)

      // Kicking a player
      socket.on('kick', id => {
        const target = this.players[id]
        let game
        if (target.game) {
          game = target.game
          game.disconnect(id)
          game.sendLobbyData()
          target.socket.emit('kick')
        }
      })

      // Handle disconnect
      socket.on('disconnect', () => {
        let game
        if (player.game) {
          game = player.game
          game.disconnect(socket.id)
          game.sendLobbyData()
        }
        delete this.players[socket.id]
      })
    })
  }

  // Let each game broadcast data
  broadcast () {
    for (const key in this.games) {
      const game = this.games[key]
      if (game.running) this.games[key].broadcast()
    }
  }

  // Execute logic
  update () {
    for (const key in this.games) {
      const game = this.games[key]
      // A game can exist for up to 1 hour after everyone has left
      if (game.players.length === 0 && Date.now() - game.lastDisconnect > 1000 * 60 * 60) {
        delete this.games[key]
      } else if (game.running) {
        game.update()
      }
    }
  }
}

module.exports = {
  Main
}
