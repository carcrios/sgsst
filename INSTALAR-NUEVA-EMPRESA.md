# Instalar el Portal SSTA en una empresa nueva (≈ 30 minutos)

El portal de INDIMON sigue igual. Para otra empresa se usan **los mismos archivos**: solo cambian `empresa.js` (los datos de la empresa) y el servidor, que es **un solo Apps Script** en la cuenta de Google de esa empresa.

**Dónde quedan los datos:** en el Google Drive de la empresa, en la carpeta «Portal SSTA - <empresa>», con un libro de Google Sheets por módulo. Nadie más los ve, ni siquiera quien instala, salvo que la empresa comparta la carpeta.

---

## 0. Antes de empezar

| Necesitas | Para qué |
|---|---|
| Una cuenta de Google **de la empresa** (Gmail o Workspace), por ejemplo `sst@empresa.com` | Ahí viven el servidor y los datos. Si quien instala usa su cuenta personal, los datos quedan en su Drive: **no lo hagas**. |
| Una cuenta de GitHub **de la empresa** (gratis) | Para publicar el sitio. Cada empresa en su propia cuenta: si dos empresas comparten cuenta, comparten en los celulares la clave guardada y los pendientes. |
| Los archivos del portal (este paquete) | — |
| El listado maestro de documentos de la empresa | Códigos, versiones y fechas de sus formatos. |

---

## 1. Servidor (Apps Script): 10 minutos

1. Entra con la cuenta de la empresa a **script.google.com** → **Nuevo proyecto**. Ponle de nombre «Portal SSTA».
2. En **⚙️ Configuración del proyecto**, pon la zona horaria **(GMT-05:00) Bogotá**.
3. Crea 8 archivos (botón **+** → Secuencia de comandos) con estos nombres, sin `.gs`, y pega en cada uno el contenido del archivo del mismo nombre de la carpeta `servidor-unico/`:
   `00-Portal`, `01-Empresa`, `10-permisos`, `11-personal`, `12-ats`, `13-asistencia`, `14-epp`, `15-sgsst`.
   Borra el archivo `Código.gs` que trae vacío. El orden de los archivos no importa.
4. En `01-Empresa` (el único que se edita; las actualizaciones nunca lo reemplazan), cambia las tres líneas:
   ```js
   const EMPRESA_NOMBRE = 'Montajes del Sur S.A.S.';
   const CORREOS_SSTA = ['sst@montajesdelsur.com', 'gerencia@montajesdelsur.com'];
   const CONTACTO_EPP = { nombre: 'Laura Gómez', whatsapp: '+57 300 123 4567' };
   ```
   (Si después cambian, edítalos aquí y haz *Gestionar implementaciones → Nueva versión*.)
5. Arriba, elige la función **instalar** → **▶ Ejecutar** → **Revisar permisos** → elige la cuenta de la empresa → *Configuración avanzada* → *Ir a Portal SSTA* → **Permitir**.
   Se crean la carpeta y los 10 libros, queda programado el **aviso diario del SG-SST** (6 a. m., a los correos de `CORREOS_SSTA`) y en el registro aparece la **clave del portal** (por ejemplo `KQRT-4827`).
6. **Implementar → Nueva implementación** → tipo **Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
   - **Implementar**.
7. Elige la función **verConfiguracion** → **▶ Ejecutar**. Copia las líneas que salen (`servidor: …` y `apiToken: …`).
   La URL del servidor debe terminar en **/exec**. Si termina en /dev o no aparece, cópiala de **Implementar → Gestionar implementaciones** (la URL de la aplicación web).

8. **Si vas a mantener tú el servidor** (actualizaciones con un comando, ver «Vender el portal a varias empresas»): **Compartir** → tu correo como **Editor**, y anota el **ID de la secuencia de comandos** (⚙️ Configuración del proyecto).

> Para actualizar el servidor a mano más adelante, pega los archivos nuevos (**nunca** `01-Empresa`) y luego **Implementar → Gestionar implementaciones → ✏️ → Versión: Nueva versión**. **No** uses «Nueva implementación»: eso cambia la URL.

---

## 2. Sitio (GitHub Pages): 10 minutos

