/* ============================================================
   plan-sugerido.js — Plan anual de trabajo armado según la empresa (v105)
   ------------------------------------------------------------
   Propone las actividades del año con lo que el portal ya sabe:
   · estándares que le aplican (7, 21 o 60, Res. 0312 de 2019),
   · número de trabajadores (COPASST o vigía),
   · peligros de la matriz (alturas, confinados, eléctrico, caliente,
     izaje, químico, biomecánico, psicosocial, físico),
   · sustancias químicas, vehículos y contratistas registrados.
   Cada actividad dice POR QUÉ se propone. Es una propuesta: el
   responsable del SG-SST la revisa, quita, agrega y asigna.
   ============================================================ */
const PLAN_SUGERIDO = (function () {
  const T = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], TRIM = [3, 6, 9, 12];
  const norm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  /** Peligros de la matriz que hablan de un tema (por tipo, descripción o tarea). */
  function buscar(peligros, re, clase) {
    return (peligros || []).filter((p) => (clase && norm(p.clasificacion) === norm(clase)) || re.test(norm([p.subtipo, p.peligro, p.tarea, p.actividad].join(' '))));
  }
  const expuestos = (l) => l.reduce((a, p) => a + (Number(p.expuestos) || 0), 0);
  function porMatriz(l, que) { const n = expuestos(l); return 'En la matriz de peligros: ' + que + (n ? ' (' + n + ' expuestos)' : '') + '.'; }

  /** ctx: {grupo, trabajadores, responsable, peligros:[…], sustancias, vehiculos, contratistas, copasst} */
  function proponer(ctx) {
    const g = Number(ctx.grupo) || 60, trab = Number(ctx.trabajadores) || 0, R = ctx.responsable || '', out = [];
    const add = (clave, ciclo, actividad, tipo, meses, por, extra) => out.push(Object.assign({ clave, ciclo, actividad, tipo, meses: meses.slice(), auto: '', responsable: R, recursos: '', metaPersonas: '', por }, extra || {}));
    const grupoTxt = 'Le aplican ' + g + ' estándares (Res. 0312 de 2019).';
    // ── Planear
    add('firma-plan', 'Planear', 'Aprobar y firmar el plan anual de trabajo (empleador y responsable del SG-SST)', 'Documental', [1], 'Estándar 2.4.1: el plan lo firman el empleador y el responsable.');
    add('rev-matriz', 'Planear', 'Actualizar la matriz de peligros con participación de los trabajadores', 'Peligros', [1], 'Se actualiza al menos una vez al año (estándares 4.1.1 y 4.1.2).', { auto: 'revmatriz' });
    add('politica', 'Planear', 'Revisar la política y los objetivos del SG-SST', 'Documental', [1], 'La política se revisa cada año (estándar 2.1.1).');
    if (g >= 21) add('matriz-legal', 'Planear', 'Actualizar la matriz legal', 'Documental', [1, 7], 'Estándar 2.7.1 y normas nuevas del semestre.');
    add('autoevaluacion', 'Planear', 'Autoevaluación de estándares mínimos (Res. 0312)', 'Auditoría', [1], grupoTxt);
    if (g >= 21) add('sociodemografico', 'Planear', 'Actualizar el perfil sociodemográfico y el diagnóstico de condiciones de salud', 'Salud', [2], 'Estándar 3.1.1.');
    // ── Hacer: personas
    add('induccion', 'Hacer', 'Inducción y reinducción en SST', 'Capacitación', [2], 'Estándar 1.2.2: a todos los trabajadores, con registro.', { metaPersonas: trab || '' });
    add('charlas', 'Hacer', 'Charlas de seguridad sobre los peligros prioritarios', 'Capacitación', T, 'Estándar 1.2.1: programa de capacitación según los peligros identificados.', { metaPersonas: trab || '' });
    add('examenes', 'Hacer', 'Exámenes médicos ocupacionales periódicos', 'Salud', [3], 'Estándar 3.1.4 y Res. 1843 de 2025.', { auto: 'examenes' });
    add('epp', 'Hacer', 'Entrega y reposición de EPP, con capacitación en su uso', 'Otra', [6, 12], 'Estándar 4.2.6.');
    if (g >= 21) add('mantenimiento', 'Hacer', 'Mantenimiento preventivo de instalaciones, equipos y herramientas', 'Inspección', [2, 5, 8, 11], 'Estándar 4.2.5.');
    if (g >= 21) add('estilos', 'Hacer', 'Actividades de estilos de vida y entornos saludables', 'Salud', [4, 9], 'Estándares 3.1.2 y 3.1.7.');
    // Comités: con 10 o más trabajadores, COPASST (reunión mensual); con menos, vigía.
    const conCopasst = trab >= 10 || !!ctx.copasst;
    if (conCopasst) add('copasst', 'Hacer', 'Reunión mensual del COPASST', 'Comité', T, (trab ? trab + ' trabajadores: ' : '') + 'COPASST con reunión mensual (Res. 2013 de 1986).', { auto: 'copasst', responsable: 'Presidente del COPASST' });
    else add('vigia', 'Hacer', 'Seguimiento del Vigía de SST a inspecciones, reportes y acciones', 'Comité', TRIM, 'Con menos de 10 trabajadores el SG-SST tiene Vigía de SST.');
    if (g >= 60) add('cap-copasst', 'Hacer', 'Capacitación del ' + (conCopasst ? 'COPASST' : 'Vigía de SST') + ' para cumplir sus funciones', 'Capacitación', [2], 'Estándar 1.1.7.');
    add('convivencia', 'Hacer', 'Reunión ordinaria del Comité de Convivencia Laboral', 'Comité', TRIM, 'Estándar 1.1.8: comité conformado y funcionando.', { auto: 'convivencia', responsable: 'Presidente del Comité de Convivencia' });
    add('inspecciones', 'Hacer', 'Inspecciones planeadas (cronograma de inspecciones)', 'Inspección', T, 'Estándar 4.2.4: con participación del COPASST o vigía.', { auto: 'inspecciones' });
    // ── Hacer: según los peligros de la matriz
    const P = ctx.peligros || [];
    const alt = buscar(P, /altura|caida|andamio|escalera|techo|arnes/);
    if (alt.length) {
      add('alturas-cap', 'Hacer', 'Curso o reentrenamiento en trabajo en alturas (Res. 4272 de 2021)', 'Capacitación', [3], porMatriz(alt, 'trabajo en alturas'), { metaPersonas: expuestos(alt) || '' });
      add('alturas-prog', 'Hacer', 'Programa de protección contra caídas: inspección de equipos y sistemas de acceso', 'Inspección', TRIM, porMatriz(alt, 'trabajo en alturas'));
    }
    const conf = buscar(P, /confinad|tanque|pozo|silo|alcantarilla/);
    if (conf.length) add('confinados', 'Hacer', 'Capacitación en espacios confinados y rescate (Res. 491 de 2020)', 'Capacitación', [4], porMatriz(conf, 'espacios confinados'), { metaPersonas: expuestos(conf) || '' });
    const ele = buscar(P, /electric|tension|energizad|tablero/);
    if (ele.length) add('electrico', 'Hacer', 'Capacitación en riesgo eléctrico y bloqueo y etiquetado', 'Capacitación', [5], porMatriz(ele, 'riesgo eléctrico'), { metaPersonas: expuestos(ele) || '' });
    const cal = buscar(P, /soldad|oxicorte|caliente|esmeril|chispa|llama/);
    if (cal.length) add('caliente', 'Hacer', 'Capacitación en trabajo en caliente y prevención de incendios', 'Capacitación', [6], porMatriz(cal, 'trabajo en caliente'), { metaPersonas: expuestos(cal) || '' });
    const iza = buscar(P, /izaje|carga suspendida|grua|polipasto|montacarga|diferencial/);
    if (iza.length) add('izaje', 'Hacer', 'Capacitación en izaje de cargas (operador y aparejador)', 'Capacitación', [7], porMatriz(iza, 'izaje de cargas'), { metaPersonas: expuestos(iza) || '' });
    const qui = buscar(P, /quimic|solvente|vapor|gas|polvo|humo/, 'Químico');
    if (qui.length || ctx.sustancias) {
      const por = ctx.sustancias ? ctx.sustancias + ' sustancia(s) química(s) en el inventario.' : porMatriz(qui, 'peligro químico');
      add('sga-cap', 'Hacer', 'Capacitación en el SGA: etiquetas, pictogramas y fichas de seguridad (Res. 773 de 2021, art. 21)', 'Capacitación', [8], por, { metaPersonas: expuestos(qui) || '' });
      add('sga-inv', 'Hacer', 'Revisar el inventario de sustancias, sus fichas de seguridad y la compatibilidad en el almacenamiento', 'Peligros', [2, 8], por);
    }
    const bio = buscar(P, /postura|carga manual|movimiento repetitivo|biomecanic|levantamiento/, 'Biomecánico');
    if (bio.length) add('biomecanico', 'Hacer', 'Pausas activas y prevención de lesiones osteomusculares', 'Salud', TRIM, porMatriz(bio, 'peligro biomecánico'), { metaPersonas: expuestos(bio) || '' });
    const psi = buscar(P, /psicosocial|estres|carga mental|jornada/, 'Psicosocial');
    if (g >= 21 || psi.length) add('psicosocial', 'Hacer', 'Aplicar o hacer seguimiento a la batería de riesgo psicosocial (Res. 2764 de 2022)', 'Salud', [5], psi.length ? porMatriz(psi, 'peligro psicosocial') : grupoTxt);
    const fis = buscar(P, /ruido|iluminacion|vibracion|temperatura|radiacion/, 'Físico');
    if (fis.length && g >= 60) add('mediciones', 'Hacer', 'Mediciones ambientales de los peligros físicos prioritarios', 'Peligros', [5], porMatriz(fis, 'peligro físico') + ' Estándar 4.1.4.');
    // ── Emergencias
    if (g >= 21) add('brigada', 'Hacer', 'Capacitación y dotación de la brigada de emergencias', 'Emergencias', [3, 8], 'Estándar 5.1.2.');
    add('simulacro', 'Hacer', 'Simulacro de evacuación', 'Emergencias', [10], 'Plan de emergencias con simulacro al menos una vez al año (Dec. 1072, art. 2.2.4.6.25).', { auto: 'simulacro' });
    // ── Vehículos y contratistas
    if (ctx.vehiculos) {
      add('pesv', 'Hacer', 'Seguimiento al plan estratégico de seguridad vial (Res. 40595 de 2022)', 'Otra', TRIM, ctx.vehiculos + ' vehículo(s) registrado(s).');
      add('vial-cap', 'Hacer', 'Capacitación en seguridad vial para conductores', 'Capacitación', [4], ctx.vehiculos + ' vehículo(s) registrado(s).', { metaPersonas: ctx.conductores || '' });
    }
    if (ctx.contratistas || g >= 21) add('contratistas', 'Hacer', 'Evaluación de contratistas y proveedores en SST', 'Otra', [6, 12], ctx.contratistas ? ctx.contratistas + ' contratista(s) registrado(s). Estándar 2.10.1.' : 'Estándar 2.10.1.');
    // ── Verificar y actuar
    add('indicadores', 'Verificar', 'Medición de indicadores del SG-SST', 'Otra', T, 'Res. 0312, art. 30: indicadores mensuales.', { auto: 'indicadores' });
    if (g >= 21) add('auditoria', 'Verificar', 'Auditoría interna del SG-SST (con el COPASST o vigía)', 'Auditoría', [11], 'Estándares 6.1.2 y 6.1.4.', { auto: 'auditoria' });
    add('revision', 'Verificar', 'Revisión por la alta dirección', 'Documental', [12], 'Estándar 6.1.3.', { auto: 'revision' });
    if (g >= 60) add('rendicion', 'Verificar', 'Rendición de cuentas', 'Documental', [12], 'Estándar 2.6.1.');
    add('seguimiento', 'Actuar', 'Seguimiento al plan de acción', 'Otra', TRIM, 'Estándares 7.1.1 a 7.1.4.');
    return out;
  }
  /* Nombres con que venían estas actividades en la plantilla típica (planes creados antes de la v105). */
  const ANTES = { charlas: 'Capacitaciones por peligros prioritarios (charlas)', convivencia: 'Reunión mensual del Comité de Convivencia', inspecciones: 'Inspecciones planeadas',
    psicosocial: 'Intervención del riesgo psicosocial', brigada: 'Capacitación de la brigada de emergencias', epp: 'Entrega y reposición de EPP' };
  /** Lo que ya está en el plan (por clave, por el mismo nombre, por su nombre de antes o porque se marca solo con lo mismo) no se vuelve a proponer. */
  function faltantes(propuesta, actividades) {
    const l = actividades || [], ya = new Set(l.map((a) => a.clave).filter(Boolean)), nombres = new Set(l.map((a) => norm(a.actividad))), autos = new Set(l.map((a) => a.auto).filter(Boolean));
    return propuesta.filter((p) => !ya.has(p.clave) && !nombres.has(norm(p.actividad)) && !(ANTES[p.clave] && nombres.has(norm(ANTES[p.clave]))) && !(p.auto && autos.has(p.auto)));
  }
  return { proponer, faltantes };
})();
if (typeof module !== 'undefined') module.exports = PLAN_SUGERIDO;
