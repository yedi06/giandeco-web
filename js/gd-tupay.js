/* ==========================================================================
   GIANDECO — PAGO CON TUPAY  (Yape, Plin, QR, transferencia, efectivo…)
   Habla con la función backend `tupay` de Supabase. El cliente termina el pago
   en la página segura de Tupay (redirección) y vuelve a pagar.html.

   Esta web no calcula ni envía montos: la función los recalcula con los
   precios del catálogo, crea el cobro en Tupay y es la única que da un pedido
   por pagado, después de preguntarle a Tupay (con su API firmada) cómo quedó.
   Las tarjetas se pagan con Izipay: ver js/gd-pago.js.
   ========================================================================== */
(function(){
'use strict';
var T = window.GD_TIENDA;
if(!T || window.GD_TUPAY) return;

var FN = T.NUBE.url + '/functions/v1/tupay';
function llamar(cuerpo){
  return fetch(FN, { method:'POST', headers:{ 'Content-Type':'application/json', apikey:T.NUBE.key }, body:JSON.stringify(cuerpo) })
    .then(function(r){ return r.json(); }).catch(function(){ return null; });
}

/* ¿hay Tupay? Se recuerda en el dispositivo para pintar sin esperar. */
function estado(){
  return llamar({ accion:'estado' }).then(function(r){ var a = !!(r && r.activa); T.db('tupay', a); return a; });
}
function consulta(n, cel){ return llamar({ accion:'consulta', n:n, cel:cel }); }
function iniciar(n, cel, medio){ return llamar({ accion:'iniciar', n:n, cel:cel, medio:medio || '' }); }   // medio: qr, banca, tupay ('' = todos)
function verificar(n, cel){ return llamar({ accion:'verificar', n:n, cel:cel }); }

window.GD_TUPAY = {
  estado: estado, consulta: consulta, iniciar: iniciar, verificar: verificar,
  activa: function(){ return T.db('tupay') === true; }
};
})();
