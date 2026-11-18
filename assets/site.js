/* Drontec – comportamiento del sitio: tema claro/oscuro, menú en celular y video */
(function () {
  var root = document.documentElement;

  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('drontec-theme', t); } catch (e) {}
  }
  document.addEventListener('click', function (ev) {
    var tgl = ev.target.closest('[data-toggle-theme]');
    if (tgl) {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      return;
    }
    if (ev.target.closest('[data-open-menu]')) { document.body.classList.add('menu-open'); return; }
    if (ev.target.closest('[data-close-menu]')) { document.body.classList.remove('menu-open'); return; }
    var link = ev.target.closest('.menu a');
    if (link) document.body.classList.remove('menu-open');
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') document.body.classList.remove('menu-open');
  });

  /* Tarjeta de resumen: aparece al abrir un grupo del menú (Marco Teórico, Análisis Estructurado, Orientado a Objetos). */
  var ICONS = {};
  function openCard(sum) {
    var $ = function (id) { return document.getElementById(id); };
    $('pvTitle').textContent = sum.getAttribute('data-title');
    $('pvSub').textContent = sum.getAttribute('data-sub');
    $('pvDesc').textContent = sum.getAttribute('data-desc');
    $('pvGo').setAttribute('href', sum.getAttribute('data-href'));
    var chips = $('pvChips'); chips.innerHTML = '';
    (sum.getAttribute('data-chips') || '').split('|').forEach(function (c) {
      if (!c) return; var s = document.createElement('span'); s.textContent = c; chips.appendChild(s);
    });
    var ic = $('pvIco'); ic.className = 'ico ' + sum.getAttribute('data-ico');
    var svg = sum.querySelector('.ico svg'); ic.innerHTML = svg ? svg.outerHTML : '';
    document.body.classList.add('pv-open');
  }
  document.addEventListener('click', function (ev) {
    var sum = ev.target.closest('.menu summary[data-title]');
    if (sum && !sum.parentNode.open) { openCard(sum); }
    if (ev.target.closest('[data-close-card]') || ev.target.closest('#pvGo')) { document.body.classList.remove('pv-open'); }
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') document.body.classList.remove('pv-open');
  });
  /* Al entrar con #sección, abrir el botón de detalle si el ancla está dentro de uno. */
  function openFor(hash) {
    if (!hash) return; var el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!el) return; var d = el.closest('details.more'); if (d) d.open = true;
  }
  window.addEventListener('hashchange', function () { openFor(location.hash); });

  /* Portada: el dron sigue suavemente al puntero (solo con mouse y sin "reducir movimiento"). */
  var scn = document.getElementById('scene');
  if (scn && window.matchMedia && !matchMedia('(prefers-reduced-motion: reduce)').matches && matchMedia('(hover: hover)').matches) {
    var hero = scn.closest('.hero') || scn;
    hero.addEventListener('mousemove', function (ev) {
      var r = hero.getBoundingClientRect();
      scn.style.setProperty('--px', ((ev.clientX - r.left) / r.width - 0.5).toFixed(3));
      scn.style.setProperty('--py', ((ev.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
    hero.addEventListener('mouseleave', function () { scn.style.setProperty('--px', 0); scn.style.setProperty('--py', 0); });
  }

  /* Video: si la página trae data-youtube con un enlace, se incrusta el reproductor. */
  var box = document.querySelector('[data-youtube]');
  if (box) {
    var url = (box.getAttribute('data-youtube') || '').trim();
    var m = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
    if (m) {
      box.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + m[1] +
        '" title="Video de presentación de Drontec" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
    }
  }
})();
