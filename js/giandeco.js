/* ==========================================================================
   GIANDECO — CAPA COMPARTIDA
   Un solo archivo gobierna el mapa del sitio, el header, el footer y las
   interacciones de todas las páginas. Cada página declara dónde está con
   <body data-mundo="retail" data-seccion="proyectos"> y el header se
   marca solo. Añadir una sección = una línea en SITIO.
   ========================================================================== */
(function(){
'use strict';

/* --------------------------------------------------------------------------
   1. MAPA DEL SITIO
   -------------------------------------------------------------------------- */
var SITIO = {
  retail: {
    label:'Retail', home:'retail/',
    secciones:[
      { key:'home',      label:'Navidad',             href:'retail/', enSub:true },   // la página principal de Retail es Navidad: sale primero en la fila y queda marcada
      { key:'diseno',    label:'Servicios',           href:'retail/servicios/' },
      { key:'proyectos', label:'Proyectos',           href:'retail/proyectos' }
    ]
  },
  hogar: {
    label:'Hogar', home:'hogar/',
    secciones:[
      { key:'home',      label:'Hogar',                 href:'hogar/' },
      { key:'diseno',    label:'Interiorismo',          href:'hogar/interiorismo/' },
      { key:'proyectos', label:'Proyectos',             href:'hogar/proyectos' },
      { key:'espacios',  label:'Espacios',              href:'hogar/espacios' }
    ]
  },
  catalogo: {
    label:'Catálogo', home:'catalogo/',
    secciones:[
      { key:'home',       label:'Catálogo',           href:'catalogo/' },
      { key:'navidad',    label:'Navidad',            href:'catalogo/navidad/' },
      { key:'muebleria',  label:'Mueblería',          href:'catalogo/muebleria/' },
      { key:'iluminacion',label:'Iluminación',        href:'catalogo/iluminacion/' },
      { key:'decoracion', label:'Decoración',         href:'catalogo/decoracion' },
      { key:'papel-mural',label:'Papel Mural',        href:'catalogo/papel-mural' },
      { key:'espacio',    label:'Compra el espacio',  href:'catalogo/compra-espacio/' }
    ]
  }
};

var PAGINAS = [
  { key:'nosotros', label:'Quiénes somos', href:'quienes-somos' },
  { key:'contacto', label:'Contacto',      href:'contacto' }
];

/* Datos del estudio: UNA sola fuente. La leen el pie, la capa de tienda (CFG.EMPRESA),
   las páginas legales (data-emp) y los scripts hacer-*.js, que los escriben ya en el HTML. */
var EMPRESA = {
  razon:'Luis Giancarlo Jiménez Sánchez',
  ruc:'10452729691',
  dir:'Ca. Las Bellísimas 170, Urb. Vipol — Callao 07036',
  correo:'contacto@giandeco.com',
  tel:'+51 920 775 559',
  horario:'lunes a sábado, de 9:00 a. m. a 6:00 p. m.'   // POR CONFIRMAR por el estudio: se cambia solo aquí
};
window.GD_EMPRESA = EMPRESA;
var WA = 'https://wa.me/51920775559';
var WA_MSG = WA + '?text=' + encodeURIComponent('Hola Giandeco, quiero conversar sobre un proyecto.');

/* --------------------------------------------------------------------------
   2. CATÁLOGO DE PRODUCTOS  (fichas reales de 05_Mobiliario)
   Alimenta la mueblería y los puntos de compra sobre fotografía.
   -------------------------------------------------------------------------- */
var PRODUCTOS = {
  'centro-deluxe':   { nombre:'Centro Deluxe Nature',        cat:'Centro de TV', precio:'S/ 1,179.00', img:'images/mobiliario/centro-deluxe-1.webp',        nota:'Para TV de hasta 75". MDF 25 mm, 3 cajones con guías telescópicas, LED integrado.' },
  'centro-burnie':   { nombre:'Centro Burnie Cinamono',      cat:'Centro de TV', precio:'S/ 879.00',   img:'images/mobiliario/centro-burnie-1.webp',        nota:'Home suspendido para TV de hasta 70". Puertas basculantes con sistema push.' },
  'comoda-flow':     { nombre:'Cómoda Flow 1.37',            cat:'Dormitorio',   precio:'S/ 879.00',   img:'images/mobiliario/comoda-flow-1.webp',          nota:'4 cajones con correderas telescópicas de apertura por presión. Patas de madera maciza.' },
  'comedor-city12':  { nombre:'Comedor 1.2 City Bouclé',     cat:'Comedor',      precio:'S/ 2,949.00', img:'images/mobiliario/comedor-city12-1.jpg',        nota:'Ideal para 4 personas. Respaldo ergonómico curvo, tablero MDF 40 mm.' },
  'comedor-city180': { nombre:'Comedor 1.80 City Bouclé',    cat:'Comedor',      precio:'S/ 3,549.00', img:'images/mobiliario/comedor-city180-1.jpg?v=2',       nota:'Mesa ovalada de 1.80 para 6 personas. Bordes biselados, madera maciza.' },
  'comedor-living16':{ nombre:'Comedor 1.6 Living Vidrio',   cat:'Comedor',      precio:'S/ 3,549.00', img:'images/mobiliario/comedor-living16-1.jpg',      nota:'Para 6 personas. Tablero con vidrio en tono Off White y patas de madera maciza.' },
  'mesa-sara-canela':{ nombre:'Mesa Sara 1.2 Canela',        cat:'Comedor',      precio:'S/ 1,679.00', img:'images/mobiliario/mesa-sara-canela-1.jpg',      nota:'Para 4 personas. Tablero MDF 25 mm revestido en laminado de madera.' },
  'mesa-sara-vidrio':{ nombre:'Mesa Sara 1.2 Vidrio',        cat:'Comedor',      precio:'Consultar',   img:'images/mobiliario/mesa-sara-vidrio-1.jpg',      nota:'Variante con vidrio Off White y canela. Precio a confirmar con el estudio.' },
  'ropero-bilbao-crema':  { nombre:'Ropero Bilbao Crema',    cat:'Dormitorio',   precio:'S/ 499.00',   img:'images/mobiliario/ropero-bilbao-crema-1.webp',  nota:'4 puertas batientes, 3 repisas y 2 barras de colgar.' },
  'ropero-bilbao-rouble': { nombre:'Ropero Bilbao Rouble',   cat:'Dormitorio',   precio:'S/ 499.00',   img:'images/mobiliario/ropero-bilbao-rouble-1.webp', nota:'4 puertas batientes, 3 repisas y 2 barras de colgar.' },
  'ropero-porto-blanco':  { nombre:'Ropero Porto Blanco',    cat:'Dormitorio',   precio:'S/ 519.00',   img:'images/mobiliario/ropero-porto-blanco-1.webp',  nota:'2 puertas corredizas de deslizamiento suave, 3 repisas.' },
  'ropero-porto-rouble':  { nombre:'Ropero Porto Rouble',    cat:'Dormitorio',   precio:'S/ 519.00',   img:'images/mobiliario/ropero-porto-rouble-1.webp',  nota:'2 puertas corredizas de deslizamiento suave, 3 repisas.' }
};
window.GD_PRODUCTOS = PRODUCTOS;
window.GD_WA = WA_MSG;

/* --------------------------------------------------------------------------
   2b. ILUMINACIÓN  (fichas reales de 07_Luminarias)
   -------------------------------------------------------------------------- */
var ILUMINACION = {
  'amaris':     { nombre:'Lámpara LED Amaris',   cat:'Colgante lineal',    precio:'S/ 572.00',   img:'images/iluminacion/amaris-hd.webp',     nota:'Home suspendido de líneas onduladas, 105 cm. Estructura ABS y silicón, 60W 220V 50/60 Hz, altura regulable, luz LED cálida.' },
  'basilea':    { nombre:'Lámpara Basilea',      cat:'Colgante múltiple',  precio:'S/ 495.00',   img:'images/iluminacion/basilea-hd.webp',    nota:'Estructura metálica y vidrio nacarado, 6 luces con socket E27 estándar. Acabado negro mate y cobre antiguo.' },
  'bristol':    { nombre:'Lámpara Bristol',      cat:'Colgante múltiple',  precio:'S/ 395.00',   img:'images/iluminacion/bristol-hd.webp',    nota:'Estructura metálica con brazos movibles y socket E27 estándar. Acabado negro mate y oro viejo.' },
  'lara':       { nombre:'Lámpara Lara Black',   cat:'Colgante individual',precio:'S/ 495.00',   img:'images/iluminacion/lara-hd.webp',        nota:'Aro circular en estructura metálica y acrílico, 38W 165/265V 50/60 Hz. Altura regulable, luz cálida.' },
  'longer':     { nombre:'Lámpara Longer',       cat:'Colgante lineal',    precio:'S/ 1,352.00', img:'images/iluminacion/longer-hd.webp',      nota:'Paneles verticales en cascada, estructura de aluminio y silicón. Luz LED tricolor, altura regulable, acabado negro mate.' },
  'mady-white': { nombre:'Lámpara Mady White',   cat:'Colgante individual',precio:'S/ 187.00',   img:'images/iluminacion/mady-white-hd.webp', nota:'Domo en estructura metálica y capuchón color cobre, socket E27 estándar. Altura regulable, color blanco bone.' },
  'stratto':    { nombre:'Lámpara Stratto',      cat:'Colgante múltiple',  precio:'S/ 495.00',   img:'images/iluminacion/stratto-hd.webp',     nota:'Estructura metálica, 6 luces con socket E27 estándar. Incluye focos LED.' },
  'villa':      { nombre:'Lámpara Villa',        cat:'Colgante individual',precio:'S/ 260.00',   img:'images/iluminacion/villa-hd.webp',       nota:'Farolillo en estructura metálica, incluye foco LED. Acabado negro y madera avejentada.' },
  'spazio':     { nombre:'Lámpara Spazio',       cat:'Colgante lineal',    precio:'S/ 125.00',   img:'images/iluminacion/spazio-hd.webp',      nota:'Batería de cilindros en aluminio, 8W/220V. Altura regulable, luz LED cálida y blanca.' }
};
window.GD_ILUMINACION = ILUMINACION;

/* --------------------------------------------------------------------------
   2c. NAVIDAD — colección 2026
   Fichas del Excel del estudio (13_Fotos_Nuevas_Actualizar_Web/NAVIDAD.xlsx):
   precio de venta, medidas, material, acabado, forma de venta y stock.
   Al cambiar el stock aquí, subir CATALOGO_V para que rija sobre el del panel.
   -------------------------------------------------------------------------- */
var NAVIDAD = {
  'tren-jengibre': { nombre:'Tren de jengibre', cat:'Jengibre', precio:'S/ 84.50', img:'images/navidad/2026/tren-jengibre.jpg', nota:'Tren de jengibre musical con iluminación LED. Pintado a mano.', medida:'Alto 13 cm · largo 18 cm', material:'Resina pintada a mano', acabado:'Mate', venta:'Unidad', stock:3 },
  'casa-jengibre': { nombre:'Casa de jengibre', cat:'Jengibre', precio:'S/ 177.50', img:'images/navidad/2026/casa-jengibre.jpg', nota:'Casa de jengibre musical con iluminación LED.', medida:'Alto 22 cm · largo 15 cm', material:'Resina', acabado:'Mate', venta:'Unidad', stock:3 },
  'tarro-galletas-jengibre': { nombre:'Tarro de galletas casita de jengibre', cat:'Jengibre', precio:'S/ 57.50', img:'images/navidad/2026/tarro-galletas-jengibre.jpg', nota:'Recipiente galletero navideño con diseño de casita de jengibre.', medida:'Alto 18 cm · largo 14 cm · profundidad 14 cm', material:'Cerámica', acabado:'Brillante', venta:'Unidad', stock:2 },
  'bandeja-jengibre': { nombre:'Bandeja ovalada de jengibre', cat:'Jengibre', precio:'S/ 37.50', img:'images/navidad/2026/bandeja-jengibre.jpg', nota:'Fuente ovalada navideña con detalles decorativos de galleta de jengibre.', medida:'Alto 24 cm · largo 33 cm', material:'Cerámica', acabado:'Brillante', venta:'Unidad', stock:2 },
  'mantequillera-jengibre': { nombre:'Mantequillera de jengibre', cat:'Jengibre', precio:'S/ 32.50', img:'images/navidad/2026/mantequillera-jengibre.jpg', nota:'Mantequillera navideña con diseño de galleta de jengibre y copos de nieve.', medida:'Alto 10 cm · largo 16 cm', material:'Cerámica', acabado:'Brillante', venta:'Unidad', stock:2 },
  'dispensador-jengibre': { nombre:'Dispensador de jabón casita de jengibre', cat:'Jengibre', precio:'S/ 20.80', img:'images/navidad/2026/dispensador-jengibre.jpg', nota:'Dispensador de jabón líquido con diseño de casita de jengibre.', medida:'Alto 19 cm · largo 8 cm · profundidad 6 cm', material:'Cerámica', acabado:'Brillante', venta:'Unidad', stock:2 },
  'servilletero-jengibre': { nombre:'Servilletero navideño de jengibre', cat:'Jengibre', precio:'S/ 18.90', img:'images/navidad/2026/servilletero-jengibre.jpg', nota:'Servilletero navideño de galleta de jengibre con detalle decorativo de soldado cascanueces.', medida:'Alto 9 cm · largo 13 cm', material:'Cerámica', acabado:'Brillante', venta:'Unidad', stock:2 },
  'taza-mug-casa-jengibre': { nombre:'Taza mug casita de jengibre', cat:'Jengibre', precio:'S/ 20.90', img:'images/navidad/2026/taza-mug-casa-jengibre.jpg', nota:'Taza mug navideña con diseño de casita de jengibre.', medida:'Alto 10 cm', material:'Cerámica', acabado:'Brillante', venta:'Unidad', stock:2 },
  'taza-mug-galleta-jengibre': { nombre:'Taza mug galleta de jengibre', cat:'Jengibre', precio:'S/ 20.90', img:'images/navidad/2026/taza-mug-galleta-jengibre.jpg', nota:'Taza mug navideña con forma de galleta de jengibre.', medida:'Alto 11 cm', material:'Cerámica', acabado:'Brillante', venta:'Unidad', stock:2 },
  'taza-mug-jengibre': { nombre:'Taza mug jengibre horneado', cat:'Jengibre', precio:'S/ 20.90', img:'images/navidad/2026/taza-mug-jengibre.jpg', nota:'Taza mug navideña con diseño de galleta de jengibre horneada.', medida:'Alto 10 cm', material:'Cerámica', acabado:'Brillante', venta:'Unidad', stock:2 },
  'cascanueces-musicales': { nombre:'Cascanueces musical base roja', cat:'Cascanueces', precio:'S/ 88.90', img:'images/navidad/2026/cascanueces-musicales.jpg', nota:'Soldado cascanueces que funciona como caja de música a cuerda. Al son de la melodía mueve los brazos o golpea el tambor.', medida:'Alto 30 cm', material:'Madera ligera', acabado:'Mate', venta:'Unidad', stock:12 },
  'cascanueces-musical-azul': { nombre:'Cascanueces musical base azul', cat:'Cascanueces', precio:'S/ 88.90', img:'images/navidad/2026/cascanueces-musical-azul.jpg', nota:'Soldado cascanueces que funciona como caja de música a cuerda. Al son de la melodía mueve los brazos o golpea el tambor.', medida:'Alto 30 cm', material:'Madera ligera', acabado:'Mate', venta:'Unidad', stock:12 },
  'cascanueces-musical-verde': { nombre:'Cascanueces musical base verde', cat:'Cascanueces', precio:'S/ 88.90', img:'images/navidad/2026/cascanueces-musical-verde.jpg', nota:'Soldado cascanueces que funciona como caja de música a cuerda. Al son de la melodía mueve los brazos o golpea el tambor.', medida:'Alto 30 cm', material:'Madera ligera', acabado:'Mate', venta:'Unidad', stock:12 },
  'cascanueces-mecedores': { nombre:'Cascanueces mecedor rojo', cat:'Cascanueces', precio:'S/ 67.50', img:'images/navidad/2026/cascanueces-mecedores.jpg', nota:'Soldado cascanueces con capa y corona tradicional sobre un caballito de base curva que se balancea.', medida:'Alto 30 cm · largo 24 cm', material:'Madera ligera', acabado:'Mate', venta:'Unidad', stock:12 },
  'cascanueces-mecedor-azul': { nombre:'Cascanueces mecedor azul', cat:'Cascanueces', precio:'S/ 67.50', img:'images/navidad/2026/cascanueces-mecedor-azul.jpg', nota:'Soldado cascanueces con capa y corona tradicional sobre un caballito de base curva que se balancea.', medida:'Alto 30 cm · largo 24 cm', material:'Madera ligera', acabado:'Mate', venta:'Unidad', stock:12 },
  'cascanueces-mecedor-verde': { nombre:'Cascanueces mecedor verde', cat:'Cascanueces', precio:'S/ 67.50', img:'images/navidad/2026/cascanueces-mecedor-verde.jpg', nota:'Soldado cascanueces con capa y corona tradicional sobre un caballito de base curva que se balancea.', medida:'Alto 30 cm · largo 24 cm', material:'Madera ligera', acabado:'Mate', venta:'Unidad', stock:12 },
  'perritos-cascanueces': { nombre:'Oso cascanueces rojo', cat:'Cascanueces', precio:'S/ 61.50', img:'images/navidad/2026/perritos-cascanueces.jpg', nota:'Oso con vestimenta tradicional de soldado cascanueces y sombrero de copa.', medida:'Alto 36 cm · largo 10 cm', material:'Madera ligera', acabado:'Mate', venta:'Unidad', stock:12 },
  'oso-cascanueces-azul': { nombre:'Oso cascanueces azul', cat:'Cascanueces', precio:'S/ 61.50', img:'images/navidad/2026/oso-cascanueces-azul.jpg', nota:'Oso con vestimenta tradicional de soldado cascanueces y corona.', medida:'Alto 36 cm · largo 10 cm', material:'Madera ligera', acabado:'Mate', venta:'Unidad', stock:12 },
  'oso-cascanueces-verde': { nombre:'Oso cascanueces verde', cat:'Cascanueces', precio:'S/ 61.50', img:'images/navidad/2026/oso-cascanueces-verde.jpg', nota:'Oso con vestimenta tradicional de soldado cascanueces y corona.', medida:'Alto 36 cm · largo 10 cm', material:'Madera ligera', acabado:'Mate', venta:'Unidad', stock:12 },
  'reno-recostado': { nombre:'Adorno reno navideño recostado', cat:'Adornos', precio:'S/ 69.00', img:'images/navidad/2026/reno-recostado.jpg', nota:'Reno dorado recostado, con astas que sostienen una esfera transparente.', medida:'Alto 17 cm · largo 12 cm', material:'Resina', acabado:'Mate', venta:'Unidad', stock:2 },
  'reno-de-pie': { nombre:'Adorno reno navideño de pie', cat:'Adornos', precio:'S/ 88.50', img:'images/navidad/2026/reno-de-pie.jpg', nota:'Reno dorado de pie, con astas que sostienen una esfera transparente.', medida:'Alto 26 cm · largo 13 cm', material:'Resina', acabado:'Mate', venta:'Unidad', stock:2 },
  'reno-recostado-plato': { nombre:'Adorno reno recostado con plato', cat:'Adornos', precio:'S/ 124.00', img:'images/navidad/2026/reno-recostado-plato.jpg', nota:'Reno dorado recostado, con astas que sostienen una esfera transparente y una bandeja circular sobre el lomo.', medida:'Alto 20 cm · largo 17 cm', material:'Resina', acabado:'Mate', venta:'Unidad', stock:2 },
  'reno-de-pie-plato': { nombre:'Adorno reno de pie con plato', cat:'Adornos', precio:'S/ 139.50', img:'images/navidad/2026/reno-de-pie-plato.jpg', nota:'Reno dorado de pie, con astas que sostienen una esfera transparente y una bandeja circular sobre el lomo.', medida:'Alto 30 cm · largo 18 cm', material:'Resina', acabado:'Mate', venta:'Unidad', stock:2 },
  'venado-mediano': { nombre:'Venado transparente mediano', cat:'Adornos', precio:'S/ 13.90', img:'images/navidad/2026/venado-mediano.jpg', nota:'Reno transparente para decorar el árbol o un centro de mesa.', medida:'Alto 11 cm · largo 10 cm', material:'Acrílico tipo cristal', acabado:'Brillante', venta:'Unidad', stock:10 },
  'venado-pequeno': { nombre:'Venado transparente pequeño', cat:'Adornos', precio:'S/ 12.50', img:'images/navidad/2026/venado-pequeno.jpg', nota:'Reno transparente con reflejos tornasolados, para decorar el árbol o un centro de mesa.', medida:'Alto 11 cm · largo 10 cm', material:'Acrílico tipo cristal', acabado:'Brillante', venta:'Unidad', stock:10 },
  'tubo-esferas-terciopelo-blanco': { nombre:'Tubo de 12 esferas de terciopelo blanco', cat:'Esferas', precio:'S/ 26.90', img:'images/navidad/2026/tubo-esferas-terciopelo-blanco.jpg', nota:'Tira de 12 esferas de terciopelo, presentadas en tubo.', medida:'Tubo de 72 cm', material:'Esferas plásticas cubiertas de terciopelo', acabado:'Afelpado', venta:'Tubo de 12 esferas', stock:6 },
  'tubo-esferas-terciopelo-guinda': { nombre:'Tubo de 12 esferas de terciopelo guinda', cat:'Esferas', precio:'S/ 26.90', img:'images/navidad/2026/tubo-esferas-terciopelo-guinda.jpg', nota:'Tira de 12 esferas de terciopelo, presentadas en tubo.', medida:'Tubo de 72 cm', material:'Esferas plásticas cubiertas de terciopelo', acabado:'Afelpado', venta:'Tubo de 12 esferas', stock:6 },
  'tubo-esferas-terciopelo-verde': { nombre:'Tubo de 12 esferas de terciopelo verde', cat:'Esferas', precio:'S/ 26.90', img:'images/navidad/2026/tubo-esferas-terciopelo-verde.jpg', nota:'Tira de 12 esferas de terciopelo, presentadas en tubo.', medida:'Tubo de 72 cm', material:'Esferas plásticas cubiertas de terciopelo', acabado:'Afelpado', venta:'Tubo de 12 esferas', stock:6 },
  'set-esferas-clasico-dorado': { nombre:'Set de esferas clásico dorado', cat:'Esferas', precio:'S/ 56.50', img:'images/navidad/2026/set-esferas-clasico-dorado.jpg', nota:'Set de 3 esferas decorativas, presentadas en tubo.', medida:'Tubo de 45 cm', material:'Poliestireno con textura de tela', acabado:'Satinado y brillante', venta:'Set de 3 esferas', stock:8 },
  'set-esferas-clasico-guinda': { nombre:'Set de esferas clásico guinda', cat:'Esferas', precio:'S/ 56.50', img:'images/navidad/2026/set-esferas-clasico-guinda.jpg', nota:'Set de 3 esferas decorativas, presentadas en tubo.', medida:'Tubo de 45 cm', material:'Poliestireno con textura de tela', acabado:'Satinado y brillante', venta:'Set de 3 esferas', stock:8 },
  'set-esferas-clasico-rojo': { nombre:'Set de esferas clásico rojo', cat:'Esferas', precio:'S/ 56.50', img:'images/navidad/2026/set-esferas-clasico-rojo.jpg', nota:'Set de 3 esferas decorativas, presentadas en tubo.', medida:'Tubo de 45 cm', material:'Poliestireno con textura de tela', acabado:'Satinado y brillante', venta:'Set de 3 esferas', stock:8 },
  'set-esferas-clasico-verde': { nombre:'Set de esferas clásico verde', cat:'Esferas', precio:'S/ 56.50', img:'images/navidad/2026/set-esferas-clasico-verde.jpg', nota:'Set de 3 esferas decorativas, presentadas en tubo.', medida:'Tubo de 45 cm', material:'Poliestireno con textura de tela', acabado:'Satinado y brillante', venta:'Set de 3 esferas', stock:8 },
  'set-esferas-terciopelo-guinda': { nombre:'Set de esferas de terciopelo guinda', cat:'Esferas', precio:'S/ 67.50', img:'images/navidad/2026/set-esferas-terciopelo-guinda.jpg', nota:'Set de 3 esferas navideñas de terciopelo con detalles en brillantina, presentadas en tubo.', medida:'Tubo de 46 cm', material:'Terciopelo con detalles en brillantina', acabado:'Afelpado', venta:'Set de 3 esferas', stock:6 },
  'set-esferas-terciopelo-rojo': { nombre:'Set de esferas de terciopelo rojo', cat:'Esferas', precio:'S/ 67.50', img:'images/navidad/2026/set-esferas-terciopelo-rojo.jpg', nota:'Set de 3 esferas navideñas de terciopelo con detalles en brillantina, presentadas en tubo.', medida:'Tubo de 46 cm', material:'Terciopelo con detalles en brillantina', acabado:'Afelpado', venta:'Set de 3 esferas', stock:6 },
  'set-esferas-terciopelo-verde': { nombre:'Set de esferas de terciopelo verde', cat:'Esferas', precio:'S/ 67.50', img:'images/navidad/2026/set-esferas-terciopelo-verde.jpg', nota:'Set de 3 esferas navideñas de terciopelo con detalles en brillantina, presentadas en tubo.', medida:'Tubo de 46 cm', material:'Terciopelo con detalles en brillantina', acabado:'Afelpado', venta:'Set de 3 esferas', stock:6 },
  'papa-noel': { nombre:'Papá Noel', cat:'Figuras', precio:'S/ 86.50', img:'images/navidad/2026/papa-noel.jpg', nota:'Figura decorativa de pie, con traje rojo y detalles de peluche blanco.', medida:'Alto 20 cm', material:'Poliéster', acabado:'Mate', venta:'Unidad', stock:6 },
  'osos-navidenos': { nombre:'Pareja de osos navideños', cat:'Figuras', precio:'S/ 223.90', img:'images/navidad/2026/osos-navidenos.jpg', nota:'Pareja de osos navideños de pie, modelo Papá y Mamá Noel.', medida:'Papá: alto 62 cm · largo 27 cm. Mamá: alto 57 cm · largo 27 cm', material:'Terciopelo rojo con detalles de piel sintética', acabado:'Afelpado', venta:'Pareja', stock:2 },
  'oso-musico-guinda': { nombre:'Peluche oso músico guinda', cat:'Figuras', precio:'S/ 92.50', img:'images/navidad/2026/oso-musico-guinda.jpg', nota:'Oso navideño sentado, con detalles dorados en el traje y un tambor.', medida:'Alto 21 cm · largo 20 cm · profundidad 16 cm', material:'Poliéster con textura suave de felpa', acabado:'Afelpado', venta:'Unidad', stock:5 },
  'oso-musico-crema': { nombre:'Peluche oso músico crema', cat:'Figuras', precio:'S/ 92.50', img:'images/navidad/2026/oso-musico-crema.jpg', nota:'Oso navideño sentado, con detalles dorados en el traje y un tambor.', medida:'Alto 31 cm · largo 20 cm · profundidad 16 cm', material:'Poliéster con textura suave de felpa', acabado:'Afelpado', venta:'Unidad', stock:5 },
  'casa-musical': { nombre:'Adorno casa musical Papá Noel', cat:'Figuras', precio:'S/ 131.50', img:'images/navidad/2026/casa-musical.jpg', nota:'Casa tipo invernadero con luces LED y música navideña, con escena de Papá Noel.', medida:'Alto 26 cm · largo 13 cm · profundidad 13 cm', material:'Vidrio y metal', acabado:'Mate', venta:'Unidad', stock:5 },
  'casa-musical-nacimiento': { nombre:'Adorno casa musical Nacimiento', cat:'Figuras', precio:'S/ 131.50', img:'images/navidad/2026/casa-musical-nacimiento.jpg', nota:'Casa tipo invernadero con luces LED y música navideña, con escena del Nacimiento.', medida:'Alto 26 cm · largo 13 cm · profundidad 14 cm', material:'Vidrio y metal', acabado:'Mate', venta:'Unidad', stock:5 },
  'bombonera-caja-regalo': { nombre:'Bombonera caja de regalo blanca', cat:'Bomboneras', precio:'S/ 53.90', img:'images/navidad/2026/bombonera-caja-regalo.jpg', nota:'Bombonera navideña con forma de caja de regalo y tapa con lazo.', medida:'Alto 16 cm · largo 11 cm · profundidad 10 cm', material:'Cerámica', acabado:'Brillante', venta:'Unidad', stock:12 },
  'bombonera-caja-regalo-roja': { nombre:'Bombonera caja de regalo roja', cat:'Bomboneras', precio:'S/ 53.90', img:'images/navidad/2026/bombonera-caja-regalo-roja.jpg', nota:'Bombonera navideña con forma de caja de regalo y tapa con lazo.', medida:'Alto 16 cm · largo 11 cm · profundidad 10 cm', material:'Cerámica', acabado:'Brillante', venta:'Unidad', stock:12 },
  'bombonera-casita': { nombre:'Bombonera casita de jengibre blanca', cat:'Bomboneras', precio:'S/ 65.50', img:'images/navidad/2026/bombonera-casita.jpg', nota:'Bombonera navideña con forma de casita de jengibre.', medida:'Alto 25 cm · largo 12 cm · profundidad 10 cm', material:'Cerámica', acabado:'Brillante', venta:'Unidad', stock:12 },
  'bombonera-casita-roja': { nombre:'Bombonera casita de jengibre roja', cat:'Bomboneras', precio:'S/ 65.50', img:'images/navidad/2026/bombonera-casita-roja.jpg', nota:'Bombonera navideña con forma de casita de jengibre.', medida:'Alto 25 cm · largo 12 cm · profundidad 10 cm', material:'Cerámica', acabado:'Brillante', venta:'Unidad', stock:12 },
  'portavela-dorado': { nombre:'Portavela dorado', cat:'Portavelas', precio:'S/ 61.50', img:'images/navidad/2026/portavela-dorado.jpg', nota:'Set de tres portavelas de alturas escalonadas.', medida:'29 cm, 24 cm y 20 cm de alto', material:'Metal', acabado:'Satinado', venta:'Juego de 3', stock:6 },
  'portavela-negro': { nombre:'Portavela negro', cat:'Portavelas', precio:'S/ 61.50', img:'images/navidad/2026/portavela-negro.jpg', nota:'Set de tres portavelas de alturas escalonadas.', medida:'29 cm, 24 cm y 20 cm de alto', material:'Metal', acabado:'Satinado', venta:'Juego de 3', stock:6 },
  'taza-cascanuez-roja': { nombre:'Set de tazas soldado cascanueces rojo', cat:'Tazas', precio:'S/ 78.80', img:'images/navidad/2026/taza-cascanuez-roja.jpg', nota:'Soldado cascanueces dividido en tres tazas individuales con asas independientes.', medida:'Alto 26 cm · largo 17 cm', material:'Cerámica', acabado:'Brillante', venta:'Unidad', stock:3 },
  'taza-cascanuez': { nombre:'Set de tazas soldado cascanueces clásico', cat:'Tazas', precio:'S/ 78.80', img:'images/navidad/2026/taza-cascanuez.jpg', nota:'Soldado cascanueces dividido en tres tazas individuales con asas independientes.', medida:'Alto 26 cm · largo 16 cm', material:'Cerámica', acabado:'Brillante', venta:'Unidad', stock:3 },
  'taza-mug-estrella-roja': { nombre:'Taza mug con tapa estrella roja', cat:'Tazas', precio:'S/ 28.80', img:'images/navidad/2026/taza-mug-estrella-roja.jpg', nota:'Taza navideña con tapa y cuchara temática de estrella.', medida:'Alto 13 cm · largo 9 cm', material:'Cerámica', acabado:'Brillante', venta:'Unidad', stock:5 },
  'taza-mug-estrella-azul': { nombre:'Taza mug con tapa estrella azul', cat:'Tazas', precio:'S/ 28.80', img:'images/navidad/2026/taza-mug-estrella-azul.jpg', nota:'Taza navideña con tapa y cuchara temática de estrella.', medida:'Alto 13 cm · largo 9 cm', material:'Cerámica', acabado:'Brillante', venta:'Unidad', stock:5 },
  'taza-mug-estrella-verde': { nombre:'Taza mug con tapa estrella verde', cat:'Tazas', precio:'S/ 28.80', img:'images/navidad/2026/taza-mug-estrella-verde.jpg', nota:'Taza navideña con tapa y cuchara temática de estrella.', medida:'Alto 13 cm · largo 9 cm', material:'Cerámica', acabado:'Brillante', venta:'Unidad', stock:5 },
  'taza-12oz-roja': { nombre:'Taza navideña roja 12 oz', cat:'Tazas', precio:'S/ 10.00', img:'images/navidad/2026/taza-12oz-roja.jpg', nota:'Taza navideña de 12 oz.', medida:'Alto 10 cm · largo 9 cm', material:'Cerámica', acabado:'Mate', venta:'Unidad', stock:5 },
  'taza-12oz-blanca': { nombre:'Taza navideña blanca 12 oz', cat:'Tazas', precio:'S/ 10.00', img:'images/navidad/2026/taza-12oz-blanca.jpg', nota:'Taza navideña de 12 oz.', medida:'Alto 10 cm · largo 9 cm', material:'Cerámica', acabado:'Mate', venta:'Unidad', stock:5 },
  'taza-galleta-corazon': { nombre:'Taza galleta corazón', cat:'Tazas', precio:'S/ 10.00', img:'images/navidad/2026/taza-galleta-corazon.jpg', nota:'Taza navideña de 12 oz con diseño festivo de galleta.', medida:'Alto 11 cm', material:'Cerámica', acabado:'Satinado', venta:'Unidad', stock:6 },
  'taza-galleta-muneco': { nombre:'Taza galleta muñeco', cat:'Tazas', precio:'S/ 10.00', img:'images/navidad/2026/taza-galleta-muneco.jpg', nota:'Taza navideña de 12 oz con diseño festivo de galleta.', medida:'Alto 11 cm', material:'Cerámica', acabado:'Satinado', venta:'Unidad', stock:6 },
  'taza-galleta-copo': { nombre:'Taza galleta copo de nieve', cat:'Tazas', precio:'S/ 10.00', img:'images/navidad/2026/taza-galleta-copo.jpg', nota:'Taza navideña de 12 oz con diseño festivo de galleta.', medida:'Alto 11 cm', material:'Cerámica', acabado:'Satinado', venta:'Unidad', stock:6 },
  'taza-galleta-arbol': { nombre:'Taza galleta árbol', cat:'Tazas', precio:'S/ 10.00', img:'images/navidad/2026/taza-galleta-arbol.jpg', nota:'Taza navideña de 12 oz con diseño festivo de galleta.', medida:'Alto 11 cm', material:'Cerámica', acabado:'Satinado', venta:'Unidad', stock:6 },
  'arbol-iluminado': { nombre:'Árbol navideño iluminado', cat:'Iluminados', precio:'S/ 71.60', img:'images/navidad/2026/arbol-iluminado.jpg', nota:'Pino blanco de porcelana con luces.', medida:'Alto 26 cm · largo 15 cm · profundidad 7 cm', material:'Porcelana', acabado:'Brillante', venta:'Unidad', stock:12 },
  'muneco-nieve': { nombre:'Muñeco de nieve iluminado', cat:'Iluminados', precio:'S/ 30.90', img:'images/navidad/2026/muneco-nieve.jpg', nota:'Muñeco de nieve blanco de porcelana con luces.', medida:'Alto 13 cm · largo 11 cm · profundidad 8 cm', material:'Porcelana', acabado:'Brillante', venta:'Unidad', stock:12 },
  'casa-iluminada-mediana': { nombre:'Casa navideña iluminada', cat:'Iluminados', precio:'S/ 44.90', img:'images/navidad/2026/casa-iluminada-mediana.jpg', nota:'Casita blanca de porcelana con luces.', medida:'Alto 17 cm · largo 10 cm · profundidad 7 cm', material:'Porcelana', acabado:'Brillante', venta:'Unidad', stock:12 },
  'casa-iluminada-pequena': { nombre:'Casa navideña iluminada con chimenea', cat:'Iluminados', precio:'S/ 44.90', img:'images/navidad/2026/casa-iluminada-pequena.jpg', nota:'Casita blanca de porcelana con chimenea y luces.', medida:'Alto 17 cm · largo 10 cm · profundidad 6 cm', material:'Porcelana', acabado:'Brillante', venta:'Unidad', stock:12 },
  'casa-iluminada-arbol': { nombre:'Casa navideña iluminada con árbol', cat:'Iluminados', precio:'S/ 64.00', img:'images/navidad/2026/casa-iluminada-arbol.jpg', nota:'Casita blanca de porcelana con árbol y luces.', medida:'Alto 20 cm · largo 11 cm · profundidad 9 cm', material:'Porcelana', acabado:'Brillante', venta:'Unidad', stock:12 },
  'casa-arbol-iluminado': { nombre:'Casa navideña con árbol iluminado', cat:'Iluminados', precio:'S/ 88.00', img:'images/navidad/2026/casa-arbol-iluminado.jpg', nota:'Casita blanca de porcelana junto a un árbol, con luces.', medida:'Alto 18 cm · largo 9 cm · profundidad 7 cm', material:'Porcelana', acabado:'Brillante', venta:'Unidad', stock:12 },
  'arreglo-pino-berries': { nombre:'Arreglo pino y berries', cat:'Decoración', precio:'S/ 35.00', img:'images/navidad/2026/arreglo-pino-berries.jpg', nota:'Centro de mesa navideño: pino artificial con bayas rojas y piñas en base de madera.', medida:'Alto 30 cm · largo 10 cm', material:'Corteza de madera y follaje de polímero', acabado:'Sintético', venta:'Unidad', stock:10 },
  'abeto-nevado': { nombre:'Abeto nevado', cat:'Decoración', precio:'S/ 26.50', img:'images/navidad/2026/abeto-nevado.jpg', nota:'Mini abeto con efecto de nieve en las ramas.', medida:'Alto 30 cm', material:'Follaje de plástico sintético', acabado:'Sintético', venta:'Unidad', stock:6 },
  'farol-124': { nombre:'Farol navideño con letrero 1.24 m', cat:'Farol', precio:'S/ 300.00', img:'images/navidad/2026/farol-124.jpg', nota:'Farol navideño musical de pie, con luces, efecto de nieve y letrero decorativo.', medida:'Alto 1.24 m', material:'Estructura de plástico y figuras interiores de resina', acabado:'Mate', venta:'Unidad', stock:2 },
  'farol-157': { nombre:'Farol navideño con corona 1.60 m', cat:'Farol', precio:'S/ 281.50', img:'images/navidad/2026/farol-157.jpg', nota:'Farol navideño musical de pie, con luces, efecto de nieve y corona.', medida:'Alto 1.60 m · largo 26 cm', material:'Estructura de plástico y figuras interiores de resina', acabado:'Mate', venta:'Unidad', stock:2 },
  'arbol-99sf-7191': { nombre:'Árbol de Navidad nevado 1.80 m 99SF-7191', cat:'Árboles de Navidad', precio:'S/ 175.00', img:'images/navidad/2026/arbol-99sf-7191.jpg', nota:'Árbol de Navidad de ramas nevadas. Se arma en 2 piezas.', medida:'Alto 1.80 m', material:'Base de metal con ramas nevadas y follaje artificial', acabado:'Sintético', venta:'Unidad', stock:4, modelo:'99SF-7191-1' },
  'arbol-99sf-7203': { nombre:'Árbol de Navidad verde 1.80 m 99SF-7203', cat:'Árboles de Navidad', precio:'S/ 225.00', img:'images/navidad/2026/arbol-99sf-7203.jpg', nota:'Árbol de Navidad verde frondoso. Se arma en 2 piezas.', medida:'Alto 1.80 m', material:'Base de metal con ramas y follaje artificial', acabado:'Sintético', venta:'Unidad', stock:4, modelo:'99SF-7203' },
  'arbol-sf-7200': { nombre:'Árbol de Navidad verde con bayas 1.80 m SF-7200', cat:'Árboles de Navidad', precio:'S/ 262.50', img:'images/navidad/2026/arbol-sf-7200.jpg', nota:'Árbol de Navidad verde con bayas rojas. Se arma en 2 piezas.', medida:'Alto 1.80 m', material:'Base de metal con ramas y follaje artificial', acabado:'Sintético', venta:'Unidad', stock:4, modelo:'SF-7200-1' },
  'arbol-99sf-7212': { nombre:'Árbol de Navidad verde con bayas 1.80 m 99SF-7212', cat:'Árboles de Navidad', precio:'S/ 275.00', img:'images/navidad/2026/arbol-99sf-7212.jpg', nota:'Árbol de Navidad verde con bayas rojas. Se arma en 2 piezas.', medida:'Alto 1.80 m', material:'Base de metal con ramas y follaje artificial', acabado:'Sintético', venta:'Unidad', stock:4, modelo:'99SF-7212-1' },
  'arbol-99sf-7205': { nombre:'Árbol de Navidad nevado 2.10 m 99SF-7205', cat:'Árboles de Navidad', precio:'S/ 195.00', img:'images/navidad/2026/arbol-99sf-7205.jpg', nota:'Árbol de Navidad de ramas nevadas. Se arma en 2 piezas.', medida:'Alto 2.10 m', material:'Base de metal con ramas nevadas y follaje artificial', acabado:'Sintético', venta:'Unidad', stock:4, modelo:'99SF-7205' },
  'arbol-99sf-7198': { nombre:'Árbol de Navidad nevado 2.10 m 99SF-7198', cat:'Árboles de Navidad', precio:'S/ 210.00', img:'images/navidad/2026/arbol-99sf-7198.jpg', nota:'Árbol de Navidad de ramas nevadas. Se arma en 4 piezas.', medida:'Alto 2.10 m', material:'Base de metal con ramas nevadas y follaje artificial', acabado:'Sintético', venta:'Unidad', stock:4, modelo:'99SF-7198' },
  'arbol-99sf-7204': { nombre:'Árbol de Navidad verde 2.10 m 99SF-7204', cat:'Árboles de Navidad', precio:'S/ 300.00', img:'images/navidad/2026/arbol-99sf-7204.jpg', nota:'Árbol de Navidad verde frondoso. Se arma en 2 piezas.', medida:'Alto 2.10 m', material:'Base de metal con ramas y follaje artificial', acabado:'Sintético', venta:'Unidad', stock:4, modelo:'99SF-7204' },
  'arbol-99sf-7210': { nombre:'Árbol de Navidad nevado 2.10 m 99SF-7210', cat:'Árboles de Navidad', precio:'S/ 606.50', img:'images/navidad/2026/arbol-99sf-7210.jpg', nota:'Árbol de Navidad de ramas nevadas. Se arma en 3 piezas.', medida:'Alto 2.10 m', material:'Base de metal con ramas nevadas y follaje artificial', acabado:'Sintético', venta:'Unidad', stock:4, modelo:'99SF-7210' }
};
window.GD_NAVIDAD = NAVIDAD;
var CATALOGO_V = '2026-11-03b';   // versión del stock de las fichas (ver 2d)
window.GD_CATALOGO_V = CATALOGO_V;

/* --------------------------------------------------------------------------
   2d. AJUSTES DEL PANEL DE ADMINISTRACIÓN
   Precio, visibilidad y piezas nuevas definidas en admin. GD_BASE
   conserva el catálogo completo para que el panel pueda mostrar también lo
   que está oculto en la tienda.
   -------------------------------------------------------------------------- */
(function(){
  var aj = null;
  try{ aj = JSON.parse(localStorage.getItem('gd.prod') || 'null'); }catch(e){}
  var L = { muebleria:PRODUCTOS, iluminacion:ILUMINACION, navidad:NAVIDAD };
  window.GD_NUEVOS = [];
  if(aj && aj.nuevos) Object.keys(aj.nuevos).forEach(function(k){
    var n = aj.nuevos[k];
    if(L[n.linea] && !L[n.linea][k]){ L[n.linea][k] = { nombre:n.nombre, cat:n.cat, precio:n.precio, img:n.img, nota:n.nota }; window.GD_NUEVOS.push(k); }
  });
  window.GD_BASE = JSON.parse(JSON.stringify(L));
  if(aj && aj.over) Object.keys(aj.over).forEach(function(k){
    var o = aj.over[k];
    Object.keys(L).forEach(function(l){
      if(!L[l][k]) return;
      if(o.activo === false){ delete L[l][k]; return; }
      if(o.precio != null) L[l][k].precio = 'S/ ' + Number(o.precio).toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 });
    });
  });
  // stock: el de la ficha (Excel del estudio) o el que fijó el panel. El del panel solo rige si se
  // guardó para esta versión del catálogo (o.sv); así una carga nueva del Excel no queda tapada.
  var STOCK_INICIAL = 1;
  Object.keys(L).forEach(function(l){
    Object.keys(L[l]).forEach(function(k){
      var o = aj && aj.over && aj.over[k], base = L[l][k].stock;
      var panel = o && o.stock != null && (base == null || o.sv === CATALOGO_V);
      L[l][k].stock = panel ? o.stock : base != null ? base : STOCK_INICIAL;
    });
  });
})();

