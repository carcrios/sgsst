/* ============================================================
   00-Portal.gs — Servidor único del Portal SSTA para UNA empresa
   ------------------------------------------------------------
   Este proyecto de Apps Script tiene TODOS los módulos del portal
   (permisos, ATS, charlas, anexo, EPP). Cada módulo responde en
   <URL de la implementación>/<módulo>, por ejemplo .../exec/ats, y
   guarda en su propio libro de Google Sheets dentro de la carpeta
   "Portal SSTA - <empresa>" en el Drive de quien lo instala.

   PASOS (detalle en INSTALAR-NUEVA-EMPRESA.md):
     1. En 01-Empresa.gs escribe el nombre de la empresa y los correos de SST.
     2. ▶ Ejecutar → instalar   (autoriza con la cuenta de la empresa).
     3. Implementar → Nueva implementación → Aplicación web
        (Ejecutar como: Yo · Acceso: Cualquier usuario).
     4. ▶ Ejecutar → verConfiguracion  y copia lo que sale a empresa.js.

   Los datos quedan en la cuenta de Google de la empresa: nadie más
   (tampoco quien vende el portal) los ve, salvo que la empresa comparta
   la carpeta.
   ============================================================ */

// Los datos de la empresa (nombre, correos, WhatsApp de EPP) están en 01-Empresa.gs:
// así una actualización del portal puede reemplazar este archivo sin tocarlos.
const VERSION_PORTAL = 'v104';

/* ════════════════════════════════════════════════════════════
   De aquí para abajo no hace falta tocar nada.
   ════════════════════════════════════════════════════════════ */

function modulosPortal_() { return globalThis.MODULOS_PORTAL || {}; }

function doGet(e) { return despachar_(e, 'doGet'); }
function doPost(e) { return despachar_(e, 'doPost'); }

function salidaJson_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function despachar_(e, metodo) {
  const ruta = String((e && e.pathInfo) || (e && e.parameter && e.parameter.modulo) || '').replace(/^\/+/, '').split('/')[0];
  const mods = modulosPortal_();
  if (!ruta) {
    return salidaJson_({ ok: true, servicio: 'Portal SSTA', version: VERSION_PORTAL, empresa: nombreEmpresa_(), modulos: Object.keys(mods),
                         nota: 'Cada módulo responde en esta misma URL terminada en /<módulo>.' });
  }
  if (!mods[ruta]) return salidaJson_({ ok: false, error: 'Módulo desconocido: ' + ruta + '. Disponibles: ' + Object.keys(mods).join(', ') });
  try {
    const m = mods[ruta]();
    if (!m[metodo]) return salidaJson_({ ok: false, error: 'El módulo ' + ruta + ' no atiende ' + metodo });
    return m[metodo](e);
  } catch (err) {
    // TEMPORAL: los celulares conservan el registro en la cola y lo reenvían
    // (un bloqueo ocupado o un servicio de Google caído un momento no deben
    // hacer que un permiso firmado se descarte).
    console.error('[' + ruta + '] ' + (err && err.stack || err));
    return salidaJson_({ ok: false, codigoError: 'TEMPORAL', error: 'Error en el servidor (' + ruta + '): ' + (err && err.message || err) });
  }
}

/* ── Lo que comparten todos los módulos ── */
function propiedades_() { return PropertiesService.getScriptProperties(); }
function nombreEmpresa_() {
  return propiedades_().getProperty('EMPRESA') || (EMPRESA_NOMBRE.indexOf('ESCRIBE') === 0 ? 'Empresa' : EMPRESA_NOMBRE);
}
function tokenPortal_() {
  // Mientras no se haya ejecutado instalar(), un valor que nadie conoce.
  return propiedades_().getProperty('API_TOKEN') || 'SIN-INSTALAR-' + Math.random();
}
function correosPortal_() {
  // Se leen del archivo (arriba): si se cambian, Implementar → Gestionar → Nueva versión.
  return CORREOS_SSTA.join(',').split(',').map(function (x) { return x.trim(); }).filter(function (x) { return x && x.indexOf('@empresa.com') === -1; });
}

