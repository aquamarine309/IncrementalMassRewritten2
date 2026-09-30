<script>
import { isFunction, isString } from "@/utility/type-check";

/* eslint-disable no-empty-function */
export default {
  name: "DescriptionDisplay",
  props: {
    config: {
      type: Object,
      required: false,
      default: undefined
    },
    name: {
      type: String,
      required: false,
      default: undefined
    },
    length: {
      type: Number,
      required: false,
      default: undefined
    },
    titleKey: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return {
      isVisible: false,
      description: ""
    };
  },
  computed: {
    classObject() {
      const name = this.name;
      if (name === undefined) {
        return undefined;
      }
      const classes = {};
      classes[name] = true;
      if (this.description.length >= this.length) {
        classes[`${name}--small-text`] = true;
      }
      return classes;
    },
    descriptionText() {
      if (this.titleKey === "") return this.description;
      return i18n.t(this.titleKey, { value: this.description });
    }
  },
  watch: {
    config: {
      immediate: true,
      handler(config) {
        this.updateFunction = () => { };
        const description = config?.description;
        // Descriptions in config entries are occasionally used both as standalone statements and mid-sentence,
        // so we explicitly capitalize them here because this only shows up in standalone places
        const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
        const isUnlocked = config?.isUnlocked?.() ?? true;
        this.isVisible = description !== undefined && isUnlocked;
        if (!this.isVisible) return;

        if (isString(description)) {
          this.description = capitalize(description);
          return;
        }

        if (!isFunction(description)) {
          throw new Error(`DescriptionDisplay config.description has ` +
            ` unsupported type "${typeof description}"`);
        }

        const value = description();

        if (isString(value)) {
          this.description = capitalize(value);
          this.updateFunction = () => this.description = capitalize(description());
          return;
        }

        throw new Error(`DescriptionDisplay config.description is a function ` +
          `which returns unsupported type "${typeof value}"`);
      }
    }
  },
  beforeCreate() {
    this.updateFunction = () => { };
  },
  methods: {
    update() {
      this.updateFunction();
    }
  },
};
</script>

<template>
  <span
    v-if="isVisible"
    :class="classObject"
  >
    {{ descriptionText }}
  </span>
</template>
