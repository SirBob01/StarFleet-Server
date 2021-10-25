const dynamo = require('dynamojs-engine')

class Entity {
  constructor (x, y, size, angle, health) {
    this.center = new dynamo.Vec2D(x, y)
    this.vel = new dynamo.Vec2D(0, 0)
    this.acc = new dynamo.Vec2D(0, 0)
    this.angularVel = 0
    this.size = size
    this.angle = angle

    // Let mass simply be the area of the entity
    this.mass = Math.PI * size * size
    this.health = health
  }

  // Test if two entities are colliding
  isColliding (other) {
    const v = this.center.sub(other.center)
    return v.length_sq() <= Math.pow(this.size + other.size, 2)
  }

  // Resolves a collision with another entity and returns the impact force
  resolveCollision (other) {
    const dir = other.center.sub(this.center)
    const dist = dir.length()
    const total = this.size + other.size
    const overlap = (total - dist) / 2
    other.center = other.center.add(dir.scale(overlap / dist))
    this.center = this.center.sub(dir.scale(overlap / dist))
  }

  // Override this function to handle entity-entity interactions
  interact (other) {}

  // Override this function to handle entity specific internal logic
  update (delta) {}

  // Move an object
  move (delta) {
    this.vel = this.vel.add(this.acc.scale(delta))
    this.center = this.center.add(this.vel.scale(delta))
  }
}

exports.Entity = Entity
