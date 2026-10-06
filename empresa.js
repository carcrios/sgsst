/* ============================================================
   empresa.js — EMPRESA DEMO (ficticia) para mostrar el Portal SSTA
   ------------------------------------------------------------
   demo: true → el portal no usa Google: un servidor simulado corre en el
   navegador (demo/demo.js) con datos de ejemplo. Nada sale del equipo.
   Solo trae los DATOS; herramientas/armar-demo.js le agrega el motor
   de empresa.js y arma el sitio de la demo.
   Para una empresa real, usa el empresa.js normal (o el configurador).
   ============================================================ */

const EMPRESA = {
  nombre: 'Montajes Andinos S.A.S. (empresa demo)',
  nombreCorto: 'MONTAJES ANDINOS',
  nit: '900.000.000-0',
  subtitulo: 'Sistema de Gestión SST',
  logo: 'demo/logo-demo.svg',
  colorMarca: '#e0912a',

  formatos: {
    'SSTA-F-005': { codigo: 'MA-SST-F-12', titulo: 'Control de asistencia a capacitación, eventos y reuniones', version: '2', fecha: '15/01/2025', actualizacion: '10-06-2026' },
    'SSTA-F-006': { codigo: 'MA-SST-F-20', titulo: 'Inspección de EPP', version: '6', fecha: '', actualizacion: '' },
    'SSTA-F-007': { codigo: 'MA-SST-F-03', titulo: 'Análisis de Trabajo Seguro (ATS)', version: '4', fecha: '19/10/2016', actualizacion: '' },
    'SSTA-F-116': { codigo: 'MA-SST-F-31', titulo: 'Permiso de trabajo en alturas', version: '3', fecha: '', actualizacion: '' },
    'SSTA-F-117': { codigo: 'MA-SST-F-32', titulo: 'Permiso de espacios confinados', version: '2', fecha: '24/01/2022', actualizacion: '25/01/2023' },
    'SSTA-F-118': { codigo: 'MA-SST-F-33', titulo: 'Permiso de izajes de cargas', version: '2', fecha: '15/05/2017', actualizacion: '25/01/2023' },
    'SSTA-F-119': { codigo: 'MA-SST-F-30', titulo: 'Permiso de trabajo en caliente', version: '2', fecha: '15/05/2017', actualizacion: '25/01/2023' },
    'SSTA-F-147': { codigo: 'MA-SST-F-21', titulo: 'Inspección de EPP de brigadistas', version: '1', fecha: '', actualizacion: '' },
    'SSTA-F-149': { codigo: 'MA-SST-F-35', titulo: 'Anexo de personal autorizado', version: '', fecha: '', actualizacion: '' },
    'SSTA-F-180': { codigo: 'MA-SST-F-34', titulo: 'Permiso de trabajo eléctrico', version: '1', fecha: '10/04/2025', actualizacion: '' },
    'SG-REPORTE': { codigo: 'MA-SST-F-40', titulo: 'Reporte e investigación de actos, condiciones, incidentes y accidentes', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PLAN': { codigo: 'MA-SST-F-41', titulo: 'Plan de acción del SG-SST', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-HABILITACION': { codigo: 'MA-SST-F-42', titulo: 'Estado de habilitación del personal', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-INSPECCION': { codigo: 'MA-SST-F-43', titulo: 'Inspección planeada / preoperacional', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-INVENTARIO': { codigo: 'MA-SST-F-44', titulo: 'Inventario de equipos e inspecciones', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-INDICADORES': { codigo: 'MA-SST-F-45', titulo: 'Informe de indicadores del SG-SST', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-COMITE-CONFORMACION': { codigo: 'MA-SST-F-46', titulo: 'Conformación de comités (COPASST / Convivencia)', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-COPASST-ACTA': { codigo: 'MA-SST-F-47', titulo: 'Acta de reunión del COPASST', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-CONVIVENCIA-ACTA': { codigo: 'MA-SST-F-48', titulo: 'Acta de reunión del Comité de Convivencia Laboral', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-CONVIVENCIA-QUEJA': { codigo: 'MA-SST-F-49', titulo: 'Expediente de queja (Comité de Convivencia)', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-CONVIVENCIA-INFORME': { codigo: 'MA-SST-F-50', titulo: 'Informe de gestión del Comité de Convivencia', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-AUDITORIA': { codigo: 'MA-SST-F-51', titulo: 'Informe de auditoría del SG-SST', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-AUDITORIA-PROGRAMA': { codigo: 'MA-SST-F-52', titulo: 'Programa anual de auditorías', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PLAN-ANUAL': { codigo: 'MA-SST-F-53', titulo: 'Plan anual de trabajo del SG-SST', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PLAN-CAPACITACION': { codigo: 'MA-SST-F-54', titulo: 'Plan de capacitación', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-MATRIZ-PELIGROS': { codigo: 'MA-SST-F-55', titulo: 'Matriz de identificación de peligros y valoración de riesgos', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-SUSTANCIAS': { codigo: 'MA-SST-F-56', titulo: 'Inventario de sustancias químicas', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PLAN-EMERGENCIAS': { codigo: 'MA-SST-F-57', titulo: 'Plan de prevención, preparación y respuesta ante emergencias', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-SIMULACRO': { codigo: 'MA-SST-F-58', titulo: 'Informe de simulacro', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PROFESIOGRAMA': { codigo: 'MA-SST-F-59', titulo: 'Profesiograma', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-EXAMENES': { codigo: 'MA-SST-F-60', titulo: 'Programación de evaluaciones médicas ocupacionales', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-AUSENTISMO': { codigo: 'MA-SST-F-61', titulo: 'Informe de ausentismo', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-POLITICA': { codigo: 'MA-SST-F-62', titulo: 'Política de seguridad y salud en el trabajo', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-MATRIZ-LEGAL': { codigo: 'MA-SST-F-63', titulo: 'Matriz de requisitos legales', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-LISTADO-MAESTRO': { codigo: 'MA-SST-F-64', titulo: 'Listado maestro de documentos', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PROVEEDORES': { codigo: 'MA-SST-F-65', titulo: 'Evaluación de proveedores y contratistas', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-REVISION-DIRECCION': { codigo: 'MA-SST-F-66', titulo: 'Revisión por la alta dirección', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-RENDICION': { codigo: 'MA-SST-F-67', titulo: 'Rendición de cuentas en SST', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-CONTRATISTA': { codigo: 'MA-SST-F-68', titulo: 'Ficha y documentos del contratista', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-INGRESO-CONTRATISTA': { codigo: 'MA-SST-F-69', titulo: 'Control de ingreso de contratistas', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-MATRIZ-EPP': { codigo: 'MA-SST-F-70', titulo: 'Matriz de elementos de protección personal por cargo', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-ENTREGA-EPP': { codigo: 'MA-SST-F-71', titulo: 'Registro de entrega de elementos de protección personal', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-INDUCCION': { codigo: 'MA-SST-F-72', titulo: 'Inducción y reinducción en SST', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PROGRAMA-ALTO-RIESGO': { codigo: 'MA-SST-F-73', titulo: 'Programas de tareas de alto riesgo', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PESV': { codigo: 'MA-SST-F-74', titulo: 'Plan estratégico de seguridad vial', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-TABLERO-GERENCIA': { codigo: 'MA-SST-F-75', titulo: 'Informe del SG-SST para la gerencia', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-REPORTE-ANUAL-0312': { codigo: 'MA-SST-F-76', titulo: 'Reporte anual de estándares mínimos', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-ASPECTOS-AMBIENTALES': { codigo: 'MA-SST-F-77', titulo: 'Matriz de aspectos e impactos ambientales', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-RESIDUOS': { codigo: 'MA-SST-F-78', titulo: 'Registro de generación de residuos', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-INFORME-ASESORIA': { codigo: 'MA-SST-F-79', titulo: 'Informe de asesoría en SST', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-COMPATIBILIDAD': { codigo: 'MA-SST-F-80', titulo: 'Matriz de compatibilidad de sustancias químicas', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-GESTION-QUIMICA': { codigo: 'MA-SST-F-81', titulo: 'Gestión del riesgo químico (SGA)', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-CRONOGRAMA-INSP': { codigo: 'MA-SST-F-82', titulo: 'Cronograma de inspecciones', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-OBJETIVOS': { codigo: 'MA-SST-D-01', titulo: 'Objetivos del SG-SST', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-DESIGNACION': { codigo: 'MA-SST-D-02', titulo: 'Designación del responsable del SG-SST', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-ROLES': { codigo: 'MA-SST-D-03', titulo: 'Roles y responsabilidades en el SG-SST', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-RECURSOS': { codigo: 'MA-SST-D-04', titulo: 'Asignación de recursos para el SG-SST', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-REGLAMENTO': { codigo: 'MA-SST-D-05', titulo: 'Reglamento de higiene y seguridad industrial', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PROC-PELIGROS': { codigo: 'MA-SST-D-06', titulo: 'Procedimiento de identificación de peligros, evaluación y valoración de riesgos', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PROC-INVESTIGACION': { codigo: 'MA-SST-D-07', titulo: 'Procedimiento de reporte e investigación de incidentes, accidentes de trabajo y enfermedades laborales', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PROC-ACCIONES': { codigo: 'MA-SST-D-08', titulo: 'Procedimiento de acciones correctivas, preventivas y de mejora', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PROC-CAMBIO': { codigo: 'MA-SST-D-09', titulo: 'Procedimiento de gestión del cambio', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PROC-AUDITORIA': { codigo: 'MA-SST-D-10', titulo: 'Procedimiento de auditoría interna del SG-SST', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PROC-REVISION': { codigo: 'MA-SST-D-11', titulo: 'Procedimiento de revisión por la alta dirección', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PROC-DOCUMENTOS': { codigo: 'MA-SST-D-12', titulo: 'Procedimiento de control de documentos y conservación de registros', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PROC-COMUNICACION': { codigo: 'MA-SST-D-13', titulo: 'Procedimiento de comunicación, participación y consulta', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PROC-COMPRAS': { codigo: 'MA-SST-D-14', titulo: 'Procedimiento de adquisiciones y contratación con criterios de SST', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PROC-EMERGENCIAS': { codigo: 'MA-SST-D-15', titulo: 'Procedimiento de prevención, preparación y respuesta ante emergencias', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PROG-CAPACITACION': { codigo: 'MA-SST-D-16', titulo: 'Programa de capacitación, inducción y reinducción en SST', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PROG-INSPECCIONES': { codigo: 'MA-SST-D-17', titulo: 'Programa de inspecciones planeadas', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PROG-MEDICO': { codigo: 'MA-SST-D-18', titulo: 'Programa de evaluaciones médicas ocupacionales', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-MANUAL': { codigo: 'MA-SST-D-19', titulo: 'Manual del Sistema de Gestión de la Seguridad y Salud en el Trabajo', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-CONTEXTO': { codigo: 'MA-CAL-F-01', titulo: 'Contexto de la organización (DOFA y partes interesadas)', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-RIESGOS-CALIDAD': { codigo: 'MA-CAL-F-02', titulo: 'Matriz de riesgos y oportunidades', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-OBJETIVOS-CALIDAD': { codigo: 'MA-CAL-F-03', titulo: 'Objetivos e indicadores de calidad', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PNC': { codigo: 'MA-CAL-F-04', titulo: 'Registro de producto o servicio no conforme', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-PQRS': { codigo: 'MA-CAL-F-05', titulo: 'Informe de PQRS de clientes', version: '1', fecha: '15/01/2025', actualizacion: '' },
    'SG-SATISFACCION': { codigo: 'MA-CAL-F-06', titulo: 'Encuesta e informe de satisfacción del cliente', version: '1', fecha: '15/01/2025', actualizacion: '' }
  },

  modulos: {
    caliente: true, alturas: true, confinados: true, izajes: true, electrico: true,
    ats: true, asistencia: true, personal: true, epp: true, brigadistas: true, tablero: true,
    reportes: true, habilitacion: true, plan: true, inspecciones: true, indicadores: true,
    copasst: true, convivencia: true, auditorias: true,
    plananual: true, peligros: true, emergencias: true, salud: true, documental: true, revision: true, contratistas: true, usuarios: true, dotacion: true, induccion: true, programas: true, pesv: true, gerencia: true, ambiental: true, quimicos: true, kit: true, calidad: true, asesor: true
  },

  correos: {
    aprobacionEpp: 'sst@montajesandinos.demo',  // a quién se pide aprobar la reposición de EPP
    dominio: 'montajesandinos.demo'                       // solo para el ejemplo del campo de correo
  },
  // Quién recibe por WhatsApp la foto de un EPP en mal estado (para aprobar el cambio).
  contactoEpp: { nombre: 'Sandra Milena Torres', cargo: 'Coordinadora SST', whatsapp: '' },
  // Clientes / centros de costo para el ATS. null = la lista de fábrica (la de INDIMON).
  centrosCosto: ['Planta propia', 'Cliente Alimentos del Norte', 'Cliente Bebidas La Sabana', 'Cliente Química Andina'],

  servidor: 'https://demo.portal-ssta.invalid/exec',
  apiToken: 'token-demo',
  demo: true,
  // Usuarios de la demo (ficticios): la ventana de entrar los muestra para probar cada rol.
  demoUsuarios: [['sandra.sst', 'Demo2026', 'Administradora (SST)'], ['jorge.obra', 'Demo2026', 'Supervisor de obra'], ['gerencia', 'Demo2026', 'Solo consulta']]
};


/* ════════════════════════════════════════════════════════════
   Motor: no hace falta tocar nada de aquí para abajo.
   ════════════════════════════════════════════════════════════ */

/* ── Varias empresas en un mismo sitio (multiempresa: true) ──
   Quien vende el portal publica UN sitio con su marca; cada empresa cliente
   tiene su archivo empresas/<código>.json (lo genera configurar-empresa.html)
   y entra con  https://…/?e=<código>.  El celular recuerda su empresa (y sus
   datos, para abrir sin señal); cambiar de empresa borra lo de la anterior en
   ese equipo. Así una sola actualización del sitio les llega a todos. */
const MultiEmpresa = (function () {
  const E = EMPRESA;
  if (!E.multiempresa || typeof window === 'undefined') return { activo: false };
  const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } return null; };
  const valido = (c) => /^[a-z0-9][a-z0-9-]{1,39}$/.test(String(c || ''));
  const proveedor = JSON.parse(JSON.stringify(E));
  let cod = ls('ssta-empresa') || '';
  let pedido = '';
  try { pedido = String(new URLSearchParams(location.search).get('e') || '').trim().toLowerCase(); } catch (e) {}
  if (pedido && (!valido(pedido) || pedido === cod)) pedido = pedido === cod ? '' : pedido;
  let datos = null; try { datos = JSON.parse(ls('ssta-empresa-datos') || 'null'); } catch (e) {}
  const cargada = !!(cod && datos && datos.codigo === cod && datos.empresa) && !pedido;
  if (cargada) {
    // Lo de la empresa reemplaza lo del sitio; la marca (producto) y el modo siguen siendo del proveedor.
    Object.keys(datos.empresa).forEach((k) => { if (k !== 'multiempresa' && k !== 'producto' && k !== 'demo') E[k] = datos.empresa[k]; });
    E.codigo = cod; delete E.sinEmpresa;
  } else E.sinEmpresa = true;
  const url = (c) => 'empresas/' + encodeURIComponent(c) + '.json';
  async function traer(c) {
    const r = await fetch(url(c), { cache: 'no-store' });
    if (r.status === 404) throw new Error('No hay ninguna empresa con el código «' + c + '».');
    if (!r.ok) throw new Error('No se pudo leer la empresa (' + r.status + ').');
    const j = await r.json();
    if (!j || !j.empresa || (j.codigo && j.codigo !== c)) throw new Error('El archivo de la empresa no es válido.');
    const emp = j.empresa;
    // Solo se aceptan logos de imagen y colores reales (el archivo viene del sitio, pero mejor no confiar a ciegas).
    if (emp.logo && !/^(data:image\/(png|jpeg|gif|webp|svg\+xml);base64,[A-Za-z0-9+/=]+|[\w./-]+\.(png|jpe?g|gif|webp|svg))$/i.test(String(emp.logo))) delete emp.logo;
    if (emp.colorMarca && !/^#[0-9a-f]{3,8}$/i.test(String(emp.colorMarca))) delete emp.colorMarca;
    return { codigo: c, empresa: emp, generado: j.generado || '' };
  }
  /** Lo que el portal guarda en el equipo (sesión, borradores de ATS y reportes, plantillas…), de la empresa anterior. */
  function borrarLocal() { try { Object.keys(localStorage).filter((k) => /^(ssta-|ats-|indimon-)/.test(k)).forEach((k) => localStorage.removeItem(k)); } catch (e) {} }
  /** ¿Hay registros sin enviar en este celular? (no se cambia de empresa con cosas en la cola) */
  function pendientes() {
    return new Promise((ok) => {
      try {
        const req = indexedDB.open('ssta-outbox', 1);
        req.onupgradeneeded = () => req.result.createObjectStore('pending', { keyPath: 'id', autoIncrement: true });
        req.onsuccess = () => { try { const c = req.result.transaction('pending', 'readonly').objectStore('pending').count(); c.onsuccess = () => ok(c.result || 0); c.onerror = () => ok(0); } catch (e) { ok(0); } };
        req.onerror = () => ok(0);
      } catch (e) { ok(0); }
    });
  }
  /** Entra a la empresa c: si había otra, primero revisa la cola y borra lo de la anterior en este equipo. */
  async function entrar(c) {
    c = String(c || '').trim().toLowerCase();
    if (!valido(c)) throw new Error('El código tiene letras minúsculas, números y guiones (ej: acme-sas).');
    const d = await traer(c);
    if (cod && cod !== c) {
      const n = await pendientes();
      if (n) throw new Error('Este celular tiene ' + n + ' registro(s) de ' + ((datos && datos.empresa && datos.empresa.nombreCorto) || cod) + ' sin enviar. Envíalos (con señal) antes de cambiar de empresa.');
      borrarLocal(); try { sessionStorage.clear(); } catch (e) {}
    }
    ls('ssta-empresa', c); ls('ssta-empresa-datos', JSON.stringify(d));
    return d;
  }
  function salir() { borrarLocal(); }
  // Si en otra pestaña se cambió de empresa, esta se recarga para no mezclar datos.
  try { window.addEventListener('storage', (ev) => { if (ev.key === 'ssta-empresa' && (ev.newValue || '') !== cod) location.reload(); }); } catch (e) {}
  // Con señal, se refrescan los datos de la empresa (logo, formatos, módulos…) para la próxima vez.
  if (cargada && typeof fetch !== 'undefined') setTimeout(() => { traer(cod).then((d) => { const a = JSON.stringify(d.empresa); if (a !== JSON.stringify(datos.empresa) && ls('ssta-empresa') === cod) ls('ssta-empresa-datos', JSON.stringify(d)); }).catch(() => {}); }, 2500);
  // Sin empresa elegida, las páginas llevan al inicio (allí se escribe el código).
  const pagina = location.pathname.split('/').pop() || 'index.html';
  if (E.sinEmpresa && !/^(index\.html|estado\.html|configurar-empresa\.html|offline\.html|ayuda\.html)?$/.test(pagina)) {
    // Se recuerda a qué página iba (con su #registro) para volver allí después de elegir la empresa.
    const volver = pagina + (location.hash || '');
    location.replace('index.html?' + (pedido ? 'e=' + encodeURIComponent(pedido) + '&' : '') + 'volver=' + encodeURIComponent(volver));
  }
  return { activo: true, codigo: cod, pedido, cargada, proveedor, entrar, salir, pendientes, nombre: () => (datos && datos.empresa && (datos.empresa.nombreCorto || datos.empresa.nombre)) || '' };
})();

const Empresa = (function () {
  const E = EMPRESA;
  const PRODUCTO = String(E.producto || 'Portal SSTA');
  // La instalación original (INDIMON) no se toca: las pantallas ya dicen
  // INDIMON y los formatos de fábrica son los suyos.
  const original = String(E.nombreCorto).toUpperCase() === 'INDIMON' && !E.demo;
  // Otra empresa sin logo propio: nunca el de INDIMON; un distintivo con sus iniciales.
  if (!original && (!E.logo || /logo-indimon\.png$/.test(E.logo))) {
    const ini = String(E.nombreCorto || E.nombre || 'SST').replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9 ]/g, '').split(/\s+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 3).toUpperCase() || 'SST';
    const color = E.colorMarca || '#1f3b57';
    E.logo = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" rx="22" fill="' + color + '"/><text x="120" y="92" font-family="Arial,Helvetica,sans-serif" font-size="64" font-weight="700" text-anchor="middle" fill="#fff">' + ini + '</text></svg>');
  }
  const FABRICA = ['SSTA-F-005', 'SSTA-F-006', 'SSTA-F-007', 'SSTA-F-116', 'SSTA-F-117', 'SSTA-F-118', 'SSTA-F-119', 'SSTA-F-147', 'SSTA-F-149', 'SSTA-F-180'];
  const MODULO_DE = {
    'permiso-trabajo-caliente.html': 'caliente', 'permiso-trabajo-alturas.html': 'alturas', 'permiso-espacios-confinados.html': 'confinados',
    'permiso-izajes-cargas.html': 'izajes', 'permiso-trabajo-electrico.html': 'electrico', 'ats.html': 'ats', 'asistencia.html': 'asistencia',
    'personal-autorizado.html': 'personal', 'inspeccion-epp.html': 'epp', 'dashboard.html': 'tablero',
    'reportes.html': 'reportes', 'habilitacion.html': 'habilitacion', 'plan-accion.html': 'plan', 'inspecciones.html': 'inspecciones', 'indicadores.html': 'indicadores',
    'copasst.html': 'copasst', 'convivencia.html': 'convivencia', 'auditorias.html': 'auditorias',
    'plan-anual.html': 'plananual', 'peligros.html': 'peligros', 'emergencias.html': 'emergencias', 'salud.html': 'salud', 'documental.html': 'documental', 'revision-direccion.html': 'revision',
    'contratistas.html': 'contratistas', 'usuarios.html': 'usuarios', 'entrega-epp.html': 'dotacion', 'induccion.html': 'induccion', 'programas.html': 'programas', 'pesv.html': 'pesv', 'gerencia.html': 'gerencia', 'ambiental.html': 'ambiental', 'quimicos.html': 'quimicos', 'documentos.html': 'kit', 'calidad.html': 'calidad', 'asesor.html': 'asesor', 'cierre-mes.html': 'cierre', 'evidencias.html': 'evidencias', 'preoperacional.html': 'preop'
  };

  function formato(id) {
    return Object.assign({ codigo: id, version: '', fecha: '', actualizacion: '' }, (E.formatos && E.formatos[id]) || {});
  }
  function codigo(id) { return formato(id).codigo || id; }
  function moduloActivo(k) { return !E.modulos || E.modulos[k] !== false; }
  /* ── Quién ve qué (v106) ──
     PUBLICO: lo de campo, como estaba el portal de INDIMON (cualquiera, sin usuario).
     Lo demás es el «Sistema de gestión»: con usuarios, cada rol ve lo suyo; Administrador y SST, todo. */
  const PUBLICO = ['caliente', 'alturas', 'confinados', 'izajes', 'electrico', 'ats', 'asistencia', 'personal', 'epp', 'brigadistas', 'tablero', 'reportes', 'preop'];
  const ACCESO_FABRICA = {
    supervisor: ['habilitacion', 'inspecciones', 'plan', 'contratistas', 'dotacion', 'induccion', 'emergencias', 'pesv', 'programas', 'quimicos', 'peligros'],
    comite: ['copasst', 'convivencia', 'inspecciones', 'plan', 'indicadores', 'peligros', 'auditorias', 'plananual', 'habilitacion'],
    consulta: ['gerencia', 'indicadores', 'plan', 'plananual', 'cierre', 'evidencias', 'auditorias', 'revision', 'documental', 'kit', 'peligros', 'habilitacion', 'calidad', 'ambiental', 'copasst']
  };
  const esPublico = (m) => !m || m === 'externo' || PUBLICO.indexOf(m) !== -1;
  function accesoRol(m, rol) {
    if (esPublico(m) || rol === 'admin' || rol === 'sst') return true;
    const t = Object.assign({}, ACCESO_FABRICA, E.acceso || {});
    return Array.isArray(t[rol]) && t[rol].indexOf(m) !== -1;
  }
  /** Tabla en uso (fábrica + lo que la empresa cambió en EMPRESA.acceso), para mostrarla. */
  function tablaAcceso() { return Object.assign({}, ACCESO_FABRICA, E.acceso || {}); }
  /** Rol de quien está en este equipo (solo si el servidor usa usuarios y hay sesión). */
  function rolActual() {
    try { return typeof Sesion !== 'undefined' && Sesion.modo() && Sesion.yo() ? Sesion.rol() : null; } catch (e) { return null; }
  }
  function moduloDeHref(href) {
    const h = String(href || '');
    if (/^https?:/i.test(h)) return 'externo';
    const archivo = h.split(/[?#]/)[0].split('/').pop();
    if (archivo === 'inspeccion-epp.html' && /tipo=brigadista/.test(h)) return 'brigadistas';
    return MODULO_DE[archivo] || null;
  }

  /* ── Reemplazo de textos (solo cuando NO es la instalación original) ── */
  const reemplazos = [];
  if (!original) {
    const nom = String(E.nombre || E.nombreCorto || 'Empresa');
    const corto = String(E.nombreCorto || nom);
    reemplazos.push([/INDIMON S\.A\.S\.?/g, nom], [/IND[IÍ]MON/gi, corto]);
    if (PRODUCTO !== 'Portal SSTA') reemplazos.push([/Portal SSTA/g, PRODUCTO]);
    FABRICA.forEach((id) => { const c = codigo(id); if (c !== id) reemplazos.push([new RegExp(id.replace(/-/g, '\\-') + '(?!\\d)', 'g'), c]); });
  }
  function cambiarTexto(s) {
    let r = s;
    for (let i = 0; i < reemplazos.length; i++) r = r.replace(reemplazos[i][0], reemplazos[i][1]);
    return r;
  }
  const ATRIBUTOS = ['aria-label', 'placeholder', 'title', 'alt', 'data-search'];
  function metaFormato(el) {
    // Encabezado de los permisos: "Código: <b>SSTA-F-117</b> · Versión: <b>2</b><br>Fecha doc…"
    if (el.dataset.empresaMeta) return;
    const m = /SSTA-F-\d+/.exec(el.textContent || '');
    if (!m || FABRICA.indexOf(m[0]) === -1) return;
    const f = formato(m[0]);
    el.dataset.empresaMeta = '1';
    const largo = /Versión|Fecha/.test(el.textContent);
    el.innerHTML = 'Código: <b>' + esc(f.codigo) + '</b>' + (f.version ? (largo ? ' · Versión: <b>' + esc(f.version) + '</b>' : ' · V' + esc(f.version)) : '') +
      (largo && (f.fecha || f.actualizacion) ? '<br>' + [f.fecha ? 'Fecha doc: ' + esc(f.fecha) : '', f.actualizacion ? 'Act.: ' + esc(f.actualizacion) : ''].filter(Boolean).join(' · ') : '');
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function aplicar(raiz) {
    if (original || !raiz) return;
    if (raiz.nodeType === 1) {
      raiz.querySelectorAll && raiz.querySelectorAll('.hdr .meta').forEach(metaFormato);
      if (raiz.matches && raiz.matches('.hdr .meta')) metaFormato(raiz);
    }
    if (raiz.nodeType === 1 && raiz.closest && raiz.closest('[data-empresa-no-tocar]')) return;
    if (raiz.nodeType === 3 && raiz.parentElement && raiz.parentElement.closest('[data-empresa-no-tocar]')) return;
    // [data-empresa-no-tocar]: zonas que muestran los textos de fábrica a propósito (configurador).
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      { acceptNode: (x) => (x.nodeType === 1 && x.hasAttribute('data-empresa-no-tocar')) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    let n = raiz.nodeType === 3 ? raiz : w.currentNode;
    while (n) {
      if (n.nodeType === 3) {
        const p = n.parentNode && n.parentNode.nodeName;
        if (p !== 'SCRIPT' && p !== 'STYLE') { const t = cambiarTexto(n.data); if (t !== n.data) n.data = t; }
      } else if (n.nodeType === 1) {
        for (let i = 0; i < ATRIBUTOS.length; i++) {
          const v = n.getAttribute(ATRIBUTOS[i]);
          if (v) { const t = cambiarTexto(v); if (t !== v) n.setAttribute(ATRIBUTOS[i], t); }
        }
        if (n.nodeName === 'IMG') { const s = n.getAttribute('src') || ''; if (/logo-indimon\.png$/.test(s)) n.setAttribute('src', E.logo); }
      }
      if (raiz.nodeType === 3) break;
      n = w.nextNode();
    }
  }

  /* ── Inicio: módulos apagados y enlaces de otra empresa ── */
  function filtrarInicio() {
    if (!document.querySelector('.accordion')) return;
    document.querySelectorAll('a.card[href]').forEach((a) => {
      const m = moduloDeHref(a.getAttribute('href'));
      // Los formularios de Google del inicio son de INDIMON: en otra empresa no salen.
      const fuera = (m === 'externo' && !original) || (m && m !== 'externo' && !moduloActivo(m));
      // Con usuario: lo que su rol no ve tampoco sale en el inicio.
      const rol = rolActual();
      if (fuera || (rol && !accesoRol(m, rol))) a.classList.add('oculto-empresa');
    });
    document.querySelectorAll('details.sub-item').forEach((d) => {
      const vis = d.querySelectorAll('a.card:not(.oculto-empresa)').length;
      const c = d.querySelector('.sub-count'); if (c) c.textContent = vis;
      if (!vis) d.classList.add('oculto-empresa');
    });
    document.querySelectorAll('details.accordion-item').forEach((d) => {
      if (!d.querySelector('a.card:not(.oculto-empresa)')) d.classList.add('oculto-empresa');
    });
  }

  function estilos() {
    const st = document.createElement('style');
    st.id = 'estiloEmpresa';
    let css = '.oculto-empresa{display:none !important;}';
    if (!original) {
      const url = 'url("' + String(E.logo).replace(/"/g, '%22') + '")';
      css += '.marca{background-image:' + url + ' !important;}body .hdr-logo{background-image:' + url + ' !important;}';
      if (E.colorMarca) css += ':root{--brand-index:' + E.colorMarca + ';}';
    }
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }

  function iniciar() {
    estilos();
    if (!original) {
      document.title = cambiarTexto(document.title);
      aplicar(document.body);
      // Lo que se pinta después (listas, modales, la hoja del PDF) también.
      new MutationObserver((muts) => {
        muts.forEach((m) => m.addedNodes.forEach((nd) => { if (nd.nodeType === 1 || nd.nodeType === 3) aplicar(nd); }));
      }).observe(document.body, { childList: true, subtree: true });
      window.addEventListener('beforeprint', () => aplicar(document.body));
    }
    filtrarInicio();
    const cab = document.querySelector('[data-empresa="cabecera"]');
    if (cab && !original) cab.textContent = (E.nombre || E.nombreCorto) + (E.nit ? ' · NIT ' + E.nit : '') + (E.subtitulo ? ' — ' + E.subtitulo : '');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else if (document.body) iniciar();

  return {
    original, formato, codigo, moduloActivo, aplicar, moduloDeHref, esPublico, accesoRol, rolActual, tablaAcceso,
    logo: () => E.logo,
    producto: PRODUCTO,
    pie: () => PRODUCTO + ' · ' + (original ? 'INDIMON' : (E.nombreCorto || E.nombre))
  };
})();

/* Empresa demo: carga el servidor simulado ANTES que el resto del portal. */
if (EMPRESA.demo && typeof document !== 'undefined' && document.readyState === 'loading') {
  document.write('<script src="demo/demo.js"><\/script>');
}
