/* Páginas legales y de ayuda: índice lateral "En esta página".
   Se arma con los h2 del texto, solo si hay cuatro o más y solo en pantallas
   anchas (en el teléfono el documento se lee de corrido). Sin índice, la
   página funciona igual. */
(function(){
  'use strict';
  var prosa = document.querySelector('.cu-top .lg-prosa:not(.es-libro)');
  var grid = document.querySelector('.cu-top .cu-grid');
  if(!prosa || !grid) return;
  var tit = [].slice.call(prosa.children).filter(function(n){ return n.tagName === 'H2'; });
  if(tit.length < 4) return;

  var usados = {};
  function slug(t){
    var s = t.replace(/^\s*\d+[.)]?\s*/, '').toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'seccion';
    var base = s, n = 2;
    while(usados[s] || document.getElementById(s)) s = base + '-' + n++;
    usados[s] = 1;
    return s;
  }

  var nav = document.createElement('nav');
  nav.className = 'lg-toc';
  nav.setAttribute('aria-label', 'En esta página');
  var cab = document.createElement('p');
  cab.className = 'lg-toc-t';
  cab.textContent = 'En esta página';
  nav.appendChild(cab);

  var enlaces = tit.map(function(h){
    if(!h.id) h.id = slug(h.textContent);
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent.replace(/^\s*\d+[.)]?\s*/, '');
    nav.appendChild(a);
    return a;
  });

  grid.classList.add('tiene-toc');
  grid.appendChild(nav);

  if(!('IntersectionObserver' in window)) return;
  var visibles = {};
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ visibles[e.target.id] = e.isIntersecting; });
    var primero = tit.filter(function(h){ return visibles[h.id]; })[0];
    if(!primero) return;
    enlaces.forEach(function(a){
      var on = a.getAttribute('href') === '#' + primero.id;
      a.classList.toggle('is-active', on);
      if(on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -70% 0px' });
  tit.forEach(function(h){ io.observe(h); });
})();
