/*
 * Portada de bienvenida (reutilizable).
 * Busca un elemento con data-cover y un botón con data-cover-open dentro de él.
 * Al tocar el botón: oculta la portada y avisa a music.js para que empiece la música
 * (el toque del visitante es lo que permite que el navegador deje sonar el audio).
 */
(function () {
  "use strict";

  var cover = document.querySelector("[data-cover]");
  if (!cover) return;

  var openBtn = cover.querySelector("[data-cover-open]");
  if (!openBtn) return;

  var root = document.documentElement;
  var closed = false;

  // Bloquea el scroll mientras la portada está abierta.
  root.classList.add("cover-open");
  openBtn.focus({ preventScroll: true });

  function finish() {
    cover.hidden = true;
    var main = document.getElementById("main");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
  }

  function closeCover() {
    if (closed) return;
    closed = true;

    // Aviso para music.js: aquí hay un gesto válido del visitante.
    document.dispatchEvent(new CustomEvent("music:play"));

    cover.classList.add("is-hidden");
    cover.setAttribute("aria-hidden", "true");
    root.classList.remove("cover-open");
    window.scrollTo(0, 0);

    cover.addEventListener("transitionend", finish, { once: true });
    setTimeout(finish, 1200); // respaldo por si no hay transición
  }

  openBtn.addEventListener("click", closeCover);
})();
