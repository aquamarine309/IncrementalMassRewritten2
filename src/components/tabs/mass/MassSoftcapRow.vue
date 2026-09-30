<script>
import Decimal from "break_eternity.js";

export default {
  name: "MassSoftcapRow",
  props: {
    softcap: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      start: new Decimal()
    };
  },
  computed: {
    level() {
      return this.softcap.id + 1;
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.softcap.isEffectActive;
      if (!this.isUnlocked) return;
      this.start = this.softcap.mass;
    }
  }
};
</script>

<template>
  <div
    v-if="isUnlocked"
    class="c-mass-softcap-row"
  >
    {{ $tc("mass_softcap", level, { mass: formatMass(start), level }) }}
  </div>
</template>