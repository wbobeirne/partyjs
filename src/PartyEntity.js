class PartyEntity {
  /**
   * A generic entity that represents anything in the party.
   * @param {Object} params - Properties to apply to the entity.
   * @param {Object} params.bounds - The boundaries of the entity.
   * @param {integer} params.bounds.height
   * @param {integer} params.bounds.width
   * @param {integer} params.bounds.top
   * @param {integer} params.bounds.left
   * @param {integer} params.bounds.bottom
   * @param {integer} params.bounds.right
   */
	constructor(params = {}) {
    this.bounds = params.bounds || {
      height: 0,
      width: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    };

		this.reset();
  }


  /**
   * Reset the entity to the start.
   * @returns {PartyEntity} this
   */
	reset() {
		this.time = Math.random() * 100;
    return this;
  }

  /**
   * Update the entity since the last frame.
   * @param {Number} delta - Time since last update in ms
   * @returns {PartyEntity} this
   */
	update(delta) {
		this.time += delta;
    return this;
  }

  /**
   * Draw the confetti in its current state on a canvas.
   * @param {CanvasRenderingContext2D} canvas
   * @returns {PartyEntity} this
   */
	draw(canvas) {
    // OK, you got me, it's a no-op. But I might want to do something here
    // at some point!
    return this;
  }
}

export default PartyEntity;
