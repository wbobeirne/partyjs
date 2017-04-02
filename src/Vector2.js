class Vector2 {
	/**
   * Represents a 2 dimensional coordinate
   * @param {int} x - X coordinate
   * @param {int} y - Y coordinate
   * @constructor
   */
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
  }

	/**
   * Returns the length of the vector
   * @returns {Number}
   */
	length() {
		return Math.sqrt(this.sqrLength());
  }

  /**
   * Returns the length of the vector, pre-square rooting
   * @returns {Number}
   */
	sqrLength() {
		return (this.x * this.x) + (this.y * this.y);
  }


	/**
   * Determine if this vector is the same as another one.
   * @param {Vector2} vec - Another vector to compare to.
   * @returns {boolean}
   */
	equals(vec) {
		return this.x === vec.x && this.y === vec.y;
  }

  /**
   * Add another vector to this one.
   * @param {Vector2} vec - Vector to add.
   * @returns {Vector2} this
   */
	add(vec) {
		this.x += vec.x;
		this.y += vec.y;
		return this;
  }

  /**
   * Subtract a vector from this one.
   * @param {Vector2} vec - Vector to subtract.
   * @returns {Vector2} this
   */
	subtract(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		return this;
  }

  /**
   * Divide this vector by some divisor.
   * @param {Number} div - Divisor.
   * @returns {Vector2} this
   */
	divide(div) {
		this.x /= div;
		this.y /= div;
		return this;
  }

  /**
   * Multiply this vector by some multiplier.
   * @param {Number} mul - Multiplier.
   * @returns {Vector2} this
   */
	multiply(mul) {
		this.x *= mul;
		this.y *= mul;
		return this;
  }


  /**
   * Normalize the vector.
   * @returns {Vector2} this
   */
	normalize() {
		const sqrLen = this.sqrLength();

		if (sqrLen) {
			factor = 1.0 / Math.sqrt(sqrLen);
			this.x *= factor;
			this.y *= factor;
    }

		return this;
  }

	/**
   * Return a different normalized version of the vector.
   * @returns {Vector2} new normalized vector
   */
	normalized() {
		const sqrLen = this.sqrLength();

		if (sqrLen) {
			const factor = 1.0 / Math.sqrt(sqrLen);
			return new Vector2(this.x * factor, this.y * factor);
    }
    else {
      return new Vector2(1, 1);
    }
  }
}

export default Vector2;
