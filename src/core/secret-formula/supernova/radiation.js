import { DC } from "@/core/constants";

function firstBoost(index) {
  // Index of -1 refers Frequency
  const currency = (
    index === -1
      ? (() => Currency.frequency.value)
      : (() => RadiationType.all[index].distance)
  );
  return boost => Softcap.power(
    currency().add(1).log10().add(1).pow(boost),
    DC.E30,
    DC.D0_5
  );
}

const metaBoost = boost => boost.powEffectOf(NeutronUpgrade.rad4).pow(DC.D0_4).div(DC.D1_75);

export const radiation = {
  radio: {
    id: 0,
    key: "radio",
    requirement: DC.D0,
    boosts: [
      {
        id: 0,
        effect: firstBoost(-1),
        formatEffect: value => formatX(value)
      },
      {
        id: 1,
        effect: boost => boost.add(1).sqrt(),
        formatEffect: value => formatX(value)
      },
      {
        id: 2,
        effect: boost => boost.add(1).pow(DC.D0_25),
        formatEffect: value => formatPow(value)
      }
    ]
  },
  microwave: {
    id: 1,
    key: "microwave",
    requirement: DC.E6,
    boosts: [
      {
        id: 0,
        effect: firstBoost(0),
        formatEffect: value => formatX(value)
      },
      {
        id: 1,
        effect: boost => boost.sqrt().div(DC.E2),
        formatEffect: value => formatPlus(value)
      },
      {
        id: 2,
        effect: boost => Softcap.power(boost.add(1).pow(2), DC.E2, DC.D0_5),
        formatEffect: value => formatX(value)
      }
    ]
  },
  infrared: {
    id: 2,
    key: "infrared",
    requirement: DC.E13,
    boosts: [
      {
        id: 0,
        effect: firstBoost(1),
        formatEffect: value => formatX(value)
      },
      {
        id: 1,
        effect: boost => boost.add(1).cbrt(),
        formatEffect: value => formatX(value)
      },
      {
        id: 2,
        effect: metaBoost,
        formatEffect: value => formatPlus(value)
      }
    ]
  },
  visible: {
    id: 3,
    key: "visible",
    requirement: DC.E20,
    boosts: [
      {
        id: 0,
        effect: firstBoost(2),
        formatEffect: value => formatX(value)
      },
      {
        id: 1,
        effect: boost => boost.add(1).cbrt(),
        formatEffect: value => formatX(value)
      },
      {
        id: 2,
        effect: boost => Currency.frequency.value.add(1).log10().add(1).pow(boost),
        formatEffect: value => formatX(value)
      }
    ]
  },
  ultraviolet: {
    id: 4,
    key: "ultraviolet",
    requirement: DC.E26,
    boosts: [
      {
        id: 0,
        effect: firstBoost(3),
        formatEffect: value => formatX(value)
      },
      {
        id: 1,
        effect: boost => DC.E3.pow(boost.pow(0.9)),
        formatEffect: value => formatX(value)
      },
      {
        id: 2,
        effect: boost => {
          let cappedBoost = Softcap.power(boost, DC.D1_3E4, DC.D0_2);
          cappedBoost = Softcap.power(cappedBoost, DC.D400, DC.D0_5);
          return DC.D1_025.pow(cappedBoost);
        },
        formatEffect: value => formatX(value)
      }
    ]
  },
  xRay: {
    id: 5,
    key: "x_ray",
    requirement: DC.E33,
    boosts: [
      {
        id: 0,
        effect: firstBoost(4),
        formatEffect: value => formatX(value)
      },
      {
        id: 1,
        effect: boost => {
          let effect = boost.add(1).pow(DC.D0_25);
          effect = Softcap.power(effect, DC.D5, DC.D0_5);
          effect = Softcap.power(effect, DC.E24, DC.D0_5);
          return effect.clampMax(DC.E30);
        },
        cap: DC.E30,
        formatEffect: value => formatX(value)
      },
      {
        id: 2,
        effect: metaBoost,
        formatEffect: value => formatPlus(value)
      }
    ]
  },
  gammaRay: {
    id: 6,
    key: "gamma_ray",
    requirement: DC.E49,
    boosts: [
      {
        id: 0,
        effect: firstBoost(5),
        formatEffect: value => formatX(value)
      },
      {
        id: 1,
        effect: boost => {
          let effect = boost.add(1).pow(DC.D0_2);
          effect = Softcap.power(effect, DC.D3, DC.D0_5);
          effect = overflow(effect, DC.E24, DC.D0_5);
          return effect.clampMax(DC.E30);
        },
        cap: DC.E30,
        formatEffect: value => formatX(value)
      },
      {
        id: 2,
        effect: boost => boost.div(2).add(1).cbrt(),
        formatEffect: value => formatPow(value)
      }
    ]
  }
};