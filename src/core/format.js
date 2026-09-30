import { DC } from "./constants";
import Decimal from "break_eternity.js";

function isEND() {
  return false;
}

/**
 * @param {string} value
 * @param {number} index
 * @returns {String}
 */
function commaSection(value, index) {
  if (index === 0) {
    return value.slice(-3);
  }
  return value.slice(-3 * (index + 1), -3 * index);
}

/**
 * @param {string} value
 * @returns {String}
 */
function addCommas(value) {
  let string = "";
  const start = Math.ceil(value.length / 3);
  for (let i = start - 1; i >= 0; i--) {
    string += commaSection(value, i);
    if (i !== 0) string += ",";
  }
  return string;
}

/**
 * @param {String} value
 * @returns {String}
 */
function formatWithCommas(value) {
  const decimalPointSplit = value.split(".");
  decimalPointSplit[0] = decimalPointSplit[0].replace(/\w+$/gu, addCommas);
  return decimalPointSplit.join(".");
}

/**
 * @param {Decimal|number} value
 * @param {number} places
 * @param {number} layerExp
 * @returns {string}
 */
window.format = function format(value, places = 4, layerExp = 12) {
  if (!GameUI.initialized) {
    throw new Error("Cannot use format before the game initializes!");
  }
  if (isEND()) return i18n.t("end");

  const decimal = Decimal.fromValue_noAlloc(value);
  if (!decimal.isFinite()) return "NaN";
  if (decimal.sign < 0) return `-${format(decimal.neg(), places, layerExp)}`;
  if (decimal.sign === 0) return (0).toFixed(Math.min(places, 100));

  const log10Result = decimal.log10();
  const exp = log10Result.floor();
  const expNum = exp.toNumber();

  if (places > 1 && exp.lt(-places)) {
    return formatSmallNumber(decimal, log10Result, places, layerExp);
  }

  if (exp.lt(layerExp)) {
    const fixed = expNum <= 0 ? places : Math.max(places - expNum, 0);
    return formatWithCommas(decimal.toFixed(Math.min(fixed, 100)));
  }

  if (decimal.layer >= 5) {
    const layer = decimal.layer;
    const formatMag = layer < 1e9 ? decimal.mag.toFixed(4) : "";
    const formatLayer = format(layer, 0, layerExp);
    return `${formatMag}F${formatLayer}`;
  }

  return formatLargeNumber(decimal, exp, layerExp);
};

function formatSmallNumber(decimal, log10Result, places, layerExp) {
  let expFloor = log10Result.floor();
  const pow10ExpFloor = Decimal.pow10(expFloor);
  const mantissa = decimal.div(pow10ExpFloor);

  const negExpFloor = expFloor.neg();
  const be = negExpFloor.clampMin(1).log10().gte(9);

  let formatMantissa = be ? "" : mantissa.toFixed(4);
  if (formatMantissa === "10.0000") {
    formatMantissa = "1.0000";
    expFloor = expFloor.add(1);
  }

  const formatExponent = format(expFloor, 0, layerExp);
  return `${formatMantissa}e${formatExponent}`;
}

function formatLargeNumber(decimal, exp, layerExp) {
  const pow10Exp = Decimal.pow10(exp);
  const mantissa = decimal.div(pow10Exp);

  const be = exp.gt(1e9);
  let formatMantissa = be ? "" : mantissa.toFixed(4);
  if (formatMantissa === "10.0000") {
    formatMantissa = "1.0000";
    // eslint-disable-next-line no-param-reassign
    exp = exp.add(1);
  }

  const formatExponent = format(exp, 0, layerExp);
  return `${formatMantissa}e${formatExponent}`;
}

window.formatX = function formatX(value, places = 4) {
  return `×${format(value, places)}`;
};

window.formatDiv = function formatX(value, places = 4) {
  return `/${format(value, places)}`;
};

window.formatMult = function formatMult(value, places = 4) {
  if (Decimal.gt(value, 1)) return formatX(value, places);
  return formatDiv(value.recip(), places);
};