/* Cada módulo ve su propio SpreadsheetApp/PropertiesService/ScriptApp:
   - getActiveSpreadsheet() es SU libro (se crea la primera vez).
   - Sus propiedades llevan el prefijo del módulo, salvo la clave y el token,
     que son de todo el portal.
   - Sus activadores llevan el prefijo del módulo (ver funciones modulo__x). */
function entornoModulo_(mod, nombreLibro) {
  const props = propiedades_();
  const GLOBAL = { CLAVE_PORTAL: true, API_TOKEN: true };
  const k = function (c) { return GLOBAL[c] ? c : mod + '.' + c; };
  let libroCache = null;
  function libro() {
    if (libroCache) return libroCache;
    const id = props.getProperty(mod + '.LIBRO');
    if (id) {
      // Si el libro existe pero no abre (Google caído un momento), se reporta el
      // error y NUNCA se crea otro: eso dejaría los datos viejos por fuera.
      let enPapelera = false;
      try { enPapelera = DriveApp.getFileById(id).isTrashed(); } catch (e) { /* sin permiso de Drive: se sigue */ }
      if (enPapelera) throw new Error('El libro de "' + nombreLibro + '" está en la papelera de Google Drive. Restáuralo (Drive → Papelera → Restaurar).');
      libroCache = SpreadsheetApp.openById(id);
      return libroCache;
    }
    libroCache = SpreadsheetApp.create('Portal SSTA - ' + nombreEmpresa_() + ' - ' + nombreLibro);
    props.setProperty(mod + '.LIBRO', libroCache.getId());
    try { DriveApp.getFileById(libroCache.getId()).moveTo(carpeta_()); } catch (e) { /* sin permiso de Drive: queda en la raíz */ }
    return libroCache;
  }
  const propsModulo = {
    getProperty: function (c) { return props.getProperty(k(c)); },
    setProperty: function (c, v) { props.setProperty(k(c), v); return propsModulo; },
    deleteProperty: function (c) { props.deleteProperty(k(c)); return propsModulo; }
  };
  const envolver = function (t) { return { getHandlerFunction: function () { return String(t.getHandlerFunction()).replace(mod + '__', ''); }, __t: t }; };
  return {
    libro: libro,
    SpreadsheetApp: {
      getActiveSpreadsheet: libro,
      getActive: libro,
      openById: function (id) { return SpreadsheetApp.openById(id); },
      create: function (n) { return SpreadsheetApp.create(n); },
      flush: function () { return SpreadsheetApp.flush(); }
    },
    PropertiesService: { getScriptProperties: function () { return propsModulo; } },
    ScriptApp: {
      newTrigger: function (f) { return ScriptApp.newTrigger(mod + '__' + f); },
      getProjectTriggers: function () {
        return ScriptApp.getProjectTriggers().filter(function (t) { return String(t.getHandlerFunction()).indexOf(mod + '__') === 0; }).map(envolver);
      },
      deleteTrigger: function (t) { return ScriptApp.deleteTrigger(t && t.__t ? t.__t : t); },
      WeekDay: ScriptApp.WeekDay,
      getService: function () { return ScriptApp.getService(); }
    }
  };
}

/* Los libros de todos los módulos (el respaldo semanal los copia todos). */
function librosDelPortal_() {
  const p = propiedades_();
  return Object.keys(modulosPortal_()).map(function (m) { return p.getProperty(m + '.LIBRO'); }).filter(Boolean);
}

function carpeta_() {
  const props = propiedades_();
  const id = props.getProperty('CARPETA');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  const c = DriveApp.createFolder('Portal SSTA - ' + nombreEmpresa_());
  props.setProperty('CARPETA', c.getId());
  return c;
}

function aleatorio_(n, alfabeto) {
  const a = alfabeto || 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let s = '';
  for (let i = 0; i < n; i++) s += a.charAt(Math.floor(Math.random() * a.length));
  return s;
}

/** ▶ PASO 2. Crea la carpeta, un libro por módulo, la clave del portal y
 *  el token. Se puede volver a ejecutar: no borra ni cambia lo que ya existe. */
