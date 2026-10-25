# Contratos de API por funcionalidad

Este documento distingue el contrato actual del backend y el consumo frontend de los requisitos descritos en las specs. Las respuestas se documentan según modelos/rutas actuales; cuando un tipo TypeScript de aplicación no existe o una regla funcional no está definida, se indica expresamente.

## Funcionalidad 1: filtro de rango de fechas

**Estado:** implementada en el frontend y soportada por el backend.

### Endpoints y tipos

- `GET /api/metrics`
  - Parámetros relevantes: `start_date` y `end_date`, ambos opcionales y recibidos por FastAPI como `date`. Se serializan/representan en el cliente como fechas `YYYY-MM-DD`. Cada límite es inclusivo y puede enviarse de forma independiente.
  - También admite `category` opcional (`suppliers`, `sales`, `operational`, `administrative` o `others`) y `operation_type` opcional (`income` o `outcome`); esta funcionalidad no los envía.
  - Si se omiten ambos, el backend no filtra por fecha. El frontend los omite cuando sus campos están vacíos.
  - Respuesta: lista de `FinancialMovement`; todos los campos son requeridos. Cada elemento contiene `create_date` (fecha JSON `YYYY-MM-DD`), `amount` (float), `operation_type` (`income` o `outcome`), `category` (`suppliers`, `sales`, `operational`, `administrative` u `others`) y `business_type` (`B2B` o `B2C`).
  - Tipos TypeScript: petición `DateRangeFilter` en `frontend/src/lib/financial-types.ts` y `frontend/specs/param-types.ts`; respuesta `FinancialMovement[]` en `frontend/src/lib/financial-types.ts`.
- `GET /api/metrics/facets`
  - No recibe parámetros de consulta.
  - Respuesta `MetricsFacets`/`FacetsResponse`: todos los campos son requeridos: `operation_types` (`income`/`outcome`), `business_types` (`B2B`/`B2C`), `categories` (los cinco valores enumerados arriba), `min_date` y `max_date` (fechas JSON `YYYY-MM-DD`).
  - El tipo TypeScript `FacetsResponse` está en `frontend/src/lib/financial-types.ts` y `frontend/specs/api-types.ts`. `App` consulta este endpoint y pasa el rango disponible a `DateRangeFilter`.

### Casos límite

- Ambos parámetros omitidos: se devuelven todos los movimientos disponibles (el generador actual produce 360 movimientos de ejemplo).
- Solo un límite informado: se aplica únicamente ese límite y se incluye el día señalado.
- Inicio posterior al fin: el frontend marca el rango como inválido y no envía la consulta; el backend no declara esa validación y el filtrado directo produciría una lista vacía.

## Funcionalidad 2: tabla de alertas de anomalías

**Estado:** el frontend consume la alerta y muestra una tabla; el backend tiene el contrato ampliado. La validación del umbral difiere entre API e interfaz.

### Endpoint y tipos

- `GET /api/metrics/alerts`
  - `threshold`: `float`, opcional, default `0.3`. El backend acepta valores `>= 0` y no declara máximo. El input frontend permite `0.01`–`1.0`; fuera de ese intervalo no actualiza el umbral de la petición.
  - `group_by`: opcional, `day`, `week` o `month`, default `month`. El frontend actual no lo envía, por lo que se usa `month`.
  - `start_date` y `end_date`: fechas opcionales, límites inclusivos, formato de consulta `YYYY-MM-DD`.
  - `business_type`: opcional, `B2B` o `B2C`; el frontend actual no lo envía.
  - Respuesta: lista `MetricsAlert`; los campos son requeridos: `period` (etiqueta de grupo), `start_date` y `end_date` (fechas), `outcome_total`, `baseline_average` e `increase_ratio` (números).
  - Tipos TypeScript: `AlertsParams` y `AlertsResponse`/`AlertEntry` en `frontend/src/lib/financial-types.ts`; descripciones contractuales en `frontend/specs/param-types.ts` y `frontend/specs/api-types.ts`.
  - `App` envía `threshold` y el rango activo; `AlertsTable` presenta las fechas, cantidades y `increase_ratio` como porcentaje.

### Comportamiento y restricciones implementados

