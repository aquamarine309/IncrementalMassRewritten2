/**
 * @abstract
 */
export class AutobuyerState {
  constructor(id = null) {
    this._id = id;
  }

  /**
   * @abstract
   */
  get isUnlocked() { throw new NotImplementedError(); }

  get id() { return this._id; }

  get canTick() {
    return this.isActive && this.isUnlocked;
  }

  /**
   * @abstract
   */
  get isActive() {
    throw new NotImplementedError();
  }

  /**
   * @abstract
   */
  set isActive(value) {
    throw new NotImplementedError();
  }

  get bulk() {
    return 1;
  }

  toggle() {
    this.isActive = !this.isActive;
  }

  /**
   * @abstract
   */
  tick() { throw new NotImplementedError(); }

  // eslint-disable-next-line no-empty-function
  reset() { }

  static get entryCount() { return 1; }

  /**
   * @abstract
   * @returns {string}
   */
  static get autobuyerGroupName() { throw new NotImplementedError(); }
  static get isActive() { return true; }
  /** @abstract */
  static set isActive(value) { throw new NotImplementedError(); }

  static createAccessor() {
    const entryCount = this.entryCount;
    /** @type {object[]} */
    const zeroIndexed = Array.range(1, entryCount).map(id => new this(id));
    const oneIndexed = [null, ...zeroIndexed];
    /** @param {number} id */
    const accessor = id => oneIndexed[id];
    Object.defineProperties(accessor, {
      oneIndexed: { get: () => oneIndexed },
      zeroIndexed: { get: () => zeroIndexed },
      entryCount: { get: () => entryCount },
      anyUnlocked: { get: () => zeroIndexed.some(x => x.isUnlocked) },
      allUnlocked: { get: () => zeroIndexed.every(x => x.isUnlocked) },
      allActive: { get: () => zeroIndexed.every(x => x.isActive) },
      groupName: { get: () => this.autobuyerGroupName },
      isActive: {
        get: () => this.isActive,
        set: value => { this.isActive = value; },
      },
    });
    accessor.toggle = () => this.isActive = !this.isActive;
    return accessor;
  }
}