function instalar() {
  const p = propiedades_();
  if (EMPRESA_NOMBRE.indexOf('ESCRIBE') !== 0) p.setProperty('EMPRESA', EMPRESA_NOMBRE);
  if (!p.getProperty('API_TOKEN')) p.setProperty('API_TOKEN', aleatorio_(40));
  // Clave corta y fácil de dictar por teléfono (sin 0/O ni 1/l).
  if (!p.getProperty('CLAVE_PORTAL')) p.setProperty('CLAVE_PORTAL', aleatorio_(4, 'ABCDEFGHJKMNPQRSTUVWXYZ') + '-' + aleatorio_(4, '23456789'));
  const mods = modulosPortal_();
  Object.keys(mods).forEach(function (m) { mods[m]().libro(); });
  // Aviso diario del SG-SST por correo (vencimientos, FURAT, investigaciones, acciones).
  if (mods.sgsst) { try { mods.sgsst().funciones.instalarAvisosDiarios(); } catch (e) { console.log('⚠ No se pudo programar el aviso diario del SG-SST: ' + e.message); } }
  // Respaldo semanal de TODOS los libros (domingos, 2 a. m.) y bitácora protegida.
  if (mods.sgsst) { try { mods.sgsst().funciones.instalarRespaldo(true); } catch (e) { console.log('⚠ No se pudo programar el respaldo semanal: ' + e.message); } }
  console.log('✅ Instalado para ' + nombreEmpresa_() + ': ' + Object.keys(mods).length + ' módulos, cada uno con su libro en la carpeta "Portal SSTA - ' + nombreEmpresa_() + '".');
  verConfiguracion();
}

/** ▶ PASO 4. Muestra lo que va en empresa.js y la clave para los celulares. */
function verConfiguracion() {
  const p = propiedades_();
  let url = '';
  try { url = ScriptApp.getService().getUrl() || ''; } catch (e) { url = ''; }
  const lineas = [
    '────────── Copia esto en empresa.js ──────────',
    "  servidor: '" + (url || 'PRIMERO IMPLEMENTA COMO APLICACIÓN WEB Y VUELVE A EJECUTAR verConfiguracion') + "',",
    "  apiToken: '" + (p.getProperty('API_TOKEN') || 'EJECUTA PRIMERO instalar') + "',",
    '───────────────────────────────────────────────',
    (url && !/\/exec$/.test(url) ? '⚠ Esa URL no termina en /exec: usa la de Implementar → Gestionar implementaciones (Aplicación web).\n' : '') +
    'Clave del portal para cada celular (botón 🔑 Clave): ' + (p.getProperty('CLAVE_PORTAL') || 'EJECUTA PRIMERO instalar'),
    'Correos de avisos: ' + (correosPortal_().join(', ') || '⚠ ninguno (escríbelos en CORREOS_SSTA, en 01-Empresa)'),
    'Usuarios con nombre (opcional): ▶ sgsst__codigoAdministrador y en el portal → Usuarios.',
    'WhatsApp para fotos de EPP: ' + (CONTACTO_EPP.nombre || '—') + ' ' + (CONTACTO_EPP.whatsapp || '')
  ];
  const mods = modulosPortal_();
  Object.keys(mods).forEach(function (m) {
    const id = p.getProperty(m + '.LIBRO');
    lineas.push('  · ' + m + ': ' + (id ? 'https://docs.google.com/spreadsheets/d/' + id : '(se crea con instalar)'));
  });
  console.log(lineas.join('\n'));
  return lineas.join('\n');
}

/** Cambiar la clave del portal (si se filtró o se fue alguien). Después,
 *  cada celular la vuelve a escribir en 🔑 Clave. */
function cambiarClave() {
  const nueva = aleatorio_(4, 'ABCDEFGHJKMNPQRSTUVWXYZ') + '-' + aleatorio_(4, '23456789');
  propiedades_().setProperty('CLAVE_PORTAL', nueva);
  console.log('Nueva clave del portal: ' + nueva);
  return nueva;
}
