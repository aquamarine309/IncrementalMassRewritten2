import { DC } from "@/core/constants";

export const quantumChallenges = [
  {
    id: 0,
    description: effects => i18n.t("quantum_challenge_0_description", {
      stars: formatPow(effects.stars),
      generators: formatPow(effects.generators)
    }),
    effects: {
      stars: value => DC.D1.minus(DC.D0_03.times(value)),
      generators: value => DC.D2.div(DC.D2.add(value))
    }
  },
  {
    id: 1,
    description: effect => i18n.t("quantum_challenge_1_description", {
      effect: format(effect)
    }),
    effect: value => {
      if (value > 35) return DC.D2.pow(Math.pow(value, 5) / 5000);
      if (value > 10) return DC.D2.pow(Math.pow(value, 5) / 1000);
      return DC.D2.pow(Math.pow(value, 2));
    }
  },
  {
    id: 2,
    description: effect => i18n.t("quantum_challenge_2_description", {
      effect: formatX(effect)
    }),
    effect: value => 0.15 * Math.pow(value, value > 10 ? 3.5 : 1.5) + 1
  },
  {
    id: 3,
    description: value => i18n.t("quantum_challenge_3_description", {
      value: formatPow(value)
    }),
    effect: value => {
      if (value > 50) return DC.D0_9.pow(Math.pow(value, 6.25) / 8000);
      if (value > 10) return DC.D0_9.pow(Math.pow(value, 3.25) / 100);
      return DC.D0_9.pow(Math.pow(value, 1.25));
    }
  },
  {
    id: 4,
    description: value => i18n.t("quantum_challenge_4_description", {
      value: formatPow(value)
    }),
    effect: value => {
      if (value > 50) return DC.D0_8.pow(Math.pow(value, 2.5) / 100);
      if (value > 10) return DC.D0_8.pow(Math.pow(value, 2) / 100);
      return DC.D0_8.pow(Math.pow(value, 1.25));
    }
  },
  {
    id: 5,
    description: effect => i18n.t("quantum_challenge_5_description", {
      effect: formatX(effect)
    }),
    effect: value => {
      if (value > 10) return DC.D1_2.pow(Math.pow(value, 1.5) / 10).min(DC.E300);
      return DC.D1_2.pow(value);
    }
  },
  {
    id: 6,
    description: effect => i18n.t("quantum_challenge_6_description", {
      effect: formatPow(effect)
    }),
    effect: value => {
      if (value > 10) return Math.pow(value, 4.5) / 2000 + 1;
      return Math.pow(value, 1.5) / 2 + 1;
    }
  },
  {
    id: 7,
    description: effects => i18n.t("quantum_challenge_7_description", {
      starting: formatPow(effects.starting),
      strength: formatPercents(effects.strength)
    }),
    effects: {
      starting: value => {
        if (value > 10) return DC.D0_49;
        return DC.D1.minus(DC.D0_05.times(value));
      },
      strength: value => {
        if (value > 16) return Math.pow(value, 3) / 5000 + 1;
        if (value > 10) return Math.pow(value, 2) / 1000 + 1;
        return value / 10 + 1;
      }
    }
  }
];