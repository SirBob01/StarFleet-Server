const names = [
  'Dynamic', 'Neutron', 'Star', 'Saber', 'Optimal', 'Mega', 'Zord',
  'Fighter', 'Scout', 'Master', 'Padawan', 'Wing', 'Plasmic', 'Plasma',
  'Transformer', 'Bot', 'Robot', 'Man', 'Core', 'Figure', 'Actor'
]

const randomName = () => {
  const n1 = Math.floor(Math.random() * names.length)
  const n2 = Math.floor(Math.random() * names.length)
  return names[n1] + names[n2]
}

class Player {
  constructor (socket) {
    this.socket = socket
    this.game = null

    this.name = randomName()
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
