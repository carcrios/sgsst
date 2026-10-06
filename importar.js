/* ============================================================
   importar.js — Carga masiva desde Excel (pegar o archivo CSV)
   ------------------------------------------------------------
   Para arrancar una empresa sin digitar uno a uno: trabajadores,
   equipos, sustancias, normas y peligros. Se descarga la plantilla,
   se llena en Excel y se pega aquí (o se sube guardada como CSV).
   Antes de guardar se ve qué filas son nuevas, cuáles actualizan algo
   que ya existe y cuáles tienen errores (esas no se cargan).
   Se guarda por lotes en el servidor (guardarLote): 300 trabajadores
   toman unos minutos, no una tarde.

   Importar.abrir({
     titulo, archivo,                  // título y nombre de la plantilla
     columnas: [{ k, l, req, tipo: 'texto'|'numero'|'fecha'|'sino'|'lista'|'listas',
                  op: [...], sin: ['otros nombres'], ej, ayuda }],
     tipoDoc,                          // tipo del registro en el SG-SST
     id: (fila) => 'TRB-…',            // id del registro (el mismo si ya existe)
     existe: (id) => true|false,
     armar: (fila) => campos,          // lo que se guarda (parche: no borra lo demás)
     validar: (fila) => '' | 'error',
     alTerminar: () => {}
   })
   ============================================================ */