/* --------------------------------------------------------------------------
   2e. RUTAS DE PRODUCTO
   Cada pieza vive en una dirección con su gama y su nombre: /catalogo/iluminacion/lampara-led-amaris.
   hacer-seo.js genera esas páginas con la misma regla. Las piezas añadidas
   desde el panel, que aún no tienen página, usan la ficha genérica.
   -------------------------------------------------------------------------- */
var RUTAS = {};
[['muebleria', PRODUCTOS], ['iluminacion', ILUMINACION], ['navidad', NAVIDAD]].forEach(function(g){
  Object.keys(g[1]).forEach(function(k){
    RUTAS[k] = 'catalogo/' + g[0] + '/' + g[1][k].nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  });
});
window.GD_URL = function(k){
  return (!RUTAS[k] || window.GD_NUEVOS.indexOf(k) !== -1) ? 'producto?p=' + encodeURIComponent(k) : RUTAS[k];
};

/* --------------------------------------------------------------------------
   3. HEADER
   -------------------------------------------------------------------------- */
var body = document.body;
var mundoActual = body.getAttribute('data-mundo') || '';
var seccionActual = body.getAttribute('data-seccion') || '';
var paginaActual = body.getAttribute('data-pagina') || '';
var esHome = body.getAttribute('data-home') === 'true';

