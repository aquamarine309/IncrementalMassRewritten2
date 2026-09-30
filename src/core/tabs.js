class SubtabState {
  constructor(parent, config) {
    this._parent = parent;
    this.config = config;
  }

  get name() {
    return i18n.t(`tab_${this._parent.key}_${this.key}`);
  }

  get shortName() {
    return i18n.t(`tab_${this._parent.key}_${this.key}_short`);
  }

  get symbol() {
    return this.config.symbol;
  }

  get isPermanentlyHidden() {
    return false;
  }

  get hidable() {
    return this.config.hidable;
  }

  get isHidden() {
    return ((player.options.hiddenSubtabBits[this._parent.id] & (1 << this.id)) !== 0) &&
      this.hidable;
  }

  get isUnlocked() {
    return this.config.condition === undefined || this.config.condition();
  }

  get isAvailable() {
    return !this.isPermanentlyHidden && (this.isOpen || !this.isHidden && this.isUnlocked);
  }

  get key() {
    return this.config.key;
  }

  get id() {
    return this.config.id;
  }

  show(manual) {
    this._parent.show(manual, this);
  }

  unhideTab() {
    this._parent.unhideTab();
    player.options.hiddenSubtabBits[this._parent.id] &= ~(1 << this.id);
  }

  toggleVisibility() {
    if (this._parent.id === Tabs.current.id && this.id === Tabs.current._currentSubtab.id) return;
    player.options.hiddenSubtabBits[this._parent.id] ^= (1 << this.id);
  }

  get isOpen() {
    return ui.view.tab === this._parent.key && ui.view.subtab === this.key;
  }
}

function findLastOpenSubtab(tabId, subtabs) {
  return subtabs.find(s => s.id === player.options.lastOpenSubtab[tabId]) ?? subtabs[0];
}

function cycleThroughSubtabs(subtabs, currentSubtab) {
  const availableTabs = subtabs.filter(tab => tab.isAvailable);
  const currentIndex = availableTabs.indexOf(currentSubtab);
  const direction = ui.view.shiftDown ? -1 : 1;
  let newIndex = currentIndex + direction;
  newIndex = newIndex < 0 ? availableTabs.length - 1 : newIndex;
  newIndex = newIndex > availableTabs.length - 1 ? 0 : newIndex;
  return availableTabs[newIndex];
}

class TabState {
  constructor(config) {
    this.config = config;
    this.isOpened = false;
    const subtabs = [];
    for (const subtabConfig of config.subtabs) {
      const subtab = new SubtabState(this, subtabConfig);
      this[subtabConfig.key] = subtab;
      subtabs.push(subtab);
    }
    this.subtabs = subtabs;
    this._currentSubtab = findLastOpenSubtab(this.id, subtabs);
  }

  get name() {
    return i18n.t(`tab_${this.key}`);
  }

  get letter() {
    return i18n.t(`tab_${this.key}_letter`);
  }

  get symbol() {
    return this.config.symbol;
  }

  get key() {
    return this.config.key;
  }

  get id() {
    return this.config.id;
  }

  get isPermanentlyHidden() {
    return false;
  }

  get hidable() {
    return this.config.hidable;
  }

  get isHidden() {
    const hasVisibleSubtab = this.subtabs.some(t => t.isAvailable);
    return (((player.options.hiddenTabBits & (1 << this.id)) !== 0) || !hasVisibleSubtab) && this.hidable;
  }

  get isUnlocked() {
    return this.config.condition === undefined || this.config.condition();
  }

  get isAvailable() {
    return !this.isPermanentlyHidden && (this.isOpen || !this.isHidden && this.isUnlocked);
  }

  get isOpen() {
    return ui.view.tab === this.key;
  }

  show(manual, subtab = undefined) {
    if (!manual && !player.options.automaticTabSwitching) return;
    if (subtab !== undefined) {
      this._currentSubtab = subtab;
    } else if (ui.view.tab === this.key && ui.view.initialized && manual) {
      this._currentSubtab = cycleThroughSubtabs(this.subtabs, this._currentSubtab);
    } else {
      this._currentSubtab = findLastOpenSubtab(this.id, this.subtabs);
    }

    if (!this._currentSubtab.isUnlocked) this.resetToUnlocked();
    if (!this._currentSubtab.isAvailable) this.resetToAvailable();

    ui.view.tab = this.key;
    ui.view.subtab = this._currentSubtab.key;

    if (manual) Modal.hideAll();
    EventHub.dispatch(GAME_EVENT.TAB_CHANGED, this, this._currentSubtab);
  }

  unhideTab() {
    player.options.hiddenTabBits &= ~(1 << this.id);
  }

  toggleVisibility() {
    if (this.id === Tabs.current.id) return;
    player.options.hiddenTabBits ^= (1 << this.id);
  }

  resetToAvailable() {
    this._currentSubtab = this.subtabs.find(tab => tab.isAvailable);
    if (this._currentSubtab === undefined) {
      this._currentSubtab = this.subtabs[0];
      this._currentSubtab.unhideTab();
    }
  }

  resetToUnlocked() {
    this._currentSubtab = this.subtabs.find(tab => tab.isUnlocked);
  }
}

export const Tab = GameDatabase.tabs.mapToObject(
  config => config.key,
  config => new TabState(config)
);

export const Tabs = (function() {
  return {
    all: Object.values(Tab),
    get current() {
      return Tabs.all.find(tab => tab.isOpen);
    },
    currentUIFormat: [
      Tab.main,
      Tab.statistics,
      Tab.upgrades,
      Tab.challenges,
      Tab.atom,
      Tab.supernova,
      Tab.quantum,
      Tab.options
    ]
  };
}());

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  const currTab = Tabs.current.id;
  player.options.lastOpenTab = currTab;
  player.options.lastOpenSubtab[currTab] = Tabs.current._currentSubtab.id;
});
