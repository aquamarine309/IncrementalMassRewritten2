<script>
export default {
  name: "MainUpgradeButton",
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isAffordable: false,
      isBought: false
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    buttonStyle() {
      return {
        "background-image": `url("${this.upgrade.url}")`
      };
    },
    buttonClass() {
      if (this.isBought) return "c-main-upgrade-btn--bought";
      if (this.isAffordable) return "c-main-upgrade-btn--available";
      return "";
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isUnlocked = upgrade.isUnlocked;
      if (!this.isUnlocked) return;
      this.isAffordable = upgrade.isAffordable;
      this.isBought = upgrade.isBought;
    },
    purchase() {
      this.upgrade.purchase();
    }
  }
};
</script>

<template>
  <Button
    v-if="isUnlocked"
    class="c-main-upgrade-btn"
    :class="buttonClass"
    :style="buttonStyle"
    @click="purchase"
  />
</template>

<style scoped>
.c-main-upgrade-btn {
  border: none;
  background-size: contain;
  background-color: #171717;
}

.light-theme .c-main-upgrade-btn {
  background-color: #505050;
}

.light-theme .c-main-upgrade-btn--available {
  background-color: #808080;
}

.c-main-upgrade-btn--available {
  background-color: #444444;
}

.c-main-upgrade-btn--bought {
  background-color: var(--color-bought) !important;
}
</style>