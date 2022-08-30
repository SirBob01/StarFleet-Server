import { Vec2D } from 'dynamojs-engine';

class Entity {
  center: Vec2D;

  vel: Vec2D;

  acc: Vec2D;

  angularVel: number;

  size: number;

  angle: number;

  mass: number;

  health: number;

  constructor(
    x: number,
    y: number,
    size: number,
    angle: number,
    health: number
  ) {
    this.center = new Vec2D(x, y);
    this.vel = new Vec2D(0, 0);
    this.acc = new Vec2D(0, 0);
    this.angularVel = 0;
    this.size = size;
    this.angle = angle;

    // Let mass simply be the area of the entity
    this.mass = Math.PI * size * size;
    this.health = health;
  }

  /**
   * Test if colling with another entity
   *
   * @param other
   * @returns {boolean}
   */
  public isColliding(other: Entity) {
    const v = this.center.sub(other.center);
    return v.length_sq() <= Math.pow(this.size + other.size, 2);
  }

  /**
   * Resolves a collision with another entity and returns the impact force
   *
   * @param other
   */
  public resolveCollision(other: Entity) {
    const dir = other.center.sub(this.center);
    const dist = dir.length();
    const total = this.size + other.size;
    const overlap = (total - dist) / 2;
    other.center = other.center.add(dir.scale(overlap / dist));
    this.center = this.center.sub(dir.scale(overlap / dist));
  }

  /**
   * Override this function to handle entity-entity interactions
   *
   * @param other
   */
  public interact(other: Entity) {}

  /**
   * Override this function to handle entity specific internal logic
   *
   * @param delta (ms)
   */
  public update(delta: number) {}

  /**
   * Apply motion to the entity
   *
   * @param delta (ms)
   */
  public move(delta: number) {
    this.vel = this.vel.add(this.acc.scale(delta));
    this.center = this.center.add(this.vel.scale(delta));
  }
}

export { Entity };
