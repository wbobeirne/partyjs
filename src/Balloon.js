import PartyEntity from "./PartyEntity";

const DEFAULT_CONFIG = {
  width: 80,
  height: 100,
  ySpeedMin: 100.0,
  ySpeedRand: 80.0,
  oscSpeedMin: 10.0,
  oscSpeedRand: 10.0,
  oscDistMin: 10.0,
  oscDistRand: 10.0,
  distMin: 10.0,
  distRandom: 10.0,
  stringLength: 120,
  stringOscSpeedMin: 20.0,
  stringOscSpeedRandom: 1.0,
  stringOscDistMin: 2.0,
  stringOscDistRand: 1.0,
};

class Balloon extends PartyEntity {
  /**
   * A balloon entity. Has a circle and a string, that wobble a bit.
   * @param {Object} params - See PartyEntity for more info
   * @param {config} config - See `balloon` param on OkParty for more info
   * @constructor
   */
	constructor(params = {}, config = {}) {
		super(params);
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
  }

  /**
   * Reset the balloon to the top, with new values.
   * @return {Balloon} this
   */
	reset() {
		super.reset();
		this.pos = new Vector2(
      Math.random() * this.bounds.width,
      Math.random() * this.config.height * 2 + this.bounds.height,
    );
		this.width = this.config.width;
		this.height = this.config.height;
		this.speedY = Math.random() * this.config.ySpeedRand + this.config.ySpeedMin;
		this.oscSpeed = Math.random() * this.config.oscSpeedRand + this.config.oscSpeedMin;
		this.oscDist = Math.random() * this.config.oscDistRand + this.config.oscDistMin;

		this.stringLength = this.config.stringLength;
		this.stringOscSpeed = Math.random() * this.config.stringOscSpeedRand + this.config.stringOscSpeedMin;
		this.stringOscDist = Math.random() * this.config.stringOscDistRand + this.config.stringOscDistMin;
		this.stringCp1 = new Vector2(this.pos.x, 0);
		this.stringCp2 = new Vector2(this.pos.x, 0);
		this.color = COLORS[Math.round(Math.random() * COLORS.length - 1)];

    return this;
  }

  /**
   * Update the balloons position based on elapsed time.
   * @param {Number} delta - Time in ms between frames.
   * @returns {Balloon} this
   */
	update(delta) {
		if (this.pos.y < -this.height - this.stringLength) {
			this.reset();
    }

		super.update(delta);

		// Raise the balloon, wiggle it a bit
		const oldX = this.pos.x;
		this.pos.y -= this.speedY * delta;
		this.pos.x += Math.cos(this.time + delta * this.oscSpeed) * this.oscDist * delta;
		const xDiff = this.pos.x - oldX;

		// Calculate the string wiggle bezier curve
		const oscilAmount = Math.cos(this.time + delta * this.stringOscSpeed) * this.stringOscDist * delta;
		this.stringCp1.x = this.stringCp1.x + oscilAmount + xDiff;
		this.stringCp2.x = this.pos.x + (this.pos.x - this.stringCp1.x);
		this.stringCp1.y = this.pos.y + this.height + this.stringLength * 0.33;
		this.stringCp2.y = this.pos.y + this.height + this.stringLength * 0.66;

    return this;
  }

  /**
   * Draw the balloon in its current state on a canvas.
   * @param {CanvasRenderingContext2D} canvas
   * @returns {Balloon} this
   */
	draw(canvas) {
		super.draw(canvas);
		canvas.fillStyle = this.color;
		canvas.strokeStyle = this.color;

		// Main balloon part
		canvas.beginPath();
		canvas.moveTo(this.pos.x, this.pos.y);


		// Sides
		const midLeftX = this.pos.x - this.width * 0.35;
    const midRightX = this.pos.x + this.width * 0.35;
		const midY = this.pos.y + this.height * 0.7;

    // Left
		canvas.bezierCurveTo(
			this.pos.x - this.width / 2, this.pos.y, // Top left
			this.pos.x - this.width * 0.6, this.pos.y + this.height * 0.45, // Top-mid left
			midLeftX, midY // Mid left
		);
		canvas.moveTo(midLeftX, midY);
		canvas.lineTo(this.pos.x, this.pos.y + this.height);
		canvas.lineTo(this.pos.x, this.pos.y);

		// Right
		canvas.moveTo(this.pos.x, this.pos.y + this.height);
		canvas.lineTo(midX, midY);
		canvas.bezierCurveTo(
			this.pos.x + this.width * 0.6, this.pos.y + this.height * 0.45, // Mid right
			this.pos.x + this.width / 2, this.pos.y, // Top right
			this.pos.x, this.pos.y, // Top
		);

		canvas.closePath();
		canvas.stroke();
		canvas.fill();

		// Draw all the pieces of the string
		canvas.fillStyle = 'rgba(255, 255, 255, 0.7)';
		canvas.strokeStyle = 'rgba(255, 255, 255, 0.7)';
		canvas.beginPath();
		canvas.moveTo(this.pos.x, this.pos.y + this.height);

		canvas.bezierCurveTo(
			this.stringCp1.x, this.stringCp1.y,
			this.stringCp2.x, this.stringCp2.y,
			this.pos.x, this.pos.y + this.height + this.stringLength,
		);

		canvas.stroke();
		canvas.closePath();


		// Triangle bit at the bottom
		const triY = this.pos.y + this.height;
		const triSize = 3;

		canvas.fillStyle = this.color;
		canvas.strokeStyle = this.color;
		canvas.beginPath();
		canvas.moveTo(this.pos.x, triY);

		canvas.lineTo(this.pos.x - triSize, triY + triSize);
		canvas.lineTo(this.pos.x + triSize, triY + triSize);
		canvas.lineTo(this.pos.x, triY);

		canvas.closePath();
		canvas.stroke();
		canvas.fill();


		// Reflection bit at the top left
    const refX = this.pos.x - this.width * 0.33;
    const refY = this.pos.y + this.height * 0.28;
    const refHalfX = this.pos.x - this.width * 0.18;
    const refHalfY = this.pos.y + this.height * 0.1;

		canvas.fillStyle = 'rgba(255, 255, 255, 0.2)';
		canvas.strokeStyle = 'rgba(255, 255, 255, 0.2)';
		canvas.beginPath();
		canvas.moveTo(refX, refY);
		canvas.bezierCurveTo(
			refX - this.width * 0.05, refY - this.height * 0.05,
			refHalfX - this.width * 0.1, refHalfY,
			refHalfX, refHalfY,
		);
		canvas.moveTo(refHalfX, refHalfY);
		canvas.bezierCurveTo(
			refHalfX + this.width * 0.05, refHalfY + this.height * 0.05,
			refX + this.width * 0.1, refY,
			refX, refY,
		);
		canvas.closePath();
		canvas.fill();

    return this;
  }
}

export default Balloon;
