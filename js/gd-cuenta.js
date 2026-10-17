/* ==========================================================================
   GIANDECO — MI CUENTA
   Acceso (correo y clave, Google, recuperar clave) y panel del cliente:
   inicio, pedidos, proyectos, guardados, beneficios y servicios, direcciones
   y facturación, y datos y seguridad. Escritorio con menú lateral; teléfono
   con barra inferior. Pocas palabras: el estado se entiende por iconos,
   cifras y barras de avance.

   Tres estados de sesión:
     · sin sesión  → pantalla de acceso
     · invitado    → compró sin cuenta: ve sus pedidos de este dispositivo y
                     una invitación a activar su cuenta
     · cuenta      → ingresó con Google o con correo y clave: nunca se le
                     vuelve a ofrecer Google ni crear clave
   ========================================================================== */
(function(){
'use strict';
var T = window.GD_TIENDA, A = window.GD_AUTH;
if(!T || !A) return;
var esc = T.esc, root = document.getElementById('cu'), cx = document.getElementById('cx');
var MOVIL = window.matchMedia ? window.matchMedia('(max-width:859px)') : { matches:false };

/* ¿se muestra el recuadro "Su próximo beneficio" para sumar módulos nuevos?
   Es solo para el equipo: con true aparece el hueco; con false, los clientes no lo ven. */
var ESPACIO_LIBRE = false;
/* para agregar un beneficio: súmelo a BENEFICIOS() y a las listas de INICIO_BEN / PAGINA_BEN */

/* ---------- iconos (trazo fino, como el resto del sitio) ---------- */
function svg(d, w){ return '<svg viewBox="0 0 24 24"' + (w ? ' width="' + w + '" height="' + w + '"' : '') + ' aria-hidden="true">' + d + '</svg>'; }
var I = {
  inicio:   svg('<rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/><rect x="13.5" y="13.5" width="7" height="7" rx="1"/>'),
  pedidos:  svg('<path d="M5 7.5h14l-1.2 11.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3z"/><path d="M9 9.5V6.8a3 3 0 0 1 6 0v2.7"/>'),
  proyectos:svg('<path d="M4 20V9l8-5 8 5v11"/><path d="M9.5 20v-6h5v6"/>'),
  guardados:svg('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  beneficios:svg('<rect x="3.5" y="8" width="17" height="12" rx="1"/><path d="M12 8v12M3.5 12.5h17M12 8c-2.5 0-4.5-1-4.5-2.8S10 3 12 8c2-5 4.5-3.5 4.5-1.8S14.5 8 12 8z"/>'),
  direcciones:svg('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'),
  datos:    svg('<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>'),
  salir:    svg('<path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14"/><path d="M10 16l-4-4 4-4M6 12h10"/>'),
  ojo:      svg('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>'),
  ojoNo:    svg('<path d="M3 3l18 18"/><path d="M10.6 5.6A9.8 9.8 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-3 3.7M6.6 6.7C4 8.4 2.5 12 2.5 12S6 18.5 12 18.5a9.6 9.6 0 0 0 4.1-.9"/><path d="M9.9 9.9a2.8 2.8 0 0 0 4 4"/>'),
  escudo:   svg('<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/>'),
  wa:       svg('<path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8z"/><path d="M9.2 8.6c.2-.5.6-.5.9-.5h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .5-.1.7l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.5c.2-.2.5-.2.7-.1l1.5.7c.2.1.4.3.4.5v.5c0 .4-.1.7-.5.9-1.6.9-4.2-.5-5.6-1.9s-2.8-4-1.9-5.4z"/>'),
  waLinea:  svg('<path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8z"/>'),
  asesor:   svg('<path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8z"/><path d="M9 11h6M9 14h3.5"/>'),
  repetir:  svg('<path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5"/><path d="M20 4v4.5h-4.5"/><path d="M20 12a8 8 0 0 1-13.7 5.7L4 15.5"/><path d="M4 20v-4.5h4.5"/>'),
  tarjeta:  svg('<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>'),
  correo:   svg('<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>'),
  copo:     svg('<path d="M12 3v18M7 7l10 10M17 7L7 17M3 12h18"/>'),
  camion:   svg('<path d="M3 6.5h11v9H3zM14 9.5h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>'),
  agenda:   svg('<rect x="3.5" y="5" width="17" height="15" rx="1"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
  mas:      svg('<path d="M12 5v14M5 12h14"/>'),
  comprobante:svg('<path d="M7 3.5h7l4 4V20.5H7z"/><path d="M14 3.5v4h4M9.5 12h5M9.5 15.5h5"/>'),
  candado:  svg('<rect x="5" y="10.5" width="14" height="9.5" rx="1"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>'),
  ayuda:    svg('<circle cx="12" cy="12" r="8.5"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 16.8v.2"/>'),
  equipo:   svg('<rect x="7" y="3.5" width="10" height="17" rx="1.6"/><path d="M11 17.5h2"/>'),
  der:      svg('<path d="M9 5l7 7-7 7"/>'),
  atras:    svg('<path d="M15 5l-7 7 7 7"/>'),
  flecha:   svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  abajo:    svg('<path d="M6 9l6 6 6-6"/>'),
  check:    svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  corazonX: svg('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>')
};
var GOOGLE = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';

/* ---------- utilidades ---------- */
var MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
var MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
function fecha(iso, corto){ var d = new Date(iso); return d.getDate() + ' ' + MES[d.getMonth()] + (corto ? '' : ' ' + d.getFullYear()); }
function correoOk(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
/* fuerza de la clave: 0 a 4 */
function fuerza(c){ var n = 0; if(c.length >= 8) n++; if(c.length >= 12) n++; if(/[a-zA-Z]/.test(c) && /\d/.test(c)) n++; if(/[^a-zA-Z0-9]/.test(c) || /[a-z]/.test(c) && /[A-Z]/.test(c)) n++; return n; }
function totalDe(p){ return (p.subtotal || 0) - (p.descuento || 0) + (p.envio || 0) + (p.armadoMonto || 0); }
function nPiezas(p){ var n = p.items.reduce(function(a, x){ return a + x.qty; }, 0); return n + (n === 1 ? ' pieza' : ' piezas'); }
function primerNombre(s){ var n = String(s && s.nombre || '').trim().split(/\s+/)[0] || ''; return n.charAt(0).toUpperCase() + n.slice(1); }
function iniciales(n){ return String(n || '').split(/\s+/).filter(Boolean).slice(0, 2).map(function(x){ return x[0]; }).join('').toUpperCase() || 'G'; }
function saludo(){ var h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'; }
function enCurso(p){ return (p.estado || 0) < T.ESTADOS.length - 1; }
function mascara(d){ d = String(d || ''); return d.length > 4 ? d.charAt(0) + new Array(d.length - 2).join('•') + d.slice(-2) : d; }
function comprobanteTxt(d){
  if(d.comp === 'factura' && d.ruc) return 'Factura · RUC ' + d.ruc + (d.razon ? ' · ' + d.razon : '');
  if(d.doc) return 'Boleta · ' + (d.tdoc || 'DNI') + ' ' + mascara(d.doc);
  return '';
}
function modo(){ var s = T.sesion.get(); return !s ? null : A.actual() ? 'cuenta' : 'invitado'; }
function favLista(){ return T.favs.lista().filter(function(k){ return T.CAT[k]; }); }
function perfil(){ return T.db('perfil') || {}; }
function dosD(n){ return ('0' + n).slice(-2); }
function edadDe(nac){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(nac || '')) return null;
  var p = nac.split('-'), h = new Date(), e = h.getFullYear() - (+p[0]);
  if(h.getMonth() + 1 < +p[1] || (h.getMonth() + 1 === +p[1] && h.getDate() < +p[2])) e--;
  return e >= 0 && e < 120 ? e : null;
}
function waAsesor(s, msg){ return T.wa(msg || ('Hola Giandeco, soy ' + (s && s.nombre ? s.nombre : 'cliente') + '. Quisiera hablar con un asesor.')); }

/* ==================== ACCESO ==================== */
var vista = 'entrar', aviso = null;
var TITULO = { entrar:'Bienvenido', crear:'Cree su cuenta', olvido:'Recuperar clave', nueva:'Nueva clave', enviado:'Revise su correo' };
var SUB = {
  entrar:'Ingrese para seguir sus pedidos y su proyecto.',
  crear:'Siga sus pedidos y su proyecto desde cualquier dispositivo.',
  olvido:'Le enviamos un enlace para crear una nueva.',
  nueva:'Elija una clave que no use en otros sitios.',
  enviado:''
};
function fld(id, label, tipo, extra, ph){
  var clave = tipo === 'password';
  return '<div class="cx-f' + (clave ? ' es-clave' : '') + '"><label class="cx-lb" for="' + id + '">' + label + '</label><div class="cx-fw">' +
    '<input class="cx-inp" id="' + id + '" type="' + tipo + '" placeholder="' + (ph || '') + '" ' + (extra || '') + '>' +
    (clave ? '<button type="button" class="cx-ojo" data-ojo="' + id + '" aria-label="Mostrar la clave">' + I.ojo + '</button>' : '') + '</div></div>';
}
var FUERZA = '<div class="cx-fuerza" aria-hidden="true"><i></i><i></i><i></i><i></i></div>';
function formAcceso(){
  var cuerpo = {
    entrar: fld('cxCorreo', 'Correo', 'email', 'autocomplete="email" required', 'nombre@correo.com') + fld('cxClave', 'Clave', 'password', 'autocomplete="current-password" required', 'Su clave') +
      '<div class="cx-olvido"><button type="button" class="cx-link" data-v="olvido">¿Olvidó su clave?</button></div>',
    crear: fld('cxNombre', 'Nombre y apellido', 'text', 'autocomplete="name" required', 'Como figura en su documento') + fld('cxCorreo', 'Correo', 'email', 'autocomplete="email" required', 'nombre@correo.com') +
      fld('cxClave', 'Clave · mínimo 8 caracteres', 'password', 'autocomplete="new-password" minlength="8" required', 'Letras y números') + FUERZA,
    olvido: fld('cxCorreo', 'Correo', 'email', 'autocomplete="email" required', 'nombre@correo.com'),
    nueva: fld('cxClave', 'Nueva clave · mínimo 8', 'password', 'autocomplete="new-password" minlength="8" required', 'Letras y números') + FUERZA +
      fld('cxClave2', 'Repita la clave', 'password', 'autocomplete="new-password" required', 'La misma clave')
  }[vista];
  var boton = { entrar:'Entrar', crear:'Crear cuenta', olvido:'Enviar enlace', nueva:'Guardar clave' }[vista];
  return '<form class="cx-form" id="cxForm" novalidate>' + cuerpo +
    '<p class="cx-msg" id="cxMsg" role="alert"' + (aviso ? '' : ' hidden') + '>' + esc(aviso || '') + '</p>' +
    '<button type="submit" class="cx-btn es-grande"><span>' + boton + '</span><i class="cx-giro" aria-hidden="true"></i></button></form>';
}
function acceso(){
  cx.classList.remove('es-panel'); cx.classList.add('es-acceso');
  document.body.classList.add('cx-es-acceso'); document.body.classList.remove('cx-es-panel');
  document.title = 'Mi cuenta — Giandeco Studio Design';
  var dosPartes = vista === 'entrar' || vista === 'crear';
  var cab = dosPartes
    ? '<div class="cx-segm" role="tablist" aria-label="Acceso"><button type="button" role="tab" data-v="entrar" aria-selected="' + (vista === 'entrar') + '">Iniciar sesión</button>' +
      '<button type="button" role="tab" data-v="crear" aria-selected="' + (vista === 'crear') + '">Crear cuenta</button></div>' +
      '<button type="button" class="cx-google" id="cxGoogle">' + GOOGLE + '<span>Continuar con Google</span></button>' +
      '<div class="cx-o"><span>o con su correo</span></div>'
    : '';
  var cuerpo;
  if(vista === 'enviado'){
    cuerpo = '<div class="cx-enviado"><span class="cx-enviado-ico">' + I.correo + '</span><p class="cx-sub">' + esc(aviso || '') + '</p>' +
      '<button type="button" class="cx-btn es-grande" data-v="entrar"><span>Volver a iniciar sesión</span></button></div>';
  } else cuerpo = formAcceso();
  var pie = vista === 'entrar'
    ? '<div class="cx-invitado">' + I.escudo + '<p><b>¿Compró como invitado?</b> Cree su cuenta con el mismo correo y verá sus pedidos en cualquier dispositivo.</p></div>'
    : vista === 'crear'
    ? '<p class="cx-legal">Al crear su cuenta acepta los <a href="terminos-y-condiciones">términos</a> y la <a href="politica-de-privacidad">privacidad</a>.</p>'
    : vista === 'olvido' || vista === 'nueva'
    ? '<button type="button" class="cx-atras" data-v="entrar">← Volver a iniciar sesión</button>' : '';
  root.innerHTML =
    '<div class="cx-ac" data-vista="' + vista + '">' +
      '<section class="cx-foto">' +
        '<img class="cx-foto-img" src="images/work/convivir.jpg" alt="Proyecto Convivir con el Arte, de Giandeco" width="1200" height="1800" decoding="async" fetchpriority="high">' +
        '<i class="cx-foto-vel" aria-hidden="true"></i>' +
        '<a class="cx-foto-logo" href="./" aria-label="Giandeco Studio Design, ir al inicio"><img src="img/logo-dorado.svg" alt="" width="84" height="75"></a>' +
        '<div class="cx-foto-pie"><ul class="cx-perks">' +
          '<li>' + I.pedidos + '<span>Siga sus pedidos</span></li><li>' + I.guardados + '<span>Guarde piezas</span></li><li>' + I.proyectos + '<span>Vea su proyecto</span></li></ul>' +
          '<p>Convivir con el Arte</p></div>' +
      '</section>' +
      '<section class="cx-lado"><div class="cx-col">' +
        '<div class="cx-tit"><p class="cx-k">Mi cuenta</p><h1>' + TITULO[vista] + '</h1>' + (SUB[vista] ? '<p class="cx-sub">' + SUB[vista] + '</p>' : '') + '</div>' +
        cab + cuerpo + pie +
      '</div></section>' +
    '</div>';
  aviso = null;
}
function irA(v, msg){ vista = v; aviso = msg || null; acceso(); var x = root.querySelector('.cx-form input'); if(x) x.focus({ preventScroll:true }); }
function error(msg){ var m = document.getElementById('cxMsg'); if(m){ m.hidden = false; m.textContent = msg; } }
function ocupado(on){ var b = root.querySelector('#cxForm .cx-btn'); if(b){ b.disabled = on; b.classList.toggle('is-cargando', on); } }
function marcar(id, ok){ var el = document.getElementById(id); if(el) el.closest('.cx-f').classList.toggle('is-mal', !ok); return ok; }

function enviarAcceso(){
  var g = function(id){ var el = document.getElementById(id); return el ? el.value.trim() : ''; };
  var correo = g('cxCorreo'), clave = (document.getElementById('cxClave') || {}).value || '';
  if(vista === 'entrar'){
    if(![marcar('cxCorreo', correoOk(correo)), marcar('cxClave', clave.length > 0)].every(Boolean)) return error('Revise el correo y la clave.');
    ocupado(true);
    A.entrar(correo, clave).then(function(r){ ocupado(false); if(r.ok){ pintar(); window.scrollTo(0, 0); } else error(r.error); });
  } else if(vista === 'crear'){
    var nombre = g('cxNombre');
    if(![marcar('cxNombre', nombre.split(/\s+/).length >= 2), marcar('cxCorreo', correoOk(correo)), marcar('cxClave', clave.length >= 8 && fuerza(clave) >= 2)].every(Boolean))
      return error(nombre.split(/\s+/).length < 2 ? 'Escriba nombre y apellido.' : !correoOk(correo) ? 'Revise el correo.' : 'Use al menos 8 caracteres, con letras y números.');
    ocupado(true);
    A.registrar(nombre, correo, clave).then(function(r){
      ocupado(false);
      if(!r.ok) return error(r.error);
      if(r.confirmar) return irA('enviado', 'Le enviamos un enlace a ' + correo + ' para activar su cuenta.');
      pintar(); window.scrollTo(0, 0);
    });
  } else if(vista === 'olvido'){
    if(!marcar('cxCorreo', correoOk(correo))) return error('Revise el correo.');
    ocupado(true);
    A.recuperar(correo).then(function(r){ ocupado(false); if(r.ok) irA('enviado', 'Si ' + correo + ' tiene cuenta, le llegará un enlace para crear una nueva clave.'); else error(r.error); });
  } else if(vista === 'nueva'){
    var c2 = (document.getElementById('cxClave2') || {}).value || '';
    if(!marcar('cxClave', clave.length >= 8 && fuerza(clave) >= 2)) return error('Use al menos 8 caracteres, con letras y números.');
    if(!marcar('cxClave2', c2 === clave)) return error('Las claves no coinciden.');
    ocupado(true);
    A.nuevaClave(clave).then(function(r){ ocupado(false); if(r.ok){ vista = 'entrar'; pintar('Clave actualizada.'); } else error(r.error); });
  }
}

/* ==================== PANEL ==================== */
var PAGINAS = { inicio:'Inicio', pedidos:'Pedidos', proyectos:'Proyectos', guardados:'Guardados', beneficios:'Beneficios', direcciones:'Direcciones y facturación', datos:'Mis datos y seguridad' };
var LATERAL = ['inicio', 'pedidos', 'proyectos', 'guardados', 'beneficios', 'direcciones', 'datos'];
var ETAPAS = ['Visita técnica', 'Propuesta y render', 'Mobiliario y compras', 'Montaje'];
var FRASE = ['Su pedido está registrado', 'Confirmado por el estudio', 'Su pedido está en preparación', 'Su pedido va en camino', 'Su pedido fue entregado'];
var filtro = 'todos', segAbierto = false, editando = null, canalSel = null;

/* #pedidos/GD2610124821 → { pg:'pedidos', n:'GD2610124821' } */
function ruta(){
  var h = decodeURIComponent((location.hash || '').slice(1)).split('/'), pg = h[0] || 'inicio';
  if(pg === 'resumen') pg = 'inicio'; if(pg === 'favoritos') pg = 'guardados';
  if(pg === 'cuenta' && !MOVIL.matches) pg = 'datos';
  if(pg === 'seguridad' && !MOVIL.matches) pg = 'datos';
  if(pg !== 'cuenta' && pg !== 'seguridad' && !PAGINAS[pg]) pg = 'inicio';
  return { pg:pg, n:h[1] || '' };
}
/* qué pestaña de la barra inferior (teléfono) queda encendida */
function tabDe(pg){ return { inicio:'inicio', pedidos:'pedidos', proyectos:'proyectos', guardados:'guardados' }[pg] || 'cuenta'; }

function hecho(){ return I.check; }
function paso(p){
  var N = T.ESTADOS.length, e = Math.min(p.estado || 0, N - 1), fin = e >= N - 1;
  var lista = '<ol class="cx-paso" style="--p:' + (e / (N - 1)) + '" aria-label="Estado del pedido">' + T.ESTADOS.map(function(x, i){
    var st = i < e || (fin && i === e) ? 'hecho' : i === e ? 'ahora' : 'falta';
    return '<li class="is-' + st + '"' + (i === e ? ' aria-current="step"' : '') + '><span class="cx-pd">' + (st === 'hecho' ? hecho() : '') + '</span><span class="cx-pt">' + esc(x) + '</span></li>';
  }).join('') + '</ol>';
  var seg = '<div class="cx-pm"><div class="cx-pm-t"><b>' + esc(T.ESTADOS[e]) + '</b><span>Paso ' + (e + 1) + ' de ' + N + '</span></div><div class="cx-seg5" aria-hidden="true">' +
    T.ESTADOS.map(function(x, i){ return '<i class="' + (i < e || (fin && i === e) ? 'is-hecho' : i === e ? 'is-ahora' : '') + '"></i>'; }).join('') + '</div></div>';
  return lista + seg;
}
function thumbs(p, n){
  var h = p.items.slice(0, n).map(function(x){ var c = x.key && T.CAT[x.key]; return c && c.img ? '<img src="' + esc(c.img) + '" alt="" loading="lazy" decoding="async">' : '<b>G</b>'; }).join('');
  if(p.items.length > n) h += '<em>+' + (p.items.length - n) + '</em>';
  return '<span class="cx-th">' + h + '</span>';
}
function chipEstado(p){ var e = p.estado || 0; return '<span class="cx-ch ' + (e >= T.ESTADOS.length - 1 ? 'es-fin' : 'es-vivo') + '">' + esc(T.ESTADOS[e]) + '</span>'; }
function vacio(icono, texto, href, cta){
  return '<div class="cx-vacio"><span>' + icono + '</span><p>' + texto + '</p>' + (href ? '<a class="cx-btn" href="' + href + '"><span>' + cta + '</span></a>' : '') + '</div>';
}
function cab(titulo, extra, sub){
  return '<div class="cx-cab"><div class="cx-cab-t"><p class="cx-k">Mi cuenta</p><h1>' + titulo + '</h1>' + (sub ? '<p class="cx-cab-s">' + sub + '</p>' : '') + '</div>' + (extra || '') + '</div>';
}

/* ---------- beneficios y servicios ---------- */
function BENEFICIOS(s){
  var nav = Object.keys(T.CAT).filter(function(k){ return T.CAT[k].linea === 'navidad'; }).length;
  return {
    asesor:  { ico:I.asesor, t:'Su asesor', d:'Un asesor del estudio resuelve sus dudas por WhatsApp.', dm:'Le responde por WhatsApp', a:'Escribir', href:waAsesor(s), ext:true },
    cambios: { ico:I.escudo, t:'Cambios y garantía', d:'Conozca las condiciones de cambio y garantía de sus piezas.', dm:'Condiciones de sus piezas', a:'Ver condiciones', href:'cambios-y-garantia' },
    navidad: { ico:I.copo, t:'Navidad 2026', tl:'Colección Navidad 2026', d:'Las ' + nav + ' piezas de la colección, con precio y ficha.', dm:nav + ' piezas con precio y ficha', a:'Ver colección', href:'catalogo-navidad' },
    envios:  { ico:I.camion, t:'Envíos y entregas', d:'Plazos, cobertura y cómo recibir su pedido.', dm:'Plazos y cobertura', a:'Ver detalles', href:'envios-y-entregas' }
  };
}
var INICIO_BEN = ['asesor', 'cambios', 'navidad'], PAGINA_BEN = ['asesor', 'navidad', 'cambios', 'envios'];
function ext(b){ return b.ext ? ' target="_blank" rel="noopener"' : ''; }
function tarjetasBen(ids, s, titulosLargos){
  var B = BENEFICIOS(s);
  return ids.map(function(id){
    var b = B[id];
    return '<article class="cx-bn"><span class="cx-ic">' + b.ico + '</span><h3>' + esc(titulosLargos && b.tl ? b.tl : b.t) + '</h3><p>' + esc(b.d) + '</p>' +
      '<a href="' + b.href + '"' + ext(b) + '>' + b.a + I.flecha + '</a></article>';
  }).join('') + (ESPACIO_LIBRE ? '<article class="cx-bn es-libre"><span class="cx-ic">' + I.mas + '</span><h3>Su próximo beneficio</h3><p>[ESPACIO PARA UN BENEFICIO NUEVO]</p></article>' : '');
}
function filasBen(ids, s){
  var B = BENEFICIOS(s);
  return ids.map(function(id){
    var b = B[id];
    return '<a class="cx-fila" href="' + b.href + '"' + ext(b) + '>' + b.ico + '<div><b>' + esc(b.t) + '</b><span>' + esc(b.dm) + '</span></div>' + I.der + '</a>';
  }).join('');
}
function secBeneficios(s){
  return '<section class="cx-sec"><div class="cx-sh"><h2>Sus beneficios</h2><a class="cx-vt" href="#beneficios">Ver todos</a></div>' +
    '<div class="cx-bns es-cols-' + (INICIO_BEN.length + (ESPACIO_LIBRE ? 1 : 0)) + '">' + tarjetasBen(INICIO_BEN, s) + '</div>' +
    '<div class="cx-filas">' + filasBen(INICIO_BEN, s) + '</div></section>';
}
function secServicios(s, largo){
  return '<section class="cx-sec"><div class="cx-sh es-col"><h2>Servicios</h2>' + (largo ? '<p class="cx-sh-s">Servicios del estudio con costo, aparte de sus beneficios.</p>' : '') + '</div>' +
    '<article class="cx-srv' + (largo ? ' es-largo' : '') + '"><span class="cx-ic es-g">' + I.agenda + '</span>' +
      '<div class="cx-srv-t"><h3>Visita técnica</h3><p>' + (largo ? 'Visitamos su espacio, lo medimos y lo analizamos para proponerle qué muebles, iluminación y decoración le convienen.' : 'Visitamos su espacio, lo analizamos y le proponemos qué le conviene.') + '</p></div>' +
      '<dl class="cx-datosrv"><div><dt>Costo</dt><dd>S/ 100</dd></div><div><dt>Duración</dt><dd>' + (largo ? '1 hora, máximo 1 h 30 min' : '1 h a 1 h 30') + '</dd></div></dl>' +
      '<a class="cx-btn" href="contacto"><span>Agendar visita</span></a></article></section>';
}
function bandaProyecto(s, solo){
  return '<section class="cx-proy"><div class="cx-proy-t"><p class="cx-k">Su proyecto</p><h2>Interiorismo con seguimiento</h2>' +
    '<p>Aún no tiene un proyecto vinculado. Cuando lo tenga, verá aquí cada etapa.</p>' +
    '<div class="cx-acc"><a class="cx-btn" href="' + T.wa('Hola Giandeco, soy ' + s.nombre + ' y quiero vincular mi proyecto a mi cuenta (' + s.email + ').') + '" target="_blank" rel="noopener"><span>Vincular</span></a>' +
      '<a class="cx-ghost" href="contacto">Agendar visita</a></div></div>' +
    '<ol class="cx-etapas">' + ETAPAS.map(function(e, i){ return '<li><span>' + (i + 1) + '</span>' + e + '</li>'; }).join('') + '</ol></section>';
}
function secGuardados(){
  var fav = favLista();
  return '<section class="cx-sec"><div class="cx-sh"><h2>Guardados</h2>' + (fav.length > 4 ? '<a class="cx-vt" href="#guardados">Ver los ' + fav.length + '</a>' : '') + '</div>' +
    (fav.length ? '<div class="cx-pcs">' + fav.slice(0, 4).map(function(k){ var c = T.CAT[k];
      return '<a class="cx-pc" href="' + T.url(k) + '"><img src="' + esc(c.img) + '" alt="' + esc(c.nombre) + '" loading="lazy" decoding="async"><span>' + esc(c.nombre) + '</span><em>' + esc(c.precio) + '</em></a>'; }).join('') + '</div>'
    : vacio(I.guardados, 'Aún no guarda piezas.', 'catalogo', 'Ver el catálogo')) + '</section>';
}

/* ---------- pedido ---------- */
function ocard(p){
  var e = p.estado || 0, vivo = enCurso(p);
  return '<section class="cx-oc"><div class="cx-oc-top"><div class="cx-oc-id">' + thumbs(p, 3) +
      '<div><p class="cx-k">' + (vivo ? 'Pedido en curso' : 'Último pedido') + '</p><b>' + esc(p.n) + '</b><span>' + fecha(p.fecha) + ' · ' + nPiezas(p) + '</span></div></div>' +
    '<div class="cx-oc-der"><div class="cx-oc-tot"><span>Total</span><b>' + (p.subtotal ? T.fmt(totalDe(p)) : 'Cotización') + '</b></div>' +
      '<a class="cx-btn" href="#pedidos/' + encodeURIComponent(p.n) + '"><span>Ver detalle</span></a></div></div>' + paso(p) + '</section>';
}
function activar(){
  return '<section class="cx-act"><span class="cx-ic es-g">' + I.escudo + '</span><div><h2>Active su cuenta</h2>' +
    '<p>Hoy sus pedidos viven solo en este dispositivo. Con una cuenta los verá desde cualquier lugar.</p></div>' +
    '<div class="cx-act-b"><button type="button" class="cx-google es-chico" id="cxGoogle">' + GOOGLE + '<span>Continuar con Google</span></button>' +
    '<button type="button" class="cx-ghost" data-crear>Crear cuenta con mi correo</button></div></section>';
}

function pagInicio(s){
  var ped = T.pedidos.lista(), p = ped.filter(enCurso)[0] || ped[0];
  return cab(saludo() + ', ' + esc(primerNombre(s)), '<a class="cx-ghost es-wa" href="' + waAsesor(s) + '" target="_blank" rel="noopener">' + I.wa + 'Hablar con mi asesor</a>') +
    (modo() === 'invitado' ? activar() : '') +
    (p ? ocard(p) : '<section class="cx-oc es-vacio">' + vacio(I.pedidos, 'Aún no tiene pedidos. Cuando compre, aquí verá cada paso.', 'catalogo', 'Ver el catálogo') + '</section>') +
    secBeneficios(s) + secServicios(s, false) + secGuardados();
}

function listaPed(ped){
  var f = ped.filter(function(p){ return filtro === 'curso' ? enCurso(p) : filtro === 'entregados' ? !enCurso(p) : true; });
  return f;
}
function filtros(ped){
  var c = ped.filter(enCurso).length, d = ped.length - c;
  var t = [['todos', 'Todos · ' + ped.length], ['curso', 'En curso · ' + c], ['entregados', 'Entregados · ' + d]];
  return '<div class="cx-filtro" role="group" aria-label="Filtrar pedidos">' + t.map(function(x){
    return '<button type="button" data-filtro="' + x[0] + '" aria-pressed="' + (filtro === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div>';
}
function tarjetaPed(p, sel){
  return '<a class="cx-lp' + (sel ? ' is-sel' : '') + '" href="#pedidos/' + encodeURIComponent(p.n) + '"' + (sel ? ' aria-current="true"' : '') + ' data-ped="' + esc(p.n) + '">' +
    '<div class="cx-lp-1"><b>' + esc(p.n) + '</b>' + chipEstado(p) + '</div>' +
    '<div class="cx-lp-2">' + thumbs(p, 3) + '<span>' + fecha(p.fecha, true) + ' · ' + nPiezas(p) + '</span></div>' +
    '<strong>' + (p.subtotal ? T.fmt(totalDe(p)) : 'Cotización') + '</strong></a>';
}
function detalle(p, esH1){
  var N = T.ESTADOS.length, e = Math.min(p.estado || 0, N - 1), vivo = enCurso(p);
  var items = p.items.map(function(x){
    var c = x.key && T.CAT[x.key];
    var op = x.key && !vivo ? (T.opiniones.mia(x.key) ? '<small>Opinión en revisión</small>' : '<a class="cx-mini" href="' + T.url(x.key) + '#opiniones">Opinar</a>') : '';
    return '<li class="cx-it">' + (c && c.img ? '<img src="' + esc(c.img) + '" alt="" loading="lazy" decoding="async">' : '<b class="cx-it-g">G</b>') +
      '<div><b>' + (x.key ? '<a href="' + T.url(x.key) + '">' + esc(x.nombre) + '</a>' : esc(x.nombre)) + '</b><span>' + x.qty + ' ud.</span>' + op + '</div>' +
      '<em>' + (x.valor === null ? 'A cotizar' : T.fmt(x.valor * x.qty)) + '</em></li>';
  }).join('');
  var pagar = (p.subtotal && !p.pagado && T.db('pasarela') === true ? '<a class="cx-btn" href="pagar?n=' + encodeURIComponent(p.n) + '"><span>Pagar</span></a>' : '') +
    (p.pagoKey === 'directo' && !p.pagado ? '<a class="cx-btn" href="checkout?ok=' + encodeURIComponent(p.n) + '"><span>Datos de pago</span></a>' : '');
  var seg = '<ol class="cx-linea">' + T.ESTADOS.map(function(x, i){ return '<li class="' + (i <= e ? 'is-hecho' : '') + '">' + esc(x) + '</li>'; }).join('') + '</ol>';
  return '<section class="cx-det">' +
    '<div class="cx-det-h"><div><p class="cx-k">Detalle del pedido</p><' + (esH1 ? 'h1' : 'h2') + '>' + esc(p.n) + '</' + (esH1 ? 'h1' : 'h2') + '></div><div class="cx-det-ch">' + (p.pagado ? '<span class="cx-ch es-pagado">Pagado</span>' : '') + chipEstado(p) + '</div></div>' +
    '<div class="cx-det-paso">' + paso(p) +
      '<div class="cx-pm-frase"><b>' + esc(FRASE[e] || T.ESTADOS[e]) + '</b><span>Paso ' + (e + 1) + ' de ' + N + '</span></div>' +
      '<button type="button" class="cx-segver" data-seg aria-expanded="' + segAbierto + '">Ver seguimiento completo' + I.der + '</button>' +
      (segAbierto ? seg : '') + '</div>' +
    '<ul class="cx-its">' + items + '</ul>' +
    '<div class="cx-tot"><span>Total</span><b>' + (p.subtotal ? T.fmt(totalDe(p)) : 'Cotización') + '</b></div>' +
    '<div class="cx-2c"><div><span class="cx-lb">Entrega</span><p>' + esc((p.entrega && p.entrega.resumen) || '—') + '</p></div>' +
      '<div><span class="cx-lb">Comprobante</span><p>' + esc((p.comprobante && p.comprobante.resumen) || '—') + '</p></div></div>' +
    '<div class="cx-det-acc">' + pagar +
      '<a class="' + (pagar ? 'cx-ghost' : 'cx-btn') + '" href="' + T.wa('Hola Giandeco, quiero saber el estado de mi pedido ' + p.n + '.') + '" target="_blank" rel="noopener">' + I.waLinea + '<span>Consultar<i class="so-m"> por WhatsApp</i></span></a>' +
      '<button type="button" class="cx-ghost" data-repetir="' + esc(p.n) + '">' + I.repetir + 'Repetir<i class="so-d"> pedido</i></button>' +
      '<a class="cx-ghost" href="' + T.wa('Hola Giandeco, necesito el comprobante de mi pedido ' + p.n + '.') + '" target="_blank" rel="noopener">' + I.comprobante + 'Comprobante</a></div>' +
    '</section>';
}
function pagPedidos(s, r){
  var ped = T.pedidos.lista();
  if(!ped.length) return cab('Pedidos') + vacio(I.pedidos, 'Aún no hay pedidos.', 'catalogo', 'Ver el catálogo');
  var sel = r.n ? T.pedidos.get(r.n) : null, f = listaPed(ped);
  if(MOVIL.matches){
    if(sel) return detalle(sel, true);
    return cab('Pedidos', filtros(ped)) + '<div class="cx-lps">' + (f.length ? f.map(function(p){ return tarjetaPed(p, false); }).join('') : '<p class="cx-nada">No hay pedidos en esta vista.</p>') + '</div>';
  }
  if(!sel || !f.some(function(p){ return p.n === sel.n; })) sel = f[0] || null;
  return cab('Pedidos', filtros(ped)) + '<div class="cx-pgrid"><div class="cx-lps">' +
    (f.length ? f.map(function(p){ return tarjetaPed(p, sel && p.n === sel.n); }).join('') : '<p class="cx-nada">No hay pedidos en esta vista.</p>') + '</div>' +
    (sel ? detalle(sel) : '') + '</div>';
}

function pagProyectos(s){
  var n = ''; for(var i = 0; i <= 10; i++) n += '<input type="radio" name="tsNps" id="tsNps' + i + '" value="' + i + '"><label for="tsNps' + i + '">' + i + '</label>';
  return cab('Proyectos') + bandaProyecto(s) +
    '<details class="cx-plegable"><summary>Dejar mi testimonio</summary>' +
      '<form class="cx-fm" id="tsForm" novalidate>' +
        '<div class="cx-2c">' + campo('tsProy', 'Proyecto', 'type="text"', 'Indique qué proyecto fue.') + campo('tsRol', 'Cargo y empresa (opcional)', 'type="text"', '') + '</div>' +
        '<div class="cx-f"><label class="cx-lb" for="tsAntes">¿Qué necesitaba resolver?</label><textarea class="cx-inp es-area" id="tsAntes"></textarea><span class="cx-err">Una o dos líneas.</span></div>' +
        '<div class="cx-f"><label class="cx-lb" for="tsDespues">¿Qué cambió después?</label><textarea class="cx-inp es-area" id="tsDespues"></textarea><span class="cx-err">Una o dos líneas.</span></div>' +
        '<div class="cx-f"><span class="cx-lb">¿Nos recomendaría? 0 a 10</span><div class="cx-nps">' + n + '</div><span class="cx-err">Elija un número.</span></div>' +
        '<label class="cx-ck"><input type="checkbox" id="tsPub"><span><b>Autorizo publicarlo con mi nombre y mi marca.</b></span></label>' +
        '<div class="cx-acc"><button type="submit" class="cx-btn"><span>Enviar por WhatsApp</span></button></div></form></details>';
}
function pagGuardados(s){
  var fav = favLista();
  return cab('Guardados') + (fav.length ? '<div class="cx-gg">' + fav.map(function(k){ var c = T.CAT[k];
    return '<article class="cx-gc"><a class="cx-pc" href="' + T.url(k) + '"><img src="' + esc(c.img) + '" alt="' + esc(c.nombre) + '" loading="lazy" decoding="async"><span>' + esc(c.nombre) + '</span><em>' + esc(c.precio) + '</em></a>' +
      '<div class="cx-gc-b">' + (c.stock <= 0 ? '<span class="cx-agot">Agotado</span>' : '<button type="button" class="cx-ghost" data-gdt-add="' + k + '">' + (c.valor === null ? 'Cotizar' : 'A la bolsa') + '</button>') +
      '<button type="button" class="cx-quitar" data-quitar="' + k + '" aria-label="Quitar de guardados: ' + esc(c.nombre) + '">' + I.corazonX + '</button></div></article>'; }).join('') + '</div>'
    : vacio(I.guardados, 'Aún no guarda piezas.', 'catalogo', 'Ver el catálogo'));
}
function pagBeneficios(s){
  return cab('Beneficios', '', 'Lo que Giandeco pone a disposición de sus clientes.') +
    '<div class="cx-bns es-grande es-n' + (PAGINA_BEN.length + (ESPACIO_LIBRE ? 1 : 0)) + '">' + tarjetasBen(PAGINA_BEN, s, true) + '</div>' + secServicios(s, true) + bandaProyecto(s);
}

/* ---------- datos ---------- */
function campo(id, label, attrs, err, val){
  return '<div class="cx-f"><label class="cx-lb" for="' + id + '">' + label + '</label><input class="cx-inp" id="' + id + '" ' + attrs + ' value="' + esc(val || '') + '"><span class="cx-err">' + err + '</span></div>';
}
function sel(id, label, opts, val, extra){
  return '<div class="cx-sel"><select class="cx-inp" id="' + id + '" aria-label="' + label + '"' + (extra || '') + '>' + opts.map(function(o){
    return '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(val) ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select>' + I.abajo + '</div>';
}
function opcionesNac(pf){
  var n = (pf.nac || '').split('-'), y = new Date().getFullYear(), dias = [['', 'Día']], meses = [['', 'Mes']], anios = [['', 'Año']], i;
  for(i = 1; i <= 31; i++) dias.push([i, i]);
  for(i = 0; i < 12; i++) meses.push([i + 1, MESES[i]]);
  for(i = y - 18; i >= y - 100; i--) anios.push([i, i]);
  return '<div class="cx-nac">' + sel('cuDia', 'Día', dias, n[2] ? +n[2] : '') + sel('cuMes', 'Mes', meses, n[1] ? +n[1] : '') + sel('cuAnio', 'Año', anios, n[0] ? +n[0] : '') + '</div>';
}
function edadTxt(nac){ var e = edadDe(nac); return e === null ? '—' : e + ' años'; }
function cardPerfil(s){
  var pf = perfil(), cuenta = modo() === 'cuenta';
  return '<section class="cx-cd" id="cxPerfil"><h2>Perfil</h2>' +
    '<form class="cx-fm" id="cuDatos" novalidate>' +
      campo('cuNombre', 'Nombre y apellido', 'type="text" autocomplete="name"', 'Indique su nombre.', s.nombre) +
      '<div class="cx-2c">' + campo('cuCel', 'Celular', 'type="tel" inputmode="numeric" maxlength="11" autocomplete="tel-national"', 'Celular de 9 dígitos que empiece en 9.', s.cel) +
        '<div class="cx-f"><label class="cx-lb" for="cuEmail">Correo</label><div class="cx-fw"><input class="cx-inp' + (cuenta ? ' es-ro' : '') + '" id="cuEmail" type="email" autocomplete="email" value="' + esc(s.email || '') + '"' + (cuenta ? ' readonly' : '') + '>' + (cuenta ? '<span class="cx-cand">' + I.candado + '</span>' : '') + '</div><span class="cx-err">Revise el correo.</span></div></div>' +
      '<div class="cx-f" id="cuNacF"><span class="cx-lb">Fecha de nacimiento</span>' + opcionesNac(pf) +
        '<span class="cx-ayuda" id="cuNacA">Para enviarle su cupón de cumpleaños<i class="cx-edad-m"> · <span id="cuEdadM">' + edadTxt(pf.nac) + '</span></i>.</span><span class="cx-err">Elija día, mes y año, o deje los tres vacíos.</span></div>' +
      '<div class="cx-2c"><div class="cx-f"><span class="cx-lb">Género · opcional</span>' + sel('cuGenero', 'Género', [['', 'Prefiero no decir'], ['f', 'Femenino'], ['m', 'Masculino'], ['o', 'Otro']], pf.genero || '') + '</div>' +
        '<div class="cx-f cx-edad-d"><span class="cx-lb">Edad</span><div class="cx-edad" id="cuEdad">' + edadTxt(pf.nac) + '</div></div></div>' +
      '<div class="cx-acc es-form"><button type="submit" class="cx-btn"><span>Guardar</span></button><span class="cx-ok" id="cuOk" role="status" hidden>' + I.check + 'Guardado</span></div>' +
    '</form></section>';
}
function cardComunicacion(){
  var pf = perfil(), canal = canalSel || pf.canal || 'whatsapp';
  var ck = function(id, t, d, on, dis){ return '<label class="cx-ck"><input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + (dis ? ' disabled' : '') + '><span><b>' + t + '</b><span>' + d + '</span></span></label>'; };
  return '<section class="cx-cd" id="cxCom"><h2>Comunicación y cupones</h2><div class="cx-fm">' +
    ck('cuCumple', 'Cupón de cumpleaños', 'Reciba su cupón en el mes de su cumpleaños.', pf.cumple !== false) +
    ck('cuNovedades', 'Novedades y colecciones', 'Lanzamientos, Navidad y ofertas para clientes.', pf.novedades !== false) +
    ck('cuAvisos', 'Avisos de sus pedidos', 'Estado, envío y entrega. Siempre activos.', true, true) +
    '<div class="cx-f"><span class="cx-lb" id="cuCanalL">Cómo prefiere que le escribamos</span><div class="cx-canal" role="group" aria-labelledby="cuCanalL">' +
      [['whatsapp', 'WhatsApp'], ['correo', 'Correo'], ['ambos', 'Ambos']].map(function(c){ return '<button type="button" data-canal="' + c[0] + '" aria-pressed="' + (canal === c[0]) + '">' + c[1] + '</button>'; }).join('') + '</div></div>' +
    '<p class="cx-nota-p">Usamos su fecha de nacimiento solo para su cupón y para comunicarnos con usted. Puede cambiarlo cuando quiera. <a href="politica-de-privacidad">Privacidad</a></p>' +
    '<span class="cx-ok" id="cuOk2" role="status" hidden>' + I.check + 'Guardado</span></div></section>';
}
function cardEntrega(modoEdicion){
  var d = T.db('datos') || {}, comp = comprobanteTxt(d);
  var fila = function(ico, t, v, vacioT, k){
    return '<div class="cx-rw"><span class="cx-ic">' + ico + '</span><div><b>' + t + '</b><span class="cx-d">' + (v ? esc(v) : vacioT) + '</span></div>' +
      (modoEdicion ? '<button type="button" class="cx-ed" data-editar="' + k + '">' + (editando === k ? 'Cerrar' : 'Editar') + '</button>' : '<a class="cx-ed" href="#direcciones">Editar</a>') + '</div>';
  };
  var fDir = '', fComp = '';
  if(modoEdicion && editando === 'dir'){
    fDir = '<form class="cx-fm cx-edit" id="cuDir" novalidate>' + campo('cuDirV', 'Dirección de entrega', 'type="text" autocomplete="street-address"', 'Escriba la dirección completa.', d.dir) +
      campo('cuRef', 'Referencia (opcional)', 'type="text"', '', d.ref) + '<div class="cx-acc"><button type="submit" class="cx-btn"><span>Guardar</span></button></div></form>';
  }
  if(modoEdicion && editando === 'comp'){
    var fac = (d.comp || 'boleta') === 'factura';
    fComp = '<form class="cx-fm cx-edit" id="cuComp" novalidate><div class="cx-f"><span class="cx-lb">Tipo</span><div class="cx-canal es-2" role="group" aria-label="Tipo de comprobante">' +
        '<button type="button" data-comp="boleta" aria-pressed="' + !fac + '">Boleta</button><button type="button" data-comp="factura" aria-pressed="' + fac + '">Factura</button></div></div>' +
      '<div class="cx-bol"' + (fac ? ' hidden' : '') + '><div class="cx-2c"><div class="cx-f"><label class="cx-lb" for="cuTdoc">Documento</label>' + sel('cuTdoc', 'Tipo de documento', [['DNI', 'DNI'], ['Carné de extranjería', 'Carné de extranjería'], ['Pasaporte', 'Pasaporte']], d.tdoc || 'DNI') + '</div>' +
        campo('cuDoc', 'Número', 'type="text" inputmode="text" maxlength="12" autocomplete="off"', 'Revise el número de documento.', d.doc) + '</div></div>' +
      '<div class="cx-fac"' + (fac ? '' : ' hidden') + '><div class="cx-2c">' + campo('cuRuc', 'RUC', 'type="text" inputmode="numeric" maxlength="11"', 'El RUC tiene 11 dígitos y empieza en 10 o 20.', d.ruc) +
        campo('cuRazon', 'Razón social', 'type="text" autocomplete="organization"', 'Indique la razón social.', d.razon) + '</div>' +
        campo('cuFiscal', 'Dirección fiscal', 'type="text"', 'Indique la dirección fiscal.', d.fiscal) + '</div>' +
      '<div class="cx-acc"><button type="submit" class="cx-btn"><span>Guardar</span></button></div></form>';
  }
  return '<section class="cx-cd" id="cxEntrega"><h2>Entrega y comprobante</h2><div class="cx-rws">' +
    fila(I.direcciones, 'Dirección de entrega', d.dir, 'Aún no guarda una dirección. Se completa al comprar.', 'dir') + fDir +
    fila(I.comprobante, 'Comprobante', comp, 'Aún no guarda datos de comprobante. Se completa al comprar.', 'comp') + fComp + '</div></section>';
}
function cardSeguridad(s){
  var m = modo(), g = s.proveedor === 'google';
  var filas;
  if(m === 'cuenta' && g){
    filas = '<div class="cx-rw"><span class="cx-ic">' + GOOGLE.replace('<svg ', '<svg width="22" height="22" ') + '</span><div><b>Entra con Google</b><span class="cx-d">' + esc(s.email) + '</span></div><span class="cx-ch es-vivo">' + I.check + 'Conectado</span></div>' +
      '<div class="cx-rw"><span class="cx-ic">' + I.escudo + '</span><div><b>Clave</b><span class="cx-d">No la necesita: su cuenta está protegida por Google.</span></div><span></span></div>';
  } else if(m === 'cuenta'){
    filas = '<div class="cx-rw"><span class="cx-ic">' + I.correo + '</span><div><b>Entra con correo y clave</b><span class="cx-d">' + esc(s.email) + '</span></div><span class="cx-ch es-vivo">' + I.check + 'Conectado</span></div>' +
      '<div class="cx-rw"><span class="cx-ic">' + I.candado + '</span><div><b>Clave</b><span class="cx-d">Le enviamos un enlace a su correo para cambiarla.</span></div><button type="button" class="cx-ed" id="cuClave">Cambiar</button></div>';
  } else {
    filas = '<div class="cx-rw"><span class="cx-ic">' + I.equipo + '</span><div><b>Solo este dispositivo</b><span class="cx-d">Sus pedidos viven en este navegador. Active su cuenta para verlos desde cualquier lugar.</span></div><span></span></div>' +
      '<div class="cx-acc"><button type="button" class="cx-google es-chico" id="cxGoogle">' + GOOGLE + '<span>Continuar con Google</span></button><button type="button" class="cx-ghost" data-crear>Crear cuenta con mi correo</button></div>';
  }
  return '<section class="cx-cd" id="cxSeg"><h2>Acceso y seguridad</h2><div class="cx-rws">' + filas + '</div>' +
    '<button type="button" class="cx-borrar" id="cuBorrar">Borrar los datos de este dispositivo</button></section>';
}
function pagDatos(s){
  return cab('Mis datos y seguridad') +
    '<div class="cx-2col"><div class="cx-col1">' + cardPerfil(s) + cardEntrega(false) + '</div><div class="cx-col1">' + cardSeguridad(s) + cardComunicacion() + '</div></div>' +
    '<div class="cx-guardar-m"><button type="submit" class="cx-btn es-grande" form="cuDatos"><span>Guardar</span></button></div>';
}
function pagDirecciones(s){ return cab('Direcciones y facturación') + '<div class="cx-1col">' + cardEntrega(true) + '</div>'; }
function pagSeguridad(s){ return cab('Seguridad') + '<div class="cx-1col">' + cardSeguridad(s) + '</div>'; }

/* en el teléfono, "Cuenta" es un índice: cada fila abre su pantalla */
function pagCuenta(s){
  var m = modo(), g = s.proveedor === 'google';
  var seguridad = m === 'cuenta' ? (g ? 'Entra con Google · Conectado' : 'Entra con correo y clave') : 'Solo este dispositivo';
  var fila = function(ico, t, d, href){ return '<a class="cx-fila" href="' + href + '"><span class="cx-ic">' + ico + '</span><div><b>' + t + '</b><span>' + d + '</span></div>' + I.der + '</a>'; };
  return '<div class="cx-hub-yo">' + avatar(s, 64) + '<div><h1>' + esc(s.nombre) + '</h1>' + insignia(m) + '</div></div>' +
    '<div class="cx-filas es-hub">' + fila(I.datos, 'Mis datos', 'Nombre, cumpleaños y comunicación', '#datos') + fila(I.direcciones, 'Direcciones y facturación', 'Entrega y comprobante', '#direcciones') +
      fila(I.beneficios, 'Beneficios', 'Asesor, Navidad y más', '#beneficios') + fila(I.escudo, 'Seguridad', seguridad, '#seguridad') + fila(I.ayuda, 'Ayuda y postventa', 'Cambios, garantía y reclamos', 'cambios-y-garantia') + '</div>' +
    '<div class="cx-hub-pie"><button type="button" class="cx-salirm" id="cuSalir">' + I.salir + 'Cerrar sesión</button><button type="button" class="cx-borrar" id="cuBorrar">Borrar los datos de este dispositivo</button></div>';
}

var PAG = { inicio:pagInicio, pedidos:pagPedidos, proyectos:pagProyectos, guardados:pagGuardados, beneficios:pagBeneficios, direcciones:pagDirecciones, datos:pagDatos, cuenta:pagCuenta, seguridad:pagSeguridad };

function avatar(s, px){ return '<span class="cx-ava" style="--px:' + px + 'px">' + (s.foto ? '<img src="' + esc(s.foto) + '" alt="" referrerpolicy="no-referrer">' : esc(iniciales(s.nombre))) + '</span>'; }
function insignia(m){ return m === 'cuenta' ? '<span class="cx-ver">' + I.escudo + 'Cuenta verificada</span>' : '<span class="cx-ver es-inv">' + I.equipo + 'Solo en este dispositivo</span>'; }

function lateral(s, r){
  var nPed = T.pedidos.lista().length, nFav = favLista().length, act = r.pg === 'seguridad' || r.pg === 'cuenta' ? 'datos' : r.pg;
  var cuentas = { pedidos:nPed, guardados:nFav };
  return '<aside class="cx-side"><div class="cx-side-in"><div class="cx-yo">' + avatar(s, 56) + '<div><b>' + esc(s.nombre) + '</b>' + insignia(modo()) + '</div></div>' +
    '<nav class="cx-nav" aria-label="Secciones de la cuenta">' + LATERAL.map(function(k){
      return '<a class="cx-nv' + (k === act ? ' is-on' : '') + '" href="#' + k + '"' + (k === act ? ' aria-current="page"' : '') + '>' + I[k] + '<span>' + PAGINAS[k] + '</span>' + (cuentas[k] ? '<b>' + cuentas[k] + '</b>' : '') + '</a>';
    }).join('') + '</nav>' +
    '<div class="cx-side-pie"><button type="button" class="cx-nv" id="cuSalir2">' + I.salir + '<span>Cerrar sesión</span></button></div></div></aside>';
}
function barraTabs(r, s){
  var tab = tabDe(r.pg), nPed = T.pedidos.lista().length;
  var t = [['inicio', 'Inicio', '#inicio'], ['pedidos', 'Pedidos', '#pedidos'], ['proyectos', 'Proyectos', '#proyectos'], ['guardados', 'Guardados', '#guardados'], ['cuenta', 'Cuenta', '#cuenta']];
  return '<nav class="cx-tabs" aria-label="Secciones de la cuenta">' + t.map(function(x){
    var ico = x[0] === 'cuenta' ? I.datos : I[x[0]];
    return '<a class="cx-tb' + (tab === x[0] ? ' is-on' : '') + '" href="' + x[2] + '"' + (tab === x[0] ? ' aria-current="page"' : '') + '>' + ico + x[1] + (x[0] === 'pedidos' && nPed ? '<i>' + nPed + '</i>' : '') + '</a>';
  }).join('') + '</nav>';
}
function barraMovil(r, s){
  var sub = r.pg === 'datos' || r.pg === 'direcciones' || r.pg === 'beneficios' || r.pg === 'seguridad';
  if(sub) return '<header class="cx-bar es-atras"><a class="cx-back" href="#cuenta" aria-label="Volver a Cuenta">' + I.atras + '</a><span>Cuenta</span></header>';
  if(r.pg === 'pedidos' && r.n) return '<header class="cx-bar es-atras"><a class="cx-back" href="#pedidos" aria-label="Volver a pedidos">' + I.atras + '</a><span>Pedidos</span></header>';
  return '<header class="cx-bar"><a class="cx-bar-logo" href="./" aria-label="Giandeco Studio Design, ir al inicio"><img src="img/logo-dorado.svg" alt="" width="40" height="36"></a>' +
    (r.pg === 'inicio' ? '<a class="cx-bar-wa" href="' + waAsesor(s) + '" target="_blank" rel="noopener" aria-label="Hablar con mi asesor">' + I.wa + '</a>' : '') + '</header>';
}

function panel(s, nota, enfocar){
  cx.classList.add('es-panel'); cx.classList.remove('es-acceso');
  document.body.classList.add('cx-es-panel'); document.body.classList.remove('cx-es-acceso');
  var r = ruta(), pg = r.pg;
  var tit = pg === 'cuenta' ? 'Cuenta' : pg === 'seguridad' ? 'Seguridad' : PAGINAS[pg];
  document.title = tit + ' — Mi cuenta — Giandeco Studio Design';
  root.innerHTML = '<div class="cx-app" data-pg="' + pg + '">' + barraMovil(r, s) + lateral(s, r) +
    '<div class="cx-main" id="cxMain">' + (nota ? '<p class="cx-nota" role="status">' + esc(nota) + '</p>' : '') + PAG[pg](s, r) + '</div></div>' + barraTabs(r, s);
  if(enfocar){ var h = root.querySelector('.cx-main h1'); if(h){ h.setAttribute('tabindex', '-1'); h.focus({ preventScroll:true }); } }
}

function pintar(nota, enfocar){
  var s = T.sesion.get();
  if(s) panel(s, nota, enfocar); else acceso();
}

/* ---------- guardar datos (en este dispositivo y, con cuenta, en la cuenta) ---------- */
function guardarPerfil(parte, destino){
  var pf = perfil(), k;
  for(k in parte) pf[k] = parte[k];
  T.db('perfil', pf);
  var md = {}, claves = ['nac', 'genero', 'cumple', 'novedades', 'canal'];
  claves.forEach(function(c){ if(pf[c] !== undefined) md[c] = pf[c]; });
  md.consentimiento_fecha = new Date().toISOString();
  if(parte.nombre){ md.nombre = parte.nombre; md.full_name = parte.nombre; }
  if(parte.cel !== undefined) md.cel = parte.cel;
  if(A.actual()){
    return A.actualizar(md).then(function(r){ return !!(r && r.ok); });
  }
  return Promise.resolve(true);
}
function flash(id, ok, textoMal){
  var el = document.getElementById(id); if(!el) return;
  el.innerHTML = (ok ? I.check + 'Guardado' : esc(textoMal || 'Guardado en este dispositivo.')); el.hidden = false; el.classList.toggle('es-aviso', !ok);
  clearTimeout(flash.t); flash.t = setTimeout(function(){ el.hidden = true; }, 3200);
}
function leerNac(){
  var d = (document.getElementById('cuDia') || {}).value, m = (document.getElementById('cuMes') || {}).value, a = (document.getElementById('cuAnio') || {}).value;
  if(!d && !m && !a) return { vacio:true, nac:'' };
  if(!d || !m || !a) return { mal:true };
  var f = new Date(+a, +m - 1, +d);
  if(f.getFullYear() !== +a || f.getMonth() !== +m - 1 || f.getDate() !== +d) return { mal:true };
  return { nac:a + '-' + dosD(m) + '-' + dosD(d) };
}
function actualizarEdad(){
  var n = leerNac(), t = n.nac ? edadTxt(n.nac) : '—';
  var a = document.getElementById('cuEdad'), b = document.getElementById('cuEdadM'); if(a) a.textContent = t; if(b) b.textContent = t;
}
function comunicacionActual(){
  var g = function(id){ var el = document.getElementById(id); return el ? el.checked : undefined; };
  var c = root.querySelector('[data-canal][aria-pressed="true"]');
  var o = { canal:c ? c.getAttribute('data-canal') : (perfil().canal || 'whatsapp') };
  if(g('cuCumple') !== undefined) o.cumple = g('cuCumple');
  if(g('cuNovedades') !== undefined) o.novedades = g('cuNovedades');
  return o;
}

/* ---------- eventos ---------- */
root.addEventListener('click', function(e){
  var t = e.target;
  var v = t.closest('[data-v]'); if(v){ e.preventDefault(); irA(v.getAttribute('data-v')); return; }
  if(t.closest('#cxGoogle')){
    var gb = t.closest('#cxGoogle'); gb.disabled = true;
    A.google().then(function(r){ gb.disabled = false; if(r && !r.ok){ if(document.getElementById('cxMsg')) error(r.error); else pintar(r.error); } });
    return;
  }
  var ojo = t.closest('[data-ojo]');
  if(ojo){ var inp = document.getElementById(ojo.getAttribute('data-ojo')), ver = inp.type === 'password'; inp.type = ver ? 'text' : 'password';
    ojo.innerHTML = ver ? I.ojoNo : I.ojo; ojo.setAttribute('aria-label', ver ? 'Ocultar la clave' : 'Mostrar la clave'); return; }
  if(t.closest('[data-crear]')){ var s0 = T.sesion.get() || {}; vista = 'crear'; acceso();
    document.getElementById('cxNombre').value = s0.nombre || ''; document.getElementById('cxCorreo').value = s0.email || ''; document.getElementById('cxClave').focus(); return; }
  var r = t.closest('[data-repetir]');
  if(r){ var p = T.pedidos.get(r.getAttribute('data-repetir'));
    p.items.forEach(function(x){ if(x.key) T.carrito.addKey(x.key, x.qty); else T.carrito.addEspacio(x.nombre, x.cat, x.origen); });
    T.abrir(); return; }
  var fl = t.closest('[data-filtro]'); if(fl){ filtro = fl.getAttribute('data-filtro'); pintar(); return; }
  var pl = t.closest('[data-ped]');
  if(pl && !MOVIL.matches){ e.preventDefault(); segAbierto = false; history.replaceState(null, '', '#pedidos/' + encodeURIComponent(pl.getAttribute('data-ped'))); pintar(); return; }
  if(t.closest('[data-seg]')){ segAbierto = !segAbierto; pintar(); var sb = root.querySelector('[data-seg]'); if(sb) sb.focus({ preventScroll:true }); return; }
  var q = t.closest('[data-quitar]'); if(q){ T.favs.alternar(q.getAttribute('data-quitar')); return; }
  var cn = t.closest('[data-canal]');
  if(cn){ root.querySelectorAll('[data-canal]').forEach(function(b){ b.setAttribute('aria-pressed', b === cn ? 'true' : 'false'); }); canalSel = cn.getAttribute('data-canal');
    guardarPerfil(comunicacionActual()).then(function(ok){ flash('cuOk2', ok, 'Guardado en este dispositivo. No pudimos sincronizar con su cuenta.'); }); return; }
  var ed = t.closest('[data-editar]'); if(ed){ var k = ed.getAttribute('data-editar'); editando = editando === k ? null : k; pintar(); return; }
  var cp = t.closest('[data-comp]');
  if(cp){ var fac = cp.getAttribute('data-comp') === 'factura';
    root.querySelectorAll('[data-comp]').forEach(function(b){ b.setAttribute('aria-pressed', b === cp ? 'true' : 'false'); });
    root.querySelector('.cx-bol').hidden = fac; root.querySelector('.cx-fac').hidden = !fac; return; }
  if(t.closest('#cuSalir, #cuSalir2')){ A.salir(); location.hash = ''; vista = 'entrar'; pintar(); return; }
  if(t.closest('#cuClave')){ var s1 = T.sesion.get(); A.recuperar(s1.email).then(function(x){ pintar(x.ok ? 'Le enviamos un enlace a ' + s1.email + ' para cambiar su clave.' : x.error); }); return; }
  if(t.closest('#cuBorrar') && window.confirm('Se borrarán su sesión, pedidos, guardados y bolsa de este dispositivo. ¿Continuar?')){
    A.salir();
    ['sesion', 'pedidos', 'favs', 'vistos', 'datos', 'perfil', 'opiniones', 'carrito', 'reclamos', 'preguntas', 'testimonios'].forEach(function(k){ T.db(k, null); });
    location.href = 'cuenta';
  }
});
root.addEventListener('input', function(e){
  var c = e.target.closest('.cx-f'); if(c) c.classList.remove('is-mal');
  var msg = document.getElementById('cxMsg'); if(msg && !root.querySelector('#cxForm .cx-f.is-mal') && e.target.closest('#cxForm')) msg.hidden = true;
  if(e.target.id === 'cxClave'){ var m = root.querySelector('.cx-fuerza'); if(m) m.setAttribute('data-n', e.target.value ? fuerza(e.target.value) : 0); }
});
root.addEventListener('change', function(e){
  var id = e.target.id;
  if(id === 'cuDia' || id === 'cuMes' || id === 'cuAnio'){ actualizarEdad(); var nf = document.getElementById('cuNacF'); if(nf) nf.classList.remove('is-mal'); return; }
  if(id === 'cuCumple' || id === 'cuNovedades'){
    guardarPerfil(comunicacionActual()).then(function(ok){ flash('cuOk2', ok, 'Guardado en este dispositivo. No pudimos sincronizar con su cuenta.'); });
  }
});
root.addEventListener('submit', function(e){
  e.preventDefault();
  var fm = e.target;
  if(fm.id === 'cxForm'){ enviarAcceso(); return; }
  if(fm.id === 'cuDatos'){
    var n = document.getElementById('cuNombre'), c = document.getElementById('cuCel'), m = document.getElementById('cuEmail'), nac = leerNac();
    var cel = c.value.replace(/\D/g, '');
    var ok = [[n, n.value.trim().length > 2], [c, !cel || /^9\d{8}$/.test(cel)], [m, correoOk(m.value.trim())]];
    ok.forEach(function(x){ if(x[0]) x[0].closest('.cx-f').classList.toggle('is-mal', !x[1]); });
    var nf = document.getElementById('cuNacF'); if(nf) nf.classList.toggle('is-mal', !!nac.mal);
    if(ok.some(function(x){ return !x[1]; }) || nac.mal){ var mal = root.querySelector('.cx-f.is-mal input, .cx-f.is-mal select'); if(mal) mal.focus(); return; }
    var s = T.sesion.get() || {};
    s.nombre = n.value.trim(); s.cel = cel; s.email = m.value.trim(); T.sesion.set(s);
    var parte = comunicacionActual(); parte.nac = nac.nac; parte.genero = document.getElementById('cuGenero').value; parte.nombre = s.nombre; parte.cel = s.cel;
    guardarPerfil(parte).then(function(okc){ flash('cuOk', okc, 'Guardado en este dispositivo. No pudimos sincronizar con su cuenta.'); });
    return;
  }
  if(fm.id === 'cuDir'){
    var dv = document.getElementById('cuDirV'), okd = dv.value.trim().length > 5;
    dv.closest('.cx-f').classList.toggle('is-mal', !okd); if(!okd){ dv.focus(); return; }
    var dd = T.db('datos') || {}; dd.dir = dv.value.trim(); dd.ref = document.getElementById('cuRef').value.trim(); T.db('datos', dd);
    editando = null; pintar('Dirección guardada.'); return;
  }
  if(fm.id === 'cuComp'){
    var fac = fm.querySelector('[data-comp][aria-pressed="true"]').getAttribute('data-comp') === 'factura', d2 = T.db('datos') || {}, g2 = function(id){ return document.getElementById(id).value.trim(); }, bad;
    var rv = function(id, ok){ document.getElementById(id).closest('.cx-f').classList.toggle('is-mal', !ok); if(!ok && !bad) bad = id; };
    if(fac){
      rv('cuRuc', /^(10|20)\d{9}$/.test(g2('cuRuc'))); rv('cuRazon', g2('cuRazon').length > 2); rv('cuFiscal', g2('cuFiscal').length > 5);
    } else {
      var doc = g2('cuDoc'); rv('cuDoc', g2('cuTdoc') === 'DNI' ? /^\d{8}$/.test(doc) : /^[A-Za-z0-9]{6,12}$/.test(doc));
    }
    if(bad){ document.getElementById(bad).focus(); return; }
    d2.comp = fac ? 'factura' : 'boleta';
    if(fac){ d2.ruc = g2('cuRuc'); d2.razon = g2('cuRazon'); d2.fiscal = g2('cuFiscal'); } else { d2.tdoc = g2('cuTdoc'); d2.doc = g2('cuDoc'); }
    T.db('datos', d2); editando = null; pintar('Comprobante guardado.'); return;
  }
  if(fm.id === 'tsForm'){
    var g = function(id){ return fm.querySelector('#' + id); }, nps = fm.querySelector('input[name="tsNps"]:checked');
    var rr = [[g('tsProy'), g('tsProy').value.trim().length > 2], [g('tsAntes'), g('tsAntes').value.trim().length > 10], [g('tsDespues'), g('tsDespues').value.trim().length > 10]];
    rr.forEach(function(x){ x[0].closest('.cx-f').classList.toggle('is-mal', !x[1]); });
    fm.querySelector('.cx-nps').closest('.cx-f').classList.toggle('is-mal', !nps);
    var mal2 = fm.querySelector('.is-mal input, .is-mal textarea'); if(mal2){ mal2.focus(); return; }
    var se = T.sesion.get(), rol = g('tsRol').value.trim();
    var ts, tss = T.db('testimonios') || []; tss.unshift(ts = { id:T.uid(), autor:se.nombre, rol:rol, proyecto:g('tsProy').value.trim(), antes:g('tsAntes').value.trim(), despues:g('tsDespues').value.trim(), nps:+nps.value, publicar:g('tsPub').checked, fecha:new Date().toISOString() });
    T.db('testimonios', tss); T.nube('testimonios', ts.id, ts);
    window.open(T.wa('Hola Giandeco, dejo mi testimonio del proyecto ' + ts.proyecto + '.\n\nQué necesitaba resolver: ' + ts.antes + '\n\nQué cambió después: ' + ts.despues +
      '\n\nRecomendación: ' + ts.nps + '/10\n' + se.nombre + (rol ? ' · ' + rol : '') + '\n' + (ts.publicar ? 'Autorizo publicarlo con mi nombre y el de mi marca o proyecto.' : 'Prefiero que no se publique.')), '_blank', 'noopener');
  }
});
window.addEventListener('hashchange', function(){ if(T.sesion.get()){ editando = null; segAbierto = false; pintar(null, true); window.scrollTo(0, 0); } });
document.addEventListener('gd:favs', function(){ var p = ruta().pg; if(T.sesion.get() && (p === 'guardados' || p === 'inicio')) pintar(); });
if(MOVIL.addEventListener) MOVIL.addEventListener('change', function(){ if(T.sesion.get()) pintar(); });
else if(MOVIL.addListener) MOVIL.addListener(function(){ if(T.sesion.get()) pintar(); });

/* ---------- arranque ---------- */
root.innerHTML = '<div class="cx-cargando" role="status" aria-label="Cargando su cuenta"><i></i></div>';
A.iniciar().then(function(r){
  if(r && r.error){ vista = 'entrar'; aviso = r.error; acceso(); return; }
  if(r && r.tipo === 'recovery'){ vista = 'nueva'; acceso(); return; }
  pintar(r && r.tipo === 'signup' ? 'Cuenta activada. Bienvenido.' : null);
  T.pedidos.sincronizar(function(){ pintar(); });
});
})();
