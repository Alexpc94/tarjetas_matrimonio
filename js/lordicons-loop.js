(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  function scheduleIcon(icon) {
    if (typeof icon.play !== "function") return;

    var state = icon.getAttribute("state");
    var playback;
    try {
      playback = icon.play(state ? { state: state } : undefined);
    } catch (error) {
      playback = false;
    }

    Promise.resolve(playback)
      .catch(function () {
        return false;
      })
      .then(function () {
        window.setTimeout(function () {
          scheduleIcon(icon);
        }, 3000);
      });
  }

  function init() {
    if (!("customElements" in window)) return;

    window.customElements.whenDefined("lord-icon").then(function () {
      var icons = Array.prototype.slice.call(document.querySelectorAll("lord-icon"));

      icons.forEach(function (icon) {
        icon.setAttribute("speed", "0.8");
        if (icon.readyPromise) {
          icon.readyPromise
            .then(function (ready) {
              if (ready) scheduleIcon(icon);
            })
            .catch(function () {});
        } else {
          scheduleIcon(icon);
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
