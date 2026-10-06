/* ============================================================
   15-sgsst.gs — Módulo "sgsst" del Portal SSTA (mismo código de backends/backend-sgsst.gs)
   GENERADO por herramientas/armar-servidor-unico.js: no se edita a mano.
   ============================================================ */
var __sgsst;
function modulo_sgsst_() {
  if (__sgsst) return __sgsst;
  __sgsst = (function () {
    const __entorno = entornoModulo_('sgsst', 'Gestión SG-SST');
    const SpreadsheetApp = __entorno.SpreadsheetApp, PropertiesService = __entorno.PropertiesService, ScriptApp = __entorno.ScriptApp;

/* ============================================================
   backend-sgsst.gs — Gestión del SG-SST — Portal SSTA
   ------------------------------------------------------------
   Un solo servidor para los módulos de gestión:
     · trabajador  → personal habilitado (requisitos con vencimiento)
     · reporte     → actos y condiciones inseguras, incidentes y accidentes
                     (reporte a la ARL e investigación, Res. 1401 de 2007)
     · accion      → plan de acción único (de reportes, inspecciones, EPP…)
     · mes         → datos del mes para los indicadores (Res. 0312 de 2019)
     · equipo      → inventario con vencimientos (extintores, arneses…)
     · inspeccion  → inspecciones planeadas y preoperacionales
     · comite      → conformación del COPASST y del Comité de Convivencia
                     (periodos, integrantes, capacitaciones)
     · reunion     → actas de reunión de los comités
     · queja       → quejas del Comité de Convivencia. LLEGAN CIFRADAS desde
                     el celular (clave del comité): aquí solo se guardan el
                     código, las fechas y la etapa. Ni el dueño de la hoja
                     puede leer el contenido.
     · auditoria   → programa de auditorías, autoevaluación Res. 0312,
                     auditoría interna (Dec. 1072), ISO 45001, clientes
     · Planeación y salud (TIPOS_GEN, más abajo): matriz de peligros,
       sustancias, mediciones, emergencias, simulacros, plan anual,
       profesiograma, exámenes médicos (solo concepto, nunca diagnóstico),
       condiciones de salud, SVE, batería psicosocial (solo resultados
       agregados), ausentismo, política, matriz legal, listado maestro,
       gestión del cambio, proveedores, revisión por la dirección y
       rendición de cuentas.
     · Contratistas (documentos de la empresa) e ingresos a obra.

   USUARIOS CON NOMBRE (opcional): mientras no exista la hoja "Usuarios",
   todo funciona como siempre (con la clave del portal). Al crear el primer
   administrador (▶ codigoAdministrador y luego el portal → Usuarios), cada
   cambio exige iniciar sesión, queda firmado con el nombre de quien lo hizo
   (bitácora "Eventos" y el propio registro) y cada rol ve y cambia solo lo
   suyo. Las claves de las personas NUNCA llegan aquí: el celular manda una
   "prueba" derivada (PBKDF2) y aquí se guarda solo su huella.

   ADJUNTOS: certificados, actas escaneadas, hojas de seguridad… se guardan en
   Google Drive (carpeta "Adjuntos SG-SST") y quedan enlazados al registro.
   Se bajan a través de este servidor (Drive no se comparte con nadie).

   RESPALDO: ▶ instalarRespaldo copia cada semana las hojas a la carpeta
   "Respaldos SG-SST" y conserva para siempre el primero de cada mes
   (Dec. 1072, art. 2.2.4.6.13: hay registros que se guardan 20 años).

   Cómo guarda (igual de cuidadoso que los permisos):
     · "Registros": UNA FILA POR DOCUMENTO (id, tipo, estado, fechas y un
       resumen corto en JSON). Es lo que se lista rápido en el celular.
     · "Datos": el documento completo en JSON, troceado si pasa el límite de
       50.000 caracteres por celda.
     · "Imagenes": fotos y firmas aparte, troceadas.
     · Una hoja legible por módulo ("Requisitos", "Reportes", "Plan de
       acción", "Equipos", "Inspecciones", "Indicadores") para consultar o
       filtrar en Google Sheets.
     · "Eventos": bitácora de cada intento de escritura.
     · Idempotencia por opId: un reenvío desde la cola sin señal no duplica.
     · "parche": cambia solo los campos enviados (dos celulares que actualizan
       cosas distintas del mismo documento no se pisan).

   DESPLIEGUE: igual que los demás (Aplicación web · Ejecutar como: yo ·
   Acceso: cualquier usuario) → URL /exec en config.js (BACKENDS.sgsst.url).
   Avisos diarios por correo: ▶ Ejecutar → instalarAvisosDiarios (una vez).
   ============================================================ */

const VERSION_SGSST = 'v103';   // la muestra el panel del asesor para saber qué clientes están desactualizados
const API_TOKEN = tokenPortal_();
const CORREOS_AVISO = correosPortal_();
// Otras hojas que se copian en el respaldo semanal junto con esta (permisos, ATS,
// EPP, charlas, anexo…): pega aquí la URL de cada una, entre comillas y con coma.
const RESPALDAR_TAMBIEN = [];

/* ── CLAVE DEL PORTAL (igual que en los demás backends) ── */
const CLAVE_PORTAL = 'ESCRIBE_AQUI_LA_CLAVE_DEL_PORTAL';
function claveConfigurada_() {
  let c = '';
  try { c = PropertiesService.getScriptProperties().getProperty('CLAVE_PORTAL') || ''; } catch (e) { c = ''; }
  if (!c && CLAVE_PORTAL && CLAVE_PORTAL.indexOf('ESCRIBE_AQUI') !== 0) c = CLAVE_PORTAL;
  return String(c).trim();
}
function checkToken_(token) {
  const clave = claveConfigurada_();
  if (clave) return String(token || '') === clave;
  return token === API_TOKEN;
}
function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* Tipos "genéricos": lo que se lista, las columnas de "Registros" y su hoja legible
   salen de esta tabla (campos cortos; las listas se cuentan). */
const TIPOS_GEN = {
  peligro: { hoja: 'Matriz de peligros', titulo: 'peligro', fecha: 'fechaRevision', estado: 'aceptabilidad', responsable: 'proceso', vence: '',
    campos: ['proceso', 'zona', 'actividad', 'tarea', 'rutinaria', 'clasificacion', 'peligro', 'efectos', 'expuestos', 'nd', 'ne', 'np', 'nc', 'nr', 'nivel', 'aceptabilidad', 'controlesPendientes', 'fechaRevision'] },
  sustancia: { hoja: 'Sustancias químicas', titulo: 'nombre', fecha: 'fechaHoja', estado: 'estado', responsable: 'ubicacion', vence: 'venceHoja',
    campos: ['nombre', 'fabricante', 'uso', 'area', 'ubicacion', 'cantidad', 'estadoFisico', 'cas', 'onu', 'pictogramas', 'palabra', 'frasesH', 'carcinogena', 'toxicidadAguda',
             'corrosivoTipo', 'hojaSeguridad', 'fdsEspanol', 'fechaHoja', 'venceHoja', 'etiquetaSGA', 'trasvasa', 'envasesRotulados', 'epp', 'controles', 'expuestos', 'estado'] },
  gestquim: { hoja: 'Gestión del riesgo químico', titulo: 'responsable', fecha: 'capacitacionSGA', estado: '', responsable: 'responsable', vence: 'proximaCapacitacion',
    campos: ['responsable', 'capacitacionSGA', 'proximaCapacitacion', 'capacitados', 'senalizacion', 'kitDerrames', 'lavaojos', 'fdsDisponibles', 'procedimiento', 'inventarioRevisado'] },
  medicion: { hoja: 'Mediciones ambientales', titulo: 'agente', fecha: 'fecha', estado: 'resultado', responsable: 'area', vence: 'proxima',
    campos: ['agente', 'area', 'fecha', 'proveedor', 'valor', 'limite', 'resultado', 'proxima'] },
  revmatriz: { hoja: 'Revisiones de la matriz', titulo: 'alcance', fecha: 'fecha', estado: '', responsable: 'responsable', vence: '',
    campos: ['fecha', 'alcance', 'responsable', 'participantes', 'cambios'] },
  emergencia: { hoja: 'Plan de emergencias', titulo: 'sede', fecha: 'fechaActualizacion', estado: 'estado', responsable: 'coordinador', vence: 'proximaRevision',
    campos: ['sede', 'direccion', 'ocupantes', 'coordinador', 'amenazas', 'riesgoAlto', 'riesgoMedio', 'brigadistas', 'brigadistasCapacitados', 'fechaActualizacion', 'proximaRevision', 'estado'] },
  simulacro: { hoja: 'Simulacros', titulo: 'escenario', fecha: 'fecha', estado: 'calificacion', responsable: 'sede', vence: '',
    campos: ['fecha', 'tipoSimulacro', 'escenario', 'sede', 'participantes', 'tiempoTotal', 'conteoCompleto', 'calificacion', 'hallazgos'] },
  plananual: { hoja: 'Plan anual de trabajo', titulo: 'anio', fecha: 'fechaFirma', estado: 'estado', responsable: 'responsable', vence: '',
    campos: ['anio', 'responsable', 'actividades', 'programadas', 'ejecutadas', 'cumplimiento', 'avance', 'capProgramadas', 'capEjecutadas', 'cobertura', 'presupuesto', 'fechaFirma', 'firmado', 'estado'] },
  cargo: { hoja: 'Profesiograma', titulo: 'nombre', fecha: '', estado: '', responsable: 'area', vence: '',
    campos: ['nombre', 'area', 'peligros', 'examenes', 'periodicidad', 'enfasis'] },
  examen: { hoja: 'Exámenes médicos', titulo: 'nombre', fecha: 'fecha', estado: 'concepto', responsable: 'cargo', vence: 'proxima',
    campos: ['nombre', 'cedula', 'cargo', 'tipoExamen', 'fecha', 'ips', 'concepto', 'tieneRestricciones', 'temporalidad', 'proxima', 'comunicada', 'seguimiento'] },
  perfil: { hoja: 'Condiciones de salud', titulo: 'anio', fecha: 'fecha', estado: '', responsable: 'ips', vence: '',
    campos: ['anio', 'fecha', 'ips', 'trabajadores', 'actividades'] },
  sve: { hoja: 'Vigilancia epidemiológica', titulo: 'programa', fecha: 'fechaInicio', estado: 'estado', responsable: 'responsable', vence: '',
    campos: ['programa', 'responsable', 'poblacion', 'intervenidos', 'cobertura', 'actividades', 'fechaInicio', 'estado'] },
  psico: { hoja: 'Riesgo psicosocial', titulo: 'fecha', fecha: 'fecha', estado: 'nivelGeneral', responsable: 'profesional', vence: 'proxima',
    campos: ['fecha', 'profesional', 'participantes', 'cobertura', 'intralaboralA', 'intralaboralB', 'extralaboral', 'estres', 'nivelGeneral', 'proxima', 'intervenciones'] },
  ausencia: { hoja: 'Ausentismo', titulo: 'nombre', fecha: 'inicio', estado: 'causa', responsable: 'cargo', vence: '',
    campos: ['nombre', 'cedula', 'cargo', 'inicio', 'fin', 'dias', 'causa', 'mes', 'prorroga'] },
  politica: { hoja: 'Política y objetivos', titulo: 'versionDoc', fecha: 'fechaFirma', estado: 'estado', responsable: 'firmante', vence: 'proximaRevision',
    campos: ['versionDoc', 'fechaFirma', 'firmante', 'proximaRevision', 'objetivos', 'divulgaciones', 'estado'] },
  legal: { hoja: 'Matriz legal', titulo: 'norma', fecha: 'fechaRevision', estado: 'cumple', responsable: 'responsable', vence: 'proximaRevision',
    campos: ['norma', 'anio', 'emisor', 'tema', 'articulos', 'requisito', 'evidencia', 'cumple', 'responsable', 'fechaRevision', 'proximaRevision', 'vigente'] },
  documento: { hoja: 'Listado maestro', titulo: 'nombre', fecha: 'fechaAprobacion', estado: 'estado', responsable: 'aprobo', vence: 'proximaRevision',
    campos: ['codigo', 'nombre', 'tipoDoc', 'versionDoc', 'fechaAprobacion', 'aprobo', 'proximaRevision', 'retencion', 'ubicacion', 'estado'] },
  cambio: { hoja: 'Gestión del cambio', titulo: 'descripcion', fecha: 'fecha', estado: 'estado', responsable: 'solicitante', vence: 'fechaImplementacion',
    campos: ['descripcion', 'tipoCambio', 'fecha', 'solicitante', 'riesgos', 'actualizarMatriz', 'capacitacion', 'aprobo', 'fechaImplementacion', 'estado', 'acciones'] },
  proveedor: { hoja: 'Proveedores y contratistas', titulo: 'nombre', fecha: 'fechaEvaluacion', estado: 'resultado', responsable: 'servicio', vence: 'proximaEvaluacion',
    campos: ['nombre', 'nit', 'tipoProveedor', 'servicio', 'puntaje', 'resultado', 'calificacion0312', 'fechaEvaluacion', 'proximaEvaluacion', 'activo'] },
  revision: { hoja: 'Revisión por la dirección', titulo: 'periodo', fecha: 'fecha', estado: 'estado', responsable: 'gerente', vence: '',
    campos: ['periodo', 'fecha', 'gerente', 'conclusion', 'decisiones', 'acciones', 'estado'] },
  rendicion: { hoja: 'Rendición de cuentas', titulo: 'nombre', fecha: 'fecha', estado: '', responsable: 'rol', vence: '',
    campos: ['nombre', 'rol', 'fecha', 'periodo', 'resumen'] },
  contratista: { hoja: 'Contratistas', titulo: 'nombre', fecha: 'fechaRevision', estado: 'estado', responsable: 'responsableSst', vence: 'venceDocs',
    campos: ['nombre', 'nit', 'servicio', 'arl', 'contacto', 'telefono', 'responsableSst', 'documentos', 'docsFaltan', 'docsVencidos', 'venceDocs', 'fechaRevision', 'estado'] },
  ingreso: { hoja: 'Ingresos de contratistas', titulo: 'contratista', fecha: 'fecha', estado: 'resultado', responsable: 'autorizo', vence: '',
    campos: ['fecha', 'contratista', 'sitio', 'trabajo', 'tareas', 'personas', 'autorizadas', 'noAutorizadas', 'resultado', 'autorizo'] },
  // v95: EPP, inducción, programas de alto riesgo y PESV
  eppcargo: { hoja: 'Matriz de EPP', titulo: 'cargo', fecha: 'fechaRevision', estado: '', responsable: 'area', vence: '',
    campos: ['cargo', 'area', 'elementosTexto', 'elementos', 'fechaRevision'], largos: ['elementosTexto'] },
  entrega: { hoja: 'Entregas de EPP', titulo: 'nombre', fecha: 'fecha', estado: 'motivo', responsable: 'entrego', vence: 'reponer',
    campos: ['nombre', 'cedula', 'cargo', 'fecha', 'motivo', 'elementosTexto', 'vencimientos', 'reponer', 'entrego', 'capacitado'], largos: ['elementosTexto', 'vencimientos'] },
  induccion: { hoja: 'Inducciones y reinducciones', titulo: 'nombre', fecha: 'fecha', estado: 'resultado', responsable: 'dicto', vence: 'vence',
    campos: ['nombre', 'cedula', 'cargo', 'empresa', 'tipoInduccion', 'fecha', 'temas', 'preguntas', 'puntaje', 'resultado', 'dicto', 'vence'] },
  programa: { hoja: 'Programas de alto riesgo', titulo: 'nombre', fecha: 'fechaRevision', estado: 'estado', responsable: 'coordinador', vence: 'proximaRevision',
    campos: ['programa', 'nombre', 'coordinador', 'cumplimiento', 'elementos', 'fechaRevision', 'proximaRevision', 'estado'] },
  pesv: { hoja: 'PESV', titulo: 'nivel', fecha: 'fechaRevision', estado: 'estado', responsable: 'lider', vence: 'proximaAuditoria',
    campos: ['nivel', 'vehiculos', 'conductores', 'lider', 'cumplimiento', 'pasosCumplen', 'pasosAplican', 'fechaRevision', 'proximaAuditoria', 'estado'] },
  vehiculo: { hoja: 'Vehículos', titulo: 'placa', fecha: '', estado: 'estado', responsable: 'conductor', vence: 'venceDocs',
    campos: ['placa', 'tipoVehiculo', 'marca', 'modelo', 'propiedad', 'conductor', 'soat', 'rtm', 'poliza', 'mantenimiento', 'venceDocs', 'estado'] },
  conductor: { hoja: 'Conductores', titulo: 'nombre', fecha: 'fechaEvaluacion', estado: 'estado', responsable: 'cargo', vence: 'vence',
    campos: ['nombre', 'cedula', 'cargo', 'categoria', 'venceLicencia', 'simit', 'capacitacionVial', 'pruebaConduccion', 'fechaEvaluacion', 'vence', 'estado'] },
  siniestro: { hoja: 'Siniestros viales', titulo: 'placa', fecha: 'fecha', estado: 'estado', responsable: 'conductor', vence: '',
    campos: ['fecha', 'placa', 'conductor', 'tipoSiniestro', 'lesionados', 'fallecidos', 'danos', 'investigacion', 'estado'] },
  // v96: ambiental (ISO 14001) y reporte anual de estándares mínimos
  aspecto: { hoja: 'Aspectos e impactos ambientales', titulo: 'aspecto', fecha: 'fechaRevision', estado: 'significancia', responsable: 'proceso', vence: '',
    campos: ['proceso', 'actividad', 'aspecto', 'impacto', 'condicion', 'frecuencia', 'severidad', 'alcance', 'legal', 'valor', 'significancia', 'controles', 'fechaRevision'] },
  residuo: { hoja: 'Residuos', titulo: 'corriente', fecha: 'fecha', estado: 'clase', responsable: 'gestor', vence: '',
    campos: ['fecha', 'mes', 'clase', 'corriente', 'cantidad', 'unidad', 'gestor', 'certificado', 'manifiesto'] },
  consumo: { hoja: 'Consumos', titulo: 'mes', fecha: 'fecha', estado: '', responsable: 'sede', vence: '',
    campos: ['mes', 'sede', 'agua', 'energia', 'combustible', 'papel', 'trabajadores'] },
  // v97: perfil de la empresa (define los estándares 7, 21 o 60) y clientes del asesor
  empresa: { hoja: 'Perfil de la empresa', titulo: 'nombre', fecha: 'fechaActualizacion', estado: 'grupo0312', responsable: 'claseRiesgo', vence: '',
    campos: ['nombre', 'nit', 'actividad', 'trabajadores', 'claseRiesgo', 'grupo0312', 'fechaActualizacion', 'correoSST', 'correoAsesor'] },
  cliente: { hoja: 'Clientes del asesor', titulo: 'nombre', fecha: 'ultimaVisita', estado: 'estado', responsable: 'contacto', vence: 'proximaVisita',
    campos: ['nombre', 'nit', 'ciudad', 'actividad', 'trabajadores', 'claseRiesgo', 'grupo0312', 'contacto', 'correo', 'telefono', 'sitio', 'codigo', 'ultimaVisita', 'proximaVisita', 'puntaje', 'tareasAbiertas', 'tareasVencidas', 'sincronizado', 'versionServidor', 'estado'] },
  plantillainsp: { hoja: 'Listas de chequeo', titulo: 'nombre', fecha: '', estado: 'activa', responsable: 'reemplaza', vence: '',
    campos: ['nombre', 'icono', 'frecuencia', 'preoperacional', 'reemplaza', 'activa', 'vencimientosTexto', 'itemsTexto'], largos: ['vencimientosTexto', 'itemsTexto'], largoMax: 6000, saltos: true },
  proginsp: { hoja: 'Programa de inspecciones', titulo: 'titulo', fecha: '', estado: 'tipoInspeccion', responsable: 'responsable', vence: '',
    campos: ['anio', 'titulo', 'tipoInspeccion', 'plantilla', 'meses', 'responsable', 'activo'] },
  /* Calidad (ISO 9001) */
  contextocal: { hoja: 'Contexto de la organización', titulo: 'alcance', fecha: 'fechaRevision', estado: '', responsable: 'responsable', vence: 'proximaRevision',
    campos: ['alcance', 'fortalezas', 'debilidades', 'oportunidades', 'amenazas', 'partes', 'fechaRevision', 'proximaRevision', 'responsable'] },
  riesgocal: { hoja: 'Riesgos y oportunidades', titulo: 'descripcion', fecha: 'fechaIdentificacion', estado: 'estado', responsable: 'responsable', vence: 'fechaCompromiso',
    campos: ['proceso', 'tipoRO', 'descripcion', 'causa', 'probabilidad', 'impacto', 'nivel', 'tratamiento', 'responsable', 'fechaIdentificacion', 'fechaCompromiso', 'estado', 'accionId'] },
  objcal: { hoja: 'Objetivos de calidad', titulo: 'objetivo', fecha: 'ultimoPeriodo', estado: 'cumple', responsable: 'responsable', vence: '',
    campos: ['objetivo', 'indicador', 'formula', 'meta', 'sentido', 'unidad', 'frecuencia', 'responsable', 'ultimoValor', 'ultimoPeriodo', 'cumple', 'estado'] },
  pnc: { hoja: 'Producto o servicio no conforme', titulo: 'producto', fecha: 'fecha', estado: 'estado', responsable: 'responsable', vence: '',
    campos: ['fecha', 'producto', 'cliente', 'descripcion', 'detectadoEn', 'cantidad', 'tratamiento', 'responsable', 'costo', 'requiereAC', 'accionId', 'estado', 'fechaCierre'] },
  pqrs: { hoja: 'PQRS de clientes', titulo: 'cliente', fecha: 'fecha', estado: 'estado', responsable: 'responsable', vence: 'fechaLimite',
    campos: ['fecha', 'cliente', 'tipoPQRS', 'canal', 'descripcion', 'responsable', 'fechaLimite', 'respuesta', 'fechaRespuesta', 'procede', 'accionId', 'estado'] },
  encuesta: { hoja: 'Satisfacción del cliente', titulo: 'cliente', fecha: 'fecha', estado: '', responsable: 'encuestado', vence: '',
    campos: ['fecha', 'cliente', 'periodo', 'calidad', 'oportunidad', 'atencion', 'precio', 'nps', 'promedio', 'comentario', 'encuestado'] },
  reporteanual: { hoja: 'Reporte anual 0312', titulo: 'anio', fecha: 'fechaRegistro', estado: 'estado', responsable: 'responsable', vence: '',
    campos: ['anio', 'puntaje', 'valoracion', 'fechaAutoevaluacion', 'acciones', 'fechaRegistro', 'radicado', 'fechaArl', 'responsable', 'estado'] }
};
/* Qué dice el correo diario cuando vence algo de estos tipos. */
const AVISO_GEN = { sustancia: 'Hoja de seguridad', medicion: 'Medición ambiental', emergencia: 'Actualizar el plan de emergencias', examen: 'Examen médico', psico: 'Aplicar la batería psicosocial',
  politica: 'Revisar la política de SST', legal: 'Revisar la norma', documento: 'Revisar el documento', proveedor: 'Reevaluar al proveedor', cambio: 'Implementar el cambio',
  contratista: 'Documentos del contratista', induccion: 'Reinducción en SST', programa: 'Revisar el programa', pesv: 'PESV: auditoría anual',
  vehiculo: 'Documentos del vehículo (SOAT, revisión técnico-mecánica, mantenimiento)', conductor: 'Requisitos del conductor (licencia, capacitación)',
  cliente: 'Visita al cliente', pqrs: 'Responder la PQRS', riesgocal: 'Tratar el riesgo u oportunidad', contextocal: 'Revisar el contexto (DOFA y partes interesadas)', gestquim: 'Capacitación anual en el SGA (Res. 773 de 2021, art. 21)' };
const TIPOS = ['trabajador', 'reporte', 'accion', 'mes', 'equipo', 'inspeccion', 'comite', 'reunion', 'queja', 'auditoria'].concat(Object.keys(TIPOS_GEN));
/* De una queja solo se aceptan estos campos; todo lo demás va dentro de "cifrado". */
const CAMPOS_QUEJA = ['codigo', 'fechaRecepcion', 'etapa', 'estado', 'fechaCierre', 'inicioEtapa', 'venceEtapa', 'venceTotal', 'cifrado'];
const COLS_REG = ['id', 'tipo', 'version', 'estado', 'fecha', 'titulo', 'responsable', 'vence', 'resumen', 'createdAt', 'updatedAt', 'borrado'];
const MAX_CHARS_CELDA = 45000;

/* ================= LIBRO Y HOJAS ================= */
function libro_() {
  const activa = SpreadsheetApp.getActiveSpreadsheet();
  if (activa) return activa;
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SGSST_SHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  const nuevo = SpreadsheetApp.create('Gestión SG-SST - Portal SSTA');
  props.setProperty('SGSST_SHEET_ID', nuevo.getId());
  return nuevo;
}
/** ▶ Ejecutar a mano: autoriza el script y muestra la URL de la hoja. */
function verLibro() {
  const ss = libro_();
  regSheet_(); datosSheet_(); imgSheet_(); eventosSheet_();
  Object.keys(VISTAS).forEach(function (t) { vistaSheet_(t); });
  console.log('Hoja del SG-SST: ' + ss.getUrl());
}
function hoja_(nombre, encabezado) {
  const ss = libro_();
  let sheet = ss.getSheetByName(nombre);
  if (!sheet) {
    sheet = ss.insertSheet(nombre);
    sheet.appendRow(encabezado);
    sheet.setFrozenRows(1);
    SpreadsheetApp.flush();
  }
  return sheet;
}
function regSheet_() { return hoja_('Registros', COLS_REG); }
function datosSheet_() { return hoja_('Datos', ['id', 'parte', 'texto', 'updatedAt']); }
function imgSheet_() { return hoja_('Imagenes', ['id', 'imgKey', 'dataUrl', 'updatedAt']); }
function eventosSheet_() { return hoja_('Eventos', ['ts', 'id', 'accion', 'resultado', 'detalle', 'opId', 'version', 'tipo']); }

function filasPorValor_(sheet, columna, valor) {
  const last = sheet.getLastRow();
  if (last < 2 || !valor) return [];
  return sheet.getRange(2, columna, last - 1, 1)
    .createTextFinder(String(valor)).matchEntireCell(true).matchCase(true).findAll()
    .map(function (r) { return r.getRow(); });
}
function borrarFilasDe_(sheet, id) {
  const filas = filasPorValor_(sheet, 1, id).sort(function (a, b) { return b - a; });
  let i = 0;
  while (i < filas.length) {
    let inicio = filas[i], cuantas = 1;
    while (i + cuantas < filas.length && filas[i + cuantas] === inicio - 1) { inicio--; cuantas++; }
    sheet.deleteRows(inicio, cuantas);
    i += cuantas;
  }
}

/* ================= FECHAS ================= */
function fechaISO_(v) {
  if (v instanceof Date && !isNaN(v.getTime())) {
    let tz = 'America/Bogota';
    try { tz = libro_().getSpreadsheetTimeZone() || tz; } catch (e) {}
    return Utilities.formatDate(v, tz, 'yyyy-MM-dd');
  }
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(String(v == null ? '' : v).trim());
  return m ? m[1] : String(v == null ? '' : v).trim();
}
function hoyISO_() { return Utilities.formatDate(new Date(), 'America/Bogota', 'yyyy-MM-dd'); }
function sumarDias_(iso, n) {
  const p = iso.split('-').map(Number);
  const d = new Date(Date.UTC(p[0], p[1] - 1, p[2] + n));
  return d.getUTCFullYear() + '-' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + d.getUTCDate()).slice(-2);
}
/* Festivos de Colombia (Ley 51 de 1983 "Emiliani" y Semana Santa). La misma
   cuenta está en common.js (Festivos) para que el celular y el correo digan
   el mismo plazo. */
function festivosCO_(anio) {
  const iso = function (d) { return d.getUTCFullYear() + '-' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + d.getUTCDate()).slice(-2); };
  const lunes = function (d) { const w = d.getUTCDay(); if (w !== 1) d.setUTCDate(d.getUTCDate() + ((8 - w) % 7)); return d; };
  const f = function (m, d) { return new Date(Date.UTC(anio, m - 1, d)); };
  // Domingo de Pascua (algoritmo de Butcher)
  const a = anio % 19, b = Math.floor(anio / 100), c = anio % 100, d = Math.floor(b / 4), e = b % 4, g = Math.floor((8 * b + 13) / 25);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 19 * l) / 433);
  const mes = Math.floor((h + l - 7 * m + 90) / 25), dia = (h + l - 7 * m + 33 * mes + 19) % 32;
  const pascua = f(mes, dia);
  const masPascua = function (n) { const x = new Date(pascua.getTime()); x.setUTCDate(x.getUTCDate() + n); return x; };
  const lista = [f(1, 1), f(5, 1), f(7, 20), f(8, 7), f(12, 8), f(12, 25), masPascua(-3), masPascua(-2),
    lunes(f(1, 6)), lunes(f(3, 19)), lunes(f(6, 29)), lunes(f(8, 15)), lunes(f(10, 12)), lunes(f(11, 1)), lunes(f(11, 11)),
    lunes(masPascua(39)), lunes(masPascua(60)), lunes(masPascua(68))];
  const out = {}; lista.forEach(function (x) { out[iso(x)] = true; });
  return out;
}
function esHabil_(iso) {
  const p = iso.split('-').map(Number), w = new Date(Date.UTC(p[0], p[1] - 1, p[2])).getUTCDay();
  return w !== 0 && w !== 6 && !festivosCO_(p[0])[iso];
}
function sumarHabiles_(iso, n) { let d = iso, k = 0; while (k < n) { d = sumarDias_(d, 1); if (esHabil_(d)) k++; } return d; }

