class Player {
  constructor (socket) {
    this.socket = socket
    this.game = null

    this.name = ''
    this.pixelData = {
      scout: null,
      fighter: null,
      carrier: null
    }
    this.resources = 0
    this.entities = []
  }

  handleMouse (mousedata) {
  }

  handleKeys (keydata) {
  }
}

exports.Player = Player