1. En la cuenta de GitHub de la empresa, crea un repositorio **público** (por ejemplo `portal-sst`).
2. Sube **todos** los archivos del portal **excepto** estas carpetas: `backends/`, `pruebas/`, `herramientas/` y `sitio-demo/`. Las carpetas `servidor-unico/` y `demo/` no estorban, pero se pueden omitir.
3. En **Settings → Pages**: Source = *Deploy from a branch*, Branch = `main`, carpeta `/ (root)` → **Save**.
   A los 1–2 minutos queda en `https://<cuenta>.github.io/portal-sst/`.

---

## 3. Configurar la empresa: 5 minutos

1. Abre `https://<cuenta>.github.io/portal-sst/configurar-empresa.html`.
2. Llena:
   - razón social, nombre corto, NIT, logo y color;
   - códigos, versiones y fechas de los formatos;
   - módulos que va a usar;
   - correos y centros de costo (clientes) para el ATS.
3. En el paso 5, pega lo que dio **verConfiguracion**.
4. **Descargar empresa.js** y **Descargar manifest.json**. Súbelos al repositorio **reemplazando** los que están.

> Si después hay que cambiar algo (un código, el logo, un correo), vuelve a abrir `configurar-empresa.html`: carga lo que ya está y solo hay que corregir y volver a subir.

---

## 4. Probar y entregar: 5 minutos

1. Abre el sitio → **🔑 Clave** → escribe la clave del paso 1.5. Luego **🩺 Estado**: los 10 servidores deben salir en verde. Si salen «Pide la clave», la clave quedó mal escrita.
2. Haz una prueba de punta a punta: un ATS corto, un permiso, una charla con un asistente, y exporta el PDF. Revisa que salgan el logo, los códigos y el nombre de la empresa.
3. Entrega al responsable de SST:
   - el enlace del portal (y que lo **agreguen a la pantalla de inicio** de cada celular);
   - la **clave del portal**, que cada celular escribe una vez en 🔑 Clave;
   - la carpeta de Drive con los libros (que la compartan solo con quien deba verla).

Si la clave se filtra o se va alguien: en Apps Script ejecuta **cambiarClave** y reparte la nueva.

---

## Gestión del SG-SST (8 módulos)

Están en el inicio, sección **Gestión del SG-SST**, y usan el servidor `15-sgsst`:

| Módulo | Qué hace |
|---|---|
| 🪪 **Personal habilitado** | Requisitos de cada trabajador con su vencimiento (seguridad social, inducción, concepto médico, alturas, espacios confinados…). Los permisos, el ATS y el anexo avisan debajo de cada cédula si alguien no está habilitado. |
| ⚠️ **Reportes e investigación** | Actos y condiciones inseguras (se puede reportar anónimo), incidentes y accidentes. En los accidentes lleva el plazo del FURAT (2 días hábiles) y la investigación con equipo, causas y firmas (15 días, Res. 1401 de 2007). |
| ✅ **Plan de acción** | Una sola lista de acciones con origen (reporte, inspección, EPP, COPASST, auditoría…), responsable, fecha, avances y cierre con evidencia. |
| 🔍 **Inspecciones planeadas** | Inventario de equipos y áreas (extintores, arneses, botiquines, eslingas…) con 13 listas de chequeo ajustables más las propias de la empresa, inspecciones gerenciales y del COPASST con participantes, y cronograma anual. Cada «no conforme» crea su acción. |
| 📈 **Indicadores** | Los de la Res. 0312 de 2019 (art. 30) calculados solos con los reportes; solo hay que escribir cada mes el número de trabajadores y los días de ausencia. |
| 🤝 **COPASST** | Conformación por periodos de 2 años con los integrantes que pide la Res. 2013 de 1986 según el número de trabajadores (vigía si son menos de 10), calendario de reuniones mensuales, actas con quórum y firmas, compromisos al plan de acción, capacitaciones del comité. Avisa la reunión extraordinaria dentro de 5 días tras un accidente grave. |
| 🕊️ **Comité de Convivencia** | Igual que el COPASST (Res. 3461 de 2025) más las **quejas de acoso laboral cifradas**, con los plazos del procedimiento (5 días para darle trámite, 65 en total) e informes trimestral y anual para la alta dirección sin nombres. |
| 🧾 **Auditorías** | Programa anual; autoevaluación de los 60 estándares de la Res. 0312 con puntaje y valoración; auditoría interna del Decreto 1072 (art. 2.2.4.6.30); ISO 45001; auditorías de clientes. Cada no conformidad crea su acción. |

