const { Entity } = require('./entity')

const shipTypes = {
  scout: {
    size: 32,
    health: 15
  },
  fighter: {
    size: 48,
    health: 25
  },
  carrier: {
    size: 96,
    health: 50
  }
}

class Ship extends Entity {
  constructor (x, y, owner, angle, type) {
    super(x, y, shipTypes[type].size, angle, shipTypes[type].health)
    this.owner = owner
    this.type = type
  }
}

exports.Ship = Ship
