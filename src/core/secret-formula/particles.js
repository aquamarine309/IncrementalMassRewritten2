export const particles = {
  proton: {
    id: 0,
    key: "proton",
    effect: () => {
      const mass = Atom.protonMass();
      const tickspeed = Atom.protonTick();
      return i18n.t("particle_proton_effect", {
        mass: formatX(mass),
        tickspeed: formatPercents(tickspeed)
      });
    }
  },
  neutron: {
    id: 1,
    key: "neutron",
    effect: () => {
      const rp = Atom.neutronRP();
      const mass = Atom.neutronMass();
      return i18n.t("particle_neutron_effect", {
        rp: formatX(rp),
        mass: formatX(mass)
      });
    }
  },
  electron: {
    id: 2,
    key: "electron",
    effect: () => {
      const dm = Atom.electronDM();
      const condenser = Atom.electronCondenser();
      return i18n.t("particle_electron_effect", {
        dm: formatX(dm),
        condenser: format(condenser)
      });
    }
  }
};