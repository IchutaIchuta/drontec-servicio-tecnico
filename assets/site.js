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