- `period` identifica un grupo día (`YYYY-MM-DD`), semana ISO (`YYYY-Www`) o mes (`YYYY-MM`), según `group_by`.
- `start_date`/`end_date` limitan los movimientos candidatos. La media se obtiene de las tres entradas anteriores en el resumen histórico de la misma granularidad, incluso si quedan antes del inicio del rango. Ese resumen solo crea entradas para períodos con movimientos; por ello, en agrupaciones diarias o semanales las tres entradas previas no necesariamente son tres intervalos calendario consecutivos. Si el requisito exige intervalos consecutivos incluyendo períodos sin movimientos, ese comportamiento está pendiente de aclaración y no coincide con el cálculo actual.
- Las fechas de la alerta son la primera y última fecha con movimientos de egreso dentro del grupo detectado.
- Solo se produce alerta si existen tres grupos previos, la media es positiva y el incremento es estrictamente mayor que `threshold`. `increase_ratio` es un ratio decimal, no un porcentaje entre 0 y 100.
- El requisito describe intervalos determinados por datos/detección, pero el backend sigue agrupando según `group_by`; por defecto es mensual. La regla que permitiría intervalos de duración distinta a esos grupos queda pendiente de aclaración.

### Casos límite

- Para los primeros tres grupos disponibles del resumen no se genera alerta; tampoco si la media de las tres entradas previas es cero.
- Si faltan períodos calendario sin movimientos, el resumen no genera entradas vacías: la referencia usa las tres entradas anteriores disponibles, no rellena los huecos.
- Incremento igual al umbral: no se genera alerta; el detector requiere que sea mayor.
- Rango de fechas invertido: `App` no consulta alertas mientras el rango esté marcado inválido.

## Funcionalidad 3: vista comparativa B2B vs B2C

**Estado:** especificada, todavía no implementada en el frontend. El backend ofrece categorías top, facets globales y resúmenes por grupo/fecha, pero no todo el dato solicitado en una sola respuesta.

### Endpoints y tipos disponibles

- `GET /api/metrics/facets`
  - Sin parámetros.
  - Respuesta `MetricsFacets`/`FacetsResponse`: `business_types` y `categories`, además de `operation_types`, `min_date` y `max_date`.
  - `categories` es una lista global; no se divide por B2B/B2C. El requisito de obtener categorías disponibles por grupo no queda cubierto por el contrato actual.
- `GET /api/metrics/categories/top`
  - `operation_type`: `income` o `outcome`; default `outcome`. La spec requiere `income`.
  - `limit`: entero entre 1 y 20; default 5. La spec requiere 5.
  - `business_type`: opcional, `B2B` o `B2C`.
  - `start_date` y `end_date`: fechas opcionales inclusivas, recibidas como `date` (formato de consulta `YYYY-MM-DD`).
  - Respuesta: lista de `TopCategoryItem` con `category`, `operation_type` y `total_amount` (float). No incluye total de ingresos del grupo ni porcentaje.
- `GET /api/metrics/summary`
  - `group_by`: `day`, `week` o `month`; default `month`.
  - `business_type`: opcional `B2B`/`B2C`; `start_date`/`end_date` opcionales inclusivas y con formato `YYYY-MM-DD`; también admite `category` y `operation_type` opcionales con los valores enumerados en Funcionalidad 1.
  - Respuesta: lista de `MetricsSummaryItem` con todos los campos requeridos: `period` (string), `income`, `outcome` y `net` (float). `income` se proporciona por período, no como total único.
  - El frontend no consume estos endpoints para la comparativa. `financial-types.ts` tampoco declara tipos de aplicación para `TopCategoryItem` o `MetricsSummaryItem`; no hay tipos TS de petición para estos endpoints.

### Casos límite y datos pendientes

- La respuesta real consultada de categorías top contenía dos categorías de ingreso por grupo, no cinco; `limit=5` es un máximo solicitado, no garantiza cinco resultados.
- Si el rango no contiene ingresos para un grupo, `categories/top` devuelve una lista vacía; `summary` puede devolver períodos con `income: 0` si hubo egresos, y solo queda vacío cuando no hubo movimientos. La spec no define el estado visual de esos resultados.
- Si el grupo tiene categorías top pero el total de ingresos del grupo para el rango es cero, el porcentaje no se puede calcular; la spec no define qué mostrar en ese caso.
- La spec requiere categorías disponibles por grupo, pero facets solo devuelve categorías globales; la forma de obtener ese desglose está pendiente de aclaración.
