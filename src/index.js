import Confetti from "./Confetti";
import Balloon from "./Balloon";
import Ribbon from "./Ribbon";

const ENTITY_TYPES = {
  CONFETTI: "confetti",
  BALLOON: "balloon",
  RIBBON: "ribbon",
};

const ENTITIES = {
  [ENTITY_TYPES.CONFETTI]: Confetti,
  [ENTITY_TYPES.BALLOON]: Balloon,
  [ENTITY_TYPES.RIBBON]: Ribbon,
};

const DEFAULT_PARAMS = {
  target: null,
  id: null,
  timescale: 1.0,
  zindex: 1000001,
  counts: {
    [ENTITY_TYPES.CONFETTI]: 200,
    [ENTITY_TYPES.BALLOON]: 2,
    [ENTITY_TYPES.RIBBON]: 6,
  },
  configs: {},
};

class Party {
	constructor(params = {}) {
    // Assign and check params
    this.params = {
      ...DEFAULT_PARAMS,
      ...params,
    };

		if (!this.params.target.length) {
      console.warn("Partyjs not provided a target, party will not start");
      return;
    }

    // Create a new canvas element
		this.canvasEl = document.createElement('canvas')
    this.canvasEl.setAttribute('style', "position: absolute; top: 0; left: 0; z-index: #{@zindex};");
    if (this.params.id) {
      this.canvasEl.setAttribute("id", this.params.id);
    }
    this.params.target.prepend(this.canvasEl);
    this.canvas = this.canvasEl.getContext("2d");

    // Initialize self
		this.resize();
		this.listen();

    // Initialize entities
    this.entities = {};
    Object.keys(ENTITIES).forEach((etype) => {
      this.entities[etype] = [];
      for (let i = 0; i < this.params.counts[etype]; i++) {
        this.entities[etype].push(new ENTITIES[etype]({
          bounds: this.bounds,
        }));
      }
    });
  }

  /**
   * Bind event listners.
   * @returns {Party} this
   */
	listen() {
    window.addEventListener("resize", () => {
      this.resize();
    });

    window.addEventListener("focus", () => {
      this.lastTimestamp = 0;
    });

    return this;
  }

  /**
   * Handle resizing of bounds.
   * @returns {Party} this
   */
	resize() {
		this.bounds = this.params.target.getBoundingClientRect();
		this.canvasEl.width = this.bounds.width;
		this.canvasEl.height = this.bounds.height;

    Object.keys(ENTITIES).forEach((etype) => {
      this.entities[etype].forEach((entity) => {
        entity.bounds = this.bounds;
      });
    });

    return this;
  }

  /**
   * Start the party. Woooo!
   * @returns {Party} this
   */
	start() {
		this.resize();
		requestAnimationFrame(this.update.bind(this));
    return this;
  }

  /**
   * Stops the party. Resume with `start`. Not cool, dude.
   * @returns {Party} this
   */
	stop() {
    this.stopped = true;
    return this;
  }

  /**
   * Kills the party and its markup. Cheese it, the fuzz is here!
   * @returns {Party} this
   */
	destroy() {
    this.stop();
    this.canvasEl.parent.removeChild(this.canvasEl);
    return this;
  }

  /**
   * Update the party based on how long since the last frame.
   * @param {integer} timestamp - Current time in ms
   * @returns {Party} this
   */
	update(timestamp) {
    if (this.stopped) {
      return;
    }

		let delta = 0;
		if (this.lastTimestamp) {
			delta = (timestamp - this.lastTimestamp) / 1000
    }
		delta = delta * this.timescale;

		this.canvas.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    Object.keys(ENTITIES).forEach((etype) => {
      this.entities[etype].forEach((entity) => {
        entity.update(delta);
				entity.draw(this.canvas);
      });
    });

    this.lastTimestamp = timestamp;
		requestAnimationFrame(this.update.bind(this));
    return this;
  }
}

export default Party;
