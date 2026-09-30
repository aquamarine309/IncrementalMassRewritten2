class ResetState {
  constructor(config) {
    this.config = config;
    this._canResetLazy = new Lazy(() => this.config.canReset())
      .invalidateOn(GAME_EVENT.GAME_TICK_AFTER);
  }

  get canReset() {
    return this._canResetLazy.value;
  }

  requestReset() {
    if (!this.canReset) return;
    this.config.requestReset(() => this.resetLayer());
  }

  resetLayer(...args) {
    this.config.resetLayer(...args);
    this._canResetLazy.invalidate();
  }
}

export const Resets = mapGameDataToObject(
  GameDatabase.resets,
  config => new ResetState(config)
);