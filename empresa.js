/* ============================================================
   empresa.js — CARC S.A.S. (empresa demo)
   Generado con configurar-empresa.html el 6/10/2026, 11:01:28 a. m..
   Para cambiar algo, vuelve a abrir configurar-empresa.html en este sitio:
   el formulario carga estos mismos datos.
   ============================================================ */

const EMPRESA = {
  "demoUsuarios": [
    [
      "sandra.sst",
      "Demo2026",
      "Administradora (SST)"
    ],
    [
      "jorge.obra",
      "Demo2026",
      "Supervisor de obra"
    ],
    [
      "gerencia",
      "Demo2026",
      "Solo consulta"
    ]
  ],
  "nombre": "CARC S.A.S. (empresa demo)",
  "nombreCorto": "CARLOS RIOS",
  "nit": "900.000.000-0",
  "subtitulo": "Sistema de Gestión SST",
  "logo": "data:image/jpeg;base64,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",
  "colorMarca": "#0cd3ed",
  "formatos": {
    "SSTA-F-005": {
      "codigo": "MA-SST-F-12",
      "titulo": "Control de asistencia a capacitación, eventos y reuniones",
      "version": "2",
      "fecha": "15/01/2025",
      "actualizacion": "10-06-2026"
    },
    "SSTA-F-006": {
      "codigo": "MA-SST-F-20",
      "titulo": "Inspección de EPP",
      "version": "6",
      "fecha": "",
      "actualizacion": ""
    },
    "SSTA-F-007": {
      "codigo": "MA-SST-F-03",
      "titulo": "Análisis de Trabajo Seguro (ATS)",
      "version": "4",
      "fecha": "19/10/2016",
      "actualizacion": ""
    },
    "SSTA-F-116": {
      "codigo": "MA-SST-F-31",
      "titulo": "Permiso de trabajo en alturas",
      "version": "3",
      "fecha": "",
      "actualizacion": ""
    },
    "SSTA-F-117": {
      "codigo": "MA-SST-F-32",
      "titulo": "Permiso de espacios confinados",
      "version": "2",
      "fecha": "24/01/2022",
      "actualizacion": "25/01/2023"
    },
    "SSTA-F-118": {
      "codigo": "MA-SST-F-33",
      "titulo": "Permiso de izajes de cargas",
      "version": "2",
      "fecha": "15/05/2017",
      "actualizacion": "25/01/2023"
    },
    "SSTA-F-119": {
      "codigo": "MA-SST-F-30",
      "titulo": "Permiso de trabajo en caliente",
      "version": "2",
      "fecha": "15/05/2017",
      "actualizacion": "25/01/2023"
    },
    "SSTA-F-147": {
      "codigo": "MA-SST-F-21",
      "titulo": "Inspección de EPP de brigadistas",
      "version": "1",
      "fecha": "",
      "actualizacion": ""
    },
    "SSTA-F-149": {
      "codigo": "MA-SST-F-35",
      "titulo": "Anexo de personal autorizado",
      "version": "",
      "fecha": "",
      "actualizacion": ""
    },
    "SSTA-F-180": {
      "codigo": "MA-SST-F-34",
      "titulo": "Permiso de trabajo eléctrico",
      "version": "1",
      "fecha": "10/04/2025",
      "actualizacion": ""
    },
    "SG-REPORTE": {
      "codigo": "MA-SST-F-40",
      "titulo": "Reporte e investigación de actos, condiciones, incidentes y accidentes",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PLAN": {
      "codigo": "MA-SST-F-41",
      "titulo": "Plan de acción del SG-SST",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-HABILITACION": {
      "codigo": "MA-SST-F-42",
      "titulo": "Estado de habilitación del personal",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-INSPECCION": {
      "codigo": "MA-SST-F-43",
      "titulo": "Inspección planeada / preoperacional",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-INVENTARIO": {
      "codigo": "MA-SST-F-44",
      "titulo": "Inventario de equipos e inspecciones",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-INDICADORES": {
      "codigo": "MA-SST-F-45",
      "titulo": "Informe de indicadores del SG-SST",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-COMITE-CONFORMACION": {
      "codigo": "MA-SST-F-46",
      "titulo": "Conformación de comités (COPASST / Convivencia)",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-COPASST-ACTA": {
      "codigo": "MA-SST-F-47",
      "titulo": "Acta de reunión del COPASST",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-CONVIVENCIA-ACTA": {
      "codigo": "MA-SST-F-48",
      "titulo": "Acta de reunión del Comité de Convivencia Laboral",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-CONVIVENCIA-QUEJA": {
      "codigo": "MA-SST-F-49",
      "titulo": "Expediente de queja (Comité de Convivencia)",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-CONVIVENCIA-INFORME": {
      "codigo": "MA-SST-F-50",
      "titulo": "Informe de gestión del Comité de Convivencia",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-AUDITORIA": {
      "codigo": "MA-SST-F-51",
      "titulo": "Informe de auditoría del SG-SST",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-AUDITORIA-PROGRAMA": {
      "codigo": "MA-SST-F-52",
      "titulo": "Programa anual de auditorías",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PLAN-ANUAL": {
      "codigo": "MA-SST-F-53",
      "titulo": "Plan anual de trabajo del SG-SST",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PLAN-CAPACITACION": {
      "codigo": "MA-SST-F-54",
      "titulo": "Plan de capacitación",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-MATRIZ-PELIGROS": {
      "codigo": "MA-SST-F-55",
      "titulo": "Matriz de identificación de peligros y valoración de riesgos",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-SUSTANCIAS": {
      "codigo": "MA-SST-F-56",
      "titulo": "Inventario de sustancias químicas",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PLAN-EMERGENCIAS": {
      "codigo": "MA-SST-F-57",
      "titulo": "Plan de prevención, preparación y respuesta ante emergencias",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-SIMULACRO": {
      "codigo": "MA-SST-F-58",
      "titulo": "Informe de simulacro",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PROFESIOGRAMA": {
      "codigo": "MA-SST-F-59",
      "titulo": "Profesiograma",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-EXAMENES": {
      "codigo": "MA-SST-F-60",
      "titulo": "Programación de evaluaciones médicas ocupacionales",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-AUSENTISMO": {
      "codigo": "MA-SST-F-61",
      "titulo": "Informe de ausentismo",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-POLITICA": {
      "codigo": "MA-SST-F-62",
      "titulo": "Política de seguridad y salud en el trabajo",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-MATRIZ-LEGAL": {
      "codigo": "MA-SST-F-63",
      "titulo": "Matriz de requisitos legales",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-LISTADO-MAESTRO": {
      "codigo": "MA-SST-F-64",
      "titulo": "Listado maestro de documentos",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PROVEEDORES": {
      "codigo": "MA-SST-F-65",
      "titulo": "Evaluación de proveedores y contratistas",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-REVISION-DIRECCION": {
      "codigo": "MA-SST-F-66",
      "titulo": "Revisión por la alta dirección",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-RENDICION": {
      "codigo": "MA-SST-F-67",
      "titulo": "Rendición de cuentas en SST",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-CONTRATISTA": {
      "codigo": "MA-SST-F-68",
      "titulo": "Ficha y documentos del contratista",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-INGRESO-CONTRATISTA": {
      "codigo": "MA-SST-F-69",
      "titulo": "Control de ingreso de contratistas",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-MATRIZ-EPP": {
      "codigo": "MA-SST-F-70",
      "titulo": "Matriz de elementos de protección personal por cargo",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-ENTREGA-EPP": {
      "codigo": "MA-SST-F-71",
      "titulo": "Registro de entrega de elementos de protección personal",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-INDUCCION": {
      "codigo": "MA-SST-F-72",
      "titulo": "Inducción y reinducción en SST",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PROGRAMA-ALTO-RIESGO": {
      "codigo": "MA-SST-F-73",
      "titulo": "Programas de tareas de alto riesgo",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PESV": {
      "codigo": "MA-SST-F-74",
      "titulo": "Plan estratégico de seguridad vial",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-TABLERO-GERENCIA": {
      "codigo": "MA-SST-F-75",
      "titulo": "Informe del SG-SST para la gerencia",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-REPORTE-ANUAL-0312": {
      "codigo": "MA-SST-F-76",
      "titulo": "Reporte anual de estándares mínimos",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-ASPECTOS-AMBIENTALES": {
      "codigo": "MA-SST-F-77",
      "titulo": "Matriz de aspectos e impactos ambientales",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-RESIDUOS": {
      "codigo": "MA-SST-F-78",
      "titulo": "Registro de generación de residuos",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-INFORME-ASESORIA": {
      "codigo": "MA-SST-F-79",
      "titulo": "Informe de asesoría en SST",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-COMPATIBILIDAD": {
      "codigo": "MA-SST-F-80",
      "titulo": "Matriz de compatibilidad de sustancias químicas",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-GESTION-QUIMICA": {
      "codigo": "MA-SST-F-81",
      "titulo": "Gestión del riesgo químico (SGA)",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-CRONOGRAMA-INSP": {
      "codigo": "MA-SST-F-82",
      "titulo": "Cronograma de inspecciones",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-OBJETIVOS": {
      "codigo": "MA-SST-D-01",
      "titulo": "Objetivos del SG-SST",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-DESIGNACION": {
      "codigo": "MA-SST-D-02",
      "titulo": "Designación del responsable del SG-SST",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-ROLES": {
      "codigo": "MA-SST-D-03",
      "titulo": "Roles y responsabilidades en el SG-SST",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-RECURSOS": {
      "codigo": "MA-SST-D-04",
      "titulo": "Asignación de recursos para el SG-SST",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-REGLAMENTO": {
      "codigo": "MA-SST-D-05",
      "titulo": "Reglamento de higiene y seguridad industrial",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PROC-PELIGROS": {
      "codigo": "MA-SST-D-06",
      "titulo": "Procedimiento de identificación de peligros, evaluación y valoración de riesgos",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PROC-INVESTIGACION": {
      "codigo": "MA-SST-D-07",
      "titulo": "Procedimiento de reporte e investigación de incidentes, accidentes de trabajo y enfermedades laborales",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PROC-ACCIONES": {
      "codigo": "MA-SST-D-08",
      "titulo": "Procedimiento de acciones correctivas, preventivas y de mejora",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PROC-CAMBIO": {
      "codigo": "MA-SST-D-09",
      "titulo": "Procedimiento de gestión del cambio",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PROC-AUDITORIA": {
      "codigo": "MA-SST-D-10",
      "titulo": "Procedimiento de auditoría interna del SG-SST",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PROC-REVISION": {
      "codigo": "MA-SST-D-11",
      "titulo": "Procedimiento de revisión por la alta dirección",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PROC-DOCUMENTOS": {
      "codigo": "MA-SST-D-12",
      "titulo": "Procedimiento de control de documentos y conservación de registros",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PROC-COMUNICACION": {
      "codigo": "MA-SST-D-13",
      "titulo": "Procedimiento de comunicación, participación y consulta",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PROC-COMPRAS": {
      "codigo": "MA-SST-D-14",
      "titulo": "Procedimiento de adquisiciones y contratación con criterios de SST",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PROC-EMERGENCIAS": {
      "codigo": "MA-SST-D-15",
      "titulo": "Procedimiento de prevención, preparación y respuesta ante emergencias",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PROG-CAPACITACION": {
      "codigo": "MA-SST-D-16",
      "titulo": "Programa de capacitación, inducción y reinducción en SST",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PROG-INSPECCIONES": {
      "codigo": "MA-SST-D-17",
      "titulo": "Programa de inspecciones planeadas",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PROG-MEDICO": {
      "codigo": "MA-SST-D-18",
      "titulo": "Programa de evaluaciones médicas ocupacionales",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-MANUAL": {
      "codigo": "MA-SST-D-19",
      "titulo": "Manual del Sistema de Gestión de la Seguridad y Salud en el Trabajo",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-CONTEXTO": {
      "codigo": "MA-CAL-F-01",
      "titulo": "Contexto de la organización (DOFA y partes interesadas)",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-RIESGOS-CALIDAD": {
      "codigo": "MA-CAL-F-02",
      "titulo": "Matriz de riesgos y oportunidades",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-OBJETIVOS-CALIDAD": {
      "codigo": "MA-CAL-F-03",
      "titulo": "Objetivos e indicadores de calidad",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PNC": {
      "codigo": "MA-CAL-F-04",
      "titulo": "Registro de producto o servicio no conforme",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-PQRS": {
      "codigo": "MA-CAL-F-05",
      "titulo": "Informe de PQRS de clientes",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    },
    "SG-SATISFACCION": {
      "codigo": "MA-CAL-F-06",
      "titulo": "Encuesta e informe de satisfacción del cliente",
      "version": "1",
      "fecha": "15/01/2025",
      "actualizacion": ""
    }
  },
  "modulos": {
    "caliente": true,
    "alturas": true,
    "confinados": true,
    "izajes": true,
    "electrico": true,
    "ats": true,
    "asistencia": true,
    "personal": true,
    "epp": true,
    "brigadistas": true,
    "tablero": true,
    "reportes": true,
    "habilitacion": true,
    "plan": true,
    "inspecciones": true,
    "indicadores": true,
    "copasst": true,
    "convivencia": true,
    "auditorias": true,
    "plananual": true,
    "peligros": true,
    "emergencias": true,
    "salud": true,
    "documental": true,
    "revision": true,
    "contratistas": true,
    "usuarios": true,
    "dotacion": true,
    "induccion": true,
    "programas": true,
    "pesv": true,
    "gerencia": true,
    "ambiental": true,
    "quimicos": true,
    "kit": true,
    "calidad": true,
    "asesor": true
  },
  "correos": {
    "aprobacionEpp": "carcrios@gmail.com",
    "dominio": "gmail"
  },
  "contactoEpp": {
    "nombre": "Carlos RIos",
    "cargo": "",
    "whatsapp": "+573237157915"
  },
  "centrosCosto": [
    "Planta propia",
    "Cliente Alimentos del Norte",
    "Cliente Bebidas La Sabana",
    "Cliente Química Andina"
  ],
  "servidor": "https://script.google.com/macros/s/AKfycbzeyMMWVLg-Btm9Yrh6G6DjQZp8BuIj_Y4Jx3S6diOB6xeSMNttHDL0owDRLCNrhGSr/exec",
  "apiToken": "xVDnUb88aueKPsUFoWEAY6W2VoyvbGoTvAxRhQUy",
  "demo": false
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
    'contratistas.html': 'contratistas', 'usuarios.html': 'usuarios', 'entrega-epp.html': 'dotacion', 'induccion.html': 'induccion', 'programas.html': 'programas', 'pesv.html': 'pesv', 'gerencia.html': 'gerencia', 'ambiental.html': 'ambiental', 'quimicos.html': 'quimicos', 'documentos.html': 'kit', 'calidad.html': 'calidad', 'asesor.html': 'asesor'
  };

  function formato(id) {
    return Object.assign({ codigo: id, version: '', fecha: '', actualizacion: '' }, (E.formatos && E.formatos[id]) || {});
  }
  function codigo(id) { return formato(id).codigo || id; }
  function moduloActivo(k) { return !E.modulos || E.modulos[k] !== false; }
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
      if (fuera) a.classList.add('oculto-empresa');
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
    original, formato, codigo, moduloActivo, aplicar,
    logo: () => E.logo,
    producto: PRODUCTO,
    pie: () => PRODUCTO + ' · ' + (original ? 'INDIMON' : (E.nombreCorto || E.nombre))
  };
})();

/* Empresa demo: carga el servidor simulado ANTES que el resto del portal. */
if (EMPRESA.demo && typeof document !== 'undefined' && document.readyState === 'loading') {
  document.write('<script src="demo/demo.js"><\/script>');
}
