/* ==========================================================================
   GIANDECO — RETAIL (página principal) · interacciones
   · carrusel de logos (movido por JS: no depende de animaciones CSS)
   · plano: elegir zonas, escenario con fotos, resumen y mensaje a WhatsApp
   · servicios y paquetes: pestañas en móvil, lista en escritorio
   ========================================================================== */
(function(){
'use strict';

var WA = 'https://wa.me/51920775559';
function $(s, c){ return (c || document).querySelector(s); }
function $$(s, c){ return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

/* --------------------------------------------------------------------------
   1. LOGOS EN MOVIMIENTO
   Se duplica la fila para que el bucle no tenga salto. Se pausa con el
   puntero encima y cuando la franja no está a la vista.
   -------------------------------------------------------------------------- */
(function(){
  var wrap = $('#rhMqw'), mq = $('#rhMq');
  if(!wrap || !mq) return;
  var originales = $$('.rh-mq-i', mq);
  originales.forEach(function(el){
    var c = el.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    $$('img', c).forEach(function(i){ i.alt = ''; i.removeAttribute('loading'); });
    mq.appendChild(c);
  });
  wrap.classList.remove('no-js');

  var x = 0, last = 0, speed = 42, visible = true, hover = false;
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ visible = es[0].isIntersecting; }, { rootMargin:'120px' }).observe(wrap);
  }
  wrap.addEventListener('mouseenter', function(){ hover = true; });
  wrap.addEventListener('mouseleave', function(){ hover = false; });

  function tick(t){
    var dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
    last = t;
    if(visible && !hover){
      var half = mq.scrollWidth / 2;
      if(half > 0){
        x = (x + speed * dt) % half;
        mq.style.transform = 'translate3d(' + (-x).toFixed(2) + 'px,0,0)';
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* --------------------------------------------------------------------------
   2. EL PLANO
   -------------------------------------------------------------------------- */
(function(){
  var legend = $('#rhLegend');
  if(!legend) return;
  var botones = $$('.rh-lg', legend);
  var zonas = $$('.rh-zone');
  var fotos = $$('#rhStage img');
  var thumbs = $$('.rh-thumb');
  var N = botones.length;
  var sel = botones.map(function(b){ return b.classList.contains('is-on'); });
  var cur = Math.max(0, botones.findIndex(function(b){ return b.classList.contains('is-cur'); }));

  var elNombre = $('#rhName'), elDesc = $('#rhDesc'), elItems = $('#rhItems'), elTog = $('#rhTog');
  var elNum = $('#rhNum'), elTienda = $('#rhTienda');
  var elCount = $('#rhCount'), elPack = $('#rhPack'), elWa = $('#rhWa');

  function paquete(n){
    if(n === 0) return 'Elija al menos una zona';
    if(n === 1) return 'Punto Navidad';
    /* con el taller y 3 zonas o más, ya es temporada completa */
    if(n <= 4 && !(sel[5] && n >= 3)) return 'Tienda en Navidad';
    return 'Temporada completa';
  }

  function pintarResumen(){
    var nombres = [], n = 0;
    botones.forEach(function(b, i){ if(sel[i]){ n++; nombres.push(b.getAttribute('data-name')); } });
    var pack = paquete(n);
    elCount.textContent = n === 0 ? 'Ninguna zona elegida' : (n === 1 ? '1 zona elegida' : n + ' zonas elegidas');
    elPack.textContent = pack;
    var msg = 'Hola Giandeco, quiero armar el montaje de Navidad de mi tienda.';
    if(n) msg += ' Zonas: ' + nombres.join(', ') + '. Paquete sugerido: ' + pack + '.';
    elWa.href = WA + '?text=' + encodeURIComponent(msg);
    thumbs.forEach(function(t, i){ t.classList.toggle('is-on', !!sel[i]); });
  }

  function pintar(){
    botones.forEach(function(b, i){
      b.classList.toggle('is-cur', i === cur);
      b.classList.toggle('is-on', !!sel[i]);
      b.setAttribute('aria-pressed', sel[i] ? 'true' : 'false');
    });
    zonas.forEach(function(z){
      var i = +z.getAttribute('data-i');
      z.classList.toggle('is-cur', i === cur);
      z.classList.toggle('is-on', !!sel[i]);
      z.setAttribute('aria-pressed', sel[i] ? 'true' : 'false');
    });
    fotos.forEach(function(f, i){ f.classList.toggle('is-on', i === cur); });

    var b = botones[cur];
    elNombre.textContent = b.getAttribute('data-name');
    elDesc.textContent = b.getAttribute('data-desc');
    elTienda.textContent = b.getAttribute('data-tienda');
    elNum.textContent = '0' + (cur + 1);
    elItems.innerHTML = '';
    b.getAttribute('data-items').split('|').forEach(function(t){
      var li = document.createElement('li'); li.textContent = t; elItems.appendChild(li);
    });
    elTog.textContent = sel[cur] ? 'Quitar de mi montaje' : 'Agregar a mi montaje';
    elTog.classList.toggle('is-on', !!sel[cur]);
    elTog.setAttribute('aria-pressed', sel[cur] ? 'true' : 'false');
    pintarResumen();
  }

  /* en móvil la leyenda es un carril: lleva la pestaña activa a la vista */
  function mostrarTab(){
    if(legend.scrollWidth <= legend.clientWidth + 2) return;
    var b = botones[cur];
    var ir = b.offsetLeft - (legend.clientWidth - b.offsetWidth) / 2;
    if(legend.scrollTo) legend.scrollTo({ left: ir, behavior: 'smooth' }); else legend.scrollLeft = ir;
  }

  function ir(i){ cur = (i + N) % N; pintar(); mostrarTab(); }

  botones.forEach(function(b){ b.addEventListener('click', function(){ ir(+b.getAttribute('data-i')); }); });
  zonas.forEach(function(z){ z.addEventListener('click', function(){ ir(+z.getAttribute('data-i')); }); });
  $('#rhPrev').addEventListener('click', function(){ ir(cur - 1); });
  $('#rhNext').addEventListener('click', function(){ ir(cur + 1); });
  elTog.addEventListener('click', function(){ sel[cur] = !sel[cur]; pintar(); });

  /* las fotos que aún no se han pedido se cargan al primer toque */
  fotos.forEach(function(f){ f.loading = 'eager'; });

  pintar();
})();

/* --------------------------------------------------------------------------
   3. SERVICIOS — lista (escritorio) y pestañas (móvil) sincronizadas
   -------------------------------------------------------------------------- */
(function(){
  var acc = $$('#rhSvAcc .rh-sv');
  if(!acc.length) return;
  var tabs = $$('#rhSvTabs .rh-tab');
  var paneles = $$('#rhSvStage .rh-svp');
  var mt = $('#rhSvMt'), md = $('#rhSvMd'), ml = $('#rhSvMl');
  function ir(i){
    acc.forEach(function(a, k){ a.classList.toggle('is-on', k === i); a.setAttribute('aria-expanded', k === i ? 'true' : 'false'); });
    tabs.forEach(function(t, k){ t.classList.toggle('is-on', k === i); });
    paneles.forEach(function(p, k){ p.classList.toggle('is-on', k === i); });
    var a = acc[i];
    mt.textContent = $('.t', a).textContent;
    md.textContent = $('.d p', a).textContent;
    ml.hidden = !$('.d .gd-link', a);
  }
  acc.forEach(function(a, i){
    a.addEventListener('click', function(){ ir(i); });
    a.addEventListener('mouseenter', function(){ if(window.matchMedia('(hover:hover)').matches) ir(i); });
  });
  tabs.forEach(function(t, i){ t.addEventListener('click', function(){ ir(i); }); });
  ir(0);
})();

/* --------------------------------------------------------------------------
   4. PAQUETES — pestañas en móvil
   -------------------------------------------------------------------------- */
(function(){
  var tabs = $$('#rhPkTabs .rh-pk-tab'), items = $$('#rhPkList .rh-pk');
  if(!tabs.length) return;
  tabs.forEach(function(t, i){
    t.addEventListener('click', function(){
      tabs.forEach(function(x, k){ x.classList.toggle('is-on', k === i); });
      items.forEach(function(x, k){ x.classList.toggle('is-on', k === i); });
    });
  });
})();

/* --------------------------------------------------------------------------
   5. SECCIONES DE RETAIL EN MÓVIL
   En escritorio la barra de secciones vive en la cabecera. En móvil la
   cabecera solo trae el menú, así que se repite aquí, pegada debajo de la
   cabecera al pasar el hero: Navidad (marcada), Servicios, Proyectos…
   Se arma con los mismos enlaces de la cabecera (mapa SITIO).
   -------------------------------------------------------------------------- */
(function(){
  var enlaces = $$('.sh-cat-nav .sh-cat-link');
  var hero = $('.rh-hero');
  if(!enlaces.length || !hero) return;
  var nav = document.createElement('nav');
  nav.className = 'rh-subnav';
  nav.setAttribute('aria-label', 'Secciones de Retail');
  enlaces.forEach(function(a){
    var l = document.createElement('a');
    l.href = a.getAttribute('href'); l.textContent = a.textContent;
    if(a.classList.contains('is-active')){ l.className = 'is-active'; l.setAttribute('aria-current', 'page'); }
    nav.appendChild(l);
  });
  hero.parentNode.insertBefore(nav, hero.nextSibling);
})();

/* en móvil, mientras se arma el montaje la barra fija ocupa el lugar de la
   burbuja del chat: se la aparta mientras el plano está a la vista */
(function(){
  var plano = $('#plano');
  if(!plano || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function(es){
    document.body.classList.toggle('rh-bar', es[0].isIntersecting);
  }, { threshold:0 }).observe(plano);
})();

})();
