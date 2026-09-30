<script>
import ElementComponent from "./ElementComponent";
import ElementInfo from "./ElementInfo";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ElementsTab",
  components: {
    ElementComponent,
    ElementInfo,
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      selected: 0,
      auto: false,
      autoUnlocked: false,
      supernova: false
    };
  },
  computed: {
    elements() {
      return GameElements.all;
    },
    names() {
      return this.$t("element_names").split("|");
    },
    symbols() {
      return this.$t("element_symbols").split("|");
    },
  },
  watch: {
    auto(value) {
      Autobuyer.element.isActive = value;
    }
  },
  methods: {
    update() {
      this.autoUnlocked = Autobuyer.element.isUnlocked;
      this.auto = Autobuyer.element.isActive;
      this.supernova = PlayerProgress.supernovaUnlocked();
    },
    handleClick(id) {
      this.selected = id;
    },
    buyMax() {
      GameElements.buyMax();
    }
  }
};
</script>

<template>
  <div>
    <div>
      <PrimaryButton
        v-if="supernova"
        class="o-buy-max-element-button"
        @click="buyMax"
      >
        {{ $t("buy_max") }}
      </PrimaryButton>
      <PrimaryToggleButton
        v-if="autoUnlocked"
        v-model="auto"
        i18n-key="auto_X"
      />
    </div>
    <ElementInfo
      :element="elements[selected - 1]"
      :name="names[selected - 1]"
    />
    <div class="l-element-table-container">
      <ElementComponent
        v-for="(element, idx) in elements"
        :key="element.id"
        :element="element"
        :name="symbols[idx]"
        :is-selected="element.id === selected"
        @click="handleClick(element.id)"
      />
    </div>
  </div>
</template>

<style scope>
.o-buy-max-element-button {
  margin: 0 6px;
}
</style>