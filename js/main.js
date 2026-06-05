(function () {
  'use strict';

  var yearEl = document.getElementById('footerYear');
  if (yearEl) {
    var currentYear = Math.max(2026, new Date().getFullYear());
    if (currentYear === 2026) {
      yearEl.parentElement.innerHTML = '© 2026 htlabs.com.cn';
    } else {
      yearEl.textContent = currentYear;
    }
  }

  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');

  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    menu.querySelectorAll('.nav__link').forEach(function (l) {
      l.addEventListener('click', function () {
        toggle.classList.remove('open');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var el = e.target;
        var target = parseInt(el.dataset.target, 10);
        var duration = 1400;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          el.textContent = Math.floor(p * target);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stats__num').forEach(function (el) {
    counterObserver.observe(el);
  });

  window.handleSubmit = function (e) {
    e.preventDefault();
    var btn = e.target.querySelector('button[type="submit"]');
    var orig = btn.textContent;
    btn.textContent = '提交中...';
    btn.disabled = true;
    setTimeout(function () {
      btn.textContent = '已提交 ✓';
      btn.style.background = '#059669';
      e.target.reset();
      setTimeout(function () {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 2500);
    }, 800);
  };
})();