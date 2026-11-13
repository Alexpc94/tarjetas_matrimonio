/* =====================================================================
   Everly — template behaviour (vanilla JS, zero dependencies)
   ===================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Sticky header ------------------------------------------------ */
  function initHeader() {
    var header = document.getElementById("siteHeader");
    if (!header) return;

    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 40);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Mobile navigation -------------------------------------------- */
  function initMobileNav() {
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("navMenu");
    var backdrop = document.getElementById("navBackdrop");

    if (!toggle || !menu) return;

    var open = function (state) {
      menu.classList.toggle("open", state);
      toggle.setAttribute("aria-expanded", state ? "true" : "false");
      toggle.setAttribute("aria-label", state ? "Close menu" : "Open menu");

      if (backdrop) {
        backdrop.hidden = false;
        backdrop.classList.toggle("show", state);
      }

      document.body.style.overflow = state ? "hidden" : "";
    };

    toggle.addEventListener("click", function () {
      open(!menu.classList.contains("open"));
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        open(false);
      });
    }

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) open(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        open(false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 767 && menu.classList.contains("open")) {
        open(false);
      }
    });
  }

  /* ---- Countdown ---------------------------------------------------- */
  function initCountdown() {
    var box = document.getElementById("countdown");
    if (!box) {
      console.warn("No se encontró el elemento #countdown");
      return;
    }

    var date = box.getAttribute("data-date");

    // Interpretar la fecha en la zona horaria local.
    var target = new Date(date).getTime();

    if (isNaN(target)) {
      console.error("La fecha del contador no es válida:", date);
      return;
    }

    var els = {
      days: document.getElementById("cd-days"),
      hours: document.getElementById("cd-hours"),
      mins: document.getElementById("cd-mins"),
      secs: document.getElementById("cd-secs"),
      chip: document.getElementById("chipDays"),
    };

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function tick() {
      var diff = target - Date.now();

      if (diff <= 0) {
        diff = 0;
      }

      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      var secs = Math.floor((diff % 60000) / 1000);

      if (els.days) els.days.textContent = days;
      if (els.hours) els.hours.textContent = pad(hours);
      if (els.mins) els.mins.textContent = pad(mins);
      if (els.secs) els.secs.textContent = pad(secs);
      if (els.chip) els.chip.textContent = days;
    }

    // Mostrar los valores inmediatamente.
    tick();

    // Actualizar cada segundo.
    var timer = setInterval(function () {
      tick();

      if (Date.now() >= target) {
        clearInterval(timer);
      }
    }, 1000);
  }

  /* ---- Scroll-spy active nav link ----------------------------------- */
  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-menu a[href^="#"]'));

    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var sec = document.getElementById(id);

      if (sec) {
        map[id] = link;
        sections.push(sec);
      }
    });

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            links.forEach(function (l) {
              l.classList.remove("active");
            });

            var active = map[entry.target.id];
            if (active) active.classList.add("active");
          }
        });
      },
      {
        rootMargin: "-45% 0px -50% 0px",
        threshold: 0,
      }
    );

    sections.forEach(function (s) {
      obs.observe(s);
    });
  }

  /* ---- Reveal on scroll --------------------------------------------- */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("in");
      });
      return;
    }

    var obs = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08,
      }
    );

    items.forEach(function (el) {
      obs.observe(el);
    });
  }

  /* ---- RSVP form (front-end only) ----------------------------------- */
  function initRsvp() {
    var form = document.getElementById("rsvpForm");
    var success = document.getElementById("rsvpSuccess");

    if (!form || !success) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var declined = form.querySelector('input[name="attending"]:checked');

      if (declined && declined.value === "no") {
        success.innerHTML = "Thank you for letting us know — you'll be missed. We'll raise a glass to you! 🥂";
      }

      form.style.display = "none";
      success.classList.add("show");

      success.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
      });
    });
  }

  /* ---- Boot --------------------------------------------------------- */
  function boot() {
    initHeader();
    initMobileNav();
    initCountdown();
    initScrollSpy();
    initReveal();
    initRsvp();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
