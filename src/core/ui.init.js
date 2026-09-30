import { reactive } from "vue";

export const state = reactive({
  view: {
    modal: {
      queue: [],
      current: undefined,
      progressBar: undefined,
    },
    tab: "main",
    subtab: "mass",
    initialized: false,
    expandBits: 0,
    resourceTooltipId: -1,
    selectedNodeId: "",
    neutronTree: 0,
    selectedFermionId: -1
  }
});