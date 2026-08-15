/* ============================================================
   Ибраева Кыял — сайт-визитка
   Навигация, скролл, анимации появления, форма
   ============================================================ */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ---------- Header: тень при прокрутке ---------- */
  var header = document.getElementById('header');
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Мобильное меню ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function toggleMenu(force) {
    var open = typeof force === 'boolean' ? force : !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    document.body.classList.toggle('no-scroll', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () { toggleMenu(); });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { toggleMenu(false); });
    });
  }

  /* ---------- Анимация появления при скролле ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el, i) {
      el.style.setProperty('--d', (i % 6) * 0.06 + 's');
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Активная ссылка в меню при прокрутке ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var current = '';

  function onScrollSpy() {
    if (window.scrollY < 200) { current = ''; }
    var pos = window.scrollY + 120;
    sections.forEach(function (sec) {
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        current = sec.id;
      }
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScrollSpy, { passive: true });
  onScrollSpy();

  /* ---------- Форма обратной связи ---------- */
  var form = document.getElementById('contact-form');
  var success = document.getElementById('form-success');

  function setError(input, invalid) {
    if (invalid) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.name;
      var phone = form.phone;
      var message = form.message;
      var valid = true;

      [name, phone, message].forEach(function (input) {
        setError(input, !input.value.trim());
        if (!input.value.trim()) valid = false;
      });

      if (!valid) return;

      if (success) {
        success.classList.remove('is-visible');
        void success.offsetWidth;
        success.classList.add('is-visible');
      }
      form.reset();
      setTimeout(function () {
        if (success) success.classList.remove('is-visible');
      }, 6000);
    });

    [form.name, form.phone, form.message].forEach(function (input) {
      input.addEventListener('input', function () { setError(input, false); });
    });
  }

  /* ---------- Год в копирайте ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
