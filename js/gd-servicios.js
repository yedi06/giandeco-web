/* ==========================================================================
   GIANDECO — SERVICIOS (fuente única)
   Alimenta las tarjetas de servicio de Retail y Hogar y las páginas de cada
   servicio (generadas por hacer-proyectos.js). Los textos salen de lo que ya
   publicaba el sitio (retail-diseno-tiendas, hogar-diseno-interiores, hogar).

   Campos:
     slug       nombre del archivo: <slug>.html
     linea      'retail' | 'hogar'
     nombre     título (lo único que se lee en la tarjeta)
     frase      una línea bajo el título de la portada
     portada    { src, alt }
     intro      el servicio en un párrafo
     incluye    lista corta de lo que se entrega
     proyectos  slugs de js/gd-proyectos.js donde se hizo este trabajo
     enlaces    [{ label, href }] otras páginas útiles (espacios, catálogo…)
     href       si el servicio ya tiene página propia, la tarjeta lleva ahí
   ========================================================================== */
(function(){
'use strict';
var S = [
 { slug:'retail/servicios/escaparatismo', linea:'retail', nombre:'Escaparatismo y vitrinas',
   frase:'Vitrinas y displays que detienen al que pasa.',
   portada:{ src:'images/material/escaparatismo-vitrina-jengibre.webp', alt:'Vitrina de Navidad con casitas de jengibre, tren y árboles nevados sobre nieve de algodón en repisa de cristal' },
   intro:'El escaparate es la venta silenciosa: muestra lo que vende su marca y cuenta una historia — un outfit, una escena, una temporada. Trabajamos las dos formas: la vitrina hacia la calle y el display interior.',
   incluye:['Concepto de temporada y guion visual', 'Styling de maniquíes: outfits, capas y accesorios', 'Ángulos de lectura desde el flujo peatonal', 'Utilería, pódiums e iluminación focalizada'],
   proyectos:['walon-figuritas', 'enchantee-paris', 'el-corte-ingles'] },
 { slug:'retail/navidad', linea:'retail', nombre:'Campañas y Navidad', href:'retail/navidad',
   frase:'Navidad y temporadas, replicables en toda la red.',
   portada:{ src:'images/campana/navidad-comedor-arbol.jpg', alt:'Ambientación navideña con árbol iluminado, aparador y piezas de temporada' } },
 { slug:'retail/servicios/remodelacion-de-locales', linea:'retail', nombre:'Remodelación de locales',
   frase:'Layout, circulación y ampliaciones.',
   portada:{ src:'images/servicios/remodelacion-1280.webp', alt:'Mesa de trabajo con planos, regla de latón y muestras de acabados en un local vacío en remodelación' },
   intro:'Cuando el problema no es la vitrina sino el local. Layout, circulación, mobiliario a medida, iluminación y acabados. Con fecha de reapertura acordada desde el primer día.',
   incluye:['Distribución y circulación del punto de venta', 'Mobiliario comercial diseñado a medida del producto', 'Iluminación comercial cálida, 2700–3000 K', 'Coordinación de especialidades y obra'],
   proyectos:['walon-punta-hermosa', 'massimo-cafe', 'hotel-union-cusco'] },
 { slug:'retail/servicios/visual-merchandising', linea:'retail', nombre:'Visual merchandising',
   frase:'Jerarquía de producto y puntos calientes.',
   portada:{ src:'images/servicios/visual-merchandising-1280.webp', alt:'Croquis de zonificación de tienda, muestras de tela agrupadas por color y prendas dobladas por tono sobre mesa de estudio' },
   intro:'Dónde va cada producto y cómo se mueve el cliente dentro. Definimos puntos calientes, jerarquía de exhibición y agrupación por familias, para que el recorrido termine en la caja y no en la puerta.',
   incluye:['Zonificación y mapa de puntos calientes', 'Jerarquía de producto y agrupación por color', 'Mesas promocionales, islas y torres exhibidoras', 'Capacitación al equipo de tienda para mantenerlo'],
   proyectos:['baby-club', 'ferrehome', 'walon-punta-hermosa', 'casa-grande'] },
 { slug:'retail/servicios/grafica-y-viniles', linea:'retail', nombre:'Gráfica y viniles',
   frase:'Vinilo, señalética y material promocional.',
   portada:{ src:'images/servicios/grafica-y-viniles-1280.webp', alt:'Rollo de vinilo dorado, espátula y cúter junto a una vitrina con ornamento de vinilo a medio aplicar' },
   intro:'Del concepto al último vinilo pegado. Armamos la campaña, la validamos en un espacio modelo y la replicamos en toda su red sin que pierda fuerza en el camino.',
   incluye:['Concepto y paleta de campaña', 'Gráfica, tipografía en vinilo y señalética', 'Espacio modelo y manual de réplica', 'Montaje, mantenimiento y desmontaje'],
   proyectos:['pycca-ecuador', 'walon-figuritas', 'enchantee-paris'] },

 { slug:'hogar/interiorismo/', linea:'hogar', nombre:'Diseño de interiores', href:'hogar/interiorismo/',
   frase:'Planos y render antes de mover un mueble.',
   portada:{ src:'images/espacios/zara-sala-2.jpg', alt:'Sala con mobiliario de líneas suaves' } },
 { slug:'hogar/interiorismo/decoracion-y-ambientacion', linea:'hogar', nombre:'Decoración y ambientación',
   frase:'Piezas, textiles, arte y luz de acento.',
   portada:{ src:'images/servicios/decoracion-y-ambientacion-1280.webp', alt:'Paleta de materiales: roble, travertino, latón cepillado, lino y terciopelos oliva y petróleo junto a un jarrón de cerámica' },
   intro:'Madera, piedra, latón, lino y luz cálida. La paleta sale de los materiales que especificamos en obra, no de una tendencia de temporada: por eso el ambiente no envejece en dos años.',
   incluye:['Paleta de materiales y color', 'Selección de piezas y textiles', 'Curaduría de arte y luz de acento', 'Montaje: dejamos el espacio listo para habitar'],
   proyectos:['convivir-con-el-arte', 'casacor-2025', 'casa-grande'],
   enlaces:[{ label:'Espacios que puede comprar', href:'hogar/espacios' }] },
 { slug:'hogar/interiorismo/mobiliario-a-medida', linea:'hogar', nombre:'Mobiliario a medida',
   frase:'La pieza que el catálogo no resuelve.',
   portada:{ src:'images/servicios/mobiliario-a-medida-1280.webp', alt:'Aparador de nogal con ensambles en cola de milano en proceso sobre banco de taller, con cepillo y tiradores de latón' },
   intro:'Seleccionamos pieza por pieza y, cuando el catálogo no resuelve, la diseñamos: material, medida y acabado especificados por el estudio, no dejados al criterio del carpintero.',
   incluye:['Pieza diseñada a la medida del espacio', 'Material, medida y acabado especificados', 'Precio y plazo de entrega cerrados', 'Instalación en obra'],
   proyectos:['hotel-union-cusco', 'casa-grande'],
   enlaces:[{ label:'Mueblería con precio', href:'catalogo/muebleria/' }] },
 { slug:'hogar/interiorismo/ambientacion-de-temporada', linea:'hogar', nombre:'Ambientación de temporada',
   frase:'Navidad y fechas especiales, montadas en casa.',
   portada:{ src:'images/espacios/mesa-servida-navidad.jpg', alt:'Mesa servida navideña con mantelería, vajilla y centro de mesa' },
   intro:'El mismo montaje de campaña que hacemos en tienda, ambientado para su casa. Se contrata por pieza o completo, y se retira en fecha.',
   incluye:['Árbol y decoración', 'Mesa servida', 'Coronas y recibimiento de entrada', 'Montaje y retiro en fecha'],
   proyectos:[],
   enlaces:[{ label:'Compre esta mesa navideña', href:'catalogo/compra-espacio/mesa-servida' }, { label:'Piezas de Navidad', href:'catalogo/navidad/' }, { label:'Navidad para tiendas', href:'retail/navidad' }] }
];

window.GD_SERVICIOS = {
  lista: S,
  url: function(s){ return s.href || s.slug; },
  de: function(linea){ return S.filter(function(s){ return s.linea === linea; }); },
  get: function(slug){ return S.filter(function(s){ return s.slug === slug; })[0] || null; }
};
})();
