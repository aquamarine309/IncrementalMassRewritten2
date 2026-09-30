/* eslint-disable import/newline-after-import, import/first, import/order */
function mergeIntoGlobal(object) {
  for (const key in object) {
    if (key === "default") {
      // Skip default exports
      continue;
    }
    const value = object[key];
    const existingValue = window[key];
    if (existingValue !== undefined) {
      continue;
    }

    window[key] = value;
  }
}

import * as Utils from "./core/utils";
mergeIntoGlobal(Utils);

import * as GameDB from "./core/secret-formula";
mergeIntoGlobal(GameDB);

import * as Globals from "./core/globals";
mergeIntoGlobal(Globals);

import * as Game from "./game";
mergeIntoGlobal(Game);