/* ================= BITÁCORA E IDEMPOTENCIA ================= */
function registrarEvento_(id, accion, resultado, detalle, opId, version, tipo) {
  try {
    const fila = [new Date(), id || '', accion, resultado, celda_(String(detalle || '').slice(0, 2000)), opId || '', version || '', tipo || ''];
    const quien = etiquetaUsuario_();
    if (quien) {
      const s = eventosSheet_();
      // Bitácoras creadas antes de los usuarios: se agrega el título de la columna.
      if (!CTX_.colUsuario && s.getRange(1, 9).getValue() !== 'usuario') s.getRange(1, 9).setValue('usuario');
      CTX_.colUsuario = true;
      fila.push(celda_(quien));
      s.appendRow(fila);
    } else eventosSheet_().appendRow(fila);
  } catch (e) {}
}
function opIdYaAplicado_(opId) {
  if (!opId) return false;
  const sheet = eventosSheet_();
  const rows = filasPorValor_(sheet, 6, opId);
  for (let i = 0; i < rows.length; i++) if (sheet.getRange(rows[i], 4).getValue() === 'APLICADO') return true;
  return false;
}

/* ================= USUARIOS, SESIONES Y PERMISOS =================
   Mientras no exista la hoja "Usuarios", nada de esto se aplica (modo de
   siempre: la clave del portal basta). Con usuarios:
     · escribir exige sesión (salvo crear un reporte o una acción nueva:
       cualquiera puede reportar un peligro sin usuario);
     · leer exige sesión (salvo la lista de personal habilitado, que usan los
       permisos de trabajo en campo);
     · cada rol escribe solo lo suyo (ESCRIBE_ROL) y los datos de salud
       individuales los ven solo Administrador y SST. */
const ROLES = { admin: 'Administrador', sst: 'SST (todo el SG-SST)', supervisor: 'Supervisor / campo', comite: 'Integrante de comité', consulta: 'Solo consulta (gerencia, auditor)' };
const ESCRIBE_ROL = {
  supervisor: ['reporte', 'inspeccion', 'equipo', 'accion', 'simulacro', 'ingreso', 'entrega', 'induccion', 'siniestro'],
  comite: ['reunion', 'queja', 'comite', 'accion', 'reporte', 'inspeccion', 'proginsp'],
  consulta: []
};
const LIBRE_SIN_SESION = ['reporte', 'accion'];               // crear (no editar) sin usuario
const SOLO_SST = ['examen', 'ausencia', 'perfil', 'sve', 'psico', 'cliente'];   // salud individual y conexiones a clientes
const ITER_USUARIO = 150000;
const USR_COLS = ['usuario', 'nombre', 'cedula', 'cargo', 'rol', 'correo', 'activo', 'salt', 'iter', 'hash', 'debeCambiar', 'sesionDesde', 'intentos', 'bloqueadoHasta', 'ultimoIngreso', 'creado', 'actualizado'];
const HORAS_SESION = { personal: 24 * 30, compartido: 12 };

/* Contexto de la petición en curso (se reinicia en cada doGet/doPost). */
var CTX_ = { modo: false, u: null, colUsuario: false };
function iniciarContexto_(tokenSesion) {
  CTX_ = { modo: false, u: null, colUsuario: false, sesionVencida: false };
  CTX_.modo = modoUsuarios_();
  if (CTX_.modo && tokenSesion) {
    const r = validarSesion_(tokenSesion);
    if (r && r.vencida) CTX_.sesionVencida = true; else if (r) CTX_.u = r;
  }
}
function etiquetaUsuario_() {
  if (!CTX_.modo) return '';
  return CTX_.u ? CTX_.u.nombre + ' (' + CTX_.u.usuario + ')' : 'Sin sesión';
}
function yo_() { const u = CTX_.u; return u ? { usuario: u.usuario, nombre: u.nombre, rol: u.rol, cargo: u.cargo, debeCambiar: u.debeCambiar === 'Sí' } : null; }
function errSesion_() {
  return { ok: false, codigoError: 'SESION', error: CTX_.sesionVencida ? 'Tu sesión venció: vuelve a entrar con tu usuario.' : 'Entra con tu usuario del portal para hacer esto.' };
}
function errPermiso_(m) { return { ok: false, codigoError: 'PERMISO', error: m }; }

function usuariosSheet_(crear) {
  const ss = libro_();
  let s = ss.getSheetByName('Usuarios');
  if (!s && crear) { s = hoja_('Usuarios', USR_COLS); }
  return s;
}
function modoUsuarios_() { const s = usuariosSheet_(false); return !!(s && s.getLastRow() >= 2); }
function ms_(v) { if (v instanceof Date) return v.getTime(); const n = Number(v); return isNaN(n) ? 0 : n; }
function leerUsuarios_() {
  if (CTX_.usuarios) return CTX_.usuarios;
  const s = usuariosSheet_(false), out = [];
  if (s && s.getLastRow() >= 2) {
    s.getRange(2, 1, s.getLastRow() - 1, USR_COLS.length).getValues().forEach(function (v, i) {
      if (!v[0]) return;
      const o = { _fila: i + 2 }; USR_COLS.forEach(function (c, j) { o[c] = v[j]; });
      o.usuario = String(o.usuario).trim().toLowerCase();
      out.push(o);
    });
  }
  CTX_.usuarios = out;
  return out;
}
function buscarUsuario_(u) { u = String(u || '').trim().toLowerCase(); return leerUsuarios_().filter(function (x) { return x.usuario === u; })[0] || null; }
function escribirUsuario_(o) {
  const s = usuariosSheet_(true);
  const fila = USR_COLS.map(function (c) {
    const v = o[c] == null ? '' : o[c];
    // Textos que Sheets convertiría en número o fecha (cédula, sal, huella) van como texto.
    return ['usuario', 'cedula', 'salt', 'hash', 'nombre', 'cargo', 'correo'].indexOf(c) !== -1 ? "'" + String(v) : v;
  });
  if (o._fila) s.getRange(o._fila, 1, 1, fila.length).setValues([fila]);
  else { s.appendRow(fila); o._fila = s.getLastRow(); }
  CTX_.usuarios = null;
}

