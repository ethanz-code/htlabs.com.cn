(function () {
  'use strict';

  // Footer year - start from 2026
  var yearEl = document.getElementById('footerYear');
  if (yearEl) {
    var currentYear = Math.max(2026, new Date().getFullYear());
    if (currentYear === 2026) {
      yearEl.parentElement.innerHTML = '© 2026 上海宏途数创科技有限公司 · htlabs.com.cn';
    } else {
      yearEl.textContent = currentYear;
    }
  }

  // Nav scroll
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');

  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile menu
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

  // Reveal on scroll
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

  // Stats counter
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

  // 表单提交
  var FC_ENDPOINT = 'https://htlabs-contact-szcypuzieu.cn-hongkong.fcapp.run';
  var submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      var name = document.getElementById('formName').value.trim();
      var phone = document.getElementById('formPhone').value.trim();
      var desc = document.getElementById('formDesc').value.trim();
      if (!name || !phone || !desc) return;

      var btn = submitBtn;
      var orig = btn.textContent;
      btn.textContent = '提交中...';
      btn.disabled = true;

      fetch(FC_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Date': new Date().toUTCString()
        },
        body: JSON.stringify({
          name: name,
          phone: phone,
          company: document.getElementById('formCompany').value.trim(),
          desc: desc
        })
      }).then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          btn.textContent = '已提交 ✓';
          btn.style.background = '#059669';
          document.getElementById('formName').value = '';
          document.getElementById('formPhone').value = '';
          document.getElementById('formCompany').value = '';
          document.getElementById('formDesc').value = '';
        } else {
          btn.textContent = '提交失败，请重试';
          btn.style.background = '#dc2626';
        }
      }).catch(function () {
        btn.textContent = '网络错误，请重试';
        btn.style.background = '#dc2626';
      }).finally(function () {
        setTimeout(function () {
          btn.textContent = orig;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      });
    });
  }
})();