function iconoBuscar(){ return '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/></svg>'; }

/* --------------------------------------------------------------------------
   BARRA DE PROMOCIONES (arriba del header)
   Cada promoción lleva su nombre comercial, el mensaje y el enlace a sus
   condiciones (legal/promociones). Para agregar o cambiar una, editar solo esta lista.
   -------------------------------------------------------------------------- */
var PROMOS = [
  { icono:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.7"/><circle cx="17" cy="17.5" r="1.7"/></svg>', nombre:'Delivery gratis', texto:'En Lima y Callao, desde S/ 399', corto:'Lima y Callao desde S/ 399', href:'legal/promociones#envio-cortesia', accion:'Condiciones' },
  { icono:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 9.5h17v3h-17zM5 12.5h14v8H5zM12 9.5v11M12 9.5C10.5 9.5 8 9 8 7a2 2 0 0 1 4-.5M12 9.5c1.5 0 4-.5 4-2.5a2 2 0 0 0-4-.5"/></svg>', nombre:'Bienvenida', texto:'10 % en su primera compra', corto:'10 % en su primera compra', href:'legal/promociones#bienvenida', accion:'Ver mi código', cupon:true }
];
function promoHTML(){
  return '<div class="sh-promo" id="shPromo" role="region" aria-label="Promociones">' +
    '<div class="sh-promo-in">' +
      '<button class="sh-promo-flecha" type="button" data-promo="-1" aria-label="Promoción anterior"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5"/></svg></button>' +
      '<div class="sh-promo-slides">' + PROMOS.map(function(p, i){
        return '<p class="sh-promo-msg' + (i === 0 ? ' is-active' : '') + (p.cupon ? ' es-cupon' : '') + '"><span class="sh-promo-ico">' + p.icono + '</span><b>' + p.nombre + '</b>' + '<span class="sh-promo-t"><span class="pc">' + p.texto + '</span><span class="mv">' + p.corto + '</span></span>' +
          '<a href="' + p.href + '"' + (p.cupon ? ' data-gdb-abrir' : '') + '>' + p.accion + '</a></p>';
      }).join('') + '</div>' +
      '<button class="sh-promo-flecha" type="button" data-promo="1" aria-label="Promoción siguiente"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg></button>' +
    '</div></div>';
}
function headerHTML(){
  var mundos = Object.keys(SITIO).map(function(k){
    var m = SITIO[k];
    return '<a class="sh-mundo' + (k === mundoActual ? ' is-active' : '') + '" href="' + m.home + '">' + m.label + '</a>';
  }).join('');

  var paginas = PAGINAS.map(function(p){
    return '<a href="' + p.href + '"' + (p.key === paginaActual ? ' class="is-active"' : '') + '>' + p.label + '</a>';
  }).join('');

  // fila de secciones del mundo activo
  var secHTML = '', rightHTML = '';
  var m = SITIO[mundoActual];
  if(m){
    // se omite la sección "home" (Retail/Hogar/Catálogo) — ya está marcada
    // como activa arriba, en la fila de mundos; repetirla aquí es redundante.
    secHTML = m.secciones.filter(function(s){ return s.key !== 'home' || s.enSub; }).map(function(s){
      return '<a class="sh-cat-link' + (s.key === seccionActual ? ' is-active' : '') + '" href="' + s.href + '">' + s.label + '</a>';
    }).join('');
    if(m.pronto){
      rightHTML += m.pronto.map(function(p){
        return '<a class="sh-cat-link" data-pronto href="' + p.href + '" title="Disponible próximamente">' + p.label + '</a>';
      }).join('');
    }
  }
  rightHTML += '<button type="button" class="sh-buscar-inline" id="shBuscarInline">' + iconoBuscar() + 'Buscar</button>';

  // acordeones del menú móvil
  var acc = Object.keys(SITIO).map(function(k){
    var mm = SITIO[k];
    // aquí SÍ se conserva la sección "home": en el menú móvil el botón del
    // mundo solo abre/cierra el acordeón (no es un link), así que este es
    // el único lugar desde el que se puede navegar a la página principal
    // de ese mundo en pantallas chicas.
    // la sección "home" repite el nombre del mundo (Retail, Hogar, Catálogo): en el acordeón se llama "Ver todo"
    var links = mm.secciones.map(function(s){ var todo = s.key === 'home' && !s.enSub; return '<a href="' + s.href + '"' + (todo ? ' class="sh-acc-todo"' : '') + '>' + (todo ? 'Ver todo' : s.label) + '</a>'; }).join('');
    if(mm.pronto) links += mm.pronto.map(function(p){ return '<a href="' + p.href + '" data-pronto title="Disponible próximamente">' + p.label + '</a>'; }).join('');
    return '<div class="sh-acc' + (k === mundoActual ? ' is-open' : '') + '">' +
      '<button type="button" class="sh-acc-btn">' + mm.label +
        '<svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 6l4 4 4-4"/></svg>' +
      '</button><div class="sh-acc-panel">' + links + '</div></div>';
  }).join('');

  return promoHTML() +
  '<header class="site-header" id="siteHeader">' +
    '<div class="sh-marca"><div class="sh-marca-in">' +
      '<div class="sh-left">' +
        '<button class="sh-burger" id="shBurger" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="shMobile"><span></span><span></span><span></span></button>' +
        '<nav class="sh-mundos" aria-label="Mundos">' + mundos + '</nav>' +
      '</div>' +
      '<a class="sh-brand" href="./" aria-label="Inicio">' +
        '<img class="sh-brand-big" src="img/logo-negativo.svg" alt="Giandeco Studio Design">' +
        '<img class="sh-brand-mini" src="img/logo-positivo.svg" alt="Giandeco Studio Design">' +
      '</a>' +
      '<div class="sh-right">' +
        '<nav class="sh-paginas" aria-label="Páginas">' + paginas + '</nav>' +
        '<button class="sh-tema" id="shTema" type="button" aria-label="Cambiar a tema claro" title="Cambiar a tema claro">' +
          '<svg class="ico-sol" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.4"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v3M12 18.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>' +
          '<svg class="ico-luna" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.4"><path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1z"/></svg>' +
        '</button>' +
        '<button class="sh-icon-btn sh-buscar-ico" id="shBuscarIco" type="button" aria-label="Buscar">' + iconoBuscar() + '</button>' +
        '<button class="sh-icon-btn" type="button" aria-label="Carrito">' +
          '<svg viewBox="0 0 24 24"><path d="M2.5 4h2.6l2.3 10.6a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.2L21 8H6.1"/><circle cx="9.5" cy="19.6" r="1.4"/><circle cx="17.2" cy="19.6" r="1.4"/></svg>' +
        '</button>' +
      '</div>' +
    '</div></div>' +
    '<div class="sh-categorias"><div class="sh-cat-in">' +
      '<nav class="sh-cat-nav" aria-label="Secciones">' + secHTML + '</nav>' +
      '<div class="sh-cat-right">' + rightHTML + '</div>' +
    '</div></div>' +
  '</header>' +
  '<div class="sh-scrim" id="shScrim"></div>' +
  '<nav class="sh-mobile" id="shMobile" aria-label="Menú móvil" aria-hidden="true">' +
    '<div class="sh-mobile-head"><a class="sh-mobile-logo" href="./" aria-label="Giandeco Studio Design — Inicio"><img src="img/logo-negativo.svg" alt="Giandeco Studio Design"></a>' +
      '<button class="sh-mobile-close" id="shMobileClose" type="button" aria-label="Cerrar menú">&times;</button></div>' +
    '<div class="sh-mobile-body">' + acc +
      '<div class="sh-mobile-paginas">' + PAGINAS.map(function(p){ return '<a href="' + p.href + '">' + p.label + '</a>'; }).join('') + '</div>' +
      '<div class="sh-mobile-cta">' +
        '<a class="gd-btn gd-btn-primary" href="' + WA_MSG + '" target="_blank" rel="noopener">Escribir por WhatsApp</a>' +
        '<a class="gd-btn gd-btn-ghost" href="contacto">Agendar visita técnica</a>' +
      '</div>' +
    '</div>' +
  '</nav>' +
  '<div class="sh-search-overlay" id="shSearchOverlay" aria-hidden="true">' +
    '<button class="sh-search-close" id="shSearchClose" type="button" aria-label="Cerrar búsqueda">&times;</button>' +
    '<div class="sh-search-in">' +
      '<input class="sh-search-input" id="shSearchInput" type="text" placeholder="Buscar…" autocomplete="off">' +
      '<div class="sh-search-chips" id="shSearchChips"></div>' +
      '<div class="sh-search-results" id="shSearchResults"></div>' +
    '</div>' +
  '</div>';
}

/* --------------------------------------------------------------------------
   4. FOOTER
   -------------------------------------------------------------------------- */
function footerHTML(){
  function col(titulo, items){
    return '<div class="gd-footer-col"><h4>' + titulo + '</h4><ul>' +
      items.map(function(i){ return '<li><a href="' + i.href + '">' + i.label + '</a></li>'; }).join('') +
    '</ul></div>';
  }
  return '' +
  '<footer class="gd-footer"><div class="gd-in">' +
    '<div class="gd-footer-grid">' +
      '<div class="gd-footer-brand">' +
        '<img src="img/logo-positivo.svg" alt="Giandeco Studio Design">' +
        '<p>Visual merchandising y diseño de espacios comerciales. Remodelamos su local, montamos la campaña y ejecutamos la obra bajo una sola dirección.</p>' +
      '</div>' +
      // el blog sale del menú y queda aquí, junto al resto del estudio
      col('Estudio', [{ label:'Retail', href:'retail/' }, { label:'Navidad para retail', href:'retail/#plano' }, { label:'Hogar', href:'hogar/' },
        { label:'Proyectos', href:'retail/proyectos' }, { label:'Quiénes somos', href:'quienes-somos' }, { label:'Blog de retail', href:'retail/blog' }, { label:'Blog de hogar', href:'hogar/blog' }]) +
      col('Catálogo', SITIO.catalogo.secciones.map(function(s){ return { label:s.key==='home'?'Ver catálogo':s.label, href:s.href }; })) +
      '<div class="gd-footer-col"><h4>Contacto</h4>' +
        '<ul class="gd-footer-contact">' +
          '<li><a href="' + WA_MSG + '" target="_blank" rel="noopener">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12C22 17.5228 17.5228 22 12 22C10.1786 22 8.47087 21.513 7 20.6622L2 21.5L2.83209 16C2.29689 14.7751 2 13.4222 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"/><path d="M12.9604 13.8683L15.0399 13.4624L17 14.2149V16.0385C17 16.6449 16.4783 17.1073 15.8901 16.9783C14.3671 16.6444 11.5997 15.8043 9.67826 13.8683C7.84859 12.0248 7.22267 9.45734 7.01039 8.04128C6.92535 7.47406 7.3737 7 7.94306 7H9.83707L10.572 8.96888L10.1832 11.0701"/></svg>+51 920 775 559</a></li>' +
          '<li><a href="mailto:contacto@giandeco.com">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg>contacto@giandeco.com</a></li>' +
          '<li><a href="https://www.google.com/maps/search/?api=1&query=Ca.+Las+Bell%C3%ADsimas+170%2C+Urb.+Vipol%2C+Callao+07036" target="_blank" rel="noopener">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.7 7-11.5A7 7 0 0 0 5 9.5C5 14.3 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.4"/></svg>Ca. Las Bellísimas 170, Urb. Vipol — Callao 07036</a></li>' +
        '</ul>' +
        '<div class="gd-footer-social">' +
          '<a href="https://www.instagram.com/giandeco.studio/" target="_blank" rel="noopener" aria-label="Instagram">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>' +
          '<a href="https://www.facebook.com/profile.php?id=61593540694016" target="_blank" rel="noopener" aria-label="Facebook">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>' +
          '<a href="https://www.tiktok.com/@giandeco_studio" target="_blank" rel="noopener" aria-label="TikTok">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 2.5v12.5a5 5 0 1 1-5-5"/><path d="M15 2.5c.4 3.2 2.6 5.4 6 5.7"/></svg></a>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<nav class="gd-footer-ayuda" aria-label="Ayuda y condiciones">' +
      [['ayuda/compra-segura','Compra segura'], ['ayuda/envios-y-entregas','Envíos y entregas'], ['ayuda/cambios-y-garantia','Cambios y garantía'],
       ['ayuda/preguntas-frecuentes','Preguntas frecuentes'], ['ayuda/opiniones','Opiniones de clientes'], ['legal/promociones','Promociones'], ['legal/terminos-y-condiciones','Términos y condiciones'],
       ['legal/politica-de-privacidad','Privacidad']].map(function(l){ return '<a href="' + l[0] + '">' + l[1] + '</a>'; }).join('') +
      '<a class="gd-footer-libro" href="legal/libro-de-reclamaciones" aria-label="Libro de Reclamaciones">' +
        '<img src="images/legal/libro-reclamaciones.svg" alt="Libro de Reclamaciones" width="204" height="128" decoding="async"></a>' +
    '</nav>' +
    '<div class="gd-footer-pagos"><span>Medios de pago</span>' +
      [['visa','Visa'], ['mastercard','Mastercard'], ['amex','American Express'], ['diners','Diners Club'], ['yape','Yape'], ['bcp','BCP']].map(function(m){
        return '<img src="images/pago/' + m[0] + '.svg" alt="' + m[1] + '" width="39" height="25" loading="lazy" decoding="async">'; }).join('') +
    '</div>' +
    '<div class="gd-footer-bar">' +
      '<span>© 2026 Giandeco Studio Design · ' + EMPRESA.razon + ', RUC ' + EMPRESA.ruc + ' · Atención de ' + EMPRESA.horario + ' · Todos los derechos reservados.</span>' +
      '<em>Espacios que saben vender</em>' +
    '</div>' +
  '</div></footer>';
}

/* --------------------------------------------------------------------------
   5. MONTAJE
   -------------------------------------------------------------------------- */
if(!esHome){
  var host = document.getElementById('gdHeader');
  if(host){ host.outerHTML = headerHTML(); }
  else { body.insertAdjacentHTML('afterbegin', headerHTML()); }

  var fhost = document.getElementById('gdFooter');
  if(fhost){ fhost.outerHTML = footerHTML(); }
  else { body.insertAdjacentHTML('beforeend', footerHTML()); }

}

/* --------------------------------------------------------------------------
   6. INTERACCIONES DEL HEADER
   -------------------------------------------------------------------------- */
var header = document.getElementById('siteHeader');
var sobreHeader = false;   // el cursor (o el foco de teclado) está sobre el header
var promo = document.getElementById('shPromo');
function setSolid(){
  if(header) header.classList.toggle('is-solid', window.scrollY > 40 || sobreHeader);
  // la barra de promociones va arriba del todo; el header baja con ella y se queda en 0 al desplazarse
  document.documentElement.style.setProperty('--promo-top', Math.max(0, (promo ? promo.offsetHeight : 0) - window.scrollY) + 'px');
}
setSolid();
window.addEventListener('scroll', setSolid, { passive:true });
window.addEventListener('resize', setSolid);
window.addEventListener('load', setSolid);

/* Header real al pasar el cursor: transparente sobre la portada (el video sigue corriendo)
   y sólido, con su segunda fila, en cuanto el mouse o el teclado lo tocan. Solo con mouse. */
if(header){
  header.addEventListener('pointerenter', function(e){ if(e.pointerType === 'mouse'){ sobreHeader = true; setSolid(); } });
  header.addEventListener('pointerleave', function(e){ if(e.pointerType === 'mouse'){ sobreHeader = false; setSolid(); } });
  header.addEventListener('focusin', function(){ sobreHeader = true; setSolid(); });
  header.addEventListener('focusout', function(e){ if(!header.contains(e.relatedTarget)){ sobreHeader = false; setSolid(); } });
}

/* Barra de promociones: rota sola cada 6 s, se detiene al pasar el cursor o enfocar, y no rota con "reducir movimiento" */
if(promo){
  var todos = [].slice.call(promo.querySelectorAll('.sh-promo-msg')), msgs = todos, idx = 0, pausa = false, quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // la promoción de bienvenida solo entra a la rotación cuando la función de cupones está activa (js/gd-bienvenida.js)
  function visibles(){
    msgs = todos.filter(function(m){ return !m.classList.contains('es-cupon') || document.documentElement.classList.contains('gd-cupon-on'); });
    promo.classList.toggle('es-una', msgs.length < 2);
  }
  var vistas = {};   // cada promoción se cuenta una vez por página
  function nombrePromo(m){ var b = m && m.querySelector('b'); return b ? b.textContent.trim() : ''; }
  function mostrarPromo(i){
    idx = (i + msgs.length) % msgs.length; todos.forEach(function(m){ m.classList.toggle('is-active', m === msgs[idx]); });
    var n = nombrePromo(msgs[idx]); if(n && !vistas[n]){ vistas[n] = true; if(window.gdMedir) window.gdMedir('promo_ver', { promo:n }); }
  }
  promo.addEventListener('click', function(e){ var a = e.target.closest('.sh-promo-msg a'); if(a && window.gdMedir) window.gdMedir('promo_clic', { promo:nombrePromo(a.closest('.sh-promo-msg')) }); });
  visibles();
  document.addEventListener('gd:cupon', function(){ visibles(); mostrarPromo(idx); });
  promo.addEventListener('click', function(e){ var b = e.target.closest('[data-promo]'); if(b) mostrarPromo(idx + parseInt(b.getAttribute('data-promo'), 10)); });
  ['mouseenter', 'focusin'].forEach(function(ev){ promo.addEventListener(ev, function(){ pausa = true; }); });
  ['mouseleave', 'focusout'].forEach(function(ev){ promo.addEventListener(ev, function(){ pausa = false; }); });
  if(!quieto) setInterval(function(){ if(!pausa && !document.hidden && msgs.length > 1) mostrarPromo(idx + 1); }, 6000);
}

var burger = document.getElementById('shBurger');
var mobile = document.getElementById('shMobile');
var scrim  = document.getElementById('shScrim');
function abrirMovil(v){
  if(!mobile) return;
  mobile.classList.toggle('is-open', v);
  if(scrim) scrim.classList.toggle('is-open', v);
  if(burger){ burger.classList.toggle('is-open', v); burger.setAttribute('aria-expanded', v ? 'true' : 'false'); }
  mobile.setAttribute('aria-hidden', v ? 'false' : 'true');
  document.documentElement.style.overflow = v ? 'hidden' : '';
}
if(burger) burger.addEventListener('click', function(){ abrirMovil(!mobile.classList.contains('is-open')); });
var mClose = document.getElementById('shMobileClose');
if(mClose) mClose.addEventListener('click', function(){ abrirMovil(false); });
if(scrim) scrim.addEventListener('click', function(){ abrirMovil(false); });
document.querySelectorAll('.sh-acc-btn').forEach(function(btn){
  btn.addEventListener('click', function(){ btn.parentNode.classList.toggle('is-open'); });
});

/* búsqueda */
var INDICE = [];
Object.keys(SITIO).forEach(function(k){
  SITIO[k].secciones.forEach(function(s){ INDICE.push({ label: SITIO[k].label + ' · ' + s.label, href:s.href }); });
  (SITIO[k].pronto || []).forEach(function(p){ INDICE.push({ label: p.label + ' (próximamente)', href:p.href }); });
});
PAGINAS.forEach(function(p){ INDICE.push({ label:p.label, href:p.href }); });
// el blog ya no está en el menú, pero se sigue encontrando en la búsqueda
INDICE.push({ label:'Promociones y condiciones', href:'legal/promociones' }, { label:'Retail · Blog', href:'retail/blog' }, { label:'Hogar · Blog', href:'hogar/blog' }, { label:'Retail · Navidad para tiendas (montaje de campaña)', href:'retail/' }, { label:'Retail · Montajes de Navidad 2026 (galería de fotos)', href:'proyectos/superhome-navidad-2026' });
[[PRODUCTOS,'Mueblería'],[ILUMINACION,'Iluminación'],[NAVIDAD,'Navidad']].forEach(function(L){
  Object.keys(L[0]).forEach(function(k){
    var p = L[0][k];
    // la categoría y la línea también se buscan: "comedor", "colgante", "navidad"
    INDICE.push({ label: p.nombre + ' — ' + p.precio, href:window.GD_URL(k), extra: p.cat + ' ' + L[1], pieza:true, nombre:p.nombre, precio:p.precio, meta:p.cat + ' · ' + L[1], img:p.img });
  });
});
/* sin tildes ni mayúsculas: "lampara" encuentra "Lámpara" */
function plano(s){ return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9.]+/g, ' ').trim(); }
INDICE.forEach(function(i){ i.texto = plano(i.label + ' ' + (i.extra || '')); });