### Planear y revisar el SG-SST (6 módulos más, misma hoja del servidor `15-sgsst`)

| Módulo | Qué hace |
|---|---|
| 🗓️ **Plan anual de trabajo** | Cronograma con responsables, recursos y firmas del empleador y del responsable. Trae una plantilla de actividades; las que el portal puede ver (reuniones del COPASST, inspecciones, simulacros, auditorías, revisión por la dirección) se marcan solas. Calcula el cumplimiento, la ejecución del plan de capacitación y su cobertura. |
| ☢️ **Matriz de peligros** | Identificación y valoración con la GTC 45 (ND × NE × NC → nivel de riesgo I a IV), medidas en orden de jerarquía que se vuelven acciones, revisión anual con firma de los trabajadores, inventario de sustancias (SGA) y mediciones ambientales. |
| 🚨 **Emergencias** | Plan por sede con el análisis de amenazas y vulnerabilidad por colores, procedimientos operativos, brigada con sus capacitaciones y dotación, y simulacros con tiempos y acciones de mejora. |
| 🩺 **Salud en el trabajo** | Profesiograma, programación de exámenes ocupacionales (Res. 1843 de 2025) con solo el concepto de aptitud y las restricciones, seguimiento a restricciones, diagnóstico de condiciones de salud, vigilancia epidemiológica, batería psicosocial (Res. 2764 de 2022, solo resultados generales) y ausentismo. **No guarda diagnósticos.** |
| 📚 **Documental y legal** | Política y objetivos (con plantilla), matriz legal (trae 30 normas base para evaluar), listado maestro (importa los formatos del portal), gestión del cambio y evaluación de proveedores y contratistas. |
| 🏛️ **Revisión por la dirección** | Se llena con los datos del portal (autoevaluación, plan anual, accidentalidad, acciones, auditorías, comités, peligros, legal, salud) y pide el análisis de los 11 puntos del art. 2.2.4.6.31 del Decreto 1072. También la rendición de cuentas. |

Indicadores trae además los de **estructura y proceso**, y la autoevaluación de estándares mínimos muestra pistas del portal para casi todos los estándares.

**Qué requisitos se exigen** se define en `empresa.js`, en `habilitacion` (vigencia en meses de cada requisito y cuáles pide cada tipo de trabajo). Por defecto: seguridad social, inducción y concepto médico para todos, y el curso de alturas (18 meses, Res. 4272 de 2021) para trabajo en alturas.

**Quejas del Comité de Convivencia (reservadas):** se cifran en el celular con una clave que crea el propio comité la primera vez que entra a *Quejas*. Ni el servidor, ni la hoja de Google, ni quien administra el portal pueden leerlas. **Si el comité pierde la clave, las quejas no se pueden recuperar**: recomienda guardarla en sobre sellado con el presidente y el secretario. Cuando sale un integrante, el comité usa *Cambiar la clave del comité*.

**Datos de salud:** del concepto médico solo se guarda si es apto y las restricciones; nunca el diagnóstico. Las restricciones solo se ven en la ficha del trabajador.

Si la empresa no va a usar alguno, se desmarca en `configurar-empresa.html` (paso de módulos) y desaparece del inicio.

### Contratistas, adjuntos, usuarios y respaldo (v94)

