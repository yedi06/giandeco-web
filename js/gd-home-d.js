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