/* ── Firma de las sesiones (HMAC con un secreto que solo vive en este proyecto) ── */
function secretoSesion_() {
  const p = PropertiesService.getScriptProperties();
  let s = p.getProperty('SECRETO_SESION');
  if (!s) {
    // Se crea una sola vez, con candado (dos peticiones a la vez no deben crear dos).
    const l = LockService.getScriptLock(); let tengo = false;
    try { tengo = l.tryLock(10000); } catch (e) {}
    try { s = p.getProperty('SECRETO_SESION'); if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); p.setProperty('SECRETO_SESION', s); } }
    finally { if (tengo) try { l.releaseLock(); } catch (e) {} }
  }
  return s;
}
function b64url_(bytesOTexto) { return Utilities.base64EncodeWebSafe(bytesOTexto).replace(/=+$/, ''); }
function hmac_(texto) { return b64url_(Utilities.computeHmacSha256Signature(texto, secretoSesion_())); }
function hex_(bytes) { return bytes.map(function (b) { return ((b < 0 ? b + 256 : b).toString(16)).padStart(2, '0'); }).join(''); }
function firmarSesion_(usuario, compartido, desde) {
  // Siempre posterior al último cierre de sesiones (si no, nacería cerrada).
  const ahora = Math.max(Date.now(), ms_(desde) + 1);
  const carga = b64url_(JSON.stringify({ u: usuario, iat: ahora, exp: ahora + (compartido ? HORAS_SESION.compartido : HORAS_SESION.personal) * 3600000, c: compartido ? 1 : 0 }));
  return { token: 'v1.' + carga + '.' + hmac_(carga), exp: ahora + (compartido ? HORAS_SESION.compartido : HORAS_SESION.personal) * 3600000 };
}
function validarSesion_(tok) {
  const p = String(tok || '').split('.');
  if (p.length !== 3 || p[0] !== 'v1' || !p[1] || hmac_(p[1]) !== p[2]) return null;
  let c;
  try { c = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(p[1] + '==='.slice((p[1].length + 3) % 4))).getDataAsString()); } catch (e) { return null; }
  if (!c || !c.u || !(c.exp > Date.now())) return { vencida: true };
  const u = buscarUsuario_(c.u);
  if (!u || u.activo !== 'Sí') return null;
  if (Number(c.iat) <= ms_(u.sesionDesde)) return { vencida: true };   // se cerraron sus sesiones o cambió la clave
  u._compartido = !!c.c;
  return u;
}

/* ── Quién puede qué ── */
function esSst_() { return !CTX_.modo || (CTX_.u && (CTX_.u.rol === 'admin' || CTX_.u.rol === 'sst')); }
function puedeEscribir_(tipo, accion, existe) {
  if (!CTX_.modo) return null;
  const u = CTX_.u;
  const libre = !existe && accion === 'guardar' && LIBRE_SIN_SESION.indexOf(tipo) !== -1;
  if (!u) return libre ? null : errSesion_();
  if (u.debeCambiar === 'Sí') return { ok: false, codigoError: 'CAMBIAR', error: 'Primero cambia tu clave temporal (botón 👤 arriba).' };
  if (u.rol === 'admin' || u.rol === 'sst' || libre) return null;
  if ((ESCRIBE_ROL[u.rol] || []).indexOf(tipo) !== -1) return null;
  return errPermiso_('Tu usuario (' + (ROLES[u.rol] || u.rol) + ') no puede modificar este tipo de registro. Pídeselo al área SST.');
}
function puedeLeer_(tipo) {
  if (!CTX_.modo) return true;
  if (!CTX_.u || CTX_.u.debeCambiar === 'Sí') return false;
  return SOLO_SST.indexOf(tipo) === -1 || esSst_();
}
/* Las restricciones médicas (texto libre) solo las ven Administrador y SST;
   los demás ven si es apto o no (lo que necesitan los permisos de trabajo). */
function sinRestricciones_(req) {
  Object.keys(req || {}).forEach(function (k) { if (req[k] && req[k].restricciones) req[k].restricciones = '(reservado)'; });
}
function soloAdmin_() {
  if (!CTX_.modo) return errPermiso_('Primero crea el administrador (▶ codigoAdministrador en Apps Script).');
  if (!CTX_.u) return errSesion_();
  if (CTX_.u.rol !== 'admin') return errPermiso_('Solo un administrador puede hacer esto.');
  if (CTX_.u.debeCambiar === 'Sí') return { ok: false, codigoError: 'CAMBIAR', error: 'Primero cambia tu clave temporal (botón 👤 arriba).' };
  return null;
}

/* ── Entrar, cambiar la clave y administrar usuarios ── */
function salDe_(usuario) {
  const u = buscarUsuario_(usuario);
  // A un usuario que no existe se le da una sal fija (no se revela quién existe).
  return u ? { salt: String(u.salt), iter: Number(u.iter) || ITER_USUARIO } : { salt: hex_(Utilities.computeHmacSha256Signature('sal|' + String(usuario).toLowerCase(), secretoSesion_())).slice(0, 32), iter: ITER_USUARIO };
}
function entrar_(body) {
  const u = buscarUsuario_(body.usuario), ahora = Date.now();
  // Un solo mensaje para todo (usuario que no existe, clave mala o bloqueado): no revela quién existe.
  const malo = { ok: false, codigoError: 'ENTRAR', error: 'Usuario o clave incorrectos. Después de 5 intentos fallidos hay que esperar 15 minutos.' };
  if (!u || u.activo !== 'Sí') { registrarEvento_('', 'ENTRAR', 'RECHAZADO', 'Usuario desconocido o inactivo: ' + corto_(body.usuario, 40), body.opId, '', 'usuario'); return malo; }
  if (ms_(u.bloqueadoHasta) > ahora) { registrarEvento_('', 'ENTRAR', 'RECHAZADO', 'Bloqueado por intentos fallidos: ' + u.usuario, body.opId, '', 'usuario'); return malo; }
  if (!body.prueba || hashPrueba_(body.prueba) !== String(u.hash)) {
    u.intentos = (Number(u.intentos) || 0) + 1;
    if (u.intentos >= 5) { u.intentos = 0; u.bloqueadoHasta = ahora + 15 * 60000; }
    escribirUsuario_(u);
    registrarEvento_('', 'ENTRAR', 'RECHAZADO', 'Clave incorrecta: ' + u.usuario, body.opId, '', 'usuario');
    return malo;
  }
  u.intentos = 0; u.bloqueadoHasta = ''; u.ultimoIngreso = new Date();
  escribirUsuario_(u);
  CTX_.u = u;
  registrarEvento_('', 'ENTRAR', 'APLICADO', body.compartido ? 'Equipo compartido (12 h)' : 'Equipo personal', body.opId, '', 'usuario');
  const s = firmarSesion_(u.usuario, !!body.compartido, u.sesionDesde);
  return { ok: true, sesion: s.token, exp: s.exp, yo: yo_() };
}
function validarClaveNueva_(body) {
  if (!/^[0-9a-f]{32}$/.test(String(body.salt || ''))) return 'Sal inválida.';
  if (!body.pruebaNueva || String(body.pruebaNueva).length < 20) return 'Falta la clave nueva.';
  const it = Number(body.iter);
  if (!(it >= 100000 && it <= 2000000)) return 'Parámetros de la clave inválidos.';
  return '';
}
function cambiarMiClave_(body) {
  const u = CTX_.u; if (!u) return errSesion_();
  if (ms_(u.bloqueadoHasta) > Date.now()) return { ok: false, error: 'Demasiados intentos fallidos: espera 15 minutos.' };
  if (!body.prueba || hashPrueba_(body.prueba) !== String(u.hash)) {
    u.intentos = (Number(u.intentos) || 0) + 1;
    if (u.intentos >= 5) { u.intentos = 0; u.bloqueadoHasta = Date.now() + 15 * 60000; }
    escribirUsuario_(u);
    registrarEvento_('', 'CLAVE', 'RECHAZADO', 'Clave actual incorrecta', body.opId, '', 'usuario');
    return { ok: false, error: 'La clave actual no es correcta.' };
  }
  const e = validarClaveNueva_(body); if (e) return { ok: false, error: e };
  if (hashPrueba_(body.pruebaNueva) === String(u.hash)) return { ok: false, error: 'La clave nueva debe ser distinta de la actual.' };
  u.salt = body.salt; u.iter = Number(body.iter) || ITER_USUARIO; u.hash = hashPrueba_(body.pruebaNueva);
  u.debeCambiar = 'No'; u.sesionDesde = Date.now(); u.actualizado = new Date();
  escribirUsuario_(u);
  registrarEvento_('', 'CLAVE', 'APLICADO', 'Cambió su clave (se cerraron sus otras sesiones)', body.opId, '', 'usuario');
  const s = firmarSesion_(u.usuario, !!u._compartido, u.sesionDesde);
  return { ok: true, sesion: s.token, exp: s.exp, yo: yo_() };
}
function admins_() { return leerUsuarios_().filter(function (x) { return x.rol === 'admin' && x.activo === 'Sí'; }); }
function datosUsuario_(o, body) {
  const nombre = corto_(body.nombre, 80);
  if (!nombre) return 'Falta el nombre.';
  if (body.rol && !ROLES[body.rol]) return 'Rol desconocido.';
  o.nombre = nombre; o.cedula = corto_(body.cedula, 20); o.cargo = corto_(body.cargo, 60); o.correo = corto_(body.correo, 80);
  if (body.rol) o.rol = body.rol;
  return '';
}
function guardarUsuario_(body) {
  const no = soloAdmin_(); if (no) return no;
  const usuario = String(body.usuario || '').trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,30}$/.test(usuario)) return { ok: false, error: 'El usuario va en minúsculas, sin espacios (3 a 30 letras, números, punto o guion).' };
  let o = buscarUsuario_(usuario);
  if (o && body.nuevo) return { ok: false, error: 'Ya existe el usuario «' + usuario + '». Ábrelo en la lista para cambiarlo.' };
  const nuevo = !o;
  if (nuevo) o = { usuario: usuario, activo: 'Sí', rol: 'consulta', intentos: 0, sesionDesde: 0, creado: new Date() };
  const e = datosUsuario_(o, body); if (e) return { ok: false, error: e };
  if (body.activo === false || body.activo === 'No') o.activo = 'No'; else if (body.activo === true || body.activo === 'Sí') o.activo = 'Sí';
  // Nunca queda el portal sin administrador activo.
  if (!nuevo && (o.rol !== 'admin' || o.activo !== 'Sí') && admins_().filter(function (x) { return x.usuario !== o.usuario; }).length === 0) return { ok: false, error: 'Tiene que quedar al menos un administrador activo.' };
  let detalle = nuevo ? 'Creó el usuario (' + (ROLES[o.rol] || o.rol) + ')' : 'Cambió los datos (' + (ROLES[o.rol] || o.rol) + (o.activo === 'Sí' ? '' : ', INACTIVO') + ')';
  if (body.pruebaNueva) {
    const e2 = validarClaveNueva_(body); if (e2) return { ok: false, error: e2 };
    o.salt = body.salt; o.iter = Number(body.iter) || ITER_USUARIO; o.hash = hashPrueba_(body.pruebaNueva);
    o.debeCambiar = 'Sí'; o.intentos = 0; o.bloqueadoHasta = ''; o.sesionDesde = Date.now();
    detalle += nuevo ? ' con clave temporal' : ' · clave temporal nueva (se cerraron sus sesiones)';
  } else if (nuevo) return { ok: false, error: 'Falta la clave temporal.' };
  if (body.cerrarSesiones || o.activo !== 'Sí') { o.sesionDesde = Date.now(); if (body.cerrarSesiones) detalle += ' · cerró sus sesiones'; }
  o.actualizado = new Date();
  escribirUsuario_(o);
  registrarEvento_(o.usuario, 'USUARIO', 'APLICADO', detalle, body.opId, '', 'usuario');
  return { ok: true, usuario: publicoUsuario_(o) };
}
function publicoUsuario_(o) {
  return { usuario: o.usuario, nombre: texto_(o.nombre), cedula: texto_(o.cedula), cargo: texto_(o.cargo), rol: texto_(o.rol), correo: texto_(o.correo),
           activo: o.activo === 'Sí', debeCambiar: o.debeCambiar === 'Sí', bloqueado: ms_(o.bloqueadoHasta) > Date.now(),
           ultimoIngreso: o.ultimoIngreso instanceof Date ? o.ultimoIngreso.toISOString() : texto_(o.ultimoIngreso) };
}
/** ▶ Ejecutar a mano: da un código (vale 2 horas, un solo uso) para crear el
 *  primer administrador desde el portal, o para recuperar el acceso si nadie
 *  recuerda la clave de administrador. Solo lo ve quien abre este proyecto. */
function codigoAdministrador() {
  const a = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let c = '';
  for (let i = 0; i < 10; i++) c += a.charAt(Math.floor(Math.random() * a.length));
  c = c.slice(0, 5) + '-' + c.slice(5);
  PropertiesService.getScriptProperties().setProperty('CODIGO_ADMIN', JSON.stringify({ codigo: c, exp: Date.now() + 2 * 3600000 }));
  console.log('Código de administrador (vale 2 horas, un solo uso): ' + c + '\nEn el portal: Inicio → Usuarios → "Crear o recuperar el administrador".');
  return c;
}
function primerAdmin_(body) {
  const p = PropertiesService.getScriptProperties();
  let c = null; try { c = JSON.parse(p.getProperty('CODIGO_ADMIN') || 'null'); } catch (e) {}
  if (!c || !c.codigo || c.exp < Date.now() || String(body.codigo || '').trim().toUpperCase() !== c.codigo) {
    registrarEvento_('', 'USUARIO', 'RECHAZADO', 'Código de administrador inválido o vencido', body.opId, '', 'usuario');
    return { ok: false, error: 'Código inválido o vencido. Genera otro con ▶ codigoAdministrador en Apps Script.' };
  }
  const usuario = String(body.usuario || '').trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,30}$/.test(usuario)) return { ok: false, error: 'El usuario va en minúsculas, sin espacios (3 a 30 letras, números, punto o guion).' };
  const e2 = validarClaveNueva_(body); if (e2) return { ok: false, error: e2 };
  let o = buscarUsuario_(usuario); const nuevo = !o;
  if (nuevo) o = { usuario: usuario, creado: new Date() };
  const e = datosUsuario_(o, Object.assign({}, body, { rol: 'admin' })); if (e) return { ok: false, error: e };
  o.activo = 'Sí'; o.salt = body.salt; o.iter = Number(body.iter) || ITER_USUARIO; o.hash = hashPrueba_(body.pruebaNueva);
  o.debeCambiar = 'No'; o.intentos = 0; o.bloqueadoHasta = ''; o.sesionDesde = Date.now(); o.actualizado = new Date();
  escribirUsuario_(o);
  p.deleteProperty('CODIGO_ADMIN');
  CTX_.modo = true; CTX_.u = o;
  registrarEvento_(o.usuario, 'USUARIO', 'APLICADO', nuevo ? 'Administrador creado con código' : 'Administrador recuperado con código', body.opId, '', 'usuario');
  const s = firmarSesion_(o.usuario, false, o.sesionDesde);
  return { ok: true, sesion: s.token, exp: s.exp, yo: yo_() };
}

/* ── Qué cambió (para la bitácora): campos de primer nivel distintos ── */
const NO_COMPARAR_ = { id: 1, tipo: 1, version: 1, creado: 1, actualizado: 1, registradoPor: 1, modificadoPor: 1 };
function camposCambiados_(antes, despues) {
  const ks = {}, out = [];
  Object.keys(antes || {}).forEach(function (k) { ks[k] = 1; }); Object.keys(despues || {}).forEach(function (k) { ks[k] = 1; });
  Object.keys(ks).forEach(function (k) { if (!NO_COMPARAR_[k] && JSON.stringify((antes || {})[k]) !== JSON.stringify((despues || {})[k])) out.push(k); });
  return out;
}

/* ================= TROCEO E IMÁGENES ================= */
function trocear_(clave, texto) {
  if (texto.length <= MAX_CHARS_CELDA) return [{ key: clave, texto: texto }];
  const total = Math.ceil(texto.length / MAX_CHARS_CELDA), out = [];
  for (let i = 0; i < total; i++) out.push({ key: clave + '~' + (i + 1) + '/' + total, texto: texto.substr(i * MAX_CHARS_CELDA, MAX_CHARS_CELDA) });
  return out;
}
function reensamblar_(filas) {
  const mapa = {}, partes = {};
  filas.forEach(function (f) {
    const key = String(f.key), pos = key.indexOf('~');
    if (pos === -1) { mapa[key] = f.texto; return; }
    const base = key.substring(0, pos), n = parseInt(key.substring(pos + 1).split('/')[0], 10) || 1;
    (partes[base] = partes[base] || []).push({ n: n, texto: f.texto });
  });
  for (const base in partes) {
    partes[base].sort(function (a, b) { return a.n - b.n; });
    mapa[base] = partes[base].map(function (p) { return p.texto; }).join('');
  }
  return mapa;
}
function leerTrozos_(sheet, id) {
  const rows = filasPorValor_(sheet, 1, id).sort(function (a, b) { return a - b; });
  if (!rows.length) return [];
  const minR = rows[0], maxR = rows[rows.length - 1];
  const vals = sheet.getRange(minR, 2, maxR - minR + 1, 2).getValues();
  return rows.map(function (r) { return { key: vals[r - minR][0], texto: vals[r - minR][1] }; });
}
function claveImg_(dataUrl) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, dataUrl);
  return digest.map(function (b) { return ((b < 0 ? b + 256 : b).toString(16)).padStart(2, '0'); }).join('').substring(0, 14);
}
/** Cambia cada imagen (data:image…) por "IMGREF:xxxx" y la anota aparte. */
function extraerImagenes_(obj, mapa) {
  // También las que van sueltas en listas (fotos: ["data:image…", …]).
  if (typeof obj === 'string') {
    if (obj.indexOf('data:image') !== 0) return obj;
    const key = claveImg_(obj); mapa.push({ key: key, dataUrl: obj }); return 'IMGREF:' + key;
  }
  if (Array.isArray(obj)) return obj.map(function (x) { return extraerImagenes_(x, mapa); });
  if (obj && typeof obj === 'object') {
    const out = {};
    Object.keys(obj).forEach(function (k) { if (!CLAVE_PELIGROSA_[k]) out[k] = extraerImagenes_(obj[k], mapa); });
    return out;
  }
  return obj;
}
function rehidratar_(obj, mapa) {
  if (typeof obj === 'string') return obj.indexOf('IMGREF:') === 0 ? (mapa[obj.substring(7)] || '') : obj;
  if (Array.isArray(obj)) return obj.map(function (x) { return rehidratar_(x, mapa); });
  if (obj && typeof obj === 'object') {
    const out = {};
    Object.keys(obj).forEach(function (k) { if (!CLAVE_PELIGROSA_[k]) out[k] = rehidratar_(obj[k], mapa); });
    return out;
  }
  return obj;
}
/* Un texto que empieza con = + - @ en una celda lo ejecuta Sheets como fórmula.
   Los trozos de datos y fotos van siempre con ' delante: un trozo que empiece por
   "-10-02" o "+Ab" Sheets lo convertiría en número, fecha o fórmula. */