| Módulo | Qué hace |
|---|---|
| 🚧 **Contratistas** | Documentos de cada empresa contratista con su vencimiento (Cámara de Comercio, ARL, PILA, autoevaluación 0312, matriz de peligros, póliza…) y **control de ingreso a obra**: solo autoriza a las personas habilitadas (se toman de *Personal habilitado* por el nombre de la empresa), con la empresa al día, inducción del sitio, EPP y permisos verificados, y firma de quien autoriza. |
| 📎 **Adjuntos** | En casi todos los registros (acciones, reportes, personal, actas, auditorías, contratistas y los formularios de planeación) se puede adjuntar el soporte: PDF, foto, Word o Excel hasta 10 MB. Se guarda en Google Drive de la empresa (carpeta *Adjuntos SG-SST*) y se baja a través del servidor. Nada se borra: quitar un adjunto lo deja como retirado. |
| 🕘 **Historial** | Cada registro tiene «Historial de cambios»: quién, cuándo y qué campos cambió (sale de la bitácora). |
| 👥 **Usuarios con nombre** (opcional) | Mientras no se activen, todo funciona con la clave del portal. Para activarlos: en Apps Script ejecuta ▶ `sgsst__codigoAdministrador`, y en el portal → *Usuarios y respaldo* escribe el código y crea el administrador. Desde ahí cada persona entra con su usuario (clave temporal que cambia la primera vez), cada cambio queda con su nombre y cada rol ve y cambia solo lo suyo (Administrador, SST, Supervisor, Comité, Solo consulta). Sin usuario se puede seguir **reportando** y los permisos siguen consultando el personal habilitado. Si nadie recuerda la clave del administrador, el mismo código sirve para recuperarla. |
| 💾 **Respaldo semanal** | `instalar` ya lo deja programado: cada domingo a las 2 a. m. se copian **todos** los libros a la carpeta *Respaldos SG-SST*. Se guardan las últimas 8 semanas y, para siempre, la primera copia de cada mes. La bitácora queda protegida contra edición manual. |

### EPP, inducción, programas de alto riesgo y PESV (v95)

| Módulo | Qué hace |
|---|---|
| 🧤 **Matriz y entrega de EPP** | EPP de cada cargo con su norma y vida útil (trae un catálogo de partida), entregas con la firma de quien recibe y la constancia de que se explicó el uso, y la lista de lo que hay que reponer (también llega en el correo diario). |
| 🎓 **Inducción y reinducción** | Temas, evaluación que la persona responde en el celular (aprueba con 80 %) y firma. Al aprobar, el requisito de inducción de *Personal habilitado* queda al día solo (vence en 12 meses). Temas, preguntas y nota se cambian en `empresa.js` → `induccion`. |
| 🧗 **Programas de alto riesgo** | Alturas, espacios confinados, eléctrico, caliente e izaje: requisitos de cada programa con su evidencia, e indicadores sacados del portal (personal con curso vigente, equipos al día, permisos del mes, simulacros de rescate, incidentes). Lo que no se cumple pasa al plan de acción. |
| 🚗 **PESV** | Nivel según vehículos y conductores, los 24 pasos de la Res. 40595 de 2022 con evidencia, vehículos (SOAT, revisión técnico-mecánica, mantenimiento), conductores (licencia, comparendos, capacitación) y siniestros viales. |

Las listas de requisitos de los programas y los pasos del PESV son una guía práctica: verifícalas con el texto vigente de cada norma.

### Tablero de la gerencia, reporte anual, ambiental y RUC (v96)

| Módulo | Qué hace |
|---|---|
| 📊 **Tablero de la gerencia** | Todo el SG-SST en una pantalla con semáforos (autoevaluación, accidentalidad, plan de acción, plan anual, comités, programas, PESV, personal, EPP, contratistas, ambiental) e informe en PDF. A quien no es SST no le muestra datos de salud. |
| 📦 **Reporte anual 0312** | Lista de lo que hay que tener (autoevaluación cerrada, plan de mejoramiento, registro en la plataforma, avances a la ARL) y el paquete en PDF con los 60 estándares, el plan y los indicadores del art. 30. Desde el 15 de noviembre el correo diario lo recuerda hasta que se registre. |
| 🌱 **Gestión ambiental** | Matriz de aspectos e impactos (valoración de referencia frecuencia × severidad × alcance), residuos con la categoría de generador RESPEL (media de 6 meses) y certificados, y consumos de agua, energía y combustible. |
| 🧾 **Auditorías ISO 14001 y RUC** | Lista ISO 14001 por capítulos. La de RUC viene vacía: se pega la Guía RUC vigente desde Excel (numeral, requisito, peso) y se calcula la calificación ponderada. |

### Estándares según el tamaño y panel del asesor (v97)

**Perfil de la empresa.** En *Auditorías* (o en el *Tablero de la gerencia*) se escribe el número de trabajadores y la clase de riesgo más alta. Con eso el portal sabe qué estándares le aplican (Res. 0312 de 2019): **7** si tiene hasta 10 trabajadores y riesgo I a III (art. 3), **21** si tiene de 11 a 50 y riesgo I a III (art. 9), y **60** si tiene más de 50 o riesgo IV o V (art. 16). La autoevaluación que le aplica sale de primera. En los grupos de 7 y 21 el porcentaje es el de estándares que se cumplen, todos con el mismo peso: compáralo con el formato de tu ARL.