window.formatPlus = function formatX(value, places = 4) {
  return `+${format(value, places)}`;
};

window.formatPow = function formatPow(value, places = 4) {
  return `^${format(value, places)}`;
};

window.formatPercents = function formatPercents(value, places = 4) {
  const decimal = (value instanceof Decimal) ? value : new Decimal(value);
  return `${format(decimal.times(100), places)}%`;
};

const massDisplays = [
  { amount: new Decimal(1), key: "X_g" },
  { amount: new Decimal(1e3), key: "X_kg" },
  { amount: new Decimal(1e6), key: "X_tonne" },
  { amount: new Decimal(1.619e20), key: "X_mass_of_mount_everest" },
  { amount: new Decimal(5.972e27), key: "X_mass_of_earth" },
  { amount: new Decimal(1.989e33), key: "X_mass_of_sun" },
  { amount: new Decimal(2.9835e45), key: "X_mass_of_milky_way_galaxy" },
  { amount: new Decimal(1.5e56), key: "X_mass_of_universe" }
];

window.formatMass = function formatMass(mass, massDisplay = player.options.massDisplay) {
  const value = Decimal.fromValue_noAlloc(mass);
  switch (massDisplay) {
    case MASS_DISPLAY.DEFAULT: {
      if (value.lt(DC.D1)) {
        return formatMass(value, MASS_DISPLAY.ALWAYS_G);
      }
      if (value.gte(DC.D1_5E1000000056)) {
        return formatMass(value, MASS_DISPLAY.ALWAYS_MLT);
      }
      const last = massDisplays.last();
      if (value.gte(last.amount)) {
        return i18n.t(last.key, { value: format(value.div(last.amount)) });
      }
      let min = 0;
      let max = massDisplays.length;
      while (max !== min) {
        const index = Math.floor((max + min) / 2);
        if (value.gte(massDisplays[index].amount)) {
          min = index + 1;
        } else {
          max = index;
        }
      }
      const data = massDisplays[max - 1];
      return i18n.t(data.key, { value: format(value.div(data.amount)) });
    }
    case MASS_DISPLAY.ALWAYS_G: {
      return i18n.t("X_g", { value: format(value) });
    }
    case MASS_DISPLAY.ALWAYS_MLT: {
      const mlt = value.div(DC.D1_5E56).max(1).log10().div(DC.E9);
      return i18n.t("X_mass_of_multiverse", { value: format(mlt) });
    }
    case MASS_DISPLAY.IMPORTANT: {
      if (value.lt(DC.D1_5E1000000056)) {
        return formatMass(value, MASS_DISPLAY.ALWAYS_G);
      }
      return formatMass(value, MASS_DISPLAY.ALWAYS_MLT);
    }
  }
  return "Unknown Mass";
};

window.formatInt = function formatInt(value) {
  if (!GameUI.initialized) {
    throw new Error("Cannot use format before the game initializes!");
  }
  if (isEND()) return i18n.t("end");
  const number = (value instanceof Decimal) ? value.toNumber() : value;
  return number.toFixed(0);
};

window.formatGain = function formatGain(amount, gain, isMass) {
  const formatType = isMass ? formatMass : format;
  const next = amount.add(gain);
  const ticks = 1000 / player.options.updateRate;
  const logMult = next.max(1).log10().div(amount.max(1).log10());
  if (!isMass && logMult.gte(DC.E1) && amount.gte(DC.EE100)) {
    const ooms2 = logMult.log10().times(ticks);
    return `(+${format(ooms2)} ${i18n.t("ooms")}^2/${i18n.t("sec")})`;
  }
  const mult = next.div(amount);
  if (mult.gte(DC.E1) && amount.gte(DC.E100)) {
    const ooms = mult.log10().times(ticks);
    return `(+${format(ooms)} ${i18n.t("ooms")}/${i18n.t("sec")})`;
  }
  return `(+${formatType(gain)}/${i18n.t("sec")})`;
};

// For i18n
window.checkSingle = function checkSingle(decimal) {
  return decimal.eq(1) ? 1 : 0;
};