var overlay = document.getElementById('shSearchOverlay');
var input = document.getElementById('shSearchInput');
var chips = document.getElementById('shSearchChips');
var results = document.getElementById('shSearchResults');
function pintarResultados(q){
  if(!results) return;
  var t = plano(q);
  if(!t){ results.innerHTML = '<p class="sh-search-empty">Escriba para buscar entre servicios, proyectos y productos.</p>'; return; }
  // cada palabra debe aparecer; el plural también vale ("lamparas", "comedores")
  var palabras = t.split(' ').filter(function(w){ return w.length > 1; })   // una letra suelta coincide con todo
      .map(function(w){ return w.length > 4 ? w.replace(/(es|s)$/, '') : w; });
  var hits = INDICE.filter(function(i){ return palabras.length && palabras.every(function(w){ return i.texto.indexOf(w) !== -1; }); })
    .map(function(i){
      // primero lo que coincide en el nombre visible, y antes si empieza por la búsqueda
      var l = plano(i.label), n = palabras.every(function(w){ return l.indexOf(w) !== -1; }) ? 2 : 0;
      return { i:i, n: n + (l.indexOf(palabras[0]) === 0 ? 1 : 0) };
    })
    .sort(function(a, b){ return b.n - a.n; })
    .map(function(x){ return x.i; })
    .slice(0, 8);
  results.innerHTML = hits.length
    ? hits.map(function(h){
        if(!h.pieza || !h.img) return '<a class="sh-search-result" href="' + h.href + '">' + h.label + '</a>';
        // pieza del catálogo: foto, nombre, categoría y precio
        return '<a class="sh-search-result is-pieza" href="' + h.href + '"><span class="sh-sr-foto"><img src="' + h.img + '" alt="" width="72" height="72" loading="lazy" decoding="async"></span>' +
          '<span class="sh-sr-txt"><b>' + h.nombre + '</b><small>' + h.meta + '</small></span><span class="sh-sr-precio">' + h.precio + '</span></a>';
      }).join('')
    : '<p class="sh-search-empty">Sin resultados. Escríbanos por WhatsApp y le respondemos.</p>';
}
function abrirBuscar(){ if(!overlay) return; overlay.classList.add('is-open'); overlay.setAttribute('aria-hidden','false'); if(input){ input.value=''; input.focus(); } pintarResultados(''); }
function cerrarBuscar(){ if(!overlay) return; overlay.classList.remove('is-open'); overlay.setAttribute('aria-hidden','true'); }
if(chips){
  chips.innerHTML = ['Visual merchandising','Escaparate','Navidad','Mueblería','Visita técnica']
    .map(function(f){ return '<button type="button" class="sh-search-chip">' + f + '</button>'; }).join('');
  chips.addEventListener('click', function(e){
    var b = e.target.closest('.sh-search-chip'); if(!b) return;
    if(input){ input.value = b.textContent; } pintarResultados(b.textContent);
  });
}
if(input) input.addEventListener('input', function(){ pintarResultados(input.value); });
['shBuscarIco','shBuscarInline'].forEach(function(id){
  var el = document.getElementById(id); if(el) el.addEventListener('click', abrirBuscar);
});
var sClose = document.getElementById('shSearchClose');
if(sClose) sClose.addEventListener('click', cerrarBuscar);
if(overlay) overlay.addEventListener('click', function(e){ if(e.target === overlay) cerrarBuscar(); });
document.addEventListener('keydown', function(e){ if(e.key === 'Escape'){ cerrarBuscar(); abrirMovil(false); } });