**Panel del asesor** (`asesor.html`). Para quien asesora varias empresas que tienen el portal instalado: cada cliente con su tamaño, clase de riesgo y segmento (7, 21 o 60), filtros, visitas y tareas. Las tareas se dejan **en el plan de acción del cliente** (origen «Asesor SST»); el cliente las ve con un aviso, las trabaja y las cierra con evidencia, y el asesor las verifica o las reabre. «Tareas de sus estándares» crea de una vez las tareas de los estándares que el cliente no cumplió en su última autoevaluación. Para conectar un cliente hacen falta la URL de su servidor (`verConfiguracion`) y su clave del portal; si el cliente usa usuarios con nombre, debe crearle al asesor un usuario con rol SST.

### Sustancias químicas, inspecciones flexibles y avisos a clientes (v98)

| Módulo | Qué hace |
|---|---|
| ⚗️ **Sustancias químicas** (`quimicos.html`) | Inventario con los pictogramas del SGA (con su dibujo), palabra de advertencia, frases H, CAS/ONU, EPP y la ficha de datos de seguridad adjunta (PDF). La próxima revisión de la ficha se pone sola a 5 años (Res. 773 de 2021, art. 18) y entra al correo diario. **Almacenamiento:** por cada lugar revisa qué sustancias quedan juntas y marca las que no deben ir juntas (p. ej. inflamable + comburente, ácido + base) o van con precaución, con el porqué y la matriz en PDF. **Res. 773:** semáforo de las obligaciones del empleador (inventario, etiquetas y fichas, capacitación anual en SGA, señalización, emergencias) y botón para crear en el plan de acción las acciones de lo que falta, sin repetir las abiertas. Lo que estaba en *Matriz de peligros → Sustancias* sigue ahí y se abre en el módulo nuevo. |
| 🔍 **Inspecciones** | **Listas de chequeo propias** (cocina, bodega, 5S…) y **ajuste** de las que trae el portal: la ajustada reemplaza a la original sin perder el inventario ni el historial, y se puede volver a la original. Listas nuevas de **almacenamiento de químicos** e **instalaciones eléctricas**. **Tipo de inspección:** rutinaria, gerencial, del COPASST o preoperacional; en las gerenciales y del COPASST se anotan los participantes con su firma (salen en el PDF) y los hallazgos del COPASST quedan con ese origen. **Cronograma anual:** equipos y áreas según su frecuencia, más las gerenciales y del COPASST que se programen; muestra lo hecho, lo atrasado y el % de cumplimiento, con PDF. El correo diario avisa desde el día 20 la gerencial o del COPASST del mes que no se ha hecho. |
| 📧 **Avisos a los clientes del asesor** | En el panel del asesor, *Configurar* en cada cliente guarda en **su** portal el correo del responsable del SG-SST y el del asesor. Desde ahí, el servidor del cliente avisa por correo cuando le dejan una tarea, le recuerda las que vencen en 3 días o ya vencieron (al día siguiente y luego cada semana) y le avisa al asesor cuando cierran una. Los correos salen solo a esas direcciones (y al usuario del portal que se llame como el responsable), con un tope diario. El cliente debe tener su servidor en v98 o posterior; también puede poner los correos él mismo en *Perfil de la empresa*. |

### Carga masiva desde Excel (v100)

Para arrancar una empresa sin digitar uno por uno. Está en **Personal habilitado**, **Inspecciones** (inventario), **Sustancias químicas**, **Documental → Matriz legal** y **Matriz de peligros**: botón «⬆️ Cargar desde Excel».

1. **Plantilla:** descárgala (CSV que abre en Excel). Los títulos con * son obligatorios.
2. **Llenar:** una fila por registro.
   - Fechas como 15/03/2026.
   - Sí/No en las casillas.
   - Las listas con sus opciones; por ejemplo, los pictogramas por nombre o código GHS, separados por coma.
