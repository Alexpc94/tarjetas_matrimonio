/*
 * Botón de música de fondo (reutilizable).
 * No hay que editar este archivo: la canción y las opciones se configuran
 * con atributos data-* en el botón del HTML.
 *
 *   data-music-src="/audios/cancion.mp3"   Ruta de la canción (obligatorio)
 *   data-music-volume="0.25"               Volumen de 0 a 1 (opcional, por defecto 0.25)
 *   data-music-autostart="true"            Intenta empezar con la actividad del visitante (opcional, por defecto true)
 */
(function () {
  "use strict";

  var btn = document.querySelector("[data-music-src]");
  if (!btn) return;

  var src = btn.dataset.musicSrc;
  var volume = parseFloat(btn.dataset.musicVolume);
  if (isNaN(volume)) volume = 0.25;
  volume = Math.min(1, Math.max(0, volume));
  var autoStart = btn.dataset.musicAutostart !== "false";

  var audio = new Audio(src);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = volume;

  var fadeTimer;
  var stoppedByUser = false;
  var lastTry = 0;

  // Actividad que intenta iniciar la música. Los navegadores solo aceptan
  // algunas (clic, toque, tecla); el scroll y el movimiento del mouse se
  // intentan igual, pero pueden ser rechazados hasta que haya un toque o clic.
  var strongEvents = ["pointerdown", "pointerup", "mousedown", "touchstart", "touchend", "click", "keydown"];
  var weakEvents = ["wheel", "touchmove", "scroll", "mousemove"];
  var allEvents = strongEvents.concat(weakEvents);
  var listenerOptions = { passive: true, capture: true };

  // Entrada suave: el volumen sube poco a poco en unos 2,5 segundos.
  function fadeIn() {
    clearInterval(fadeTimer);
    audio.volume = 0;
    fadeTimer = setInterval(function () {
      audio.volume = Math.min(volume, audio.volume + volume / 25);
      if (audio.volume >= volume) clearInterval(fadeTimer);
    }, 100);
  }

  function setState(playing) {
    btn.classList.toggle("is-playing", playing);
    btn.setAttribute("aria-pressed", String(playing));
    btn.setAttribute("aria-label", playing ? "Detener la música de fondo" : "Activar la música de fondo");
    btn.title = playing ? "Detener música" : "Activar música";
  }

  function stopWatching() {
    allEvents.forEach(function (name) {
      window.removeEventListener(name, tryAutoStart, listenerOptions);
    });
  }

  function tryAutoStart(event) {
    // El clic sobre el propio botón lo maneja el botón.
    if (event.target && event.target.closest && event.target.closest("[data-music-src]")) return;

    if (stoppedByUser) {
      stopWatching();
      return;
    }

    // Para no insistir en cada pixel de scroll o movimiento, se intenta cada 0,5 s.
    if (weakEvents.indexOf(event.type) !== -1) {
      var now = Date.now();
      if (now - lastTry < 500) return;
      lastTry = now;
    }

    audio
      .play()
      .then(stopWatching)
      .catch(function () {});
  }

  audio.addEventListener("play", function () {
    setState(true);
    fadeIn();
  });

  audio.addEventListener("pause", function () {
    setState(false);
  });

  // Si el archivo no existe o no carga, el botón queda en "detenido".
  audio.addEventListener("error", function () {
    setState(false);
  });

  btn.addEventListener("click", function () {
    if (audio.paused) {
      stoppedByUser = false;
      audio.play().catch(function () {});
    } else {
      stoppedByUser = true;
      audio.pause();
    }
  });

  setState(false);

  if (autoStart) {
    allEvents.forEach(function (name) {
      window.addEventListener(name, tryAutoStart, listenerOptions);
    });
  }
})();
