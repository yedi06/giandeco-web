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
   TRES MUNDOS · flechas del carrusel en móvil (‹ ›) con contador
   ========================================================================== */
(function(){
  'use strict';
  var pista = document.querySelector('.hm-mundos');
  var nav = document.querySelector('.hm-mundos-nav');
  if(!pista || !nav) return;
  var ant = nav.querySelector('.is-prev'), sig = nav.querySelector('.is-next'), cnt = nav.querySelector('.hm-mundos-cnt');
  var paneles = pista.querySelectorAll('.hm-mundo'), espera = false;
  function paso(){ return paneles[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(pista).columnGap) || 2); }
  function indice(){
    var max = pista.scrollWidth - pista.clientWidth;
    var i = max > 0 && pista.scrollLeft >= max - 4 ? paneles.length - 1 : Math.round(pista.scrollLeft / paso());
    return Math.max(0, Math.min(paneles.length - 1, i));
  }
  function marcar(){
    espera = false;
    if(!paneles.length) return;
    var i = indice();
    ant.disabled = i <= 0; sig.disabled = i >= paneles.length - 1;
    if(cnt) cnt.innerHTML = '<b>0' + (i + 1) + '</b> / 0' + paneles.length;
  }
  function ir(d){ var i = Math.max(0, Math.min(paneles.length - 1, indice() + d)); pista.scrollTo({ left: i * paso(), behavior: 'smooth' }); }
  ant.addEventListener('click', function(){ ir(-1); });
  sig.addEventListener('click', function(){ ir(1); });
  pista.addEventListener('scroll', function(){ if(!espera){ espera = true; requestAnimationFrame(marcar); } }, { passive: true });
  window.addEventListener('resize', marcar);
  marcar();

  /* avance automático en móvil: pasa de panel en panel, vuelve al primero y se detiene si la persona lo toca */
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var enVista = false, pausado = false, espera2 = null;
  function pausar(){ pausado = true; clearTimeout(espera2); espera2 = setTimeout(function(){ pausado = false; }, 9000); }
  ['touchstart', 'pointerdown', 'wheel', 'keydown', 'focusin'].forEach(function(ev){ pista.addEventListener(ev, pausar, { passive: true }); });
  nav.addEventListener('pointerdown', pausar, { passive: true });
  if('IntersectionObserver' in window) new IntersectionObserver(function(es){ enVista = es[0].isIntersecting; }, { threshold: .5 }).observe(pista); else enVista = true;
  setInterval(function(){
    if(pausado || !enVista || document.hidden || pista.scrollWidth <= pista.clientWidth + 12) return;
    var i = indice();
    pista.scrollTo({ left: (i >= paneles.length - 1 ? 0 : i + 1) * paso(), behavior: 'smooth' });
  }, 4200);
})();