function celda_(v) { return (typeof v === 'string' && /^[=+\-@]/.test(v)) ? "'" + v : v; }
function guardarImagenes_(id, mapa) {
  if (!mapa.length) return;
  const sheet = imgSheet_(), existentes = {};
  leerTrozos_(sheet, id).forEach(function (f) { const k = String(f.key); existentes[k.indexOf('~') === -1 ? k : k.substring(0, k.indexOf('~'))] = true; });
  const ahora = new Date(), filas = [], vistas = {};
  mapa.forEach(function (f) {
    if (existentes[f.key] || vistas[f.key]) return;
    vistas[f.key] = true;
    trocear_(f.key, f.dataUrl).forEach(function (t) { filas.push([id, t.key, "'" + t.texto, ahora]); });
  });
  if (filas.length) sheet.getRange(sheet.getLastRow() + 1, 1, filas.length, 4).setValues(filas);
}

/* ================= DOCUMENTOS ================= */
function texto_(x) { return x == null ? '' : String(x); }
function corto_(x, n) { const t = texto_(x).replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; }
function filaDe_(id) { const r = filasPorValor_(regSheet_(), 1, id); return r.length ? r[0] : -1; }
function leerFila_(fila) {
  const v = regSheet_().getRange(fila, 1, 1, COLS_REG.length).getValues()[0];
  const o = {}; COLS_REG.forEach(function (c, i) { o[c] = v[i]; });
  return o;
}
function leerDoc_(id, conImagenes) {
  const mapa = reensamblar_(leerTrozos_(datosSheet_(), id));
  if (!mapa.doc) return null;
  let doc;
  try { doc = JSON.parse(mapa.doc); } catch (e) { return null; }
  return conImagenes ? rehidratar_(doc, reensamblar_(leerTrozos_(imgSheet_(), id))) : doc;
}
function escribirDoc_(id, doc) {
  const sheet = datosSheet_();
  borrarFilasDe_(sheet, id);
  const ahora = new Date();
  const filas = trocear_('doc', JSON.stringify(doc)).map(function (t) { return [id, t.key, "'" + t.texto, ahora]; });
  sheet.getRange(sheet.getLastRow() + 1, 1, filas.length, 4).setValues(filas);
}
/** Mezcla profunda: los objetos se mezclan campo a campo; listas y valores se reemplazan. */
/* Claves que en JavaScript cambian el "prototipo" de un objeto: nunca se copian
   (un "__proto__" en los datos podría colar campos que el servidor protege). */
const CLAVE_PELIGROSA_ = { '__proto__': true, constructor: true, prototype: true };
function mezclar_(base, cambios) {
  const out = (base && typeof base === 'object' && !Array.isArray(base)) ? JSON.parse(JSON.stringify(base)) : {};
  Object.keys(cambios || {}).forEach(function (k) {
    if (CLAVE_PELIGROSA_[k]) return;
    const v = cambios[k];
    if (v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object' && !Array.isArray(out[k])) out[k] = mezclar_(out[k], v);
    else out[k] = v;
  });
  return out;
}

/* ── Lo que se lista de cada tipo (sin fotos ni textos largos) ── */
function resumen_(tipo, d) {
  if (tipo === 'trabajador') {
    const req = {};
    Object.keys(d.requisitos || {}).forEach(function (k) {
      const r = d.requisitos[k] || {};
      req[k] = { fecha: texto_(r.fecha), vence: texto_(r.vence), apto: texto_(r.apto), restricciones: corto_(r.restricciones, 120), soporte: !!r.soporte };
    });
    return { nombre: corto_(d.nombre, 90), cedula: texto_(d.cedula), cargo: corto_(d.cargo, 60), empresa: corto_(d.empresa, 60), activo: d.activo !== false, req: req };
  }
  if (tipo === 'reporte') {
    const inv = d.investigacion || {};
    return { clase: texto_(d.clase), fecha: texto_(d.fecha), hora: texto_(d.hora), lugar: corto_(d.lugar, 80), centro: corto_(d.centro, 60),
             descripcion: corto_(d.descripcion, 160), potencial: texto_(d.potencial), reportadoPor: corto_(d.anonimo ? 'Anónimo' : d.reportadoPor, 60),
             lesionado: corto_(d.lesionado && d.lesionado.nombre, 60), diasIncapacidad: Number(d.diasIncapacidad) || 0, diasCargados: Number(d.diasCargados) || 0,
             mortal: !!d.mortal, grave: !!d.grave, fotos: (d.fotos || []).length,
             furat: { radicado: !!(d.furat && d.furat.radicado), numero: texto_(d.furat && d.furat.numero), fecha: texto_(d.furat && d.furat.fecha) },
             investigacion: { estado: texto_(inv.estado), fecha: texto_(inv.fecha) }, acciones: (d.acciones || []).length };
  }
  if (tipo === 'accion') {
    return { origen: texto_(d.origen), origenRef: texto_(d.origenRef), hallazgo: corto_(d.hallazgo, 180), accion: corto_(d.accion, 180), tipoAccion: texto_(d.tipoAccion),
             responsable: corto_(d.responsable, 60), fechaCompromiso: texto_(d.fechaCompromiso), prioridad: texto_(d.prioridad),
             fechaCierre: texto_(d.cierre && d.cierre.fecha), eficaz: texto_(d.cierre && d.cierre.eficaz), centro: corto_(d.centro, 60),
             verificada: !!(d.verificada && d.verificada.fecha), asignadaPor: corto_(d.asignadaPor, 60), lote: corto_(d.lote, 40) };
  }
  if (tipo === 'mes') {
    return { mes: texto_(d.mes), trabajadores: Number(d.trabajadores) || 0, diasProgramados: Number(d.diasProgramados) || 0,
             diasAusencia: Number(d.diasAusencia) || 0, hht: Number(d.hht) || 0, casosEL: Number(d.casosEL) || 0, casosELNuevos: Number(d.casosELNuevos) || 0,
             inspeccionesProgramadas: Number(d.inspeccionesProgramadas) || 0, capacitacionesProgramadas: Number(d.capacitacionesProgramadas) || 0 };
  }
  if (tipo === 'equipo') {
    const ven = {};
    Object.keys(d.vencimientos || {}).forEach(function (k) { ven[k] = texto_(d.vencimientos[k]); });
    return { categoria: texto_(d.categoria), codigo: corto_(d.codigo, 40), nombre: corto_(d.nombre, 80), ubicacion: corto_(d.ubicacion, 80),
             frecuencia: texto_(d.frecuencia), ultimaInspeccion: texto_(d.ultimaInspeccion), ultimoResultado: texto_(d.ultimoResultado),
             vencimientos: ven, activo: d.activo !== false };
  }
  if (tipo === 'inspeccion') {
    const nc = (d.items || []).filter(function (i) { return i && i.r === 'NC'; });
    return { categoria: texto_(d.categoria), plantilla: texto_(d.plantilla), equipoId: texto_(d.equipoId), equipo: corto_(d.equipoNombre, 80),
             fecha: texto_(d.fecha), lugar: corto_(d.lugar, 80), inspector: corto_(d.inspector && d.inspector.nombre, 60),
             resultado: nc.length ? 'NO CONFORME' : 'CONFORME', nc: nc.length, items: (d.items || []).length, noConformes: nc.slice(0, 8).map(function (i) { return corto_(i.t, 80); }),
             tipoInspeccion: texto_(d.tipoInspeccion), participantes: (d.participantes || []).length, progId: texto_(d.progId) };
  }
  if (tipo === 'comite') {
    const per = periodoActual_(d);
    const c = d.cifrado && d.cifrado.actual;
    return { comite: texto_(d.comite), trabajadores: Number(d.trabajadores) || 0,
             periodo: per ? { inicio: texto_(per.inicio), fin: texto_(per.fin), miembros: (per.miembros || []).map(function (m) {
               return { nombre: corto_(m.nombre, 80), cargo: corto_(m.cargo, 60), representa: texto_(m.representa), calidad: texto_(m.calidad), rol: texto_(m.rol) }; }) } : null,
             periodos: (d.periodos || []).length, capacitaciones: (d.capacitaciones || []).length,
             // Para abrir las quejas en el celular (no son secretos: sin la clave no sirven).
             cifrado: c ? { actual: claveCifrado_(c), anterior: d.cifrado.anterior ? claveCifrado_(d.cifrado.anterior) : null } : null };
  }
  if (tipo === 'reunion') {
    const as = d.asistentes || [];
    return { comite: texto_(d.comite), numero: texto_(d.numero), tipo: texto_(d.tipoReunion), fecha: texto_(d.fecha), lugar: corto_(d.lugar, 80),
             asistentes: as.filter(function (a) { return a && a.asistio === 'Sí'; }).length, convocados: as.length, quorum: !!d.quorum,
             motivo: corto_(d.motivo, 120), compromisos: (d.compromisos || []).length, temas: (d.ordenDia || []).slice(0, 6).map(function (t) { return corto_(t, 80); }) };
  }
  if (tipo === 'queja') {
    return { codigo: texto_(d.codigo), fechaRecepcion: texto_(d.fechaRecepcion), etapa: texto_(d.etapa), estado: texto_(d.estado || 'ABIERTA'),
             fechaCierre: texto_(d.fechaCierre), inicioEtapa: texto_(d.inicioEtapa), venceEtapa: texto_(d.venceEtapa), venceTotal: texto_(d.venceTotal),
             kid: texto_(d.cifrado && d.cifrado.kid) };
  }
  if (tipo === 'auditoria') {
    const h = { ncMayor: 0, ncMenor: 0, obs: 0, om: 0 };
    (d.hallazgos || []).forEach(function (x) { if (x && h[x.tipo] !== undefined) h[x.tipo]++; });
    const items = d.items || [];
    return { tipoAuditoria: texto_(d.tipoAuditoria), plantilla: texto_(d.plantilla), titulo: corto_(d.titulo, 120), fechaPlan: texto_(d.fechaPlan),
             fechaEjecucion: texto_(d.fechaEjecucion), auditor: corto_(d.auditor && d.auditor.nombre, 60), alcance: corto_(d.alcance, 160),
             estado: texto_(d.estado || 'PROGRAMADA'), puntaje: d.puntaje == null ? null : Number(d.puntaje), valoracion: texto_(d.valoracion),
             hallazgos: h, items: items.length, respondidos: items.filter(function (i) { return i && i.r; }).length, acciones: (d.acciones || []).length };
  }
  if (TIPOS_GEN[tipo]) {
    const o = {};
    TIPOS_GEN[tipo].campos.forEach(function (k) {
      const v = d[k];
      if (v == null || v === '') { o[k] = ''; return; }
      if (typeof v === 'number' || typeof v === 'boolean') { o[k] = v; return; }
      const esLargo = (TIPOS_GEN[tipo].largos || []).indexOf(k) !== -1, largo = esLargo ? (TIPOS_GEN[tipo].largoMax || 1500) : 200;
      if (esLargo && TIPOS_GEN[tipo].saltos && typeof v === 'string') { const t = v.replace(/[ \t\f\v\r]+/g, ' ').replace(/ *\n+ */g, '\n').trim(); o[k] = t.length > largo ? t.slice(0, largo - 1) + '…' : t; return; }
      if (Array.isArray(v)) { o[k] = v.every(function (x) { return typeof x === 'string'; }) ? corto_(v.join(', '), largo) : v.length; return; }
      if (typeof v === 'object') { o[k] = Object.keys(v).length; return; }
      o[k] = corto_(v, largo);
    });
    return o;
  }
  return {};
}
function claveCifrado_(c) { return { kid: texto_(c.kid), salt: texto_(c.salt), iter: Number(c.iter) || 0, verif: c.verif ? { iv: texto_(c.verif.iv), data: texto_(c.verif.data) } : null }; }
function periodoActual_(d) { const l = d.periodos || []; return l.length ? l[l.length - 1] : null; }
/* Lo que va en las columnas de "Registros". */
function columnas_(tipo, d, id) {
  const r = resumen_(tipo, d);
  if (tipo === 'trabajador') {
    let vence = '';
    Object.keys(r.req).forEach(function (k) { const v = r.req[k].vence; if (v && (!vence || v < vence)) vence = v; });
    return { estado: r.activo ? 'ACTIVO' : 'INACTIVO', fecha: '', titulo: r.nombre, responsable: r.cargo, vence: vence, resumen: r };
  }
  if (tipo === 'reporte') return { estado: texto_(d.estado || 'ABIERTO'), fecha: r.fecha, titulo: r.clase + ' · ' + r.descripcion, responsable: r.reportadoPor, vence: '', resumen: r };
  if (tipo === 'accion') return { estado: texto_(d.estado || 'ABIERTA'), fecha: texto_(d.fecha), titulo: r.accion || r.hallazgo, responsable: r.responsable, vence: r.fechaCompromiso, resumen: r };
  if (tipo === 'mes') return { estado: '', fecha: r.mes + '-01', titulo: 'Datos de ' + r.mes, responsable: '', vence: '', resumen: r };
  if (tipo === 'equipo') {
    let vence = ''; Object.keys(r.vencimientos).forEach(function (k) { const v = r.vencimientos[k]; if (v && (!vence || v < vence)) vence = v; });
    return { estado: r.activo ? 'ACTIVO' : 'DE BAJA', fecha: r.ultimaInspeccion, titulo: (r.codigo ? r.codigo + ' · ' : '') + r.nombre, responsable: r.ubicacion, vence: vence, resumen: r };
  }
  if (tipo === 'inspeccion') return { estado: r.resultado, fecha: r.fecha, titulo: r.categoria + ' · ' + r.equipo, responsable: r.inspector, vence: '', resumen: r };
  if (tipo === 'comite') {
    const per = r.periodo, pres = per ? per.miembros.filter(function (m) { return /presidente/i.test(m.rol); })[0] : null;
    return { estado: per ? (per.fin && per.fin < hoyISO_() ? 'VENCIDO' : 'VIGENTE') : 'SIN CONFORMAR', fecha: per ? per.inicio : '', titulo: NOMBRE_COMITE_[r.comite] || r.comite,
             responsable: pres ? pres.nombre : '', vence: per ? per.fin : '', resumen: r };
  }
  if (tipo === 'reunion') return { estado: 'REALIZADA', fecha: r.fecha, titulo: (NOMBRE_COMITE_[r.comite] || r.comite) + ' · Acta ' + r.numero + ' (' + r.tipo + ')', responsable: '', vence: '', resumen: r };
  if (tipo === 'queja') {
    const v = r.estado === 'ABIERTA' ? [r.venceEtapa, r.venceTotal].filter(Boolean).sort()[0] || '' : '';
    return { estado: r.estado, fecha: r.fechaRecepcion, titulo: r.codigo + ' · ' + r.etapa, responsable: '', vence: v, resumen: r };
  }
  if (tipo === 'auditoria') return { estado: r.estado, fecha: r.fechaEjecucion || r.fechaPlan, titulo: r.titulo || r.tipoAuditoria, responsable: r.auditor, vence: r.estado === 'PROGRAMADA' ? r.fechaPlan : '', resumen: r };
  if (TIPOS_GEN[tipo]) {
    const t = TIPOS_GEN[tipo], g = function (k) { return k ? texto_(r[k]) : ''; };
    return { estado: g(t.estado), fecha: g(t.fecha), titulo: g(t.titulo) || id, responsable: g(t.responsable), vence: /^\d{4}-\d{2}-\d{2}$/.test(g(t.vence)) ? g(t.vence) : '', resumen: r };
  }
  return { estado: '', fecha: '', titulo: id, responsable: '', vence: '', resumen: {} };
}

const NOMBRE_COMITE_ = { copasst: 'COPASST', convivencia: 'Comité de Convivencia Laboral' };

/* ── Hojas legibles (una por módulo) ── */
const VISTAS = {
  trabajador: { hoja: 'Requisitos', cols: ['id', 'cédula', 'nombre', 'cargo', 'empresa', 'requisito', 'fecha', 'vence', 'apto', 'restricciones', 'actualizado'],
    filas: function (id, d) { const req = d.requisitos || {}; const ks = Object.keys(req); if (!ks.length) ks.push('');
      return ks.map(function (k) { const r = req[k] || {}; return [id, texto_(d.cedula), texto_(d.nombre), texto_(d.cargo), texto_(d.empresa), k, texto_(r.fecha), texto_(r.vence), texto_(r.apto), texto_(r.restricciones), new Date()]; }); } },
  reporte: { hoja: 'Reportes', cols: ['id', 'clase', 'fecha', 'hora', 'lugar', 'centro', 'descripción', 'potencial', 'reportado por', 'lesionado', 'días incapacidad', 'FURAT', 'investigación', 'estado', 'actualizado'],
    filas: function (id, d) { return [[id, texto_(d.clase), texto_(d.fecha), texto_(d.hora), texto_(d.lugar), texto_(d.centro), corto_(d.descripcion, 2000), texto_(d.potencial),
      d.anonimo ? 'Anónimo' : texto_(d.reportadoPor), texto_(d.lesionado && d.lesionado.nombre), Number(d.diasIncapacidad) || 0,
      d.furat && d.furat.radicado ? 'Radicado ' + texto_(d.furat.numero) : '', texto_(d.investigacion && d.investigacion.estado), texto_(d.estado || 'ABIERTO'), new Date()]]; } },
  accion: { hoja: 'Plan de acción', cols: ['id', 'origen', 'referencia', 'hallazgo', 'acción', 'tipo', 'responsable', 'fecha compromiso', 'estado', 'fecha cierre', 'eficaz', 'actualizado'],
    filas: function (id, d) { return [[id, texto_(d.origen), texto_(d.origenRef), corto_(d.hallazgo, 2000), corto_(d.accion, 2000), texto_(d.tipoAccion), texto_(d.responsable),
      texto_(d.fechaCompromiso), texto_(d.estado || 'ABIERTA'), texto_(d.cierre && d.cierre.fecha), texto_(d.cierre && d.cierre.eficaz), new Date()]]; } },
  mes: { hoja: 'Indicadores', cols: ['mes', 'trabajadores', 'días programados', 'días ausencia', 'HHT', 'casos EL', 'casos EL nuevos', 'inspecciones programadas', 'capacitaciones programadas', 'actualizado'],
    filas: function (id, d) { return [["'" + texto_(d.mes), Number(d.trabajadores) || 0, Number(d.diasProgramados) || 0, Number(d.diasAusencia) || 0, Number(d.hht) || 0,
      Number(d.casosEL) || 0, Number(d.casosELNuevos) || 0, Number(d.inspeccionesProgramadas) || 0, Number(d.capacitacionesProgramadas) || 0, new Date()]]; }, clave: function (d) { return texto_(d.mes); } },
  equipo: { hoja: 'Equipos', cols: ['id', 'categoría', 'código', 'nombre', 'ubicación', 'frecuencia', 'última inspección', 'resultado', 'vencimientos', 'estado', 'actualizado'],
    filas: function (id, d) { const v = d.vencimientos || {}; return [[id, texto_(d.categoria), texto_(d.codigo), texto_(d.nombre), texto_(d.ubicacion), texto_(d.frecuencia),
      texto_(d.ultimaInspeccion), texto_(d.ultimoResultado), Object.keys(v).map(function (k) { return k + ': ' + v[k]; }).join(' · '), d.activo === false ? 'DE BAJA' : 'ACTIVO', new Date()]]; } },
  inspeccion: { hoja: 'Inspecciones', cols: ['id', 'categoría', 'equipo', 'fecha', 'lugar', 'inspector', 'resultado', 'no conformes', 'actualizado'],
    filas: function (id, d) { const r = resumen_('inspeccion', d); return [[id, r.categoria, r.equipo, r.fecha, r.lugar, r.inspector, r.resultado, r.noConformes.join(' | '), new Date()]]; } },
  comite: { hoja: 'Comités', cols: ['id', 'comité', 'inicio del periodo', 'fin del periodo', 'nombre', 'cédula', 'cargo', 'representa a', 'calidad', 'rol', 'actualizado'],
    filas: function (id, d) { const per = periodoActual_(d); const ms = per && per.miembros && per.miembros.length ? per.miembros : [{}];
      return ms.map(function (m) { return [id, NOMBRE_COMITE_[d.comite] || texto_(d.comite), texto_(per && per.inicio), texto_(per && per.fin), texto_(m.nombre), texto_(m.cedula), texto_(m.cargo), texto_(m.representa), texto_(m.calidad), texto_(m.rol), new Date()]; }); } },
  reunion: { hoja: 'Actas de comités', cols: ['id', 'comité', 'acta', 'tipo', 'fecha', 'lugar', 'asistentes', 'quórum', 'temas', 'compromisos', 'actualizado'],
    filas: function (id, d) { const r = resumen_('reunion', d); return [[id, NOMBRE_COMITE_[r.comite] || r.comite, r.numero, r.tipo, r.fecha, r.lugar, r.asistentes + ' de ' + r.convocados, r.quorum ? 'Sí' : 'No', r.temas.join(' | '), r.compromisos, new Date()]]; } },
  queja: { hoja: 'Quejas convivencia (sin datos)', cols: ['id', 'código', 'recibida', 'etapa', 'estado', 'vence la etapa', 'límite total (65 días)', 'cierre', 'actualizado'],
    filas: function (id, d) { return [[id, texto_(d.codigo), texto_(d.fechaRecepcion), texto_(d.etapa), texto_(d.estado), texto_(d.venceEtapa), texto_(d.venceTotal), texto_(d.fechaCierre), new Date()]]; } },
  auditoria: { hoja: 'Auditorías', cols: ['id', 'tipo', 'título', 'planeada', 'ejecutada', 'auditor', 'estado', 'puntaje', 'valoración', 'NC mayores', 'NC menores', 'observaciones', 'oportunidades de mejora', 'actualizado'],
    filas: function (id, d) { const r = resumen_('auditoria', d); return [[id, r.tipoAuditoria, r.titulo, r.fechaPlan, r.fechaEjecucion, r.auditor, r.estado, r.puntaje == null ? '' : r.puntaje, r.valoracion, r.hallazgos.ncMayor, r.hallazgos.ncMenor, r.hallazgos.obs, r.hallazgos.om, new Date()]]; } }
};
Object.keys(TIPOS_GEN).forEach(function (t) {
  const g = TIPOS_GEN[t];
  VISTAS[t] = { hoja: g.hoja, cols: ['id'].concat(g.campos, ['actualizado']),
    filas: function (id, d) { const r = resumen_(t, d); return [[id].concat(g.campos.map(function (k) { return r[k]; }), [new Date()])]; } };
});
function vistaSheet_(tipo) { return hoja_(VISTAS[tipo].hoja, VISTAS[tipo].cols); }
/* Si una versión nueva agregó columnas a un tipo genérico, la hoja legible vieja queda con el
   encabezado de antes: se rehace una vez desde "Registros" (el resumen trae los mismos campos). */
function encabezadoAlDia_(tipo, sheet) {
  const v = VISTAS[tipo], g = TIPOS_GEN[tipo]; if (!g || sheet.getLastRow() < 1) return;
  CTX_.vistasRevisadas = CTX_.vistasRevisadas || {};
  if (CTX_.vistasRevisadas[tipo]) return; CTX_.vistasRevisadas[tipo] = true;
  const ancho = Math.max(v.cols.length, sheet.getLastColumn());
  const h = sheet.getRange(1, 1, 1, ancho).getValues()[0].map(texto_);
  // Columnas que la empresa agregó a la derecha (fórmulas, notas) no obligan a rehacer la hoja.
  if (h.slice(0, v.cols.length).join('|') === v.cols.join('|')) return;
  const filas = [];
  const reg = regSheet_(), last = reg.getLastRow();
  if (last >= 2) reg.getRange(2, 1, last - 1, COLS_REG.length).getValues().forEach(function (x) {
    if (x[1] !== tipo || x[11]) return; let r = {}; try { r = JSON.parse(x[8] || '{}'); } catch (e) {}
    filas.push([x[0]].concat(g.campos.map(function (k) { return r[k] == null ? '' : r[k]; }), [x[10]]).map(celda_));
  });
  if (sheet.getLastRow() >= 2) sheet.deleteRows(2, sheet.getLastRow() - 1);
  sheet.getRange(1, 1, 1, ancho).setValues([v.cols.concat(new Array(ancho - v.cols.length).fill(''))]);
  if (filas.length) sheet.getRange(2, 1, filas.length, v.cols.length).setValues(filas);
}
function escribirVista_(tipo, id, d, borrado) {
  const v = VISTAS[tipo]; if (!v) return;
  const sheet = vistaSheet_(tipo);
  try { encabezadoAlDia_(tipo, sheet); } catch (e) { console.log('Encabezado de ' + v.hoja + ': ' + e.message); }
  borrarFilasDe_(sheet, v.clave ? v.clave(d) : id);
  if (borrado) return;
  const filas = v.filas(id, d).map(function (f) { return f.map(celda_); });
  if (filas.length) sheet.getRange(sheet.getLastRow() + 1, 1, filas.length, filas[0].length).setValues(filas);
}

/* ================= ESCRITURA ================= */
function doPost(e) {
  CTX_ = { modo: false, u: null, colUsuario: false };
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return jsonOut_({ ok: false, error: 'Cuerpo ilegible.' }); }
  if (!checkToken_(body.token)) {
    registrarEvento_(body.id, body.action || 'GUARDAR', 'RECHAZADO', 'Token inválido', '', '', body.tipo);
    return jsonOut_({ ok: false, error: 'Clave del portal incorrecta o faltante (Token inválido).', codigoError: 'CLAVE' });
  }
  // El respaldo copia libros enteros (tarda): va sin el candado, para no frenar a los demás.
  if (body.action === 'respaldar') { iniciarContexto_(body.sesion); return jsonOut_(respaldarAhora_()); }
  const lock = LockService.getScriptLock();
  try { lock.waitLock(20000); }
  catch (err) { return jsonOut_({ ok: false, codigoError: 'TEMPORAL', error: 'El servidor está ocupado; se reintenta solo.' }); }
  try {
    iniciarContexto_(body.sesion);
    delete body._interno; delete body._sinVersion; delete body._sistema;   // solo los usa el propio servidor
    if (body.opId && opIdYaAplicado_(body.opId)) {
      registrarEvento_(body.id, body.action, 'DUPLICADO', 'opId ya aplicado', body.opId, '', body.tipo);
      const f = filaDe_(texto_(body.id));
      return jsonOut_({ ok: true, id: body.id, duplicado: true, version: f === -1 ? 0 : leerFila_(f).version });
    }
    if (body.action === 'guardar' || body.action === 'parche') return jsonOut_(guardar_(body));
    if (body.action === 'guardarLote') return jsonOut_(guardarLote_(body));
    if (body.action === 'borrar') return jsonOut_(borrar_(body));
    if (body.action === 'adjuntar') return jsonOut_(adjuntar_(body));
    if (body.action === 'quitarAdjunto') return jsonOut_(quitarAdjunto_(body));
    if (body.action === 'entrar') return jsonOut_(entrar_(body));
    if (body.action === 'cambiarMiClave') return jsonOut_(cambiarMiClave_(body));
    if (body.action === 'guardarUsuario') return jsonOut_(guardarUsuario_(body));
    if (body.action === 'primerAdmin') return jsonOut_(primerAdmin_(body));
    return jsonOut_({ ok: false, error: 'Acción no reconocida.' });
  } catch (err) {
    registrarEvento_(body.id, body.action, 'RECHAZADO', 'Error: ' + err.message, body.opId, '', body.tipo);
    return jsonOut_({ ok: false, error: 'Error en el servidor SG-SST: ' + err.message });
  } finally {
    lock.releaseLock();
  }
}