3. **Pegar o subir:** copia las celdas con la fila de títulos y pégalas, o sube el archivo guardado como CSV.
4. **Revisar:** antes de guardar se ve qué filas son nuevas, cuáles actualizan algo que ya existe y cuáles tienen errores, y por qué. Las filas con error no se cargan.
5. **Cargar:** se guarda por lotes en el servidor. Si una persona, equipo o sustancia ya existe, solo cambia lo que trae la fila: no borra sus requisitos, soportes ni historial. Cargar el mismo archivo dos veces no duplica nada. En un registro que ya existe, una celda vacía deja lo que tenía (los valores por defecto, como «Activo: Sí», son solo para los nuevos).
   - Las cédulas: dale a la columna formato Número sin decimales; si Excel las muestra como 1,02E+09, el portal rechaza la fila y lo explica.

- En personal, el vencimiento de cada requisito se calcula con la vigencia configurada si no viene en la fila.
- En peligros, la valoración GTC 45 (NP, NR, nivel y aceptabilidad) se calcula sola.
- En sustancias, la próxima revisión de la ficha sale a 5 años.

### Kit documental (v101)

`documentos.html` genera **20 documentos del SG-SST** con los datos de la empresa:
- **Datos del perfil:** razón social, NIT, actividad, trabajadores, clase de riesgo, ARL, ciudad, representante legal y responsable del SG-SST.
- **Datos del portal:** los peligros de la matriz, el comité que corresponde (COPASST, o vigía con menos de 10 trabajadores) y los códigos de los formatos.

Los documentos son:
- **Política y documentos de la estructura:** política de SST, objetivos con metas e indicadores, designación del responsable, roles y responsabilidades, asignación de recursos y reglamento de higiene y seguridad industrial.
- **Procedimientos:** identificación de peligros (GTC 45), reporte e investigación de incidentes y accidentes, acciones correctivas y preventivas, gestión del cambio, auditoría, revisión por la dirección, control de documentos y conservación de registros, comunicación, compras y contratistas, y emergencias.
- **Programas y manual:** programas de capacitación, inspecciones y evaluaciones médicas, y el manual del SG-SST.

Para cada documento:
- Dice qué estándar de la Res. 0312 cubre y si está entre los que le aplican a la empresa (7, 21 o 60).
- Se ve en pantalla, sale en **PDF** con el encabezado de la empresa y en **Word editable** para ajustarlo. También se pueden sacar todos en un solo PDF o en un solo Word.
- **Aprobar** lo registra en el listado maestro (Documental) con su versión, la fecha y la próxima revisión a un año. Allí se adjunta la versión firmada. Aprobar de nuevo sube la versión.

Son una base técnica según el Decreto 1072 de 2015 y la Resolución 0312 de 2019. La empresa (o tú, como asesor con licencia) los revisa y los ajusta a su realidad antes de aprobarlos.

### Gestión de la calidad ISO 9001 (v102)

`calidad.html` (HSEQ · Calidad) cubre el sistema de gestión de la calidad:

| Pestaña | Qué hace |
|---|---|
| **Contexto** (4.1 a 4.3) | Alcance, DOFA y partes interesadas con sus necesidades y cómo se les hace seguimiento. Se revisa cada año y el correo diario lo recuerda. |
| **Riesgos y oportunidades** (6.1) | Probabilidad × impacto (1 a 5): alto desde 15. Los riesgos altos van al plan de acción con origen «Calidad». |
| **Objetivos** (6.2) | Indicador, fórmula, meta (mayor o menor que) y frecuencia. Cada medición queda guardada con su análisis; si no cumple, ofrece la acción. |
| **No conforme** (8.7) | Producto o servicio no conforme: dónde se detectó, cantidad, costo y tratamiento (corrección, concesión, rechazo…). Con acción correctiva cuando hace falta. |
| **PQRS** | Peticiones, quejas, reclamos, sugerencias y felicitaciones. El plazo interno es de 15 días hábiles y se cambia en `empresa.js` con `calidad: { diasPQRS: 10 }`. No se cierra sin respuesta, el correo diario avisa las vencidas y mide el % respondido a tiempo. Una queja o reclamo que procede va con acción. |
| **Satisfacción** (9.1.2) | Encuestas con 4 criterios (1 a 5) y NPS. Calcula la satisfacción global, el NPS y el promedio por criterio de los últimos 12 meses. Trae encuesta en blanco para imprimir. |

En **Auditorías** quedó la lista de verificación **ISO 9001:2015** por capítulos (4 a 10). La evaluación de proveedores sigue en Documental.