const Importar = (function () {
  const LOTE = 8;   // pocos por envío: el servidor atiende de a uno y no debe hacer esperar a los demás
  const norm = (t) => String(t == null ? '' : t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const escH = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /** Texto pegado de Excel (tabuladores) o CSV (; o ,) → filas de celdas. Respeta comillas. */
  function leerTabla(texto) {
    texto = String(texto || '').replace(/^﻿/, '').replace(/\r\n?/g, '\n');
    const primera = texto.split('\n').find((l) => l.trim()) || '';
    const cuenta = (c) => primera.split(c).length - 1;
    const sep = cuenta('\t') ? '\t' : cuenta(';') >= cuenta(',') ? ';' : ',';
    const filas = []; let fila = [], celda = '', comillas = false;
    for (let i = 0; i < texto.length; i++) {
      const ch = texto[i];
      if (comillas) {
        if (ch === '"') { if (texto[i + 1] === '"') { celda += '"'; i++; } else comillas = false; }
        else celda += ch;
      } else if (ch === '"' && celda === '') comillas = true;
      else if (ch === sep) { fila.push(celda); celda = ''; }
      else if (ch === '\n') { fila.push(celda); filas.push(fila); fila = []; celda = ''; }
      else celda += ch;
    }
    if (celda !== '' || fila.length) { fila.push(celda); filas.push(fila); }
    return filas.map((f) => f.map((c) => c.trim())).filter((f) => f.some((c) => c !== ''));
  }
  const valida = (iso) => { const d = new Date(iso + 'T12:00:00Z'); return !isNaN(d) && d.toISOString().slice(0, 10) === iso; };
  /** Fecha de Excel: 2026-03-15, 15/03/2026, 15-03-26, o el número de serie (46096). */
  function fecha(v) {
    v = String(v || '').trim(); if (!v) return '';
    let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(v);
    if (m) { const iso = m[1] + '-' + m[2].padStart(2, '0') + '-' + m[3].padStart(2, '0'); return valida(iso) ? iso : null; }
    m = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/.exec(v);
    if (m) { const a = m[3].length === 2 ? '20' + m[3] : m[3], iso = a + '-' + m[2].padStart(2, '0') + '-' + m[1].padStart(2, '0');
      return valida(iso) ? iso : null; }
    if (/^\d{5}$/.test(v)) { const d = new Date(Date.UTC(1899, 11, 30) + Number(v) * 864e5); return d.toISOString().slice(0, 10); }
    return null;
  }
  /** Número con coma decimal o punto de miles (1.234,5 · 1234,5 · 1234.5). */
  function numero(v) {
    v = String(v || '').trim().replace(/\s/g, ''); if (!v) return '';
    if (/,/.test(v) && /\./.test(v)) v = v.replace(/\./g, '').replace(',', '.');
    else if (/,/.test(v)) v = v.replace(',', '.');
    else if (/^-?\d{1,3}(\.\d{3})+$/.test(v)) v = v.replace(/\./g, '');   // 1.500 → mil quinientos (punto de miles)
    const n = Number(v); return isNaN(n) ? null : n;
  }
  function sino(v) { const t = norm(v); if (!t) return ''; if (/^(si|s|x|1|true|verdadero|yes)$/.test(t)) return true; if (/^(no|n|0|false|falso)$/.test(t)) return false; return null; }
  function opcion(v, op) { const t = norm(v); if (!t) return ''; const o = op.find((x) => norm(Array.isArray(x) ? x[0] : x) === t || (Array.isArray(x) && norm(x[1]) === t)); return o === undefined ? null : (Array.isArray(o) ? o[0] : o); }

  /** Encabezados de la tabla → columna de la configuración (por nombre, clave u otros nombres). */
  function mapear(encabezados, columnas) {
    const idx = {};
    columnas.forEach((c) => {
      const nombres = [c.l, c.k].concat(c.sin || []).map(norm);
      const i = encabezados.findIndex((h) => nombres.indexOf(norm(h).replace(/ ?\*$/, '')) !== -1 || nombres.indexOf(norm(h)) !== -1);
      if (i !== -1) idx[c.k] = i;
    });
    return idx;
  }
  function convertir(celdas, idx, columnas) {
    const f = {}, errores = [];
    columnas.forEach((c) => {
      const crudo = idx[c.k] === undefined ? '' : (celdas[idx[c.k]] || '');
      let v = crudo;
      if (c.tipo === 'fecha') v = fecha(crudo);
      else if (c.tipo === 'numero') v = numero(crudo);
      else if (c.tipo === 'sino') v = sino(crudo);
      else if (c.tipo === 'lista') v = opcion(crudo, c.op);
      else if (c.tipo === 'listas') { const partes = String(crudo).split(/\s*[;,|]\s*/).filter(Boolean); const ok = partes.map((p) => opcion(p, c.op)); v = ok.indexOf(null) === -1 ? ok : null; }
      if (v === null) { errores.push(c.l + ': «' + crudo + '» no se entiende' + (c.op ? ' (opciones: ' + c.op.map((x) => Array.isArray(x) ? x[1] : x).slice(0, 8).join(', ') + ')' : c.tipo === 'fecha' ? ' (usa dd/mm/aaaa)' : '')); v = ''; }
      if (c.req && (v === '' || v == null || (Array.isArray(v) && !v.length))) errores.push('Falta ' + c.l);
      f[c.k] = v;
    });
    return { f, errores };
  }

  function plantillaCSV(cfg) {
    const q = (t) => /[;"\n]/.test(String(t)) ? '"' + String(t).replace(/"/g, '""') + '"' : String(t);
    return '﻿' + cfg.columnas.map((c) => q(c.l + (c.req ? ' *' : ''))).join(';') + '\n' + cfg.columnas.map((c) => q(c.ej == null ? '' : c.ej)).join(';') + '\n';
  }
  function descargar(nombre, texto) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([texto], { type: 'text/csv;charset=utf-8' }));
    a.download = nombre; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  function leerArchivo(archivo) {
    return new Promise((ok, mal) => {
      if (/\.xlsx?$/i.test(archivo.name)) { mal(new Error('Ese es un archivo de Excel. En Excel: Archivo → Guardar como → CSV (delimitado por comas), o copia las celdas y pégalas aquí.')); return; }
      const fr = new FileReader();
      fr.onload = () => {
        const buf = new Uint8Array(fr.result);
        let t = new TextDecoder('utf-8').decode(buf);
        if (t.indexOf('�') !== -1) { try { t = new TextDecoder('windows-1252').decode(buf); } catch (e) {} }   // CSV de Excel en Windows
        ok(t);
      };
      fr.onerror = () => mal(fr.error);
      fr.readAsArrayBuffer(archivo);
    });
  }

  /** Analiza todo lo pegado: filas listas, errores y repetidos. */
  function analizar(texto, cfg) {
    const tabla = leerTabla(texto);
    if (tabla.length < 2) return { error: 'Pega la tabla con su fila de títulos (la primera fila de la plantilla) y al menos una fila de datos.' };
    const idx = mapear(tabla[0], cfg.columnas);
    const faltan = cfg.columnas.filter((c) => c.req && idx[c.k] === undefined).map((c) => c.l);
    if (faltan.length) return { error: 'No encuentro la(s) columna(s): ' + faltan.join(', ') + '. Usa los títulos de la plantilla.' };
    const ignoradas = tabla[0].filter((h, i) => h && Object.keys(idx).every((k) => idx[k] !== i));
    const vistos = {};
    const filas = tabla.slice(1).map((celdas, n) => {
      const { f, errores } = convertir(celdas, idx, cfg.columnas);
      let id = '';
      if (!errores.length) {
        const e = cfg.validar ? cfg.validar(f) : ''; if (e) errores.push(e);
        else { id = cfg.id(f); if (vistos[id]) errores.push('Repetida con la fila ' + vistos[id]); else vistos[id] = n + 2; }
      }
      const existe = id ? !!cfg.existe(id) : false;
      // Los valores por defecto son solo para registros nuevos: en uno que ya existe, la celda vacía deja lo que tenía.
      if (!existe) cfg.columnas.forEach((c) => { if (c.def !== undefined && (f[c.k] === '' || f[c.k] == null)) f[c.k] = c.def; });
      return { n: n + 2, f, id, errores, existe };
    });
    return { filas, ignoradas, columnas: Object.keys(idx).length };
  }

  function abrir(cfg) {
    const m = UI.modal('<h3>⬆️ ' + escH(cfg.titulo) + '</h3>' +
      '<p class="ayuda"><b>1.</b> Descarga la plantilla y llénala en Excel (una fila por registro; los títulos con * son obligatorios). <b>2.</b> Copia las celdas, títulos incluidos, y pégalas aquí, o sube el archivo guardado como CSV. <b>3.</b> Revisa y carga.</p>' +
      '<button type="button" class="btn ghost" data-plantilla>⬇️ Plantilla (' + escH(cfg.archivo) + '.csv)</button>' +
      '<div class="field"><textarea data-pegar rows="6" placeholder="Pega aquí las celdas copiadas de Excel (con la fila de títulos)" style="font-family:ui-monospace,monospace;font-size:12px;"></textarea></div>' +
      '<div class="field"><label>O sube el archivo (CSV)</label><input type="file" data-archivo accept=".csv,.txt,.tsv,text/csv,text/plain"></div>' +
      '<div data-vista></div>' +
      '<button type="button" class="btn amber" data-cargar disabled>Cargar</button><button type="button" class="btn ghost" data-cerrar>Cerrar</button><div class="status-msg" data-msg></div>', true);
    const $m = (s) => m.el.querySelector(s);
    let analisis = null;
    $m('[data-plantilla]').addEventListener('click', () => descargar('plantilla-' + cfg.archivo + '.csv', plantillaCSV(cfg)));
    const ver = () => {
      const t = $m('[data-pegar]').value;
      analisis = t.trim() ? analizar(t, cfg) : null;
      const v = $m('[data-vista]'), b = $m('[data-cargar]');
      if (!analisis) { v.innerHTML = ''; b.disabled = true; return; }
      if (analisis.error) { v.innerHTML = '<div class="aviso">' + escH(analisis.error) + '</div>'; b.disabled = true; return; }
      const fs = analisis.filas, buenas = fs.filter((x) => !x.errores.length), nuevas = buenas.filter((x) => !x.existe).length;
      const vis = cfg.columnas.filter((c) => c.vista !== false).slice(0, 4);
      v.innerHTML = '<div class="aviso ' + (fs.length === buenas.length ? 'info' : 'amar') + '"><b>' + fs.length + ' fila(s):</b> ' + nuevas + ' nueva(s), ' + (buenas.length - nuevas) + ' actualiza(n) un registro que ya existe' + (fs.length - buenas.length ? ', <b>' + (fs.length - buenas.length) + ' con errores (no se cargan)</b>' : '') + '.' +
        (analisis.ignoradas.length ? '<br><small>Columnas que no se usan: ' + escH(analisis.ignoradas.join(', ')) + '</small>' : '') + '</div>' +
        '<div style="overflow-x:auto;max-height:260px;overflow-y:auto;border:1px solid var(--line);border-radius:10px;margin-bottom:10px;"><table style="width:100%;border-collapse:collapse;font-size:12px;">' +
        '<tr style="background:#f3f5f8;"><th style="padding:5px;text-align:left;">Fila</th>' + vis.map((c) => '<th style="padding:5px;text-align:left;">' + escH(c.l) + '</th>').join('') + '<th style="padding:5px;text-align:left;">Resultado</th></tr>' +
        fs.slice(0, 200).map((x) => '<tr style="border-top:1px solid var(--line);' + (x.errores.length ? 'background:#fdecea;' : '') + '"><td style="padding:5px;">' + x.n + '</td>' + vis.map((c) => '<td style="padding:5px;">' + escH(Array.isArray(x.f[c.k]) ? x.f[c.k].join(', ') : x.f[c.k] === true ? 'Sí' : x.f[c.k] === false ? 'No' : x.f[c.k]) + '</td>').join('') +
          '<td style="padding:5px;">' + (x.errores.length ? '✗ ' + escH(x.errores.join(' · ')) : x.existe ? '↻ Actualiza' : '＋ Nuevo') + '</td></tr>').join('') +
        (fs.length > 200 ? '<tr><td colspan="9" style="padding:5px;">… y ' + (fs.length - 200) + ' más</td></tr>' : '') + '</table></div>';
      b.disabled = !buenas.length; b.textContent = 'Cargar ' + buenas.length + ' registro(s)';
    };
    $m('[data-pegar]').addEventListener('input', ver);
    $m('[data-archivo]').addEventListener('change', async () => {
      const f = $m('[data-archivo]').files[0]; if (!f) return;
      try { $m('[data-pegar]').value = await leerArchivo(f); ver(); } catch (e) { $m('[data-vista]').innerHTML = '<div class="aviso">' + escH(e.message) + '</div>'; }
    });
    $m('[data-cargar]').addEventListener('click', async () => {
      if (!analisis || analisis.error) return;
      if (!navigator.onLine) { $m('[data-msg]').textContent = 'La carga masiva necesita señal.'; return; }
      const buenas = analisis.filas.filter((x) => !x.errores.length), msg = $m('[data-msg]'), b = $m('[data-cargar]');
      b.disabled = true; $m('[data-pegar]').disabled = true;
      let hechas = 0; const fallas = [];
      for (let i = 0; i < buenas.length; i += LOTE) {
        const lote = buenas.slice(i, i + LOTE);
        msg.textContent = 'Cargando ' + Math.min(i + LOTE, buenas.length) + ' de ' + buenas.length + '…';
        const items = lote.map((x) => ({ tipo: cfg.tipoDoc, id: x.id, campos: soloLlenos(cfg.armar(x.f, x.existe), x.existe) }));
        let r;
        try { r = await SGSST.enviar({ action: 'guardarLote', items }, null, { sinCola: true }); } catch (e) { r = { ok: false, error: e.message }; }
        if (!r.ok) { lote.forEach((x) => fallas.push('Fila ' + x.n + ': ' + (r.error || 'error'))); if (r.codigoError === 'SESION' || r.clave || r.codigoError === 'PERMISO') break; continue; }
        (r.resultados || []).forEach((res, k) => { if (res.ok) hechas++; else fallas.push('Fila ' + lote[k].n + ': ' + (res.error || 'error')); });
      }
      msg.innerHTML = '✓ ' + hechas + ' registro(s) cargado(s).' + (fallas.length ? '<br><span style="color:var(--mal);">' + fallas.length + ' no se cargaron:<br>' + fallas.slice(0, 15).map(escH).join('<br>') + (fallas.length > 15 ? '<br>…' : '') + '</span>' : '');
      b.textContent = 'Listo'; if (cfg.alTerminar) cfg.alTerminar(hechas);
    });
    return m;
  }
  /** En un registro que ya existe se manda solo lo que trae la fila (lo vacío no borra lo que había). */
  function soloLlenos(c, existe) {
    if (!existe) return c;
    const o = {}; Object.keys(c).forEach((k) => { const v = c[k]; if (v === '' || v == null || (Array.isArray(v) && !v.length) || (v && typeof v === 'object' && !Array.isArray(v) && !Object.keys(v).length)) return; o[k] = v; });
    return o;
  }
  /** Para armar ids estables a partir de texto (la misma fila vuelve al mismo registro). */
  function idDe(prefijo, ...partes) {
    const t = partes.map(norm).join('|');
    let h = 5381; for (let i = 0; i < t.length; i++) h = ((h * 33) ^ t.charCodeAt(i)) >>> 0;
    const legible = norm(partes[0]).toUpperCase().replace(/ /g, '-').slice(0, 24);
    return prefijo + '-' + (legible ? legible + '-' : '') + h.toString(36).toUpperCase();
  }
  return { abrir, leerTabla, fecha, numero, sino, analizar, idDe, norm, plantillaCSV, soloLlenos };
})();
