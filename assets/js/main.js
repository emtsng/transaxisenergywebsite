// Transaxis Energy Limited — site interactions (vanilla JS, no dependencies)

document.addEventListener('DOMContentLoaded', function () {

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      var expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* Highlight active nav link based on current page */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === path) {
      link.classList.add('active');
      var parentDrop = link.closest('.nav-drop');
      if (parentDrop) {
        var parentToggle = parentDrop.querySelector('.nav-drop-toggle');
        if (parentToggle) parentToggle.classList.add('active');
      }
    }
  });

  /* Nav dropdowns (About Us, Capabilities, Governance) */
  var navDrops = document.querySelectorAll('.nav-drop');
  navDrops.forEach(function (drop) {
    var toggleBtn = drop.querySelector('.nav-drop-toggle');
    if (!toggleBtn) return;
    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = drop.classList.contains('open');
      navDrops.forEach(function (d) { d.classList.remove('open'); });
      if (!isOpen) drop.classList.add('open');
    });
  });
  document.addEventListener('click', function () {
    navDrops.forEach(function (d) { d.classList.remove('open'); });
  });

  /* Scroll-reveal animation */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* Animated counters */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var animateCounter = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1400;
      var start = null;
      var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = target * eased;
        el.textContent = value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      var cIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cIo.observe(el); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* Logo / partner strip auto-scroll (simple marquee) */
  var track = document.querySelector('.marquee-track');
  if (track) {
    track.innerHTML += track.innerHTML; // duplicate for seamless loop
  }

  /* Contact / Quote form handling (no backend yet — shows confirmation) */
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var successBox = form.parentElement.querySelector('.form-success') || document.getElementById('form-success');
      if (successBox) {
        successBox.classList.add('show');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  });

  /* FAQ / accordion (used on solutions pages) */
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    var head = item.querySelector('.accordion-head');
    head.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      item.closest('.accordion').querySelectorAll('.accordion-item').forEach(function (i) {
        i.classList.remove('open');
      });
      if (!isOpen) item.classList.add('open');
    });
  });

});
