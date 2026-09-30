import TWEEN from "tween.js";

import eruda from "eruda";

import { deepmergeAll } from "./utility/deepmerge";

window.onload = function() {
  GameUI.initialized = true;
  ui.view.initialized = true;
};

function isLocalEnvironment() {
  const href = window.location.href;
  return href.includes("file") || href.includes("127.0.0.1") || href.includes("localhost");
}

export async function init() {
  GameStorage.init();
  Tabs.all.find(t => t.config.id === player.options.lastOpenTab)?.show(true);
  if (import.meta.env.DEV && isLocalEnvironment()) {
    const { default: eruda } = await import("eruda");
    eruda.init();
  }
}

export function applyAutoprestige(preQu) {
  if (BHUpgrade(5).canBeApplied || AtomUpgrade(5).canBeApplied) Currency.ragePowers.tick(preQu);
  if (AtomUpgrade(5).canBeApplied) Currency.darkMatter.tick(preQu);
  if (GameElement(14).canBeApplied) Currency.quark.tick(preQu.times(0.05 + GameElement(16).effectOrDefault(0)));
  if (GameElement(24).canBeApplied) Currency.atoms.tick(preQu);
  if (GameElement(30).canBeApplied && !Challenge(9).canBeApplied) {
    for (const particle of Particles.all) {
      particle.amount = particle.amount.add(Currency.quark.value.div(10).times(preQu));
    }
  }
}

export function updateTime(diff) {
  const time = player.time;
  time.supernova += diff;
  time.quantum += diff;
}

export function simulateTime(seconds, fast = false) {
  // The game is simulated at a base 50ms update rate, with a maximum tick count based on the values of real and fast
  // - Calling with real === true will always simulate at full accuracy with no tick count reduction unless it would
  //   otherwise simulate with more ticks than offline progress would allow
  // - Calling with fast === true will only simulate it with a max of 50 ticks
  // - Otherwise, tick count will be limited to the offline tick count (which may be set externally during save import)
  // Tick count is never *increased*, and only ever decreased if needed.
  if (seconds < 0) return;
  let ticks = Math.floor(seconds * 20);

  // Limit the tick count (this also applies if the black hole is unlocked)
  const maxTicks = Math.min(1000 * seconds / 33, 1e5);
  if (ticks > maxTicks && !fast) {
    ticks = maxTicks;
  } else if (ticks > 50 && fast) {
    ticks = 50;
  }

  const playerStart = deepmergeAll([{}, player]);

  let remainingRealSeconds = seconds;
  // During async code the number of ticks remaining can go down suddenly
  // from "Speed up" which means tick length needs to go up, and thus
  // you can't just divide total time by total ticks to get tick length.
  // For example, suppose you had 6000 offline ticks, and called "Speed up"
  // 1000 ticks in, meaning that after "Speed up" there'd only be 1000 ticks more
  // (so 1000 + 1000 = 2000 ticks total). Dividing total time by total ticks would
  // use 1/6th of the total time before "Speed up" (1000 of 6000 ticks), and 1/2 after
  // (1000 of 2000 ticks). Short of some sort of magic user prediction to figure out
  // whether the user *will* press "Speed up" at some point, dividing remaining time
  // by remaining ticks seems like the best thing to do.
  const loopFn = i => {
    const diff = remainingRealSeconds / i;
    GameLoop.tick(1000 * diff);
    remainingRealSeconds -= diff;
  };

  // We don't show the offline modal here or bother with async if doing a fast simulation
  if (fast) {
    // Fast simulations happen when simulating between 10 and 50 seconds of offline time.
    // One easy way to get this is to autosave every 30 or 60 seconds, wait until the save timer
    // in the bottom-left hits 15 seconds, and refresh (without saving directly beforehand).
    GameLoop.stop();
    // Fast simulations are always 50 ticks. They're done in this weird countdown way because
    // we want to be able to call the same function that we call when using async code (to avoid
    // duplicating functions), and that function expects a parameter saying how many ticks are remaining.
    for (let remaining = 50; remaining > 0; remaining--) {
      loopFn(remaining);
    }
  } else {
    const progress = {};
    ui.view.modal.progressBar = {};
    Async.run(loopFn,
      ticks,
      {
        batchSize: 1,
        maxTime: 60,
        sleepTime: 1,
        asyncEntry: doneSoFar => {
          GameLoop.stop();
          ui.$viewModel.modal.progressBar = {
            label: i18n.t("calculating_offline_progress"),
            current: doneSoFar,
            max: ticks,
            startTime: Date.now(),
            buttons: [{
              text: i18n.t("speed_up"),
              condition: (current, max) => max - current > 500,
              click: () => {
                const newRemaining = Math.clampMin(Math.floor(progress.remaining / 2), 500);
                // We subtract the number of ticks we skipped, which is progress.remaining - newRemaining.
                // This, and the below similar code in "SKIP", are needed or the progress bar to be accurate
                // (both with respect to the number of ticks it shows and with respect to how full it is).
                progress.maxIter -= progress.remaining - newRemaining;
                progress.remaining = newRemaining;
                // We update the progress bar max data (remaining will update automatically).
                ui.$viewModel.modal.progressBar.max = progress.maxIter;
              }
            },
            {
              text: i18n.t("skip"),
              condition: (current, max) => max - current > 10,
              click: () => {
                // We jump to 10 from the end (condition guarantees there are at least 10 left).
                // We subtract the number of ticks we skipped, which is progress.remaining - 10.
                progress.maxIter -= progress.remaining - 10;
                progress.remaining = 10;
              }
            }]
          };
        },
        asyncProgress: doneSoFar => {
          ui.$viewModel.modal.progressBar.current = doneSoFar;
        },
        asyncExit: () => {
          ui.$viewModel.modal.progressBar = undefined;
          GameLoop.start();
        },
        then: () => {
          afterSimulation(seconds, playerStart);
        },
        progress
      });
  }
}

function afterSimulation(seconds, playerBefore) {
  if (seconds > 600) {
    const playerAfter = deepmergeAll([{}, player]);
    Modal.awayProgress.show({ playerBefore, playerAfter, seconds });
  }
  GameStorage.save();
}

window.tweenTime = 0;
let lastFrame;
function animateTweens(time) {
  requestAnimationFrame(animateTweens);
  if (time === undefined || lastFrame === undefined) {
    lastFrame = time;
    return;
  }
  let delta = (time - lastFrame) / 12;
  lastFrame = time;
  if (player.dilation.active) {
    delta /= 2;
  }
  tweenTime += delta;
  TWEEN.update(tweenTime);
}

animateTweens();