/* Carga masiva desde Excel (importar.js): hasta 10 registros por llamada, cada uno como
   un "parche" (crea si no existe; si existe, cambia solo lo que trae). Cada registro pasa
   por las mismas reglas y permisos que uno guardado a mano. */
const TIPOS_LOTE_ = ['trabajador', 'equipo', 'sustancia', 'legal', 'peligro', 'documento', 'proveedor'];
function guardarLote_(body) {
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) return { ok: false, error: 'No llegó ningún registro.' };
  if (items.length > 10) return { ok: false, error: 'Máximo 10 registros por envío.' };
  const base = texto_(body.opId) || ('lote-' + Date.now());
  const resultados = items.map(function (it, i) {
    it = it || {};
    const tipo = texto_(it.tipo);
    if (TIPOS_LOTE_.indexOf(tipo) === -1) return { ok: false, error: 'No se puede cargar en lote: ' + tipo };
    if (!it.campos || typeof it.campos !== 'object' || Array.isArray(it.campos)) return { ok: false, error: 'Registro vacío.' };
    try {
      // Si el envío se cortó a mitad y el celular lo repite, lo que ya quedó no se aplica otra vez.
      if (opIdYaAplicado_(base + ':' + i)) return { ok: true, id: texto_(it.id), repetido: true };
      const r = guardar_({ action: 'parche', tipo: tipo, id: texto_(it.id), campos: it.campos, opId: base + ':' + i });
      return r.ok ? { ok: true, id: r.id, version: r.version } : { ok: false, error: r.error || 'error', codigoError: r.codigoError };
    } catch (e) { return { ok: false, error: e.message }; }
  });
  const malos = resultados.filter(function (r) { return !r.ok; });
  // Sin sesión o sin permiso: todos fallan igual; se devuelve como error general.
  if (malos.length === resultados.length && malos[0].codigoError && /SESION|PERMISO|CAMBIAR/.test(malos[0].codigoError)) return { ok: false, codigoError: malos[0].codigoError, error: malos[0].error };
  return { ok: true, resultados: resultados, cargados: resultados.length - malos.length };
}

function guardar_(body) {
  const tipo = texto_(body.tipo), id = texto_(body.id).trim();
  if (TIPOS.indexOf(tipo) === -1) return { ok: false, error: 'Tipo desconocido: ' + tipo };
  if (!/^[A-Za-z0-9_.:-]{3,80}$/.test(id)) return { ok: false, error: 'Identificador inválido.' };
  const fila = filaDe_(id);
  const prev = fila === -1 ? null : leerFila_(fila);
  if (prev && prev.tipo !== tipo) return { ok: false, error: 'Ese identificador ya es de otro tipo.' };
  const versionActual = prev ? Number(prev.version) || 0 : 0;
  let doc;
  if (prev && prev.borrado) return { ok: false, error: 'Ese registro fue borrado.', borrado: true };
  const sinPermiso = body._sistema ? null : puedeEscribir_(tipo, body.action, !!prev);
  if (sinPermiso) { registrarEvento_(id, body.action === 'parche' ? 'PARCHE' : 'GUARDAR', 'RECHAZADO', sinPermiso.error, body.opId, versionActual, tipo); return sinPermiso; }
  // Lo que pone el servidor (quién y adjuntos) no se acepta del celular.
  let prevRes = {}, prevResFallo = false; try { prevRes = prev ? JSON.parse(prev.resumen || '{}') : {}; } catch (e) { prevResFallo = true; }
  let prevDocCache;
  const prevDoc = function () { if (prevDocCache === undefined) prevDocCache = prev ? (leerDoc_(id, false) || {}) : {}; return prevDocCache; };
  const PROPIOS = ['registradoPor', 'modificadoPor', 'adjuntos'];
  if (!body._interno) {
    if (body.doc) PROPIOS.forEach(function (k) { delete body.doc[k]; });
    if (body.campos) PROPIOS.forEach(function (k) { delete body.campos[k]; });
    if (body.agregar) PROPIOS.forEach(function (k) { delete body.agregar[k]; });
  }
  if (tipo === 'queja') {
    // Las quejas de convivencia son reservadas: solo llegan cifradas y completas.
    if (body.action !== 'guardar') return { ok: false, error: 'Las quejas se guardan completas (cifradas).' };
    const err = validarQueja_(body.doc || {}, body);
    if (err) { registrarEvento_(id, 'GUARDAR', 'RECHAZADO', err, body.opId, versionActual, tipo); return { ok: false, error: err }; }
  }
  if (body.action === 'parche') {
    // Reportes, acciones e inspecciones se crean con "guardar". Si llega antes
    // un cambio (la cola sin señal los mandó en desorden), se espera: si se
    // creara aquí, el "guardar" que llega después borraría ese cambio.
    if (!prev && ['reporte', 'accion', 'inspeccion', 'plantillainsp'].indexOf(tipo) !== -1) {
      return { ok: false, codigoError: 'TEMPORAL', error: 'El registro todavía no ha llegado al servidor; este cambio se reenvía solo.' };
    }
    doc = mezclar_(prevDoc(), body.campos || {});
    // "agregar": se suma a la lista del SERVIDOR (no se reemplaza con la copia
    // del celular). Así dos celulares que anotan avances no se borran entre sí.
    const ag = body.agregar || {};
    Object.keys(ag).forEach(function (k) {
      const lista = Array.isArray(doc[k]) ? doc[k] : [];
      (Array.isArray(ag[k]) ? ag[k] : [ag[k]]).forEach(function (it) {
        const ya = lista.some(function (x) { return (it && typeof it === 'object' && it.uid) ? (x && x.uid === it.uid) : JSON.stringify(x) === JSON.stringify(it); });
        if (!ya) lista.push(it);
      });
      doc[k] = lista;
    });
    // Anotar un avance pone en proceso una acción abierta; nunca reabre una cerrada.
    if (tipo === 'accion' && ag.seguimiento && (doc.estado || 'ABIERTA') === 'ABIERTA') doc.estado = 'EN PROCESO';
  } else {
    if (prev && body.versionBase !== undefined && body.versionBase !== null && Number(body.versionBase) !== versionActual) {
      registrarEvento_(id, 'GUARDAR', 'RECHAZADO', 'Conflicto de versión (base ' + body.versionBase + ', actual ' + versionActual + ')', body.opId, versionActual, tipo);
      return { ok: false, conflicto: true, version: versionActual, error: 'Otra persona actualizó este registro. Ábrelo de nuevo para ver los cambios.' };
    }
    doc = body.doc || {};
  }
  // Los adjuntos se agregan y retiran solo con "adjuntar" / "quitarAdjunto": fuera
  // de eso, lo que vale es lo que ya tiene el servidor (nunca lo que manda el celular).
  if (!body._interno) {
    const pa = prev && (prevResFallo || Number(prevRes._adjTotal) > 0) ? prevDoc().adjuntos : null;
    if (pa && pa.length) doc.adjuntos = pa; else delete doc.adjuntos;
  }
  // La clave del Comité de Convivencia: crearla, cambiarla y cerrar el cambio
  // tienen reglas estrictas (ver reglaCifradoComite_).
  if (tipo === 'comite') {
    const r = reglaCifradoComite_(prevDoc(), doc, body);
    if (r) { registrarEvento_(id, body.action, 'RECHAZADO', r.error, body.opId, versionActual, tipo); return r; }
  }
  const ahora = new Date();
  // Adjuntar o quitar un adjunto no cambia la versión: así quien tiene el registro
  // abierto puede guardarlo igual (los adjuntos los conserva el servidor).
  const version = body._sinVersion && prev ? versionActual : versionActual + 1;
  if (CTX_.modo && tipo !== 'queja') {   // en las quejas (reservadas) no se anota nombre en el registro
    if (prev) prevDoc();   // se lee ANTES de escribir, para anotar qué cambió
    const quien = etiquetaUsuario_();
    const por = prev ? (doc.registradoPor || prevRes._por || '') : quien;
    if (por) doc.registradoPor = por;
    doc.modificadoPor = quien;
  }
  doc.id = id; doc.tipo = tipo; doc.version = version;
  doc.creado = doc.creado || (prev ? texto_(prev.createdAt && prev.createdAt.toISOString ? prev.createdAt.toISOString() : prev.createdAt) : ahora.toISOString());
  doc.actualizado = ahora.toISOString();
  const mapa = [];
  const limpio = extraerImagenes_(doc, mapa);
  guardarImagenes_(id, mapa);
  escribirDoc_(id, limpio);
  const c = columnas_(tipo, limpio, id);
  const adj = (limpio.adjuntos || []).filter(function (a) { return a && !a.retirado; }).length;
  if (adj) c.resumen._adj = adj;
  if ((limpio.adjuntos || []).length) c.resumen._adjTotal = limpio.adjuntos.length;
  if (limpio.registradoPor) c.resumen._por = corto_(limpio.registradoPor, 120);
  // Qué cambió, para la bitácora (solo con usuarios: cuesta una lectura más).
  let cambio = '';
  if (CTX_.modo && (tipo !== 'queja')) {
    const ks = body.action === 'parche' ? Object.keys(body.campos || {}).concat(Object.keys(body.agregar || {}).map(function (k) { return k + ' (+)'; }))
      : (prev ? camposCambiados_(prevDoc(), limpio) : []);
    if (ks.length) cambio = ' · cambió: ' + ks.slice(0, 15).join(', ') + (ks.length > 15 ? '…' : '');
  }
  const valores = [id, tipo, version, c.estado, c.fecha, celda_(corto_(c.titulo, 300)), celda_(corto_(c.responsable, 120)), c.vence,
                   JSON.stringify(c.resumen).slice(0, 45000), prev ? prev.createdAt : ahora, ahora, ''];
  const reg = regSheet_();
  if (fila === -1) reg.appendRow(valores); else reg.getRange(fila, 1, 1, valores.length).setValues([valores]);
  escribirVista_(tipo, id, limpio, false);
  registrarEvento_(id, body.action === 'parche' ? 'PARCHE' : (prev ? 'ACTUALIZAR' : 'CREAR'), 'APLICADO', corto_(c.titulo, 300) + cambio, body.opId, version, tipo);
  if (tipo === 'reporte' && !prev && limpio.clase === 'Accidente de trabajo') avisarAccidente_(id, limpio);
  if (tipo === 'accion' && limpio.origen === ORIGEN_ASESOR_ && texto_(limpio.asignadaPor).trim()) {
    try {
      if (!prev && puedeAvisarTarea_()) avisarTareaAsesor_(id, limpio, 'nueva');
      else if (limpio.estado === 'CERRADA' && texto_(prev.estado) !== 'CERRADA') avisarTareaAsesor_(id, limpio, 'cerrada');
    } catch (e) { registrarEvento_(id, 'CORREO', 'RECHAZADO', 'No salió el aviso de la tarea: ' + e.message, '', '', tipo); }
  }
  if (tipo === 'induccion' && !body._sistema) { try { efectoInduccion_(limpio); } catch (e) { registrarEvento_(id, 'HABILITACION', 'RECHAZADO', 'No se actualizó Personal habilitado: ' + e.message, '', '', tipo); } }
  return { ok: true, id: id, version: version, resumen: c.resumen, estado: c.estado };
}

