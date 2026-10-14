# Portal SSTA

Sistema de gestión de seguridad y salud en el trabajo (SG-SST, Colombia) para
el celular y el computador: permisos de trabajo, ATS, inspecciones, charlas,
personal habilitado, comités, indicadores, plan anual, auditorías y el resto de
la Res. 0312 de 2019. Funciona sin señal y sincroniza cuando vuelve la conexión.

- **Instalar el portal para una empresa (o para varias desde un solo sitio):**
  [INSTALAR-NUEVA-EMPRESA.md](INSTALAR-NUEVA-EMPRESA.md).
- **¿Te estás haciendo cargo de esto sin haberlo construido?** Lee
  [TRASPASO.md](TRASPASO.md): cómo está armado, por qué y dónde están los peligros.

---

## Cómo está armado

| | Qué es | Dónde vive | Cómo se actualiza |
|---|---|---|---|
| **Sitio web** | Pantallas, PDF, funcionamiento sin señal | Un repositorio → GitHub Pages | Subiendo los archivos |
| **Servidor de cada empresa** | Guardado en Google Sheets, correos y avisos | Un proyecto de Google Apps Script en la cuenta de la empresa | `node herramientas/actualizar-servidores.js clientes.json` |

- `empresa.js` tiene los datos de la empresa (nombre, logo, códigos de los
  formatos, módulos activos). Se genera con `configurar-empresa.html`; los que
  trae de fábrica son de ejemplo («Tu empresa»).
- `config.js` trae las URL de servidor vacías: cada empresa pone la suya en su
  configuración (`servidor` / `apiToken`), nunca en el código.
- `servidor-unico/` es el Apps Script que se instala en cada empresa. **Es
  generado**: se arma con `node herramientas/armar-servidor-unico.js` a partir
  de `backends/`, que es el código fuente de cada módulo. No se edita a mano.
- `demo/` es la empresa de demostración (datos ficticios). El sitio demo se arma
  con `node herramientas/armar-demo.js <carpeta>`.

---

## Antes de subir nada: correr las pruebas

```bash
node pruebas/pruebas.js
```

Revisa más de mil cosas en unos segundos: que las firmas no se pierdan, que los
servidores se comporten igual que el navegador, que no falte ningún archivo en
la caché, que todo compile y que en el código no quede ningún dato real
(correos, celulares, tokens, enlaces a formularios o carpetas de alguien).

**Si algo sale en rojo, no subas.** Requiere Node.js; no necesita instalar nada más.

---

## Publicar una versión nueva del sitio

1. Corre las pruebas.
2. **Si tocaste un `.html`, `.js`, `.css` o un ícono → sube `CACHE_NAME` en
   `sw.js`.** Sin esto los celulares siguen mostrando la versión vieja.
3. Sube los archivos al repositorio. GitHub Pages publica en uno o dos minutos.
4. En el celular sale el aviso **«Hay una versión nueva»**; al aceptarlo se actualiza.

Para los servidores: `node herramientas/actualizar-servidores.js clientes.json`
(ver INSTALAR-NUEVA-EMPRESA.md). Al actualizar a mano, siempre **Nueva versión**
de la misma implementación, nunca «Nueva implementación» (cambia la URL).

---

## ATS interactivo: cómo mantener la base de conocimiento

Todo lo que el ATS sugiere sale de `ats-catalogo.js`. Es solo datos, así que
se puede ajustar sin tocar la pantalla:

- **Agregar un control** a un peligro: añadirlo a su lista `controles` con la
  letra de jerarquía (E eliminación, S sustitución, I ingeniería,
  A administrativo, P EPP).
- **Agregar un peligro**: copiar uno existente, darle un `id` nuevo y
  asignarle una de las 7 clases de la GTC 45.
- **Agregar una tarea tipo**: añadirla a `TAREAS` con los ids de sus peligros
  y, si aplica, las tareas que suelen seguirla (`siguiente`).

Después de editar: `node pruebas/pruebas.js` y subir `CACHE_NAME` en `sw.js`.

---

## Decisiones que conviene no deshacer

- **Las firmas se exportan a resolución acotada.** Google Sheets no admite más
  de 50.000 caracteres por celda. Sin el tope, las firmas de tablets grandes se
  perdían en silencio.
- **El servidor recalcula qué EPP está en MALO**, no confía en lo que manda el
  navegador. El correo de reposición debe corresponder a lo que quedó guardado.
- **Los datos de salud solo los ven Administrador y SST**, y las quejas de
  convivencia van cifradas. Lo hace cumplir el servidor, no la pantalla.
- **La bitácora (`Eventos`) registra también los intentos rechazados.** Un
  intento de tocar un permiso cerrado es justo lo que uno querría poder
  demostrar después.
- **Los `@media` no se centralizan.** Una regla dentro de un `@media` movida a
  global aplicaría siempre, y ese error no se ve hasta que alguien gira el
  celular o imprime.

---

## Si algo falla

| Síntoma | Revisar primero |
|---|---|
| Un arreglo «no sirvió» | ¿Subiste `CACHE_NAME`? ¿Aceptaste el aviso de versión nueva? |
| Las firmas no aparecen | Hoja **Firmas** del servidor: ¿hay filas para ese código? |
| «Token inválido» | ¿El `apiToken` de la empresa coincide con el de su servidor (`verConfiguracion`)? |
| Un registro no se guarda | Hoja **Eventos**: ahí queda el motivo del rechazo |
| La página no carga sin señal | ¿Está el archivo listado en `sw.js`? Lo verifican las pruebas |
| No se sabe qué falla en un celular | `estado.html` prueba cada servidor; `?debug=1` en un permiso muestra el panel de diagnóstico |
