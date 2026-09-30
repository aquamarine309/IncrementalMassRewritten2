import { createApp, reactive } from "vue";
import { createI18n } from "vue-i18n";

import GameUIComponent from "@/components/GameUIComponent";
import { state } from "./ui.init";
import { notify } from "./notify";
import { messages } from "./languages";
import Vue3TouchEvents from "@3land/vue3-touch-events";

export const i18n = createI18n({
  locale: "en",
  messages,
  legacy: true,
  globalInjection: true,
});

const _plainCache = new Map();
const _paramCache = new Map();
const _PLAIN_MAX = 5000;
const _PARAM_MAX = 5000;

function makeCacheKey(key, params) {
  const keys = Object.keys(params);
  if (keys.length === 0) return key;
  let sig = key;
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    sig += `|${k}:${params[k]}`;
  }
  return sig;
}

i18n.t = function cachedT(key, params) {
  if (params === undefined || params === null) {
    let v = _plainCache.get(key);
    if (v === undefined) {
      v = i18n.global.t(key);
      if (_plainCache.size > _PLAIN_MAX) _plainCache.clear();
      _plainCache.set(key, v);
    }
    return v;
  }

  const cacheKey = makeCacheKey(key, params);
  let v = _paramCache.get(cacheKey);
  if (v === undefined) {
    v = i18n.global.t(key, params);
    if (_paramCache.size > _PARAM_MAX) _paramCache.clear();
    _paramCache.set(cacheKey, v);
  }
  return v;
};

i18n.tc = i18n.global.tc.bind(i18n.global);
i18n.te = i18n.global.te.bind(i18n.global);

export function invalidateI18nCache() {
  _plainCache.clear();
  _paramCache.clear();
}

export const recomputeState = reactive({ tick: 0 });

const globalMixin = {
  computed: {
    $viewModel() {
      return state.view;
    }
  },

  created() {
    if (this.update) {
      this.on$(GAME_EVENT.UPDATE, this.update);
      if (GameUI.initialized) {
        this.update();
      }
    }
  },

  beforeUnmount() {
    EventHub.ui.offAll(this);
  },

  methods: {
    format,
    formatX,
    formatPlus,
    formatPow,
    formatInt,
    formatPercents,
    formatMass,
    formatGain,
    formatDiv,
    formatMult,
    checkSingle,

    emitClick() {
      this.$emit("click");
    },
    emitInput(val) {
      this.$emit("input", val);
    },
    emitClose() {
      this.$emit("close");
    },
    on$(event, fn) {
      EventHub.ui.on(event, fn, this);
    },
    $recompute() {
      recomputeState.tick++;
    },
  }
};

export const GameUI = {
  notify,
  events: [],
  flushPromise: undefined,
  initialized: false,

  dispatch(event, args) {
    const index = this.events.indexOf(event);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
    if (event !== GAME_EVENT.UPDATE) {
      this.events.push([event, args]);
    }
    if (this.flushPromise) return;
    this.flushPromise = Promise.resolve()
      .then(this.flushEvents.bind(this));
  },

  flushEvents() {
    this.flushPromise = undefined;
    for (const event of this.events) {
      EventHub.ui.dispatch(event[0], event[1]);
    }
    EventHub.ui.dispatch(GAME_EVENT.UPDATE);
    this.events = [];
  },

  update() {
    this.dispatch(GAME_EVENT.UPDATE);
  }
};

export const ui = {
  get view() {
    return state.view;
  },
  get $viewModel() {
    return state.view;
  },
};

window.ui = ui;

const app = createApp(GameUIComponent);
app.use(i18n);
app.use(Vue3TouchEvents);
app.mixin(globalMixin);

const instance = app.mount("#ui");

Object.setPrototypeOf(ui, instance);