/* --------------------------------------------------------------------------
   7. REVELADO AL SCROLL + BARRA DE PROGRESO
   -------------------------------------------------------------------------- */
var revealTargets = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .reveal-underline, .gd-curtain, hr.rule');
if('IntersectionObserver' in window){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold:.12, rootMargin:'0px 0px -6% 0px' });
  revealTargets.forEach(function(el){ io.observe(el); });
} else {
  revealTargets.forEach(function(el){ el.classList.add('is-visible'); });
}

var progressEl = document.getElementById('scrollProgress');
if(progressEl){
  var ticking = false;
  function actualizarProgreso(){
    var st = window.scrollY || 0;
    var max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    var pct = Math.min(100, Math.max(0, (st / max) * 100));
    progressEl.style.transform = 'scaleX(' + (pct / 100) + ')';
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ ticking = true; requestAnimationFrame(actualizarProgreso); }
  }, { passive:true });
  actualizarProgreso();
}

/* --------------------------------------------------------------------------
   8. PUNTOS DE COMPRA SOBRE FOTOGRAFÍA
   Markup esperado:
   <div class="gd-shop">
     <img class="gd-shop-img" src="…">
     <button class="gd-shop-dot" style="left:32%;top:58%" data-prod="comoda-flow"></button>
   </div>
   -------------------------------------------------------------------------- */
