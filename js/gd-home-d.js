/* ==========================================================================
   HOME · «EL RECORRIDO» — comportamiento
   · cifras que cuentan hasta su valor al entrar en pantalla
   · índice lateral (escritorio): marca la sección activa
   · «Más obra»: flechas y arrastre con el ratón
   Sin dependencias; cada bloque se salta si su elemento no existe.
   ========================================================================== */
(function(){
  'use strict';
  var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var conIO = 'IntersectionObserver' in window;

  /* ---------- cifras ---------- */
  (function(){
    var els = Array.prototype.slice.call(document.querySelectorAll('.hm-cifras b[data-n]'));
    if(!els.length) return;
    function contar(el){
      var n = parseInt(el.getAttribute('data-n'), 10) || 0;
      if(reducido || !n){ el.textContent = n; return; }
      var t0 = null, dur = 1300;
      function paso(t){
        if(t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(n * e);
        if(p < 1) requestAnimationFrame(paso);
      }
      el.textContent = '0';
      requestAnimationFrame(paso);
    }
    if(!conIO){ return; }
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ contar(e.target); io.unobserve(e.target); } });
    }, { threshold: .6 });
    els.forEach(function(el){ io.observe(el); });
  })();

  /* ---------- índice lateral ---------- */
  (function(){
    var rail = document.getElementById('hmRail');
    if(!rail || !conIO) return;
    var links = Array.prototype.slice.call(rail.querySelectorAll('a[data-s]'));
    var secs = links.map(function(a){ return document.getElementById(a.getAttribute('data-s')); });
    var hero = document.getElementById('top');
    if(hero) new IntersectionObserver(function(e){ rail.classList.toggle('is-on', !e[0].isIntersecting); }, { threshold: .15 }).observe(hero);
    else rail.classList.add('is-on');
    var visibles = {};
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ visibles[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
      var mejor = -1, id = null;
      links.forEach(function(a){ var v = visibles[a.getAttribute('data-s')] || 0; if(v > mejor){ mejor = v; id = a.getAttribute('data-s'); } });
      links.forEach(function(a){ a.classList.toggle('is-act', mejor > 0 && a.getAttribute('data-s') === id); });
    }, { rootMargin: '-35% 0px -35% 0px', threshold: [0, .05, .2, .5, 1] });
    secs.forEach(function(s){ if(s) io.observe(s); });
  })();

  /* ---------- «Más obra» ---------- */
  (function(){
    var row = document.getElementById('hmMas');
    if(!row) return;
    var paso = function(){ var c = row.querySelector('.hm-mas-card'); return c ? c.getBoundingClientRect().width + 20 : 280; };
    document.querySelectorAll('.hm-arrow[data-dir]').forEach(function(b){
      b.addEventListener('click', function(){
        row.scrollBy({ left: parseInt(b.getAttribute('data-dir'), 10) * paso() * 2, behavior: reducido ? 'auto' : 'smooth' });
      });
    });
    row.addEventListener('keydown', function(e){
      if(e.key === 'ArrowRight'){ e.preventDefault(); row.scrollBy({ left: paso(), behavior: 'smooth' }); }
      if(e.key === 'ArrowLeft'){ e.preventDefault(); row.scrollBy({ left: -paso(), behavior: 'smooth' }); }
    });
    // arrastre con el ratón (en táctil ya se desliza)
    var down = false, x0 = 0, s0 = 0, movio = false;
    row.addEventListener('pointerdown', function(e){
      if(e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; movio = false; x0 = e.clientX; s0 = row.scrollLeft;
    });
    window.addEventListener('pointermove', function(e){
      if(!down) return;
      var dx = e.clientX - x0;
      if(Math.abs(dx) > 5){ movio = true; row.classList.add('is-drag'); }
      if(movio) row.scrollLeft = s0 - dx;
    });
    window.addEventListener('pointerup', function(){ if(!down) return; down = false; row.classList.remove('is-drag'); });
    // un arrastre no debe abrir la ficha
    row.addEventListener('click', function(e){ if(movio){ e.preventDefault(); e.stopPropagation(); movio = false; } }, true);
  })();
})();
