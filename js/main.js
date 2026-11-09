/* ==========================================================================
   Ahmad CCTV Solutions — main.js
   Mobile nav, scroll reveal, header shadow, stat counters, feed clock.
   No dependencies.
   ========================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Mobile hamburger navigation ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primary-nav');

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('nav-open');
  }

  function openNav() {
    if (!nav || !toggle) return;
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    document.body.classList.add('nav-open');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close after tapping any link inside the menu
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    // Close on Escape, return focus to the button
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        toggle.focus();
      }
    });

    // Reset state if the viewport grows past the mobile breakpoint
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeNav();
    });
  }

  /* ---------- 2. Header shadow once scrolled ---------- */
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 3. Reveal on scroll (respects reduced motion) ---------- */
  var revealItems = document.querySelectorAll('.reveal');

  function showAll() {
    for (var i = 0; i < revealItems.length; i++) {
      revealItems[i].classList.add('is-visible');
    }
  }

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Stagger siblings slightly for a smoother cascade
        var siblings = Array.prototype.slice.call(el.parentElement.children);
        var delay = Math.min(siblings.indexOf(el), 5) * 80;
        setTimeout(function () { el.classList.add('is-visible'); }, delay);
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    for (var r = 0; r < revealItems.length; r++) {
      revealObserver.observe(revealItems[r]);
    }
  }

  /* ---------- 4. Animated stat counters ---------- */
  var counters = document.querySelectorAll('[data-count]');

  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;

    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }

    var duration = 1400;
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      for (var c = 0; c < counters.length; c++) runCounter(counters[c]);
    } else {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          countObserver.unobserve(entry.target);
        });
      }, { threshold: 0.5 });

      for (var k = 0; k < counters.length; k++) countObserver.observe(counters[k]);
    }
  }

  /* ---------- 5. Live clock in the hero camera feed ---------- */
  var clock = document.getElementById('feedClock');
  if (clock) {
    var pad = function (n) { return n < 10 ? '0' + n : String(n); };
    var tick = function () {
      var now = new Date();
      clock.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- 6. Footer copyright year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- 7. Progressive enhancement flag ---------- */
  document.documentElement.classList.remove('no-js');
})();