/* iconos de Heroicons 2.2.0 (outline) · MIT · Tailwind Labs */
var ICO_OJO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>';
var ICO_AMPLIAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/></svg>';
var ICO_CERRAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6l12 12"/></svg>';

/* vista ampliada: la fotografía sola, a pantalla completa */
function ampliarFoto(img){
  var luz = document.getElementById('gdLuz');
  if(!luz){
    document.body.insertAdjacentHTML('beforeend',
      '<div class="gd-luz" id="gdLuz" role="dialog" aria-modal="true" aria-label="Fotografía ampliada" aria-hidden="true">' +
        '<button type="button" class="gd-luz-x" aria-label="Cerrar">' + ICO_CERRAR + '</button>' +
        '<img alt=""><p class="gd-luz-cap"></p></div>');
    luz = document.getElementById('gdLuz');
    luz.addEventListener('click', function(e){ if(e.target === luz || e.target.closest('.gd-luz-x')) cerrarFoto(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') cerrarFoto(); });
  }
  var grande = luz.querySelector('img');
  var fuente = img.closest && img.closest('[data-full]');   // miniatura con versión grande aparte
  grande.src = (fuente && fuente.getAttribute('data-full')) || img.currentSrc || img.src; grande.alt = img.alt;
  luz.querySelector('.gd-luz-cap').textContent = 'Producción Giandeco';
  luz._vuelve = document.activeElement;
  luz.classList.add('is-open'); luz.setAttribute('aria-hidden', 'false');
  document.documentElement.style.overflow = 'hidden';
  luz.querySelector('.gd-luz-x').focus();
}
window.GD_AMPLIAR = ampliarFoto;   // galerías de proyecto

/* fotos de producto enteras: si la foto no tiene la forma del marco (una
   lámpara cuadrada en una tarjeta 4:5), se muestra completa sobre fondo liso
   en vez de recortarla */
var MARCOS = '.gd-prod-thumb img, .pdp-plate img, .ctl-ph img';
/* el fondo liso toma el color del borde de la foto, para que continúe sin corte.
   Se calcula una vez por foto: al volver a pintar una rejilla se reutiliza */
var COLOR_BORDE = {};
function colorDeBorde(img, lados){
  var k = (img.currentSrc || img.src) + '|' + (lados || '');
  if(k in COLOR_BORDE) return COLOR_BORDE[k];
  return (COLOR_BORDE[k] = medirBorde(img, lados));
}
/* lados: 'lr' = solo las columnas izquierda y derecha (foto más alta que su marco: las franjas quedan a los lados),
   'tb' = solo arriba y abajo (foto más ancha). Así el relleno toma el color de la pared y no el del piso. */
function medirBorde(img, lados){
  try{
    var c = document.createElement('canvas'), n = 12; c.width = c.height = n;
    var x = c.getContext('2d'); x.drawImage(img, 0, 0, n, n);
    var d = x.getImageData(0, 0, n, n).data, r = 0, g = 0, b = 0, k = 0;
    for(var i = 0; i < n; i++) for(var j = 0; j < n; j++){
      var borde = lados === 'lr' ? (i === 0 || i === n - 1) : lados === 'tb' ? (j === 0 || j === n - 1) : !(i && j && i < n - 1 && j < n - 1);
      if(!borde) continue;   // solo el contorno (o solo los lados donde quedan las franjas)
      var p = (j * n + i) * 4; r += d[p]; g += d[p + 1]; b += d[p + 2]; k++;
    }
    return 'rgb(' + Math.round(r / k) + ',' + Math.round(g / k) + ',' + Math.round(b / k) + ')';
  }catch(e){ return ''; }
}
function encajarFoto(img){
  var caja = (img.closest && img.closest('.ctl-ph')) || img.parentElement;
  if(!caja || !img.naturalWidth || !caja.clientWidth || !caja.clientHeight) return;
  var r = img.naturalWidth / img.naturalHeight, rc = caja.clientWidth / caja.clientHeight;
  var entera = Math.abs(r - rc) / rc > 0.04;
  caja.classList.toggle('es-entera', entera);
  if(entera) caja.style.backgroundColor = colorDeBorde(img, r < rc ? 'lr' : 'tb');
}
document.addEventListener('load', function(e){ if(e.target.matches && e.target.matches(MARCOS)) encajarFoto(e.target); }, true);
document.querySelectorAll(MARCOS).forEach(function(img){ if(img.complete) encajarFoto(img); });
window.GD_ENCAJAR = encajarFoto;
/* foto de puntos muy ancha: se marca para dar puntos más pequeños en móvil */
function marcarAncha(img){ var s = img.closest && img.closest('.gd-shop'); if(s && img.naturalWidth) s.classList.toggle('is-ancha', img.naturalWidth / img.naturalHeight >= 1.6); }
document.addEventListener('load', function(e){ if(e.target.matches && e.target.matches('.gd-shop-img')) marcarAncha(e.target); }, true);
document.querySelectorAll('.gd-shop-img').forEach(function(img){ if(img.complete) marcarAncha(img); });
function cerrarFoto(){
  var luz = document.getElementById('gdLuz');
  if(!luz || !luz.classList.contains('is-open')) return;
  luz.classList.remove('is-open'); luz.setAttribute('aria-hidden', 'true');
  document.documentElement.style.overflow = '';
  if(luz._vuelve && luz._vuelve.focus) luz._vuelve.focus();
}

function montarPuntos(){
  document.querySelectorAll('.gd-shop').forEach(function(shop){
    var dots = shop.querySelectorAll('.gd-shop-dot');
    if(!dots.length) return;

    dots.forEach(function(dot){
      dot.innerHTML = '<b aria-hidden="true"></b><i aria-hidden="true"></i>';
      var key = dot.getAttribute('data-prod');
      var p = PRODUCTOS[key] || NAVIDAD[key] || ILUMINACION[key];
      var nombre = p ? p.nombre : (dot.getAttribute('data-nombre') || 'Pieza');
      dot.setAttribute('aria-label', 'Ver ' + nombre);
      dot.setAttribute('type', 'button');
    });

    // controles sobre la foto: ver solo el ambiente y ampliar
    var bar = document.createElement('div');
    bar.className = 'gd-shop-bar';
    bar.innerHTML = '<button type="button" class="gd-shop-ver" aria-pressed="false">' + ICO_OJO + '<span>Ver solo el ambiente</span></button>' +
      '<button type="button" class="gd-shop-amp" aria-label="Ampliar la fotografía" title="Ampliar">' + ICO_AMPLIAR + '</button>';
    shop.appendChild(bar);

    var card = document.createElement('div');
    card.className = 'gd-shop-card';
    shop.appendChild(card);
    var abierto = null;

    function cerrar(){
      card.classList.remove('is-open');
      if(abierto){ abierto.classList.remove('is-open'); abierto = null; }
    }

    // zona realmente visible de la fotografía: la foto puede estar recortada por un contenedor (portada de catálogo)
    // o quedar bajo el menú fijo; la ficha se acomoda dentro de eso, no del alto completo de la imagen
    function limites(){
      var r = shop.getBoundingClientRect(), L = r.left, T = r.top, R = r.right, B = r.bottom, el = shop.parentElement;
      while(el && el !== document.body){
        var cs = getComputedStyle(el);
        if(cs.overflowX !== 'visible' || cs.overflowY !== 'visible'){ var c = el.getBoundingClientRect(); L = Math.max(L, c.left); T = Math.max(T, c.top); R = Math.min(R, c.right); B = Math.min(B, c.bottom); }
        el = el.parentElement;
      }
      var h = document.querySelector('.site-header');
      if(h && getComputedStyle(h).position === 'fixed'){ var hb = h.querySelector('.sh-marca') ? h.querySelector('.sh-marca').getBoundingClientRect().bottom : h.getBoundingClientRect().bottom; if(hb > T && hb < B) T = hb; }
      return { left:L, top:T, right:R, bottom:B };
    }

    function abrir(dot){
      var key = dot.getAttribute('data-prod');
      var p = PRODUCTOS[key] || NAVIDAD[key] || ILUMINACION[key];
      var nombre = p ? p.nombre : (dot.getAttribute('data-nombre') || 'Pieza del espacio');
      var cat    = p ? p.cat    : (dot.getAttribute('data-cat') || 'Giandeco');
      var precio = p ? p.precio : (dot.getAttribute('data-precio') || 'Consultar');
      var img    = p ? p.img    : (dot.getAttribute('data-img') || '');
      var href   = p ? window.GD_URL(key) : (dot.getAttribute('data-href') || WA_MSG);
      // con la capa de tienda cargada, el punto también suma la pieza a la selección
      var sumar  = !window.GD_TIENDA ? '' : (p
        ? '<button class="gd-shop-card-add" type="button" data-gdt-add="' + key + '">Añadir al carrito</button>'
        : '<button class="gd-shop-card-add" type="button" data-gdt-add-esp="' + nombre + '" data-cat="' + cat + '">Añadir para cotizar</button>');

      card.innerHTML =
        '<button class="gd-shop-card-close" type="button" aria-label="Cerrar">&times;</button>' +
        (img ? '<img decoding="async" class="gd-shop-card-img" src="' + img + '" alt="' + nombre + '">' : '') +
        '<div class="gd-shop-card-body">' +
          '<span class="gd-shop-card-cat">' + cat + '</span>' +
          '<span class="gd-shop-card-name">' + nombre + '</span>' +
          '<span class="gd-shop-card-price">' + precio + '</span>' +
          sumar +
          '<a class="gd-shop-card-cta" href="' + href + '"' + (p ? '' : ' target="_blank" rel="noopener"') + '>' + (p ? 'Ver la pieza' : 'Consultar esta pieza') +
            '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg></a>' +
        '</div>';

      // colocación: al lado del punto, girando de lado si no hay aire
      var left = parseFloat(dot.style.left) || 50;
      var top  = parseFloat(dot.style.top) || 50;
      card.style.top = 'auto'; card.style.bottom = 'auto'; card.style.left = 'auto'; card.style.right = 'auto';
      if(left > 55){ card.style.right = (100 - left) + '%'; card.style.marginRight = '28px'; card.style.marginLeft = '0'; }
      else{ card.style.left = left + '%'; card.style.marginLeft = '28px'; card.style.marginRight = '0'; }
      if(top > 55){ card.style.bottom = (100 - top) + '%'; card.style.marginBottom = '-20px'; }
      else{ card.style.top = top + '%'; card.style.marginTop = '-20px'; }

      // la ficha nunca se sale de la fotografía: si no cabe, se corre lo justo
      card.style.translate = '';
      var sr = limites(), cr = card.getBoundingClientRect(), aire = 10, dx = 0, dy = 0;
      if(cr.right > sr.right - aire) dx = sr.right - aire - cr.right;
      if(cr.left + dx < sr.left + aire) dx = sr.left + aire - cr.left;
      if(cr.bottom > sr.bottom - aire) dy = sr.bottom - aire - cr.bottom;
      if(cr.top + dy < sr.top + aire) dy = sr.top + aire - cr.top;
      card.style.translate = Math.round(dx) + 'px ' + Math.round(dy) + 'px';

      card.classList.add('is-open');
      if(abierto && abierto !== dot) abierto.classList.remove('is-open');
      dot.classList.add('is-open');
      abierto = dot;
    }

    shop.addEventListener('click', function(e){
      var ver = e.target.closest('.gd-shop-ver');
      if(ver){
        var oculto = shop.classList.toggle('sin-puntos');
        cerrar();
        ver.setAttribute('aria-pressed', oculto ? 'true' : 'false');
        ver.querySelector('span').textContent = oculto ? 'Mostrar las piezas' : 'Ver solo el ambiente';
        return;
      }
      if(e.target.closest('.gd-shop-amp')){ cerrar(); ampliarFoto(shop.querySelector('.gd-shop-img')); return; }
      if(e.target.closest('.gd-shop-card-close')){ cerrar(); return; }
      if(e.target.closest('.gd-shop-card')) return;
      var dot = e.target.closest('.gd-shop-dot');
      if(dot){ e.preventDefault(); (dot === abierto) ? cerrar() : abrir(dot); return; }
      cerrar();
    });
    document.addEventListener('click', function(e){ if(!shop.contains(e.target)) cerrar(); });
  });
}
montarPuntos();

/* --------------------------------------------------------------------------
   8b. MARCAS — muro de logos reales, en dos filas con movimiento continuo.
   Todos se pintan en blanco sólido (filtro CSS) para que contrasten parejo
   sobre el fondo ébano, sin importar el color original de cada logo.
   Excepción: El Corte Inglés ya trae blanco reservado dentro de su banderín
   verde — forzarlo a blanco sólido fusiona el texto con el fondo y lo hace
   ilegible, así que ese conserva sus colores de marca (nativo:true).
   Falta el logo real de Baby Club — sigue en texto plano a propósito, no
   se inventa un archivo que no existe.
   Markup esperado — muro completo (home, y cualquier página que hable de
   todos los rubros): dos filas, sin "data-marcas" en el wall:
   <section class="gd-sec gd-marcas">
     <div class="gd-in"><p class="gd-eyebrow is-muted">...</p><h2 class="gd-h2">...</h2></div>
     <div class="gd-marcas-wall">
       <div class="gd-marcas-row" id="marcasRow1"><div class="gd-marcas-track" id="marcasTrack1"></div></div>
       <div class="gd-marcas-row gd-marcas-row--rev" id="marcasRow2"><div class="gd-marcas-track" id="marcasTrack2"></div></div>
     </div>
   </section>
   Markup para un mundo específico (ej. retail: solo marcas retail,
   una sola fila) — agregar data-marcas="retail" al wall y omitir la
   segunda fila:
   <div class="gd-marcas-wall" data-marcas="retail">
     <div class="gd-marcas-row" id="marcasRow1"><div class="gd-marcas-track" id="marcasTrack1"></div></div>
   </div>
   -------------------------------------------------------------------------- */
var MARCAS_TODAS_1 = [
  { nombre: 'El Corte Inglés', logo: 'images/marcas/el-corte-ingles.png', nativo: true },
  { nombre: 'Pycca', logo: 'images/marcas/pycca.png' },
  { nombre: 'Enchantée Paris', logo: 'images/marcas/enchantee-paris.png' },
  { nombre: 'Zara', logo: 'images/marcas/zara.png' },
  { nombre: 'Walon', logo: 'images/marcas/walon.png' },
  { nombre: 'Baby Club Chic', logo: 'images/marcas/baby-club-chic.png' }
];
var MARCAS_TODAS_2 = [
  { nombre: 'Hotel Unión Cusco', logo: 'images/marcas/hotel-union-cusco.png' },
  { nombre: 'Mássimo Café', logo: 'images/marcas/massimo-cafe.png' },
  { nombre: 'Casa Grande', logo: 'images/marcas/casa-grande.png' },
  { nombre: 'Casacor', logo: 'images/marcas/casacor.png' },
  { nombre: 'Expodeco', logo: 'images/marcas/expodeco.png' }
];
// Solo las marcas que son retail de verdad (tienda/boutique/campaña) —
// Hotel Unión Cusco (hotelería), Mássimo Café (gastronomía), Casa Grande
// (mobiliario), Casacor/Expodeco (ferias) no son retail y no van aquí.
var MARCAS_RETAIL = [
  { nombre: 'El Corte Inglés', logo: 'images/marcas/el-corte-ingles.png', nativo: true },
  { nombre: 'Pycca', logo: 'images/marcas/pycca.png' },
  { nombre: 'Zara', logo: 'images/marcas/zara.png' },
  { nombre: 'Walon', logo: 'images/marcas/walon.png' },
  { nombre: 'Enchantée Paris', logo: 'images/marcas/enchantee-paris.png' },
  { nombre: 'Baby Club Chic', logo: 'images/marcas/baby-club-chic.png' }
];
function pintarFilaMarcas(el, items){
  if(!el) return;
  // El loop infinito mueve la fila con translateX(-50%): para que nunca se
  // vea el final (hueco vacío en monitores anchos), una "mitad" de la pista
  // tiene que ser más ancha que cualquier pantalla razonable. Con solo 5
  // logos no alcanza en monitores grandes, así que se repite la lista antes
  // de duplicarla para el loop.
  var REPETICIONES = 6;
  var base = [];
  for (var r = 0; r < REPETICIONES; r++) base = base.concat(items);
  var doble = base.concat(base);
  el.innerHTML = doble.map(function(it){
    var contenido = it.logo
      ? '<span class="gd-marcas-logo"><img decoding="async" src="' + it.logo + '" alt="' + it.nombre + '" loading="lazy"' + (it.nativo ? ' class="is-nativo"' : '') + '></span>'
      : it.nombre;
    return '<span class="gd-marcas-item">' + contenido + '</span>';
  }).join('');
}
function montarMarcas(){
  var t1 = document.getElementById('marcasTrack1');
  var t2 = document.getElementById('marcasTrack2');
  if(!t1 && !t2) return;
  var wall = document.querySelector('.gd-marcas-wall');
  var set = wall ? wall.getAttribute('data-marcas') : null;
  if(set === 'retail'){
    pintarFilaMarcas(t1, MARCAS_RETAIL);
  } else {
    pintarFilaMarcas(t1, MARCAS_TODAS_1);
    pintarFilaMarcas(t2, MARCAS_TODAS_2);
  }
}
montarMarcas();

/* --------------------------------------------------------------------------
   8c. DETALLE DEL MONTAJE — piezas sin foto de producto
   En "Las piezas de este espacio", una pieza que aún no tiene foto propia
   muestra un recorte ampliado de la fotografía del espacio, centrado en su
   punto de compra: se ve la pieza real, montada por el estudio, en vez de
   un recuadro vacío. Cuando la pieza tenga foto de producto, la tarjeta deja
   de ser .is-slot y esto no la toca.
   -------------------------------------------------------------------------- */
function detallesDeMontaje(){
  var foto = document.querySelector('.gd-shop .gd-shop-img');
  var slots = document.querySelectorAll('.gd-pieza-thumb.is-slot');
  if(!foto || !slots.length) return;
  function pintar(){
    var r = foto.naturalHeight / foto.naturalWidth;            // alto/ancho de la foto
    if(!r) return;
    var z = Math.max(3.2, 1.25 / r * 1.4);                      // ampliación: la miniatura es 4:5
    var src = foto.currentSrc || foto.src;
    slots.forEach(function(slot){
      var card = slot.parentElement, b = card && card.querySelector('[data-gdt-add-esp]');
      if(!b) return;
      var nombre = b.getAttribute('data-gdt-add-esp'), punto = null;
      document.querySelectorAll('.gd-shop-dot[data-nombre]').forEach(function(d){ if(d.getAttribute('data-nombre') === nombre) punto = d; });
      if(!punto) return;
      var px = parseFloat(punto.style.left) / 100, py = parseFloat(punto.style.top) / 100;
      if(isNaN(px) || isNaN(py)) return;
      // posición de fondo que deja el punto en el centro del recorte
      var bx = Math.min(1, Math.max(0, (px * z - .5) / (z - 1)));
      var by = Math.min(1, Math.max(0, (py * z * r - .625) / (z * r - 1.25)));
      slot.classList.remove('is-slot'); slot.classList.add('is-detalle');
      slot.style.backgroundImage = "url('" + src + "')";
      slot.style.backgroundSize = (z * 100).toFixed(1) + '% auto';
      slot.style.backgroundPosition = (bx * 100).toFixed(1) + '% ' + (by * 100).toFixed(1) + '%';
      slot.setAttribute('role', 'img');
      slot.setAttribute('aria-label', nombre + ', detalle de la fotografía del espacio');
      slot.innerHTML = '<span class="gd-detalle-tag">Detalle del montaje</span>';
    });
  }
  if(foto.complete && foto.naturalWidth) pintar(); else foto.addEventListener('load', pintar, { once:true });
}
// la grilla de piezas la arma el script de cada espacio, después de este archivo
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', detallesDeMontaje); else detallesDeMontaje();

/* --------------------------------------------------------------------------
   9. BOTONES MAGNÉTICOS
   -------------------------------------------------------------------------- */
(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if(reduced || !fino) return;

  document.querySelectorAll('.gd-btn, .gd-link, .sh-icon-btn, .sh-tema').forEach(function(el){
    el.addEventListener('mousemove', function(e){
      var r = el.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width/2);
      var dy = e.clientY - (r.top + r.height/2);
      el.style.transform = 'translate(' + (dx*.24).toFixed(1) + 'px,' + (dy*.28).toFixed(1) + 'px)';
    });
    el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
  });
})();

})();