/* Una inducción o reinducción APROBADA deja al día el requisito "induccion" de la
   persona en Personal habilitado (la crea si no existe). Lo hace el servidor: un
   supervisor puede registrar inducciones aunque no pueda editar el personal. */
function efectoInduccion_(d) {
  if (d.resultado !== 'APROBADA' || !d.cedula || d.tipoInduccion === 'Visitante' || !/^\d{4}-\d{2}-\d{2}$/.test(texto_(d.fecha))) return;
  const tid = 'TRB-' + String(d.cedula).replace(/[^0-9A-Za-z]/g, '').toUpperCase();
  if (tid.length < 7) return;
  const f = filaDe_(tid), actual = f === -1 ? null : (leerDoc_(tid, false) || {});
  const ya = actual && actual.requisitos && actual.requisitos.induccion;
  if (ya && texto_(ya.fecha) >= texto_(d.fecha)) return;   // ya tiene una más reciente
  const campos = { requisitos: { induccion: { fecha: d.fecha, vence: texto_(d.vence) || '', fuente: d.id } } };
  if (!actual) Object.assign(campos, { nombre: d.nombre, cedula: d.cedula, cargo: d.cargo || '', empresa: d.empresa || '', activo: true });
  const r = guardar_({ action: 'parche', tipo: 'trabajador', id: tid, campos: campos, opId: '', _interno: true, _sistema: true });
  if (!r.ok) throw new Error(r.error || 'error');
}
function hashPrueba_(p) {
  if (!p) return '';
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(p))
    .map(function (b) { return ((b < 0 ? b + 256 : b).toString(16)).padStart(2, '0'); }).join('');
}
function cifradoConvivencia_() { const d = leerDoc_('CMT-CONVIVENCIA', false); return (d && d.cifrado) || null; }
/* Solo quien tiene la clave del comité puede escribir o borrar quejas: el celular
   manda la "prueba" (sale de la clave, pero no sirve para descifrar). */
function pruebaValida_(body, conf) { return !!(conf && conf.pruebaHash && body.prueba && hashPrueba_(body.prueba) === conf.pruebaHash); }
function validarQueja_(d, body) {
  const permitidos = CAMPOS_QUEJA.concat(['id', 'tipo', 'version', 'creado', 'actualizado']);
  for (const k in d) {
    if (permitidos.indexOf(k) === -1) return 'Campo no permitido en una queja: ' + k + ' (todo el contenido va cifrado).';
    if (k !== 'cifrado' && d[k] != null && (typeof d[k] !== 'string' || d[k].length > 60)) return 'Dato no permitido fuera del cifrado: ' + k + '.';
  }
  const c = d.cifrado, b64 = /^[A-Za-z0-9+/=]+$/;
  if (!c || typeof c !== 'object' || Array.isArray(c)) return 'La queja debe llegar cifrada con la clave del comité.';
  for (const k in c) if (['v', 'kid', 'iv', 'data'].indexOf(k) === -1) return 'La queja debe llegar cifrada con la clave del comité.';
  if (!b64.test(texto_(c.iv)) || !b64.test(texto_(c.data)) || !/^[0-9a-f]{6,32}$/.test(texto_(c.kid))) return 'La queja debe llegar cifrada con la clave del comité.';
  const conf = cifradoConvivencia_();
  if (!conf || !conf.actual) return 'El Comité de Convivencia todavía no tiene clave.';
  if (c.kid !== conf.actual.kid) return 'La clave del comité cambió: cierra las quejas y ábrelas con la clave nueva.';
  if (!pruebaValida_(body, conf.actual)) return 'Clave del comité incorrecta.';
  return '';
}
function quejasConKid_(kid) {
  const reg = regSheet_(), last = reg.getLastRow(); let n = 0;
  if (last < 2 || !kid) return 0;
  reg.getRange(2, 1, last - 1, COLS_REG.length).getValues().forEach(function (v) {
    if (v[1] !== 'queja' || v[11]) return;
    let r = {}; try { r = JSON.parse(v[8] || '{}'); } catch (e) {}
    if (r.kid === kid) n++;
  });
  return n;
}
/** Reglas de la clave del comité. Devuelve null si se acepta, o el error. */
function reglaCifradoComite_(antes, doc, body) {
  const A = antes.cifrado || null, N = doc.cifrado || null;
  const kA = A && A.actual ? A.actual.kid : '', kN = N && N.actual ? N.actual.kid : '';
  const aA = A && A.anterior ? A.anterior.kid : '', aN = N && N.anterior ? N.anterior.kid : '';
  const no = function (m, extra) { return Object.assign({ ok: false, error: m }, extra || {}); };
  if (!kA) {                                   // todavía no hay clave: se crea
    if (!kN) { if (N) delete doc.cifrado; return null; }
    if (aN) return no('Una clave nueva no puede traer clave anterior.');
    if (!body.pruebaNueva) return no('Falta la prueba de la clave nueva.');
    doc.cifrado = { actual: Object.assign({}, N.actual, { pruebaHash: hashPrueba_(body.pruebaNueva) }), anterior: null };
    return null;
  }
  if (!kN) return no('No se puede quitar la clave del comité.', { claveExiste: true });
  if (kN !== kA) {                             // cambio de clave
    if (!body.cambioClave) return no('El comité ya tiene una clave. Para cambiarla usa "Cambiar la clave del comité".', { claveExiste: true });
    if (body.kidBase !== kA) return no('La clave del comité ya cambió en otro equipo. Recarga la página.', { conflicto: true });
    if (aA) return no('Hay un cambio de clave sin terminar: termínalo antes de cambiarla otra vez.');
    if (!pruebaValida_(body, A.actual)) return no('Clave del comité incorrecta.');
    if (!body.pruebaNueva) return no('Falta la prueba de la clave nueva.');
    doc.cifrado = { actual: Object.assign({}, N.actual, { pruebaHash: hashPrueba_(body.pruebaNueva) }), anterior: A.actual };
    return null;
  }
  // Misma clave: el celular no puede alterarla; se conserva la del servidor.
  if (aN !== aA) {
    if (aN) return no('No se puede cambiar la clave anterior.');
    if (!pruebaValida_(body, A.actual)) return no('Clave del comité incorrecta.');
    const quedan = quejasConKid_(aA);
    if (quedan) return no('Todavía hay ' + quedan + ' queja(s) con la clave anterior.');
    doc.cifrado = { actual: A.actual, anterior: null };
    return null;
  }
  doc.cifrado = { actual: A.actual, anterior: A.anterior || null };
  return null;
}

function borrar_(body) {
  const id = texto_(body.id), fila = filaDe_(id);
  if (fila === -1) return { ok: true, id: id, noExistia: true };
  const prev = leerFila_(fila);
  const sinPermiso = puedeEscribir_(prev.tipo, 'borrar', true);
  if (sinPermiso) { registrarEvento_(id, 'BORRAR', 'RECHAZADO', sinPermiso.error, body.opId, prev.version, prev.tipo); return sinPermiso; }
  if (prev.tipo === 'comite') return { ok: false, error: 'La conformación de un comité no se borra (queda como historial).' };
  if (prev.tipo === 'queja') { const conf = cifradoConvivencia_(); if (!conf || !pruebaValida_(body, conf.actual)) return { ok: false, error: 'Clave del comité incorrecta.' }; }
  regSheet_().getRange(fila, 12).setValue('BORRADO ' + new Date().toISOString() + (body.motivo ? ' · ' + corto_(body.motivo, 200) : ''));
  try { escribirVista_(prev.tipo, id, { mes: prev.tipo === 'mes' ? JSON.parse(prev.resumen || '{}').mes : '' }, true); } catch (e) {}
  registrarEvento_(id, 'BORRAR', 'APLICADO', body.motivo || '', body.opId, prev.version, prev.tipo);
  return { ok: true, id: id };
}

/* ================= ADJUNTOS (Google Drive) =================
   El archivo va a Drive (carpeta "Adjuntos SG-SST/<tipo>") y en el registro
   queda la ficha: nombre, tamaño, quién y cuándo. Nada se borra: "quitar"
   lo marca como retirado y renombra el archivo (queda la evidencia). */
const MIME_ADJ = /^(application\/pdf|image\/(jpeg|png|webp|gif)|application\/msword|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet|presentationml\.presentation)|text\/plain|text\/csv)$/;
const MAX_ADJ = 10 * 1024 * 1024;
function carpetaRaiz_(prop, nombre) {
  const p = PropertiesService.getScriptProperties();
  const id = p.getProperty(prop);
  if (id) { try { const f = DriveApp.getFolderById(id); if (!f.isTrashed()) return f; } catch (e) { /* se borró: se crea otra */ } }
  // En el servidor único va dentro de la carpeta de la empresa.
  const c = (typeof carpeta_ === 'function') ? carpeta_().createFolder(nombre) : DriveApp.createFolder('Portal SSTA - ' + nombre);
  p.setProperty(prop, c.getId());
  return c;
}
function subcarpeta_(padre, nombre) {
  const it = padre.getFoldersByName(nombre);
  return it.hasNext() ? it.next() : padre.createFolder(nombre);
}
function nombreArchivo_(n) { return corto_(String(n || 'archivo').replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '_'), 120) || 'archivo'; }
function adjuntar_(body) {
  const id = texto_(body.id), fila = filaDe_(id);
  if (fila === -1) return { ok: false, codigoError: 'TEMPORAL', error: 'El registro todavía no ha llegado al servidor; el adjunto se reenvía solo.' };
  const prev = leerFila_(fila);
  if (prev.borrado) return { ok: false, error: 'Ese registro fue borrado.' };
  if (prev.tipo === 'queja') return { ok: false, error: 'Las quejas de convivencia no llevan adjuntos (todo va cifrado).' };
  const sinPermiso = puedeEscribir_(prev.tipo, 'parche', true);
  if (sinPermiso) { registrarEvento_(id, 'ADJUNTAR', 'RECHAZADO', sinPermiso.error, body.opId, prev.version, prev.tipo); return sinPermiso; }
  const uid = texto_(body.uid);
  if (!/^[A-Za-z0-9_-]{6,60}$/.test(uid)) return { ok: false, error: 'Identificador del adjunto inválido.' };
  const mime = texto_(body.mime).toLowerCase();
  if (!MIME_ADJ.test(mime)) return { ok: false, error: 'Tipo de archivo no permitido (PDF, imagen, Word, Excel, PowerPoint, texto o CSV).' };
  let bytes;
  try { bytes = Utilities.base64Decode(texto_(body.base64)); } catch (e) { return { ok: false, error: 'El archivo llegó dañado.' }; }
  if (!bytes.length) return { ok: false, error: 'El archivo está vacío.' };
  if (bytes.length > MAX_ADJ) return { ok: false, error: 'El archivo pasa de 10 MB.' };
  const doc = leerDoc_(id, false) || {};
  const ya = (doc.adjuntos || []).filter(function (a) { return a && a.uid === uid; })[0];
  if (ya) return { ok: true, id: id, version: prev.version, adjunto: ya, duplicado: true };
  const nombre = nombreArchivo_(body.nombre);
  const carpeta = subcarpeta_(carpetaRaiz_('CARPETA_ADJUNTOS', 'Adjuntos SG-SST'), prev.tipo);
  const archivo = carpeta.createFile(Utilities.newBlob(bytes, mime, id + ' - ' + nombre));
  const item = { uid: uid, nombre: nombre, mime: mime, tamano: bytes.length, fileId: archivo.getId(), en: new Date().toISOString(),
                 por: etiquetaUsuario_(), ref: corto_(body.ref, 60), nota: corto_(body.nota, 200) };
  const r = guardar_({ action: 'parche', tipo: prev.tipo, id: id, campos: {}, agregar: { adjuntos: [item] }, opId: body.opId, _interno: true, _sinVersion: true });
  if (!r.ok) { try { archivo.setTrashed(true); } catch (e) {} return r; }
  return Object.assign(r, { adjunto: item });
}
function quitarAdjunto_(body) {
  const id = texto_(body.id), fila = filaDe_(id);
  if (fila === -1) return { ok: false, codigoError: 'TEMPORAL', error: 'El registro todavía no ha llegado al servidor.' };
  const prev = leerFila_(fila);
  const sinPermiso = puedeEscribir_(prev.tipo, 'parche', true);
  if (sinPermiso) return sinPermiso;
  const doc = leerDoc_(id, false) || {};
  const lista = doc.adjuntos || [], it = lista.filter(function (a) { return a && a.uid === body.uid; })[0];
  if (!it) return { ok: false, error: 'Ese adjunto no está en el registro.' };
  if (it.retirado) return { ok: true, id: id, version: prev.version, duplicado: true };
  it.retirado = { en: new Date().toISOString(), por: etiquetaUsuario_(), motivo: corto_(body.motivo, 200) };
  try { const f = DriveApp.getFileById(it.fileId); f.setName('RETIRADO - ' + f.getName()); } catch (e) {}
  return guardar_({ action: 'parche', tipo: prev.tipo, id: id, campos: { adjuntos: lista }, opId: body.opId, _interno: true, _sinVersion: true });
}
function leerAdjunto_(p) {
  const id = texto_(p.id), fila = filaDe_(id);
  if (fila === -1) return { ok: false, error: 'No existe ' + id };
  const r = leerFila_(fila);
  if (r.borrado) return { ok: false, error: 'Ese registro fue borrado.' };
  if (!puedeLeer_(r.tipo)) return CTX_.u ? errPermiso_('Tu usuario no puede ver este registro.') : errSesion_();
  const doc = leerDoc_(id, false) || {};
  const it = (doc.adjuntos || []).filter(function (a) { return a && a.uid === p.uid; })[0];
  if (!it) return { ok: false, error: 'Ese adjunto no está en el registro.' };
  if (it.ref === 'medico' && !esSst_()) return errPermiso_('El concepto médico solo lo ven el administrador y SST.');
  let blob;
  try { blob = DriveApp.getFileById(it.fileId).getBlob(); } catch (e) { return { ok: false, error: 'No se encontró el archivo en Drive (¿lo borraron de la carpeta?).' }; }
  return { ok: true, nombre: it.nombre, mime: it.mime, base64: Utilities.base64Encode(blob.getBytes()) };
}

