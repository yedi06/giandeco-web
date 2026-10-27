/* ==========================================================================
   GIANDECO — FICHAS DE PROYECTO (comportamiento)
   1. Transición tarjeta → portada: al abrir un proyecto, la foto de la
      tarjeta pulsada se convierte en la portada de la ficha (View
      Transitions entre páginas; el CSS solo la activa sin reduced-motion).
   2. Comparador boceto → obra (.pjb): arrastre, teclado y un barrido de
      entrada que muestra el gesto una sola vez.
   ========================================================================== */
(function(){
'use strict';
var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 1. transición tarjeta → portada ---------- */
// el nombre debe ser único en la página: se le quita a la portada y a otras
// tarjetas antes de dárselo a la tarjeta pulsada
document.addEventListener('click', function(e){
  var card = e.target.closest && e.target.closest('a.pj-card');
  if(!card || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  var img = card.querySelector('img');
  if(!img) return;
  Array.prototype.forEach.call(document.querySelectorAll('.pjl-marco img, .pj-hero > img, .pj-card img'), function(i){ i.style.viewTransitionName = 'none'; });
  img.style.viewTransitionName = 'pj-portada';
});

// solo hay transición si el destino también la activa (fichas, listados y servicios);
// si no, se omite aquí y el navegador no deja un error en la consola de la otra página
var CON_TRANSICION = /\/(proyectos(\/|$)|retail\/proyectos|hogar\/proyectos|retail\/servicios\/.|hogar\/interiorismo\/.)/;
window.addEventListener('pageswap', function(e){
  if(!e.viewTransition) return;
  var destino = e.activation && e.activation.entry && e.activation.entry.url;
  if(destino && CON_TRANSICION.test(new URL(destino).pathname)) return;
  e.viewTransition.ready.catch(function(){});
  e.viewTransition.finished.catch(function(){});
  e.viewTransition.skipTransition();
});

/* ---------- 2. comparador boceto → obra ---------- */
Array.prototype.forEach.call(document.querySelectorAll('.pjb-frame'), function(frame){
  var range = frame.querySelector('.pjb-range');
  var tocado = false, arrastre = false;
  function pos(p){
    p = Math.max(0, Math.min(100, p));
    frame.style.setProperty('--pjb', p + '%');
    if(Math.abs(parseFloat(range.value) - p) > .01) range.value = p;
  }
  function desdeEvento(ev){ var r = frame.getBoundingClientRect(); return r.width ? ((ev.clientX - r.left) / r.width) * 100 : 50; }
  range.addEventListener('input', function(){ tocado = true; pos(parseFloat(range.value)); });
  frame.addEventListener('pointerdown', function(ev){
    if(ev.target === range) return;
    tocado = arrastre = true; frame.setPointerCapture(ev.pointerId); pos(desdeEvento(ev));
  });
  frame.addEventListener('pointermove', function(ev){ if(arrastre){ ev.preventDefault(); pos(desdeEvento(ev)); } });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function(t){ frame.addEventListener(t, function(){ arrastre = false; }); });

  // barrido de entrada: del boceto entero a la mitad, una sola vez
  if(reducido || !('IntersectionObserver' in window)){ pos(50); return; }
  pos(96);
  var io = new IntersectionObserver(function(es){
    if(!es[0].isIntersecting) return;
    io.disconnect();
    var t0 = null, dur = 1500;
    (function paso(t){
      if(tocado) return;
      if(t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur), ease = 1 - Math.pow(1 - k, 4);
      pos(96 - 46 * ease);
      if(k < 1) requestAnimationFrame(paso);
    })(performance.now());
  }, { threshold:.45 });
  io.observe(frame);
});
})();