/* ==========================================================================
   PUNTOS DE COMPRA solo en fotos grandes y panorámicas · la pista desaparece con ellos
   Criterio: la parte visible de la foto mide 700 px o más de ancho y es claramente apaisada (≥ 1.45).
   En fotos pequeñas, verticales o en el teléfono no se ponen puntos: las piezas están en la fila de productos.
   ========================================================================== */
(function(){
  'use strict';
  function visible(shop){
    var r = shop.getBoundingClientRect(), w = r.width, h = r.height, el = shop.parentElement;
    while(el && el !== document.body){
      var cs = getComputedStyle(el);
      if(cs.overflowX === 'auto' || cs.overflowX === 'scroll' || cs.overflowX === 'hidden'){ w = Math.min(w, el.clientWidth || w); }
      el = el.parentElement;
    }
    w = Math.min(w, window.innerWidth);
    return { w:w, h:h };
  }
  function evaluar(){
    var tiene = false, shops = document.querySelectorAll('.gd-shop');
    shops.forEach(function(shop){
      if(!shop.querySelector('.gd-shop-dot')) return;
      if(shop.offsetParent === null && getComputedStyle(shop).position !== 'fixed'){ return; }
      var v = visible(shop), img = shop.querySelector('.gd-shop-img');
      var rr = img ? img.getBoundingClientRect() : null;
      var apaisada = rr && rr.height ? (shop.getBoundingClientRect().width / rr.height >= 1.45 || rr.width / rr.height >= 1.45) : v.w / v.h >= 1.45;
      shop.classList.toggle('sin-puntos', !(v.w >= 700 && apaisada));
    });
    // pistas ("seleccione cualquier punto…"): solo si hay una foto con puntos visibles a su alcance
    document.querySelectorAll('.hm-hint, .gd-shop-hint, .ctb-tip').forEach(function(h){
      var scope = h.parentElement, hallado = null, n = 0;
      while(scope && n < 6 && !(hallado = scope.querySelector('.gd-shop'))){ scope = scope.parentElement; n++; }
      if(!scope) return;
      var activa = false;
      scope.querySelectorAll('.gd-shop').forEach(function(sh){ if(sh.offsetParent !== null && !sh.classList.contains('sin-puntos') && sh.querySelector('.gd-shop-dot')) activa = true; });
      h.hidden = !activa;
    });
  }
  var t;
  function pronto(){ clearTimeout(t); t = setTimeout(evaluar, 120); }
  window.addEventListener('resize', pronto);
  window.addEventListener('orientationchange', pronto);
  window.addEventListener('load', evaluar);
  document.addEventListener('load', function(e){ if(e.target && e.target.matches && e.target.matches('.gd-shop-img')) pronto(); }, true);
  if(document.readyState !== 'loading') evaluar(); else document.addEventListener('DOMContentLoaded', evaluar);
})();