### Manual de uso y videos (v103)

- **❓ Ayuda** (en el inicio) abre `ayuda.html`, el manual dentro del portal:
  - guías paso a paso de cada módulo;
  - filtro por rol (trabajador y supervisor, SST, comités, gerencia, asesor) y buscador;
  - preguntas frecuentes.
- **Videos:** cada guía tiene un video corto (30 a 60 segundos, con subtítulos), grabado sobre la empresa demo. Están en la carpeta `videos/` del sitio (pesan unos 2,5 MB en total). Necesitan señal; el resto del manual funciona sin ella.
- **Volver a grabar los videos** cuando cambie una pantalla (con Playwright y ffmpeg):
  ```
  node herramientas/armar-demo.js /tmp/sitio-demo
  (cd /tmp/sitio-demo && python3 -m http.server 8766) &
  node herramientas/grabar-videos.js http://localhost:8766
  ```

---

## Vender el portal a varias empresas (sitio multiempresa, v99)

En vez de un sitio por empresa, **tú publicas UN sitio con tu marca** y cada empresa entra con su código. Así una actualización del sitio les llega a todas a la vez, y los servidores se actualizan con un solo comando.

**Lo que es de cada uno:**
- **Tuyo:** el sitio (GitHub Pages), tu marca y el archivo de cada empresa (`empresas/<código>.json`).
- **De la empresa:** su servidor y sus datos, en **su** cuenta de Google. Tú no ves sus datos salvo que te compartan el proyecto como editor para mantenerlo; pon eso por escrito en el contrato.

**1. Tu sitio (una vez)**
1. Sube el portal a tu repositorio de GitHub y activa GitHub Pages (como en el paso 2).
2. Abre `configurar-empresa.html` → **«Tu sitio multiempresa (tu marca)»**. Escribe el nombre de tu producto, tus datos y tu logo. Descarga `empresa.js` y `manifest.json` y súbelos al repositorio.
3. Crea en el repositorio la carpeta `empresas/`.

**2. Cada empresa nueva**
1. Instala su servidor en **su** cuenta de Google (paso 1 de esta guía, con el paso 8: compártelo contigo como editor).
2. En tu sitio, `configurar-empresa.html` → **«Empresa dentro de tu sitio multiempresa»**. Llena el código (por ejemplo `acme-sas`), sus datos, su logo y su servidor (`verConfiguracion`).
3. Descarga `acme-sas.json` y súbelo a `empresas/` en tu repositorio.
4. Envía a la empresa el enlace `https://tu-sitio/?e=acme-sas` o imprime el QR que sale en el configurador. Cada celular lo abre una vez y queda en esa empresa. La clave del portal es la de su servidor.
5. En tu **panel del asesor**, crea el cliente con su servidor, su clave y el mismo código.

Un enlace a una página concreta (p. ej. un registro del plan de acción) en un celular sin empresa pide el código y, al entrar, abre esa página.

Un celular queda en una sola empresa. Para cambiar, se usa «cambiar» al pie del inicio o el enlace de otra empresa. No deja cambiar si hay registros sin enviar, y al cambiar borra lo de la anterior en ese equipo (en el servidor no se borra nada).

**3. Actualizar a todas**
- **Sitio:** subes la versión nueva a tu repositorio y les llega a todas. Nunca reemplaces `empresa.js`, `manifest.json` ni la carpeta `empresas/`.
- **Servidores:** desde tu computador, una vez: Node 18+, `npm install -g @google/clasp`, `clasp login` con tu cuenta, y activar la API de Apps Script en script.google.com/home/usersettings. Luego haz una lista `clientes.json` (fuera del repositorio):
  ```json
  [ { "codigo": "acme-sas", "nombre": "ACME S.A.S.", "scriptId": "1AbC…", "servidor": "https://script.google.com/macros/s/AKfy…/exec" } ]
  ```
  y corre `node herramientas/actualizar-servidores.js clientes.json`.
  - Por cada empresa: descarga su proyecto, conserva su `01-Empresa` y su `appsscript.json`, sube el código nuevo y lo publica en la **misma** URL. Al final comprueba que responda con la versión nueva.
  - Con `--probar` arma todo sin subir nada, y con `--solo acme-sas` actualiza solo esa empresa.
  - Un servidor de la v98 o anterior (sin `01-Empresa`) queda migrado con sus mismos datos.
  - **Código propio de un cliente:** todo `.gs` se reemplaza menos `01-Empresa` y los que empiecen por `propio` (p. ej. `propio-Informes.gs`). Si un cliente agregó un archivo con otro nombre, se quita y el resumen lo dice: renómbralo antes.
