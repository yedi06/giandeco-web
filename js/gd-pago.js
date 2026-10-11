/* ==========================================================================
   GIANDECO — PAGO EN LÍNEA
   Habla con la función backend/functions/pago y abre el formulario de la
   pasarela (Culqi). Los datos de tarjeta se escriben en el formulario de
   Culqi y viajan directo a Culqi: esta web solo recibe un identificador de
   un solo uso y se lo pasa al servidor, que es quien cobra.

   El monto no se decide aquí: lo calcula el servidor.
   ========================================================================== */
(function(){
'use strict';
var T = window.GD_TIENDA;
if(!T || window.GD_PAGO) return;

var FN = T.NUBE.url + '/functions/v1/pago';
function llamar(cuerpo){
  return fetch(FN, { method:'POST', headers:{ 'Content-Type':'application/json', apikey:T.NUBE.key }, body:JSON.stringify(cuerpo) })
    .then(function(r){ return r.json(); }).catch(function(){ return null; });
}
var cargados = {};
function cargar(src){
  return cargados[src] || (cargados[src] = new Promise(function(ok, mal){
    var s = document.createElement('script'); s.src = src; s.async = true;
    s.onload = ok; s.onerror = function(){ delete cargados[src]; mal(new Error(src)); };
    document.head.appendChild(s);
  }));
}

/* ¿hay pasarela? Se recuerda en el dispositivo para pintar sin esperar. */
function estado(){
  return llamar({ accion:'estado' }).then(function(r){
    var a = !!(r && r.activa); T.db('pasarela', a); return a;
  });
}
function consulta(n, cel){ return llamar({ accion:'consulta', n:n, cel:cel }); }

/* Abre el formulario y cobra.
   o = { n, cel, cuenta (respuesta de consulta), alProcesar(), alTerminar(resultado) }
   resultado = { ok:true, … }  |  { ok:false, mensaje | motivo }  |  { cerrado:true } */
function pagar(o){
  var c = o.cuenta, fin = false;
  function terminar(r){ if(fin) return; fin = true; o.alTerminar(r || { ok:false, motivo:'error' }); }

  Promise.all([cargar('https://js.culqi.com/checkout-js'), cargar('https://3ds.culqi.com').catch(function(){})]).then(function(){
    var device = null, token = null, cuotas = 0;
    var tresDS = window.Culqi3DS || null;

    function cobrar(auth){
      o.alProcesar();
      llamar({ accion:'cobrar', n:o.n, cel:o.cel, token:token, device:device, cuotas:cuotas, auth3ds:auth || null }).then(function(r){
        if(r && r.requiere3ds && !auth && tresDS){ autenticar(r); return; }
        if(r && r.requiere3ds) r = { ok:false, mensaje:'Su banco pidió una verificación adicional que no se pudo completar. Pruebe con otra tarjeta o con otro medio de pago.' };
        terminar(r);
      });
    }
    /* verificación del banco (3-D Secure): la muestra Culqi en su propia ventana */
    function autenticar(r){
      function oir(ev){
        if(ev.origin !== location.origin || !ev.data || typeof ev.data !== 'object') return;
        if(ev.data.parameters3DS){ window.removeEventListener('message', oir); try{ tresDS.reset(); }catch(e){} cobrar(ev.data.parameters3DS); }
        else if(ev.data.error){ window.removeEventListener('message', oir); try{ tresDS.reset(); }catch(e){} terminar({ ok:false, mensaje:'Su banco no pudo verificar la operación. Inténtelo de nuevo o use otro medio de pago.' }); }
      }
      window.addEventListener('message', oir, false);
      try{
        tresDS.settings = { charge:{ totalAmount:r.monto, returnUrl:location.href }, card:{ email:r.email } };
        tresDS.options = { showModal:true, showLoading:true, showIcon:true, closeModalAction:function(){ terminar({ cerrado:true }); },
                           style:{ btnColor:'#C9A24A', btnTextColor:'#0A0A09' } };
        tresDS.initAuthentication(token);
      }catch(e){ window.removeEventListener('message', oir); terminar({ ok:false, mensaje:'No se pudo iniciar la verificación de su banco. Inténtelo de nuevo.' }); }
    }

    var medios = { tarjeta:true, yape:!!c.yape };
    var Culqi = new window.CulqiCheckout(c.pk, {
      settings: { title:'Giandeco Studio Design', currency:'PEN', amount:c.monto },
      client: { email:c.cliente.email },
      options: { lang:'es', installments:true, modal:true, paymentMethods:medios, paymentMethodsSort:Object.keys(medios) },
      appearance: {
        theme:'default', hiddenCulqiLogo:false, hiddenBannerContent:false, hiddenBanner:false, hiddenToolBarAmount:false,
        menuType:'sidebar', buttonCardPayText:'Pagar',   // Culqi añade el monto
        logo:'https://giandeco.com/images/firma/logo-giandeco-oficial.png',
        defaultStyle:{ bannerColor:'#0A0A09', buttonBackground:'#C9A24A', menuColor:'#9C7A2B', linksColor:'#9C7A2B', buttonTextColor:'#0A0A09', priceColor:'#C9A24A' }
      }
    });
    Culqi.culqi = function(){
      if(Culqi.token){
        token = Culqi.token.id;
        var m = Culqi.token.metadata || {};
        cuotas = parseInt(m.installments, 10) || 0;
        Culqi.close();
        cobrar();
      } else if(Culqi.error){
        // el propio formulario muestra el error y deja corregir
      }
    };
    if(tresDS){
      try{ tresDS.publicKey = c.pk; }catch(e){}
      Promise.resolve().then(function(){ return tresDS.generateDevice(); }).then(function(d){ device = d || null; }).catch(function(){})
        .then(function(){ Culqi.open(); });
    } else Culqi.open();
  }).catch(function(){
    terminar({ ok:false, mensaje:'No se pudo abrir el formulario de pago. Revise su conexión e inténtelo de nuevo.' });
  });
}

window.GD_PAGO = {
  estado: estado, consulta: consulta, pagar: pagar,
  activa: function(){ return T.db('pasarela') === true; },
  /* medios que se cobran en línea cuando hay pasarela */
  EN_LINEA: ['tarjeta', 'cuotas', 'yape']
};
})();
