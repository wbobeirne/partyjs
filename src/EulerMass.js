import Vector2 from "./Vector2";

class EulerMass {
  /**
   * Represents an object that adheres to Euler's laws of motion
   * @param {Number} x - X position
   * @param {Number} y - Y position
   * @param {Number} mass - The weight of the object
   * @param {Number} drag - The friction of the object
   */
	constructor(x, y, mass, drag) {
		this.pos = new Vector2(0, 0);
		this.pos.x = x;
		this.pos.y = y;
		this.mass = mass;
		this.drag = drag;
		this.force = new Vector2(0, 0);
		this.velocity = new Vector2(0, 0);
  },

	/**
   * Add some amount of force to the mass.
   * @param {Number} force
   * @returns {EulerMass} this
   */
	addForce(f) {
		this.force.add(f);
		return this;
  },


  /**
   * Integrate a Vector2
   * @param {Vector2} dt - Vector to integrate
   * @returns {EulerMass} this
   */
	integrate(dt) {
		// Compute acceleration
		const accel = this.currentForce(this.position);
		accel.divide(this.mass);

		// Compute new position & velocity
		const delta = new Vector2(this.velocity.x, this.velocity.y);
		delta.multiply(dt);
		this.pos.add(delta);
		accel.multiply(dt);
		this.velocity.add(accel);
		this.force = new Vector2(0, 0);

		return this;
  },

  /**
   * Get the current force of the mass
   * @returns {Vector2} force
   */
	currentForce() {
		const totalForce = new Vector2(this.force.x, this.force.y);
		const speed = this.velocity.length();

		dragVel = new Vector2(this.velocity.x, this.velocity.y);
		dragVel.multiply(this.drag * this.mass * speed);
		totalForce.subtract(dragVel);

		return totalForce
  },
}

export default EulerMass;