- El **panel del asesor** muestra la versión del servidor de cada cliente y cuántos faltan por actualizar.
- Si una versión nueva pidiera permisos nuevos de Google, el dueño del proyecto debe ejecutar ▶ `instalar` una vez; el resumen del comando lo avisa.

---

## Actualizar a una versión nueva del portal

- **Sitio:** sube los archivos nuevos **menos** `empresa.js` y `manifest.json` (esos son de la empresa).
- **Servidor:** solo si cambió algún backend. Vuelve a pegar los archivos de `servidor-unico/` que cambiaron → *Gestionar implementaciones → Nueva versión*.
- **De v98 o anterior a v99 (a mano):** los datos de la empresa pasaron de `00-Portal` a un archivo nuevo, `01-Empresa`. Crea `01-Empresa` con el contenido de `servidor-unico/01-Empresa.gs` y pon ahí las tres líneas (`EMPRESA_NOMBRE`, `CORREOS_SSTA`, `CONTACTO_EPP`) que tenías arriba de tu `00-Portal`. Después pega el `00-Portal` nuevo. Con `herramientas/actualizar-servidores.js` esto se hace solo.
- **De v93 o anterior a v94:** el servidor ahora usa **Google Drive** (adjuntos y respaldo). Después de pegar el código y **antes** de *Nueva versión*, ejecuta una vez ▶ `instalar` y acepta el permiso nuevo de Drive. Si no se autoriza, el portal no puede guardar nada (Google responde con su pantalla de permisos).

Para quien mantiene el código: `servidor-unico/` se genera con `node herramientas/armar-servidor-unico.js` a partir de `backends/`. Las pruebas (`node pruebas/pruebas.js`) avisan si quedó desactualizado.

---

## La empresa demo (para mostrar el portal)

Es el portal completo con una empresa ficticia («Montajes Andinos S.A.S. (empresa demo)»). **No usa Google**: el servidor corre dentro del navegador y lo que se registre queda solo en ese equipo. Tiene datos de ejemplo:

- 2 ATS (uno cerrado);
- permisos en caliente y en alturas firmados;
- el anexo de una obra con 4 días;
- charlas de dos semanas;
- inspecciones de EPP;
- gestión del SG-SST: 12 trabajadores con sus requisitos (uno con alturas vencido, otro con la PILA vencida), reportes (un accidente con FURAT e investigación en curso), plan de acción, 8 equipos con sus inspecciones e indicadores de 3 meses.
- plan anual, matriz de peligros, plan de emergencias con simulacro, exámenes y ausentismo, política, matriz legal evaluada y una revisión por la dirección;
- COPASST y Comité de Convivencia conformados con sus actas mensuales, dos quejas cifradas (la clave de la demo es `Convivencia2026`) y tres auditorías (autoevaluación de estándares mínimos al 85 %, una de cliente y una interna programada).

Las fechas se corren solas para verse siempre recientes. El botón **🧪 DEMO** (abajo a la izquierda) explica qué es y permite **reiniciar**.

**Publicarla:**

1. `node herramientas/armar-demo.js` → sale la carpeta `sitio-demo/`.
2. Súbela a un repositorio de GitHub Pages en **una cuenta distinta** a la de INDIMON y a la de los clientes (por ejemplo, la tuya personal).

**Regenerar los datos de ejemplo** (si cambian los formatos): sirve `sitio-demo/` en un puerto y ejecuta `node herramientas/sembrar-demo.js http://localhost:8766` (necesita Playwright).

---

## Protección de datos (Ley 1581 de 2012)

Con esta instalación, la empresa es la **responsable** de los datos (nombres, cédulas, firmas) y los guarda en su propia cuenta. Si quien vende o da soporte va a tener acceso a esa cuenta o a la carpeta, conviene firmar un **contrato de transmisión o encargo de datos** y que la empresa tenga su política de tratamiento y la autorización de los trabajadores.

*Esto es orientación general, no asesoría legal: confírmalo con un abogado.*
