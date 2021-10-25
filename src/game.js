const { Vec2D } = require("dynamojs-engine")
const { Ship } = require("./entities/ship")

class Game {
  constructor (key) {
    this.key = key
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
        this.sendStartData()
        this.running = true
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

  // Disconnect a player
  disconnect (id) {
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
    
    // Delete entities owned by that player
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const entity = this.entities[i]
      if (entity.owner === id) this.entities.splice(i, 1)
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

  sendLobbyData () {
    const data = {}
    data.players = this.players.map(player => {
      return {
        id: player.socket.id,
        name: player.name,
        host: player.socket.id === this.host.id
      }
    })
    for (const player of this.players) {
      data.name = player.name
      data.isHost = player.socket.id === this.host.id
      player.socket.emit('lobby', data)
    }
  }

  // Randomly generate the planets, asteroids, and stars
  generate () {
    this.mapSize = new Vec2D(2000, 2000).scale(this.players.length)
    
    // Randomly allocate each player a sector
    // Ensure assigned sectors are evenly spaced
    let sectors = Math.pow(this.players.length, 2)

    for(let i = 0; i < this.players.length; i++) {
      const player = this.players[i]
      this.entities.push(new Ship(100 + Math.random() * 300, 100 + Math.random() * 300, player.socket.id, 0, 'scout'))
    }
  }

  // Send initial data to the clients
  sendStartData () {
    const pixelData = {}
    for (const player of this.players) {
      pixelData[player.socket.id] = player.pixelData
    }
    for (const player of this.players) {
      player.socket.emit('start', { key: this.key, pixelData, mapSize: this.mapSize })
    }
  }

  // Broadcast players the relevant game state
  broadcast () {
    for(const player of this.players) {
      player.socket.emit('broadcast', {
        entities: this.entities.map(e => {
          e.class = e.constructor.name
          return e
        })
      })
    }
  }

  // Update game state
  update (delta) {
    // Fetch the list of all entities and update them
    for(const entity of this.entities) {
      entity.update(delta)
      entity.move(delta)
    }

    // Handle collisions and interactions
    const n = this.entities.length
    for(let i = 0; i < n - 1; i++) {
      for(let j = i+1; j < n; j++) {
        const a = this.entities[i]
        const b = this.entities[j]
        if(a.isColliding(b)) {
          a.interact(b)
          b.interact(a)
        }
      }
    }
  }
}

exports.Game = Game
