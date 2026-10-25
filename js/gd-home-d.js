/* ==========================================================================
   HOME · CAPÍTULOS — comportamiento
   · la cifra de la obra cuenta hasta su valor al entrar en pantalla
   Sin dependencias; se salta si su elemento no existe.
   ========================================================================== */
(function(){
  'use strict';
  var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = Array.prototype.slice.call(document.querySelectorAll('.hm-stat b[data-n]'));
  if(!els.length || !('IntersectionObserver' in window)) return;
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
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ contar(e.target); io.unobserve(e.target); } });
  }, { threshold: .6 });
  els.forEach(function(el){ io.observe(el); });
})();

/* ==========================================================================
   TRES MUNDOS · carga de los detalles laterales
   Los detalles que se revelan al ensanchar un panel viven fuera del recorte,
   así que el lazy nativo no los trae; los cargamos al acercarse la sección.
   (solo escritorio: en móvil no se muestran)
   ========================================================================== */
(function(){
  'use strict';
  var caja = document.querySelector('.hm-mundos');
  if(!caja) return;
  var lados = Array.prototype.slice.call(caja.querySelectorAll('img[data-src]'));
  if(!lados.length || (window.matchMedia && !window.matchMedia('(min-width:900px)').matches)) return;
  function cargar(){
    lados.forEach(function(i){ var s = i.getAttribute('data-src'); if(s){ i.src = s; i.removeAttribute('data-src'); } });
  }
  if(!('IntersectionObserver' in window)){ cargar(); return; }
  var io = new IntersectionObserver(function(es){
    if(es[0].isIntersecting){ cargar(); io.disconnect(); }
  }, { rootMargin: '700px 0px' });
  io.observe(caja);
})();

/* ==========================================================================
   TRES MUNDOS · indicador del carrusel en móvil
   ========================================================================== */
(function(){
  'use strict';
  var pista = document.querySelector('.hm-mundos');
  var puntos = pista ? Array.prototype.slice.call(document.querySelectorAll('.hm-mundos-dots i')) : [];
  if(!pista || !puntos.length) return;
  var paneles = pista.querySelectorAll('.hm-mundo'), espera = false;
  function marcar(){
    espera = false;
    if(!paneles.length) return;
    var paso = paneles[0].getBoundingClientRect().width + 2;
    var max = pista.scrollWidth - pista.clientWidth;
    var i = max > 0 && pista.scrollLeft >= max - 4 ? paneles.length - 1 : Math.round(pista.scrollLeft / paso);
    i = Math.max(0, Math.min(paneles.length - 1, i));
    puntos.forEach(function(p, k){ p.classList.toggle('is-on', k === i); });
  }
  pista.addEventListener('scroll', function(){ if(!espera){ espera = true; requestAnimationFrame(marcar); } }, { passive: true });
  window.addEventListener('resize', marcar);
})();
