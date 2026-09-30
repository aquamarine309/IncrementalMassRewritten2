<script>
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import CostDisplay from "@/components/CostDisplay";

export default {
  name: "ElementInfo",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay
  },
  props: {
    element: {
      type: Object,
      required: false
    },
    name: {
      type: String,
      required: false
    }
  },
  computed: {
    config() {
      return this.element.config;
    }
  }
};
</script>

<template>
  <div class="c-element-info-container">
    <div
      v-if="element"
      class="c-element-info"
    >
      <span class="c-sky">
        <span class="c-element-name">[{{ name }}]</span>
        <DescriptionDisplay
          :config="config"
        />
      </span>
      <CostDisplay
        :config="config"
        name-key="X_quark"
      />
      <EffectDisplay
        class="c-green"
        :config="config"
      />
    </div>
    <div v-else>
      Click an element to show info
    </div>
  </div>
</template>

<style scoped>
.c-element-info {
  font-size: 11px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px 0;
  min-height: 70px;
  border-top: 1px solid #bbbbbb;
  border-bottom: 1px solid #bbbbbb;
}

.c-element-info-container {
  margin: 15px 0;
}
</style>