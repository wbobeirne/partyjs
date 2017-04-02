import PartyEntity from "./PartyEntity";
import Vector2 from "./Vector2";
import { DEG_TO_RAD } from "./constants";

const DEFAULT_CONFIG = {
  size: 5,
  oscMin: 0.2,
  oscRand: 0.5,
  rotationMin: 800,
  rotationRand: 600,
  xSpeedMin: 30.0,
  xSpeedRand: 20.0,
  ySpeedMin: 80.0,
  ySpeedRand: 60.0,
};

class Confetti extends PartyEntity {

  /**
   * Represents a small piece of falling confetti
   * @param {Object} params - See PartyEntity for more info
   * @param {config} config - See `confetti` param on OkParty for more info
   * @constructor
   */
	constructor(params = {}, config) {
		super(params);

    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    this.corners = [];
    for (let i = 0; i < 4; i++) {
      this.corners.push(new Vector2(
        Math.cos(this.angle + DEG_TO_RAD * (i * 90 + 45)),
        Math.sin(this.angle + DEG_TO_RAD * (i * 90 + 45)),
      ));
    }
  }

  /**
   * Reset the balloon to the top, with new values.
   * @return {Confetti} this
   */
	reset() {
		super.reset();
		this.pos = new Vector2(Math.random() * this.bounds.width, 0);
		this.size = this.config.size;
		this.cosA = 1.0;

		this.speedX = Math.random() * this.config.xSpeedRand + this.config.xSpeedMin;
		this.speedY = Math.random() * this.config.ySpeedRand + this.config.ySpeedMin;

		this.angle = DEG_TO_RAD * Math.random() * 360;
		this.rotation = DEG_TO_RAD * Math.random() * 360;
		this.rotSpeed = Math.random() * this.config.rotationRand + this.config.rotationMin;
		this.oscSpeed = Math.random() * this.config.oscRand + this.config.oscMin;

		color = Math.round(Math.random() * (COLOR_PAIRS.length - 1));
		this.colorFront = COLOR_PAIRS[color][0];
		this.colorBack = COLOR_PAIRS[color][1];

    return this;
  }

  /**
   * Update the balloons position based on elapsed time.
   * @param {Number} delta - Time in ms between frames.
   * @returns {Confetti} this
   */
	update(delta) {
		super.update(delta);

		this.rotation += this.rotSpeed * delta;
		this.cosA = Math.cos(DEG_TO_RAD * this.rotation);
		this.pos.x += Math.cos(this.time * this.oscSpeed) * this.speedX * delta;
		this.pos.y += this.speedY * delta;

		if (this.pos.y + this.config.size > this.bounds.height) {
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

		if (this.cosA > 0) {
			canvas.fillStyle = this.colorFront;
    } else {
			canvas.fillStyle = this.colorBack;
    }

		// Square
		canvas.beginPath();
		canvas.moveTo(
      this.pos.x + this.corners[0].x * this.size,
      this.pos.y + this.corners[0].y * this.size * this.cosA,
    );

		for (let i = 0; i < 4; i++) {
			canvas.lineTo(
        this.pos.x + this.corners[i].x * this.size,
        this.pos.y + this.corners[i].y * this.size * this.cosA,
      );
    }

		canvas.closePath();
		canvas.fill();
  }
}

export default Confetti;