/* ================= HISTORIAL DE UN REGISTRO ================= */
function historial_(p) {
  const id = texto_(p.id), fila = filaDe_(id);
  if (fila === -1) return { ok: false, error: 'No existe ' + id };
  const r = leerFila_(fila);
  if (!puedeLeer_(r.tipo)) return CTX_.u ? errPermiso_('Tu usuario no puede ver este registro.') : errSesion_();
  const s = eventosSheet_(), filas = filasPorValor_(s, 2, id).sort(function (a, b) { return b - a; }).slice(0, 150), out = [];
  if (!filas.length) return { ok: true, id: id, eventos: [] };
  // Se leen por bloques de filas cercanas (no una lectura por fila).
  const valores = {};
  for (let i = 0; i < filas.length;) {
    let j = i; while (j + 1 < filas.length && filas[i] - filas[j + 1] < 400) j++;
    const lo = filas[j], b = s.getRange(lo, 1, filas[i] - lo + 1, 9).getValues();
    for (let k = i; k <= j; k++) valores[filas[k]] = b[filas[k] - lo];
    i = j + 1;
  }
  filas.forEach(function (n) {
    const v = valores[n];
    out.push({ ts: v[0] instanceof Date ? v[0].toISOString() : texto_(v[0]), accion: texto_(v[2]), resultado: texto_(v[3]), detalle: texto_(v[4]), version: texto_(v[6]), usuario: texto_(v[8]) });
  });
  return { ok: true, id: id, eventos: out };
}

/* Lo que ha hecho un usuario (para el administrador). */
function actividad_(p) {
  const no = soloAdmin_(); if (no) return no;
  const u = buscarUsuario_(p.usuario); if (!u) return { ok: false, error: 'No existe ese usuario.' };
  const s = eventosSheet_(), last = s.getLastRow(), out = [];
  if (last < 2 || s.getLastColumn() < 9) return { ok: true, eventos: [] };
  const filas = s.getRange(2, 9, last - 1, 1).createTextFinder('(' + u.usuario + ')').matchCase(true).findAll().map(function (r) { return r.getRow(); })
    .concat(filasPorValor_(s, 2, u.usuario)).sort(function (a, b) { return b - a; }).filter(function (x, i, l) { return l.indexOf(x) === i; }).slice(0, 150);
  filas.forEach(function (n) {
    const v = s.getRange(n, 1, 1, 9).getValues()[0];
    out.push({ ts: v[0] instanceof Date ? v[0].toISOString() : texto_(v[0]), ref: texto_(v[1]) + (v[7] ? ' (' + texto_(v[7]) + ')' : ''), accion: texto_(v[2]), resultado: texto_(v[3]), detalle: texto_(v[4]), version: texto_(v[6]), usuario: '' });
  });
  return { ok: true, eventos: out };
}

/* ================= RESPALDO SEMANAL ================= */
function idDeHoja_(x) { const m = /\/d\/([A-Za-z0-9_-]{20,})/.exec(String(x)); return m ? m[1] : String(x || '').trim(); }
function librosParaRespaldar_() {
  const ids = [libro_().getId()];
  const sumar = function (x) { const id = idDeHoja_(x); if (id && /^[A-Za-z0-9_-]{10,}$/.test(id) && ids.indexOf(id) === -1) ids.push(id); };
  RESPALDAR_TAMBIEN.forEach(sumar);
  if (typeof librosDelPortal_ === 'function') librosDelPortal_().forEach(sumar);   // servidor único: todos los módulos
  return ids;
}
/** ▶ Lo corre el activador cada domingo (o "Respaldar ahora" en el portal). */
function respaldoSemanal() {
  const hoy = hoyISO_(), carpeta = carpetaRaiz_('CARPETA_RESPALDOS', 'Respaldos SG-SST'), hechos = [], errores = [];
  librosParaRespaldar_().forEach(function (id) {
    try { const f = DriveApp.getFileById(id); f.makeCopy(f.getName() + ' — respaldo ' + hoy, carpeta); hechos.push(f.getName()); }
    catch (e) { errores.push(id + ': ' + e.message); }
  });
  let depurados = 0; try { depurados = depurarRespaldos_(carpeta, hoy); } catch (e) { errores.push('Depurar: ' + e.message); }
  const estado = { fecha: hoy, en: new Date().toISOString(), libros: hechos.length, nombres: hechos, errores: errores, depurados: depurados };
  PropertiesService.getScriptProperties().setProperty('RESPALDO_ULTIMO', JSON.stringify(estado));
  registrarEvento_('', 'RESPALDO', errores.length ? 'CON ERRORES' : 'APLICADO', hechos.length + ' hoja(s) copiadas' + (errores.length ? ' · errores: ' + errores.join(' | ') : ''), '', '', 'respaldo');
  if (errores.length) { const dest = correos_(); if (dest.length) try { MailApp.sendEmail(dest.join(','), '⚠ Respaldo del SG-SST con errores — ' + hoy, 'No se pudieron copiar:\n· ' + errores.join('\n· ')); } catch (e) {} }
  console.log('Respaldo: ' + hechos.length + ' hoja(s) en ' + carpeta.getUrl() + (errores.length ? '\nErrores: ' + errores.join('\n') : ''));
  return estado;
}
/* Se conservan los respaldos de las últimas 8 semanas y, para siempre, el
   primero de cada mes de cada hoja. Los demás van a la papelera de Drive. */
function depurarRespaldos_(carpeta, hoy) {
  const limite = sumarDias_(hoy, -56), it = carpeta.getFiles(), grupos = {};
  while (it.hasNext()) {
    const f = it.next(), m = /^(.*) — respaldo (\d{4}-\d{2}-\d{2})$/.exec(f.getName());
    if (!m) continue;
    const k = m[1] + '|' + m[2].slice(0, 7);
    (grupos[k] = grupos[k] || []).push({ f: f, fecha: m[2] });
  }
  let n = 0;
  Object.keys(grupos).forEach(function (k) {
    const l = grupos[k].sort(function (a, b) { return a.fecha < b.fecha ? -1 : 1; });
    l.slice(1).forEach(function (x) { if (x.fecha < limite) { x.f.setTrashed(true); n++; } });
  });
  return n;
}
function protegerBitacora_() {
  try {
    const p = eventosSheet_().protect().setDescription('Bitácora del SG-SST: no se edita a mano');
    p.removeEditors(p.getEditors());
    if (p.canDomainEdit()) p.setDomainEdit(false);
  } catch (e) { console.log('No se pudo proteger la bitácora: ' + e.message); }
}
/** ▶ Ejecutar una vez (pide permiso de Google Drive): respaldo cada domingo
 *  a las 2 a. m. y protege la bitácora. Hace el primer respaldo de una vez. */
function instalarRespaldo(sinCopiaAhora) {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'respaldoSemanal') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('respaldoSemanal').timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.SUNDAY).atHour(2).create();
  PropertiesService.getScriptProperties().setProperty('RESPALDO_INSTALADO', '1');
  protegerBitacora_();
  if (sinCopiaAhora === true) return 'Respaldo programado (domingos, 2 a. m.).';
  return respaldoSemanal();
}
/* "Respaldar ahora" desde el portal: el administrador; sin usuarios, máximo uno cada 6 horas. */
function respaldarAhora_() {
  if (CTX_.modo) { const no = soloAdmin_(); if (no) return no; }
  else {
    let u = null; try { u = JSON.parse(PropertiesService.getScriptProperties().getProperty('RESPALDO_ULTIMO') || 'null'); } catch (e) {}
    if (u && u.en && Date.now() - new Date(u.en).getTime() < 6 * 3600000) return { ok: false, error: 'Ya se hizo un respaldo hace menos de 6 horas.' };
  }
  return Object.assign({ ok: true }, respaldoSemanal());
}
function estadoRespaldo_() {
  const p = PropertiesService.getScriptProperties();
  let u = null; try { u = JSON.parse(p.getProperty('RESPALDO_ULTIMO') || 'null'); } catch (e) {}
  let url = ''; try { const id = p.getProperty('CARPETA_RESPALDOS'); if (id) url = DriveApp.getFolderById(id).getUrl(); } catch (e) {}
  return { ok: true, instalado: p.getProperty('RESPALDO_INSTALADO') === '1', ultimo: u, carpeta: url, libros: librosParaRespaldar_().length };
}

/* ================= LECTURA ================= */
function doGet(e) {
  CTX_ = { modo: false, u: null, colUsuario: false };
  const p = e.parameter || {};
  if (!checkToken_(p.token)) return jsonOut_({ ok: false, error: 'Clave del portal incorrecta o faltante (Token inválido).', codigoError: 'CLAVE' });
  iniciarContexto_(p.sesion);
  if (p.action === 'ping') return jsonOut_({ ok: true, servicio: 'SG-SST', version: VERSION_SGSST, usuarios: CTX_.modo, yo: yo_() });
  if (p.action === 'sal') return jsonOut_(Object.assign({ ok: true }, salDe_(p.usuario)));
  if (p.action === 'historial') return jsonOut_(historial_(p));
  if (p.action === 'actividad') return jsonOut_(actividad_(p));
  if (p.action === 'adjunto') return jsonOut_(leerAdjunto_(p));

  if (p.action === 'list' || p.list) {
    const tipos = texto_(p.tipo).split(',').filter(Boolean);
    // Sin usuario solo se lee el personal habilitado (lo consultan los permisos en campo).
    const libre = tipos.length === 1 && tipos[0] === 'trabajador';
    if (CTX_.modo && !CTX_.u && !libre) return jsonOut_(errSesion_());
    const reg = regSheet_(), last = reg.getLastRow(), rows = [];
    if (last >= 2) {
      reg.getRange(2, 1, last - 1, COLS_REG.length).getValues().forEach(function (v) {
        if (!v[0] || v[11]) return;
        if (tipos.length && tipos.indexOf(v[1]) === -1) return;
        if (CTX_.u && !puedeLeer_(v[1])) return;
        let res = {}; try { res = JSON.parse(v[8] || '{}'); } catch (err) {}
        if (v[1] === 'trabajador' && CTX_.modo && !esSst_()) sinRestricciones_(res.req);
        rows.push({ id: v[0], tipo: v[1], version: v[2], estado: v[3], fecha: fechaISO_(v[4]), titulo: v[5], responsable: v[6], vence: fechaISO_(v[7]),
                    resumen: res, actualizado: v[10] instanceof Date ? v[10].toISOString() : texto_(v[10]), creado: v[9] instanceof Date ? v[9].toISOString() : texto_(v[9]) });
      });
    }
    return jsonOut_(CTX_.modo ? { ok: true, rows: rows, usuarios: true, yo: yo_() } : { ok: true, rows: rows });
  }

  if (p.action === 'doc' || p.id) {
    const id = texto_(p.id), fila = filaDe_(id);
    if (fila === -1) return jsonOut_({ ok: false, error: 'No existe ' + id });
    const r = leerFila_(fila);
    if (r.borrado) return jsonOut_({ ok: false, error: 'Ese registro fue borrado.', borrado: true });
    if (!puedeLeer_(r.tipo)) return jsonOut_(CTX_.u ? errPermiso_('Tu usuario no puede ver este registro.') : errSesion_());
    const doc = leerDoc_(id, true);
    if (!doc) return jsonOut_({ ok: false, error: 'No se pudo leer ' + id });
    if (r.tipo === 'trabajador' && CTX_.modo && !esSst_()) sinRestricciones_(doc.requisitos);
    return jsonOut_({ ok: true, id: id, version: r.version, doc: doc });
  }

  // ¿Ya se aplicó este envío? (la cola sin señal lo pregunta antes de reenviar)
  if (p.action === 'opAplicado') return jsonOut_({ ok: true, aplicado: opIdYaAplicado_(texto_(p.opId)) });
  if (p.action === 'usuarios') { const no = soloAdmin_(); return jsonOut_(no || { ok: true, usuarios: leerUsuarios_().map(publicoUsuario_), roles: ROLES, yo: yo_() }); }
  if (p.action === 'respaldo') { if (CTX_.modo && !esSst_()) return jsonOut_(CTX_.u ? errPermiso_('Solo Administrador o SST.') : errSesion_()); return jsonOut_(estadoRespaldo_()); }

  return jsonOut_({ ok: false, error: 'Acción no reconocida.' });
}

/* ================= AVISOS POR CORREO ================= */
function correos_() { return CORREOS_AVISO.filter(function (c) { return c && c.indexOf('pon-aqui') === -1 && c.indexOf('@empresa.com') === -1; }); }
function avisarAccidente_(id, d) {
  const dest = correos_(); if (!dest.length) return;
  const limite = sumarHabiles_(texto_(d.fecha) || hoyISO_(), 2);
  const cuerpo = 'Se reportó un ACCIDENTE DE TRABAJO en el Portal SSTA.\n\n' +
    'Registro: ' + id + '\nFecha: ' + texto_(d.fecha) + ' ' + texto_(d.hora) + '\nLugar: ' + texto_(d.lugar) + '\n' +
    'Lesionado: ' + texto_(d.lesionado && d.lesionado.nombre) + ' (' + texto_(d.lesionado && d.lesionado.cedula) + ')\n\n' +
    'Descripción:\n' + texto_(d.descripcion) + '\n\n' +
    '⚠ Reporte a la ARL (FURAT): a más tardar el ' + limite + ' (2 días hábiles).\n' +
    '⚠ Investigación (Res. 1401 de 2007): dentro de los 15 días siguientes, a más tardar el ' + sumarDias_(texto_(d.fecha) || hoyISO_(), 15) + '.' +
    (d.grave || d.mortal ? '\n⚠ Accidente GRAVE o MORTAL: la investigación se remite a la ARL y, si es mortal, también a la Dirección Territorial del Ministerio de Trabajo.' : '');
  try { MailApp.sendEmail(dest.join(','), '⚠ Accidente de trabajo reportado — ' + id, cuerpo); } catch (e) {}
}

/* ── Tareas que deja el asesor SST externo (panel del asesor) ──
   Cuando el asesor deja una tarea en este portal, le llega un correo al responsable;
   cuando la empresa la cierra, le llega al asesor para que la verifique; y el correo
   diario recuerda las que están por vencer o vencidas. Los destinatarios salen SOLO de
   lo que conoce este servidor (perfil de la empresa, usuarios y CORREOS_AVISO): nunca
   de lo que mande el celular. Tope diario de correos inmediatos para evitar abusos. */
const ORIGEN_ASESOR_ = 'Asesor SST';
const TOPE_CORREOS_TAREA_ = 30;
/** Quién puede disparar el correo de una tarea nueva: con usuarios, solo Administrador o SST
 *  (el asesor entra con rol SST); sin usuarios, solo si el portal tiene su propia clave
 *  (con el token de fábrica, que es público, no sale ningún correo). */
