/* ==========================================================================
   POPUP DE BIENVENIDA — pide el correo y la función `cupon` le envía un código
   personal (GIAN-XXXXXX) de un solo uso. Solo se muestra si esa función está
   activa; si no responde, la página queda exactamente igual que antes.
   ========================================================================== */
(function(){
'use strict';
if(window.GD_BIENVENIDA) return;
window.GD_BIENVENIDA = true;

// no interrumpe donde la persona está comprando, leyendo o administrando
if(/(^|\/)(checkout|pagar|cuenta|seguimiento|admin|mantenimiento|404)(\.html)?$/.test(location.pathname) || /\/(legal|ayuda)\//.test(location.pathname)) return;

var NUBE = 'https://vsivmdfmecqxeumepyea.supabase.co', LLAVE = 'sb_publishable_mA4Evx59RnBY4lKVGh3GRg_Coe26bp-';
var FN = NUBE + '/functions/v1/cupon', CLAVE = 'gd_bienvenida', ESPERA = 9000, REPOSO = 14 * 864e5;
var IMG = 'images/popup/regalo.webp';

function leer(){ try{ return JSON.parse(localStorage.getItem(CLAVE) || 'null'); }catch(e){ return null; } }
function guardar(v){ try{ localStorage.setItem(CLAVE, JSON.stringify(v)); }catch(e){} }
function llamar(cuerpo){
  return fetch(FN, { method:'POST', headers:{ 'Content-Type':'application/json', apikey:LLAVE }, body:JSON.stringify(cuerpo) })
    .then(function(r){ return r.json(); }).catch(function(){ return null; });
}

var est = leer();
if(est && (est.enviado || (est.cerrado && Date.now() - est.cerrado < REPOSO))) return;

var el, previo, temporizador;
function construir(){
  var raiz = location.pathname.replace(/[^\/]*$/, '').replace(/[^\/]+\//g, '../');   // ruta relativa a la raíz del sitio
  el = document.createElement('div');
  el.className = 'gdb'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'gdbT');
  el.innerHTML =
    '<div class="gdb-scrim" data-cierra></div>' +
    '<div class="gdb-card">' +
      '<button class="gdb-x" type="button" data-cierra aria-label="Cerrar"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13"/></svg></button>' +
      '<figure class="gdb-img"></figure>' +
      '<div class="gdb-cuerpo">' +
        '<h2 class="gdb-t" id="gdbT"><em>10 %</em> en su primera compra</h2>' +
        '<p class="gdb-p gdb-p--ini">Déjenos su correo y le enviamos un código personal, de un solo uso. Válido solo en productos.</p>' +
        '<form class="gdb-form" novalidate>' +
          '<div class="gdb-campo"><label for="gdbMail">Correo electrónico</label><input id="gdbMail" type="email" name="email" inputmode="email" autocomplete="email" placeholder="nombre@correo.com" required></div>' +
          '<p class="gdb-msg" role="alert" aria-live="polite"></p>' +
          '<button class="gdb-btn" type="submit">Recibir mi código</button>' +
          '<p class="gdb-leyes">Usamos su correo solo para enviarle este código. <a href="' + raiz + 'legal/promociones">Condiciones</a> · <a href="' + raiz + 'legal/politica-de-privacidad">Privacidad</a></p>' +
        '</form>' +
        '<button class="gdb-no" type="button" data-cierra>No, gracias</button>' +
        '<div class="gdb-ok" tabindex="-1"><p>Le enviamos el código a <strong class="gdb-quien"></strong>. Si no lo ve en unos minutos, revise la carpeta de correo no deseado.</p><p>Escríbalo en el paso de pago, con este mismo correo.</p><button class="gdb-btn" type="button" data-cierra>Seguir comprando</button></div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(el);

  // imagen opcional: si existe images/popup/regalo.webp, la tarjeta pasa a dos columnas
  var t = new Image(), mio = el;
  t.onload = function(){ t.alt = ''; t.width = 480; t.height = 600; t.decoding = 'async'; mio.querySelector('.gdb-img').appendChild(t); mio.classList.add('tiene-img'); };
  t.src = raiz + IMG;

  el.addEventListener('click', function(e){ if(e.target.closest('[data-cierra]')) cerrar(); });
  el.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ cerrar(); return; }
    if(e.key !== 'Tab') return;
    var f = [].slice.call(el.querySelectorAll('button, input, a[href]')).filter(function(x){ return x.offsetParent !== null && !x.disabled; });
    if(!f.length) return;
    var a = f[0], z = f[f.length - 1];
    if(e.shiftKey && document.activeElement === a){ e.preventDefault(); z.focus(); }
    else if(!e.shiftKey && document.activeElement === z){ e.preventDefault(); a.focus(); }
  });
  el.querySelector('form').addEventListener('submit', enviar);
}

function abrir(){
  if(el || document.querySelector('.gdt-drawer.is-open, .gd-luz.is-open')) return;   // no se monta sobre la bolsa ni la foto ampliada
  construir();
  previo = document.activeElement;
  requestAnimationFrame(function(){ el.classList.add('is-on'); setTimeout(function(){ var i = el.querySelector('#gdbMail'); if(i) i.focus({ preventScroll:true }); }, 450); });
}
function cerrar(){
  if(!el) return;
  el.classList.remove('is-on');
  if(!(leer() || {}).enviado) guardar({ cerrado:Date.now() });
  var x = el; el = null;
  setTimeout(function(){ if(x.parentNode) x.parentNode.removeChild(x); }, 600);
  if(previo && previo.focus) try{ previo.focus({ preventScroll:true }); }catch(e){}
}

var MOTIVOS = {
  correo:'Revise el correo: parece incompleto.',
  usado:'Este correo ya usó su código de bienvenida.',
  demasiados:'Demasiados intentos. Pruebe de nuevo en un rato.',
  envio:'No pudimos enviar el correo. Inténtelo de nuevo en unos minutos.',
  error:'No pudimos generar el código. Inténtelo de nuevo en unos minutos.'
};
function enviar(e){
  e.preventDefault();
  var f = e.target, msg = f.querySelector('.gdb-msg'), btn = f.querySelector('.gdb-btn'), mail = f.email.value.trim().toLowerCase();
  msg.textContent = '';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)){ msg.textContent = MOTIVOS.correo; f.email.focus(); return; }
  btn.disabled = true; btn.textContent = 'Enviando…';
  llamar({ accion:'solicitar', email:mail }).then(function(r){
    btn.disabled = false; btn.textContent = 'Recibir mi código';
    if(r && r.ok){
      guardar({ enviado:true });
      el.querySelector('.gdb-quien').textContent = mail;
      el.classList.add('enviado');
      el.querySelector('.gdb-ok').focus();
      return;
    }
    msg.textContent = MOTIVOS[r && r.motivo] || MOTIVOS.error;
  });
}

function programar(){
  llamar({ accion:'estado' }).then(function(r){
    if(!r || !r.ok || !r.activa) return;     // sin correo configurado o sin respuesta: no se muestra nada
    temporizador = setTimeout(abrir, ESPERA);
  });
}
if(document.readyState === 'complete') programar(); else window.addEventListener('load', programar);
})();
