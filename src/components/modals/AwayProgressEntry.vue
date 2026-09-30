<script>
import Decimal from "break_eternity.js";

export default {
  name: "AwayProgressEntry",
  props: {
    name: {
      type: String,
      required: true
    },
    playerBefore: {
      type: Object,
      required: true
    },
    playerAfter: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      removed: false,
    };
  },
  computed: {
    item() {
      return AwayProgressTypes.all[this.name];
    },
    before() {
      return this.item.navigateTo(this.playerBefore);
    },
    after() {
      return this.item.navigateTo(this.playerAfter);
    },
    formatBefore() {
      return this.formatPseudo(this.before);
    },
    formatAfter() {
      return this.formatPseudo(this.after);
    },
    classObject() {
      return {
        [this.item.classObject]: !this.removed,
        "c-modal-away-progress__disabled": this.removed,
      };
    },
    formattedName() {
      return this.item.formatName;
    },
    increased() {
      if (this.formatAfter === this.formatBefore) return false;
      const before = this.before;
      const after = this.after;

      return after instanceof Decimal
        ? after.gt(before)
        : after > before;
    },
    show() {
      if (!this.item.appearsInAwayModal) return false;
      const show = this.increased && this.item.option && this.item.isUnlocked();
      if (show) this.$emit("something-happened");
      return show;
    }
  },
  methods: {
    // We want different formatting above and below 1e9 to improve readability
    formatPseudo(number) {
      if (number === undefined) return "";
      return format(number, 2);
    },
    hideEntry() {
      this.removed = !this.removed;
      this.item.option = !this.item.option;
    }
  }
};
</script>

<template>
  <div
    v-if="show"
    @click="hideEntry"
  >
    <span>
      <b :class="classObject">{{ formattedName }}</b>
      increased from
      {{ formatBefore }} to {{ formatAfter }}
    </span>
  </div>
</template>

<style scoped>
.c-modal-away-progress__rage-powers {
  color: var(--color-rage-powers);
}

.c-modal-away-progress__dark-matter,
.c-modal-away-progress__black-hole {
  color: var(--color-dark-matter);
}

.c-modal-away-progress__quark {
  animation: a-quark 6s cubic-bezier(0.37, 0, 0.63, 1) infinite;
}

.c-modal-away-progress__relativistic-particles,
.c-modal-away-progress__dilated-mass {
  color: var(--color-dilation);
}

.c-modal-away-progress__collapsed-stars,
.c-modal-away-progress__neutron-stars,
.c-modal-away-progress__photon,
.c-modal-away-progress__gluon {
  color: var(--color-supernova);
}

.c-modal-away-progress__u-quark {
  color: var(--color-fermion-quark);
}

.c-modal-away-progress__u-lepton {
  color: var(--color-fermion-lepton);
}

.c-modal-away-progress__disabled b,
.c-modal-away-progress__disabled {
  font-style: italic;
  color: #303030;
  text-shadow: 0 0 0.3rem #303030;
  text-decoration: line-through;
  animation: none;
}
</style>
