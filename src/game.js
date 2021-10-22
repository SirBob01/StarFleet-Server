class Game {
  constructor () {
    this.host = null
    this.players = []
    this.running = false
    this.lastDisconnect = Date.now()

    this.entities = []
  }

  handleHostInput () {
    this.host.on('start', () => {
      if (!this.running) {
        this.generate()
        this.runnning = true
      }
    })
    this.host.on('stop', () => {
      this.running = false
    })
  }

  // Let a new player join
  join (player) {
    this.players.push(player)
    player.game = this

    // Set the host
    if (this.host === null) {
      this.host = player.socket
      this.handleHostInput()
    }
  }

  disconnect (id) {
    // Disconnect a player
    let newHost = false
    for (let i = 0; i < this.players.length; i++) {
      const playerId = this.players[i].socket.id
      if (playerId === id) {
        this.players[i].game = null
        this.players.splice(i, 1)
        if (playerId === this.host.id) {
          newHost = true
        }
        break
      }
    }

    // Host left, get a new host
    if (newHost) {
      if (this.players.length > 0) {
        this.host = this.players[0].socket
        this.handleHostInput()
      } else {
        this.host = null
      }
    }

    this.lastDisconnect = Date.now()
  }

  // Randomly generate the planets, asteroids, and stars
  generate () {
  }

  // Broadcast players the relevant game state
  broadcast () {
  }

  // Run the game
  update () {
  }
}

exports.Game = Game