/* ==========================================================================
   CARRUSELES DE PRODUCTOS · avanzan solos cuando los vecinos quedan fuera de vista
   Se detienen al tocar, al pasar el puntero o con el foco, y si la persona prefiere menos movimiento.
   ========================================================================== */
(function(){
  'use strict';
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var PASO_MS = 3600, PAUSA_MS = 9000;
  function montar(c){
    if(c.__gdAuto) return; c.__gdAuto = true;
    var enVista = false, pausado = false, tim = null, reanuda = null;
    function desborda(){ return c.scrollWidth > c.clientWidth + 12; }
    function avanzar(){
      if(pausado || !enVista || document.hidden || !desborda()) return;
      var hijo = c.children[0]; if(!hijo) return;
      var gap = parseFloat(getComputedStyle(c).columnGap) || 14;
      var paso = hijo.getBoundingClientRect().width + gap;
      var max = c.scrollWidth - c.clientWidth;
      if(c.scrollLeft >= max - 6) c.scrollTo({ left:0, behavior:'smooth' });
      else c.scrollTo({ left:Math.min(max, c.scrollLeft + paso), behavior:'smooth' });
    }
    function pausar(){ pausado = true; clearTimeout(reanuda); reanuda = setTimeout(function(){ pausado = false; }, PAUSA_MS); }
    ['touchstart','pointerdown','wheel','keydown','focusin'].forEach(function(ev){ c.addEventListener(ev, pausar, { passive:true }); });
    c.addEventListener('mouseenter', function(){ pausado = true; clearTimeout(reanuda); });
    c.addEventListener('mouseleave', function(){ pausar(); });
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){ enVista = es[0].isIntersecting; }, { threshold:.35 }).observe(c);
    } else enVista = true;
    tim = setInterval(avanzar, PASO_MS);
  }
  function buscar(){ document.querySelectorAll('.gd-grid.es-carrusel').forEach(montar); }
  // los productos se pintan por script: se vigila hasta que el carrusel tenga contenido
  var intentos = 0, v = setInterval(function(){ buscar(); if(++intentos > 12) clearInterval(v); }, 600);
  if(document.readyState !== 'loading') buscar(); else document.addEventListener('DOMContentLoaded', buscar);
})();

/* MEDICIÓN DE PROMOCIONES — cada evento va a window.dataLayer y, si GA_ID tiene el ID
   de Google Analytics 4 (G-XXXXXXXXXX), también a GA4. Sin ID no se envía nada a nadie.
   Eventos: promo_ver, promo_clic, popup_ver, popup_cerrar, popup_codigo (enviado o copiado),
   cupon_aplicado, pedido_registrado y purchase (con el cupón usado). */
var GA_ID = '';
window.dataLayer = window.dataLayer || [];
window.gdMedir = function(evento, datos){
  try{
    var d = datos || {}, o = { event:evento }; for(var k in d) o[k] = d[k];
    window.dataLayer.push(o);
    if(window.gtag) window.gtag('event', evento, d);
  }catch(e){}
};
if(GA_ID && !/(^|\/)admin(\.html)?$/.test(location.pathname)){
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date()); window.gtag('config', GA_ID);
  var ga = document.createElement('script'); ga.async = true; ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID; document.head.appendChild(ga);
}

/* popup de bienvenida: solo se muestra si la función de cupones está activa (js/gd-bienvenida.js lo decide) */
(function(){
  var base = (document.currentScript && document.currentScript.src || '').replace(/js\/giandeco\.js.*$/, '');
  if(!base) return;
  var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = base + 'css/gd-bienvenida.css?v=20261106f'; document.head.appendChild(l);
  var s = document.createElement('script'); s.src = base + 'js/gd-bienvenida.js?v=20261102g'; s.defer = true; document.head.appendChild(s);
})();