function puedeAvisarTarea_() {
  if (CTX_.modo) return !!(CTX_.u && (CTX_.u.rol === 'admin' || CTX_.u.rol === 'sst'));
  return !!claveConfigurada_();
}
function correoValido_(c) { c = texto_(c).trim(); return /^[^\s@,;<>"]+@[^\s@,;<>"]+\.[^\s@,;<>"]{2,}$/.test(c) && c.length <= 120 ? c.toLowerCase() : ''; }
function normNombre_(t) { return texto_(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim(); }
function perfilEmpresa_() { try { return filaDe_('EMPRESA-PERFIL') === -1 ? {} : (leerDoc_('EMPRESA-PERFIL', false) || {}); } catch (e) { return {}; } }
/** Para quién es el aviso de una tarea: el responsable del SG-SST del perfil y el usuario
 *  que se llame como el responsable; si no hay ninguno, CORREOS_AVISO. Copia: el asesor. */
function destinosTarea_(responsable, perfil) {
  const para = [], add = function (c) { c = correoValido_(c); if (c && para.indexOf(c) === -1) para.push(c); };
  add(perfil.correoSST);
  const n = normNombre_(responsable);
  if (n) leerUsuarios_().forEach(function (u) { if (u.activo !== false && String(u.activo).toUpperCase() !== 'NO' && normNombre_(u.nombre) === n) add(u.correo); });
  if (!para.length) correos_().forEach(add);
  const cc = correoValido_(perfil.correoAsesor);
  return { para: para, cc: cc && para.indexOf(cc) === -1 ? cc : '' };
}
function cupoCorreoTarea_() {
  const pr = PropertiesService.getScriptProperties(), hoy = hoyISO_();
  let c = null; try { c = JSON.parse(pr.getProperty('CORREOS_TAREA') || 'null'); } catch (e) {}
  if (!c || c.fecha !== hoy) c = { fecha: hoy, n: 0 };
  if (c.n >= TOPE_CORREOS_TAREA_) return false;
  c.n++; pr.setProperty('CORREOS_TAREA', JSON.stringify(c));
  return true;
}
function nombreEmpresa_(perfil) { return texto_(perfil.nombre) || 'la empresa'; }
function avisarTareaAsesor_(id, d, que) {
  const perfil = perfilEmpresa_(), emp = nombreEmpresa_(perfil);
  // Tareas creadas en lote ("Tareas de sus estándares"): un solo correo, al llegar la última.
  const lote = corto_(d.lote, 40), n = Number(d.loteN) || 0;
  if (que === 'nueva' && lote && n > 1) {
    if (Number(d.loteI) !== n) return false;
    const reg = regSheet_(), last = reg.getLastRow(), titulos = [];
    if (last >= 2) reg.getRange(2, 1, last - 1, COLS_REG.length).getValues().forEach(function (v) {
      if (v[1] !== 'accion' || v[11]) return; let r = {}; try { r = JSON.parse(v[8] || '{}'); } catch (e) { return; }
      if (r.lote === lote) titulos.push('· ' + corto_(r.accion, 160) + (r.fechaCompromiso ? ' (para el ' + r.fechaCompromiso + ')' : ''));
    });
    if (titulos.indexOf('· ' + corto_(d.accion, 160) + (d.fechaCompromiso ? ' (para el ' + texto_(d.fechaCompromiso) + ')' : '')) === -1) titulos.push('· ' + corto_(d.accion, 160));
    const dst = destinosTarea_(d.responsable, perfil);
    if (!dst.para.length || !cupoCorreoTarea_()) return false;
    MailApp.sendEmail(dst.para.join(','), titulos.length + ' tareas nuevas de tu asesor SST', 'Hola,\n\n' + corto_(d.asignadaPor, 80) + ' dejó ' + titulos.length + ' tareas en el SG-SST de ' + emp + ' (responsable: ' + corto_(d.responsable, 60) + '):\n\n' +
      titulos.slice(0, 80).join('\n') + (titulos.length > 80 ? '\n…' : '') + '\n\nPara verlas, anotar avances y cerrarlas con su evidencia: Portal SSTA → Plan de acción.\n\nCorreo automático del Portal SSTA.', dst.cc ? { cc: dst.cc } : {});
    registrarEvento_(id, 'CORREO', 'APLICADO', 'Aviso de ' + titulos.length + ' tareas (lote) a ' + dst.para.concat(dst.cc ? [dst.cc] : []).join(', '), '', '', 'accion');
    return true;
  }
  const datos = 'Tarea: ' + corto_(d.accion, 300) + '\n' + (d.hallazgo ? 'Detalle: ' + corto_(d.hallazgo, 800) + '\n' : '') +
    'Responsable: ' + corto_(d.responsable, 80) + '\nFecha límite: ' + corto_(d.fechaCompromiso, 12) + '\nPrioridad: ' + corto_(d.prioridad, 12) + '\nRegistro: ' + id + '\n';
  let para, cc = '', asunto, cuerpo;
  if (que === 'nueva') {
    const dst = destinosTarea_(d.responsable, perfil); para = dst.para; cc = dst.cc;
    asunto = 'Nueva tarea de tu asesor SST — ' + corto_(d.accion, 70);
    cuerpo = 'Hola,\n\n' + (corto_(d.asignadaPor, 80) || 'Tu asesor SST') + ' dejó una tarea en el SG-SST de ' + emp + '.\n\n' + datos +
      '\nPara verla, anotar avances y cerrarla con su evidencia: Portal SSTA → Plan de acción.\n\nCorreo automático del Portal SSTA.';
  } else {
    para = [correoValido_(perfil.correoAsesor)].filter(String);
    asunto = 'Tarea cerrada en ' + emp + ' — por verificar';
    const ci = d.cierre || {};
    cuerpo = emp + ' cerró una tarea que dejaste.\n\n' + datos + '\nCierre: ' + corto_(ci.fecha, 12) + (ci.descripcion || ci.evidencia ? ' — ' + corto_(ci.descripcion || ci.evidencia, 400) : '') + (ci.eficaz ? '\nEficaz: ' + corto_(ci.eficaz, 20) : '') +
      '\n\nVerifícala desde el panel del asesor (Verificar o Reabrir).\n\nCorreo automático del Portal SSTA.';
  }
  if (!para.length || !cupoCorreoTarea_()) return false;
  const op = cc ? { cc: cc } : {};
  MailApp.sendEmail(para.join(','), asunto, cuerpo, op);
  registrarEvento_(id, 'CORREO', 'APLICADO', 'Aviso de tarea (' + que + ') a ' + para.concat(cc ? [cc] : []).join(', '), '', '', 'accion');
  return true;
}
/** Parte del correo diario: tareas del asesor que vencen en 3 días o están vencidas
 *  (se recuerdan el día siguiente al vencimiento y luego cada 7 días). Un correo por destinatario. */
function avisoTareasAsesor_() {
  const reg = regSheet_(), last = reg.getLastRow(); if (last < 2) return 0;
  const hoy = hoyISO_(), en3 = sumarDias_(hoy, 3), perfil = perfilEmpresa_(), grupos = {};
  reg.getRange(2, 1, last - 1, COLS_REG.length).getValues().forEach(function (v) {
    if (!v[0] || v[11] || v[1] !== 'accion' || v[3] === 'CERRADA') return;
    let r = {}; try { r = JSON.parse(v[8] || '{}'); } catch (e) { return; }
    if (r.origen !== ORIGEN_ASESOR_ || !/^\d{4}-\d{2}-\d{2}$/.test(texto_(r.fechaCompromiso))) return;
    const f = r.fechaCompromiso; let linea = '';
    if (f === en3) linea = 'Vence el ' + f + ' (en 3 días): ';
    else if (f < hoy) { const dias = Math.round((new Date(hoy + 'T12:00:00Z') - new Date(f + 'T12:00:00Z')) / 864e5); if (dias % 7 === 1) linea = 'VENCIDA hace ' + dias + ' día(s) (' + f + '): '; }
    if (!linea) return;
    const dst = destinosTarea_(r.responsable, perfil), k = dst.para.join(',') + '|' + dst.cc;
    if (!dst.para.length) return;
    (grupos[k] = grupos[k] || { dst: dst, l: [] }).l.push('· ' + linea + corto_(r.accion, 160) + ' — ' + corto_(r.responsable, 60));
  });
  let n = 0;
  Object.keys(grupos).forEach(function (k) {
    const g = grupos[k];
    MailApp.sendEmail(g.dst.para.join(','), 'Tareas de tu asesor SST en ' + nombreEmpresa_(perfil) + ': ' + g.l.length + ' por atender',
      'Estas tareas que dejó tu asesor SST necesitan atención:\n\n' + g.l.join('\n') + '\n\nPortal SSTA → Plan de acción (anota el avance o ciérrala con su evidencia).\n\nCorreo automático del Portal SSTA.', g.dst.cc ? { cc: g.dst.cc } : {});
    n++;
  });
  return n;
}

/** ▶ Ejecutar una vez: correo diario (6:00 a. m.) con lo que vence. */
function instalarAvisosDiarios() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'avisoDiario') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('avisoDiario').timeBased().everyDays(1).atHour(6).inTimezone('America/Bogota').create();
  console.log('Listo: el aviso diario sale a las 6 a. m. a ' + correos_().join(', '));
}
/** Lo que vence: requisitos del personal, equipos, acciones, FURAT e investigaciones,
 *  periodos y reuniones de los comités, plazos de quejas (solo el código) y auditorías. */
function avisoDiario() {
  let tareas = 0; try { tareas = avisoTareasAsesor_(); } catch (e) { console.log('Avisos de tareas del asesor: ' + e.message); }
  const dest = correos_(); if (!dest.length) return 'Sin correos configurados.' + (tareas ? ' Avisos de tareas del asesor: ' + tareas + '.' : '');
  const hoy = hoyISO_(), en15 = sumarDias_(hoy, 15), lineas = { vencido: [], pronto: [] };
  const comites = {}, reunidos = {}, gen = [], epp = {}, reportesAnuales = {}, inspHechas = [], progs = [];
  const reg = regSheet_(), last = reg.getLastRow();
  if (last < 2) return 'Nada que revisar.';
  reg.getRange(2, 1, last - 1, COLS_REG.length).getValues().forEach(function (v) {
    if (!v[0] || v[11]) return;
    let r = {}; try { r = JSON.parse(v[8] || '{}'); } catch (e) {}
    const tipo = v[1];
    const anotar = function (fecha, txt) { if (!fecha) return; if (fecha < hoy) lineas.vencido.push(txt + ' (venció ' + fecha + ')'); else if (fecha <= en15) lineas.pronto.push(txt + ' (vence ' + fecha + ')'); };
    if (tipo === 'trabajador' && r.activo !== false) Object.keys(r.req || {}).forEach(function (k) { anotar(r.req[k].vence, r.nombre + ' — ' + k); });
    if (tipo === 'equipo' && r.activo !== false) Object.keys(r.vencimientos || {}).forEach(function (k) { anotar(r.vencimientos[k], (r.codigo || r.nombre) + ' — ' + k); });
    if (tipo === 'accion' && v[3] !== 'CERRADA') anotar(r.fechaCompromiso, 'Acción: ' + corto_(r.accion || r.hallazgo, 90) + ' — ' + r.responsable);
    if (tipo === 'reporte' && r.clase === 'Accidente de trabajo') {
      if (!r.furat.radicado) anotar(sumarHabiles_(r.fecha, 2), 'FURAT pendiente ' + v[0]);
      if (r.investigacion.estado !== 'CERRADA') anotar(sumarDias_(r.fecha, 15), 'Investigación pendiente ' + v[0]);
    }
    if (tipo === 'reporte' && r.clase === 'Incidente' && r.investigacion.estado !== 'CERRADA') anotar(sumarDias_(r.fecha, 15), 'Investigación de incidente ' + v[0]);
    if (tipo === 'comite' && r.periodo) {
      comites[r.comite] = true;
      const f = r.periodo.fin, nom = NOMBRE_COMITE_[r.comite] || r.comite;
      // La elección toma tiempo: se avisa 45 días antes.
      if (f && f < hoy) lineas.vencido.push(nom + ': el periodo venció el ' + f + ' (hay que elegir el nuevo)');
      else if (f && f <= sumarDias_(hoy, 45)) lineas.pronto.push(nom + ': el periodo vence el ' + f + ' (organizar la elección)');
    }
    if (tipo === 'reunion' && r.tipo === 'Ordinaria' && texto_(r.fecha).slice(0, 7) === hoy.slice(0, 7)) reunidos[r.comite] = true;
    if (tipo === 'queja' && r.estado === 'ABIERTA') {
      // Solo el código: el contenido de la queja es reservado.
      anotar(r.venceEtapa, 'Convivencia ' + r.codigo + ' — ' + r.etapa);
      anotar(r.venceTotal, 'Convivencia ' + r.codigo + ' — límite de 65 días');
    }
    if (tipo === 'auditoria' && r.estado === 'PROGRAMADA') anotar(r.fechaPlan, 'Auditoría: ' + r.titulo);
    if (AVISO_GEN[tipo] && v[7]) gen.push({ tipo: tipo, r: r, v: v });
    if (tipo === 'reporteanual' && r.fechaRegistro) reportesAnuales[String(r.anio)] = true;
    if (tipo === 'inspeccion') inspHechas.push({ progId: r.progId || '', tipo: r.tipoInspeccion || '', plantilla: r.plantilla || '', equipo: r.equipoId || '', mes: texto_(r.fecha).slice(0, 7) });
    if (tipo === 'proginsp' && r.activo !== false) progs.push({ id: v[0], r: r });
    // EPP: de cada persona y elemento cuenta la ÚLTIMA entrega ("Casco|2027-03-01; Guantes|…").
    if (tipo === 'entrega') String(r.vencimientos || '').split(/\s*;\s*/).forEach(function (x) {
      const p = x.split('|'); if (p.length < 2 || !/^\d{4}-\d{2}-\d{2}$/.test(p[1])) return;
      const k = (String(r.cedula || '').replace(/[^0-9A-Za-z]/g, '') || r.nombre) + '|' + p[0].toLowerCase(), f = fechaISO_(v[4]);
      if (!epp[k] || f > epp[k].f) epp[k] = { f: f, vence: p[1], txt: 'Reponer EPP: ' + p[0] + ' de ' + r.nombre };
    });
  });
  // De exámenes, baterías, políticas y mediciones solo cuenta el MÁS RECIENTE de cada persona o tema
  // (un examen viejo ya reemplazado no debe salir vencido todos los días).
  const ultimo = {};
  gen.forEach(function (g) {
    const ced = function (c) { return String(c || '').replace(/[^0-9A-Za-z]/g, '').toUpperCase(); };
    const r = g.r, k = g.tipo === 'examen' ? 'ex|' + (ced(r.cedula) || g.v[5]) : g.tipo === 'psico' ? 'psico' : g.tipo === 'politica' ? 'politica' : g.tipo === 'medicion' ? 'med|' + r.agente + '|' + r.area :
      g.tipo === 'induccion' ? 'ind|' + (ced(r.cedula) || g.v[5]) : g.tipo === 'pesv' ? 'pesv' : g.tipo === 'programa' ? 'prog|' + r.programa : g.v[0];
    if (!ultimo[k] || fechaISO_(g.v[4]) > fechaISO_(ultimo[k].v[4])) ultimo[k] = g;
  });
  Object.keys(ultimo).forEach(function (k) {
    const g = ultimo[k], r = g.r;
    if (/BAJA|OBSOLETO|INACTIVO|IMPLEMENTADO|CERRAD[OA]|RECHAZADO|FUERA DE USO|RESPONDIDA|TRATAD[OA]/i.test(texto_(g.v[3]))) return;
    if ((g.tipo === 'examen' && r.tipoExamen === 'Egreso') || (g.tipo === 'proveedor' && r.activo === false) || (g.tipo === 'legal' && r.vigente === 'No') ||
        (g.tipo === 'induccion' && (r.tipoInduccion === 'Visitante' || r.resultado !== 'APROBADA'))) return;
    const f = fechaISO_(g.v[7]), txt = AVISO_GEN[g.tipo] + ': ' + texto_(g.v[5]);
    if (f < hoy) lineas.vencido.push(txt + ' (venció ' + f + ')'); else if (f <= en15) lineas.pronto.push(txt + ' (vence ' + f + ')');
  });
  Object.keys(epp).forEach(function (k) { const e = epp[k]; if (e.vence < hoy) lineas.vencido.push(e.txt + ' (venció ' + e.vence + ')'); else if (e.vence <= en15) lineas.pronto.push(e.txt + ' (vence ' + e.vence + ')'); });
  // Reporte anual de estándares mínimos (Res. 0312): del 15 de noviembre en adelante, si no se ha registrado el del año.
  if (hoy.slice(5) >= '11-15') {
    const anio = hoy.slice(0, 4);
    if (!reportesAnuales[anio]) lineas.pronto.push('Estándares mínimos ' + anio + ': registrar la autoevaluación y el plan de mejoramiento (revisa la fecha límite que fije el Ministerio del Trabajo)');
  }
  // El respaldo semanal debe estar al día (si se instaló).
  const pr = PropertiesService.getScriptProperties();
  if (pr.getProperty('RESPALDO_INSTALADO') === '1') {
    let u = null; try { u = JSON.parse(pr.getProperty('RESPALDO_ULTIMO') || 'null'); } catch (e) {}
    if (!u || !u.fecha || u.fecha < sumarDias_(hoy, -9)) lineas.vencido.push('Respaldo semanal de las hojas: no se hace desde ' + (u && u.fecha ? u.fecha : 'su instalación') + ' (revisa el activador "respaldoSemanal")');
    else if (u.errores && u.errores.length) lineas.pronto.push('El último respaldo (' + u.fecha + ') tuvo errores: ' + u.errores.join(' | '));
  }
  // Programa de inspecciones gerenciales / del COPASST: desde el día 20 se avisa lo del mes sin hacer;
  // los primeros 5 días del mes, lo del mes anterior que quedó sin hacer.
  const dia = Number(hoy.slice(8, 10)), mesAnt = sumarDias_(hoy.slice(0, 8) + '01', -1).slice(0, 7);
  const revisarProg = function (mes, vencido) {
    progs.forEach(function (p) {
      const r = p.r, lista = String(r.meses || '').split(/\s*,\s*/).filter(String);
      // Meses "AAAA-MM" (o, en registros viejos, números del 1 al 12 del año "anio").
      const toca = lista.indexOf(mes) !== -1 || (String(r.anio) === mes.slice(0, 4) && lista.some(function (x) { return /^\d{1,2}$/.test(x) && Number(x) === Number(mes.slice(5, 7)); }));
      if (!toca) return;
      const hecha = inspHechas.some(function (h) { return h.mes === mes && (h.progId === p.id || (!h.progId && !h.equipo && r.tipoInspeccion && r.tipoInspeccion !== 'Rutinaria' && h.tipo === r.tipoInspeccion && h.plantilla === r.plantilla)); });
      if (hecha) return;
      const txt = 'Inspección ' + (r.tipoInspeccion || 'programada').toLowerCase() + ' de ' + mes + ' sin hacer: ' + texto_(r.titulo) + (r.responsable ? ' — ' + r.responsable : '');
      (vencido ? lineas.vencido : lineas.pronto).push(txt);
    });
  };
  if (dia >= 20) revisarProg(hoy.slice(0, 7), false);
  if (dia <= 5) revisarProg(mesAnt, true);
  if (Number(hoy.slice(8, 10)) >= 20) Object.keys(comites).forEach(function (c) { if (!reunidos[c]) lineas.pronto.push((NOMBRE_COMITE_[c] || c) + ': falta la reunión ordinaria de este mes'); });
  if (!lineas.vencido.length && !lineas.pronto.length) return 'Nada vence en los próximos 15 días.';
  const cuerpo = (lineas.vencido.length ? 'VENCIDO (' + lineas.vencido.length + '):\n· ' + lineas.vencido.join('\n· ') + '\n\n' : '') +
    (lineas.pronto.length ? 'VENCE EN LOS PRÓXIMOS 15 DÍAS (' + lineas.pronto.length + '):\n· ' + lineas.pronto.join('\n· ') + '\n' : '');
  MailApp.sendEmail(dest.join(','), 'SG-SST: ' + lineas.vencido.length + ' vencido(s), ' + lineas.pronto.length + ' por vencer — ' + hoy, cuerpo);
  return 'Aviso enviado.';
}


    return {
      doGet: doGet,
      doPost: doPost,
      libro: __entorno.libro,
      funciones: { verLibro: verLibro, codigoAdministrador: codigoAdministrador, respaldoSemanal: respaldoSemanal, instalarRespaldo: instalarRespaldo, instalarAvisosDiarios: instalarAvisosDiarios, avisoDiario: avisoDiario }
    };
  })();
  return __sgsst;
}
(globalThis.MODULOS_PORTAL = globalThis.MODULOS_PORTAL || {})['sgsst'] = modulo_sgsst_;

/* Funciones de mantenimiento de "sgsst" (menú ▶ Ejecutar del editor). */
function sgsst__verLibro() { return modulo_sgsst_().funciones.verLibro.apply(null, arguments); }
function sgsst__codigoAdministrador() { return modulo_sgsst_().funciones.codigoAdministrador.apply(null, arguments); }
function sgsst__respaldoSemanal() { return modulo_sgsst_().funciones.respaldoSemanal.apply(null, arguments); }
function sgsst__instalarRespaldo() { return modulo_sgsst_().funciones.instalarRespaldo.apply(null, arguments); }
function sgsst__instalarAvisosDiarios() { return modulo_sgsst_().funciones.instalarAvisosDiarios.apply(null, arguments); }
function sgsst__avisoDiario() { return modulo_sgsst_().funciones.avisoDiario.apply(null, arguments); }
