/* Thirugnanasambandar Nursery & Primary School — site scripts */
(function () {
  // Sticky header shadow + back-to-top
  var header = document.querySelector('.header');
  var toTop = document.querySelector('.to-top');
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (toTop) toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

  // Reveal on scroll
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  // Animated counters
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, end = parseInt(el.getAttribute('data-count'), 10), t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1400, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  // Only one video plays at a time
  var vids = document.querySelectorAll('video[controls]');
  vids.forEach(function (v) {
    v.addEventListener('play', function () {
      vids.forEach(function (o) { if (o !== v) o.pause(); });
    });
  });

  // Gallery filters
  var filterBtns = document.querySelectorAll('.filters button');
  filterBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      filterBtns.forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
      b.classList.add('active'); b.setAttribute('aria-pressed', 'true');
      var f = b.getAttribute('data-filter');
      document.querySelectorAll('.masonry figure').forEach(function (fig) {
        var show = f === 'all' || (fig.getAttribute('data-cat') || '').split(' ').indexOf(f) > -1;
        fig.classList.toggle('hide', !show);
      });
    });
  });

  // Lightbox
  var lb = document.querySelector('.lightbox');
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  var idx = 0;
  function visibleItems() { return items.filter(function (i) { return !i.closest('.hide'); }); }
  function show(i) {
    var list = visibleItems(); if (!list.length) return;
    idx = (i + list.length) % list.length;
    var el = list[idx];
    lb.querySelector('img').src = el.getAttribute('data-lightbox');
    lb.querySelector('img').alt = el.getAttribute('data-caption') || '';
    lb.querySelector('p').textContent = el.getAttribute('data-caption') || '';
  }
  function closeLb() { if (lb) { lb.classList.remove('open'); document.body.style.overflow = ''; } }
  if (lb) {
    items.forEach(function (el) {
      el.setAttribute('tabindex', '0');
      function open() { show(visibleItems().indexOf(el)); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
      el.addEventListener('click', open);
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
    });
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  // WhatsApp enquiry forms: build a ready-to-send message with the student name
  var WA = '919487251271';
  document.querySelectorAll('[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var get = function (k) { return (d.get(k) || '').toString().trim(); };
      var student = form.querySelector('[name="student"]');
      var err = form.querySelector('.form-err');
      if (!get('student')) {
        student.classList.add('invalid'); student.focus();
        if (err) err.hidden = false;
        return;
      }
      student.classList.remove('invalid'); if (err) err.hidden = true;
      var lines = ['Hello Thirugnanasambandar School,', 'I want to enquire about: ' + (get('topic') || 'Admission'), '', 'Student name: ' + get('student')];
      if (get('grade')) lines.push('Class: ' + get('grade'));
      if (get('parent')) lines.push('Parent name: ' + get('parent'));
      if (get('phone')) lines.push('Phone: ' + get('phone'));
      if (get('email')) lines.push('Email: ' + get('email'));
      if (get('message')) lines.push('', 'Question: ' + get('message'));
      var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n'));
      var w = window.open(url, '_blank');
      if (!w) window.location.href = url;
    });
    var st = form.querySelector('[name="student"]');
    if (st) st.addEventListener('input', function () { st.classList.remove('invalid'); var er = form.querySelector('.form-err'); if (er) er.hidden = true; });
  });

  // Year in footer
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
