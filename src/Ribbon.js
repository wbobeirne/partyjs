import PartyEntity from "./PartyEntity";
import EulerMass from "./EulerMass";
import Vector2 from "./Vector2";

const DEFAULT_PARAMS = {
  pieces: 30,
  length: 8.0,
  width: 8.0,
  angle: 45.0,
  mass: 1.0,
  drag: 0.05,
  ySpeedMin: 100.0,
  ySpeedRand: 60.0,
  velocityMin: 4.0,
  velocityRand: 2.0,
  oscSpeedMin: 2.0,
  oscSpeedRand: 2.0,
  oscDistMin: 40.0,
  oscDistRand: 40.0,
};

class Ribbon extends PartyEntity {
  /**
   * Represents a small piece of falling confetti
   * @param {Object} params - See PartyEntity for more info
   * @param {config} config - See `ribbon` param on OkParty for more info
   * @constructor
   */
	constructor(params = {}) {
		super(params)
  }

  /**
   * Reset the ribbon to the top, with new values.
   * @return {Ribbon} this
   */
	reset() {
		super.reset();

		this.pos = new Vector2(Math.random() * this.bounds.width, 0);
		this.prevPos = new Vector2(this.pos.x, this.pos.y);
		this.offsetX = Math.cos(DEG_TO_RAD * this.config.angle) * this.config.width;
		this.offsetY = Math.sin(DEG_TO_RAD * this.config.angle) * this.config.width;

		this.velocity = Math.random() * this.config.velocityRand + this.config.velocityMin;
		this.speedY = Math.random() * this.config.ySpeedRand + this.config.ySpeedMin;
		this.oscSpeed = Math.random() * this.config.oscSpeedRand + this.config.oscSpeedMin;
		this.oscDist = Math.random() * this.config.oscDistRand + this.config.oscDistMin;

		this.colorNum = Math.round(Math.random() * (COLOR_PAIRS.length - 1));
		this.colorFront = COLOR_PAIRS[this.colorNum][0];
		this.colorBack = COLOR_PAIRS[this.colorNum][1];

		this.particles = []
		for (let i = 0; i < this.config.pieces; i++) {
			this.particles.push(new EulerMass(
        this.pos.x,
        this.pos.y - count * this.config.length,
        this.config.mass,
        this.config.drag
      ));
    }

    return this;
  }

  /**
   * Update the ribbons position and twist based on elapsed time.
   * @param {Number} delta - Time in ms between frames.
   * @returns {Ribbon} this
   */
	update(delta) {
		// Weird stuff happens when delta is 0, so just skip the frame.
    if (!delta) {
      return;
    }

		this.time += delta * this.oscSpeed;
		this.pos.y += this.speedY * delta;
		this.pos.x += Math.cos(this.time) * this.oscDist * delta;
		this.particles[0].pos = new Vector2(this.pos.x, this.pos.y);

		diffX = this.prevPos.x - this.pos.x;
		diffY = this.prevPos.y - this.pos.y;
		diff = Math.sqrt(diffX * diffX + diffY * diffY);
		this.prevPos = new Vector2(this.pos.x, this.pos.y);

		// Seperated into 3 since we don't want reference to previous
		// positions to be affected by later steps.
    for (let i = 1; i < this.particles.length; i++) {
			const dir = new Vector2(this.particles[i - 1].pos.x, this.particles[i - 1].pos.y);
			dir.subtract(this.particles[i].pos);
			dir.normalize();
			dir.multiply((diff / delta) * this.velocity);
			this.particles[i].addForce(dir);
    }

		for (let i = 1; i < this.particles.length; i++) {
			this.particles[i].integrate(delta);
    }

		for (let i = 1; i < this.particles.length; i++) {
			const newPos = new Vector2(this.particles[i].pos.x, this.particles[i].pos.y);
			newPos.subtract(this.particles[i - 1].pos);
			newPos.normalize();
			newPos.multiply(this.config.length);
			newPos.add(this.particles[i - 1].pos);
			this.particles[i].pos = newPos;
    }

		if (this.pos.y > this.bounds.height + this.config.length * this.config.pieces) {
			this.reset();
    }
  }

  /**
   * Draw the confetti in its current state on a canvas.
   * @param {CanvasRenderingContext2D} canvas
   * @returns {Confetti} this
   */
	draw(canvas) {
		super.draw(canvas);

		for (let i = 0; i < this.particles.length - 1; i++) {
      const thisPos = this.particles[i].pos;
      const nextPos = this.particles[i + 1].pos;
			const p1 = new Vector2(thisPos.x + this.offsetX, thisPos.y + this.offsetY);
			const p2 = new Vector2(nextPos.x + this.offsetX, nextPos.y + this.offsetY);

			if (this.side(thisPos, nextPos, p1) < 0) {
				canvas.fillStyle = this.colorFront;
				canvas.strokeStyle = this.colorFront;
      } else {
				canvas.fillStyle = this.colorBack;
				canvas.strokeStyle = this.colorBack;
      }

			canvas.beginPath();
			canvas.moveTo(thisX, thisY);
			canvas.lineTo(nextX, nextY);

			// First and last particles have a little notch in them
			if (i === 0) {
				canvas.lineTo((nextX + p2.x) * 0.5, (nextY + p2.y) * 0.5);
				canvas.closePath();
				canvas.stroke();
				canvas.fill();

				canvas.beginPath();
				canvas.moveTo(p2.x, p2.y);
				canvas.lineTo(p1.x, p1.y);
				canvas.lineTo((nextX + p2.x) * 0.5, (nextY + p2.y) * 0.5);
      } else if (i === this.particles.length - 2) {
				canvas.lineTo((thisX + p1.x) * 0.5, (thisY + p1.y) * 0.5);
				canvas.closePath();
				canvas.stroke();
				canvas.fill();

				canvas.beginPath();
				canvas.moveTo(p2.x, p2.y);
				canvas.lineTo(p1.x, p1.y);
				canvas.lineTo((thisX + p1.x) * 0.5, (thisY + p1.y) * 0.5);
      } else {
				canvas.lineTo(p2.x, p2.y);
				canvas.lineTo(p1.x, p1.y);
      }

			canvas.closePath();
			canvas.stroke();
			canvas.fill();
    }
  }

  /**
   * Determine how far to which side we're on. Sub-zero is front, above is back.
   * @param {Vector2} v1
   * @param {Vector2} v2
   * @param {Vector2} v3
   */
	side(v1, v2, v3) {
		return ((v1.x - v2.x) * (v3.y - v2.y) - (v1.y - v2.y) * (v3.x - v2.x));
  }
}

export default Ribbon;
