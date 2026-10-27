---
name: financial-api-contracts
description: "Use when changing or auditing financial API fields, query parameters, TypeScript response types, KPI formulas, date aggregations, comparisons, or alerts across this repository's FastAPI and React frontend."
---

# Financial API Contracts

## Objetivo

Mantener coherentes los contratos de métricas y el comportamiento financiero observable entre el backend FastAPI y el frontend React/TypeScript. Detectar discrepancias antes de que afecten filtros, KPI, resúmenes o visualizaciones.

Esta skill complementa las reglas existentes del repositorio. No convierte el comportamiento actual del código en requisitos de negocio aprobados.

## Cuándo usarla

- Al añadir o cambiar un endpoint, campo, valor permitido o parámetro de consulta de métricas.
- Al modificar modelos Pydantic o tipos TypeScript que representan la API.
- Al modificar KPI, agregaciones por período, comparaciones o alertas.
- Al investigar una discrepancia entre la respuesta del backend y lo mostrado por el frontend.
- Al revisar cambios que cruzan `backend/app` y `frontend/src`.

No usarla para optimizaciones generales de React, diseño visual o auditorías de accesibilidad; esas tareas corresponden a las skills existentes.

## Archivos que inspeccionar

Lee primero las instrucciones aplicables y el contexto del producto:

- `AGENTS.md`
- `memory-bank/product.md`
- `memory-bank/techContext.md`
- `.agents/rules/backend.md` si la tarea afecta el backend
- `.agents/rules/frontend.md` si la tarea afecta el frontend

Después sigue el flujo afectado, según corresponda:

- Backend: `backend/app/routes.py`
- Frontend: `frontend/src/App.tsx`
- Tipos: `frontend/src/lib/financial-types.ts`
- Cálculos frontend: `frontend/src/lib/financial-utils.ts`
- Pruebas frontend: `frontend/src/lib/financial-utils.test.ts`
- Pruebas backend: `backend/tests/test_routes.py`
- Integración: `frontend/vite.config.ts` y `docker-compose.yml`

No inspecciones o modifiques todos estos archivos si el cambio no los afecta.

## Procedimiento

1. **Delimita el cambio**
   - Identifica endpoint, consumidor, cálculo y pruebas relacionados.
   - Distingue cambios de contrato, de cálculo, de presentación y de datos de ejemplo.

2. **Traza el contrato completo**
   - En `backend/app/routes.py`, revisa ruta, `response_model`, parámetros, valores permitidos, valores por defecto y restricciones.
   - Compáralos con los tipos en `frontend/src/lib/financial-types.ts` y con el consumo en `frontend/src/App.tsx`.
   - Comprueba nombres, tipos, opcionalidad, nulabilidad, formatos de fecha y valores de enumeración.
   - No supongas que TypeScript valida automáticamente el JSON recibido en tiempo de ejecución.
   - Si un endpoint no tiene consumidor frontend, indícalo; no declares que falta un tipo TypeScript como defecto sin demostrar que el frontend lo necesita.

3. **Traza los cálculos financieros**
   - Localiza cada cálculo en el backend y en `frontend/src/lib/financial-utils.ts`; evita duplicar lógica en componentes visuales.
   - Comprueba que las rutas de agregación, comparación y alertas usen los filtros y helpers cronológicos existentes cuando corresponda.
   - Contrasta las fórmulas con las especificaciones del producto y las reglas documentadas.
   - Si solo existe una fórmula en el código, descríbela como comportamiento actual, no como requisito de negocio aprobado.
   - No inventes reglas para redondeo, moneda, períodos vacíos, fechas o denominadores. Si falta una especificación necesaria, indícalo y solicita aclaración antes de alterar ese comportamiento.

4. **Preserva la integración**
   - Mantén los tipos TypeScript y los modelos Pydantic sincronizados cuando cambie el contrato.
   - Conserva el prefijo `/api` y el proxy de Vite hacia `backend:8000` en Compose.
   - No muevas peticiones a componentes visuales si el flujo actual centraliza la petición en `App.tsx`.

5. **Haz el cambio mínimo**
   - Modifica únicamente las capas afectadas y sus pruebas pertinentes.
   - No refactorices endpoints o cálculos ajenos al cambio.
   - No describas los movimientos generados como persistidos o reales: el backend los genera como datos de ejemplo.
   - No afirmes que el período generado coincide con el título fijo del dashboard.

6. **Verifica**
   - Para cambios de cálculos, ejecuta las pruebas relevantes de `financial-utils.test.ts` o añade cobertura enfocada a los casos modificados.
   - Para cambios de API, ejecuta las pruebas de rutas relacionadas y verifica la respuesta del endpoint.
   - Para cambios que cruzan ambas capas, comprueba los tipos, la respuesta API y las pruebas de ambos lados.
   - Usa los comandos del proyecto cuando el entorno lo permita:
     - `docker compose exec backend pytest`
     - `docker compose exec frontend npm test`
     - `docker compose exec frontend npm run build`
     - `docker compose exec frontend npm run lint`
   - No declares una verificación exitosa si no se ejecutó. Si el entorno bloquea un comando, informa del error y de qué quedó sin verificar.

## Salida esperada

Entrega un resumen breve con estas secciones:

1. **Alcance revisado:** endpoints, cálculos, tipos y pruebas realmente inspeccionados.
2. **Contratos:** tabla con endpoint o modelo, campos/valores relevantes, consumidor frontend (si existe), evidencia y estado: `coincide`, `discrepancia`, `sin consumidor` o `no verificable`.
3. **Cálculos:** comportamiento documentado, implementación encontrada en cada capa aplicable y pruebas relevantes. Distingue equivalencia comprobada de comportamiento que existe solo en una capa.
4. **Cambios realizados:** archivos y propósito; si no hubo cambios, indícalo.
5. **Verificaciones:** comandos ejecutados y resultado exacto. Enumera aparte lo que no pudo ejecutarse.
6. **Decisiones pendientes:** especificaciones de negocio que faltan y que impiden decidir una fórmula o cambio.

Cada hallazgo debe incluir referencias a archivos y símbolos concretos. No presentes una posibilidad como un bug confirmado. No propongas añadir tipos o lógica frontend para endpoints que no se consumen sin explicar primero el beneficio y el alcance.

## Ejemplo de salida

Ejemplo ilustrativo del formato basado en el repositorio; no es una declaración de defecto:

### Alcance revisado

Se revisaron `/api/metrics`, `/api/metrics/summary`, sus modelos de respuesta, el consumo desde `App.tsx`, los tipos TypeScript y las utilidades de KPI.

### Contratos

| Endpoint/modelo | Evidencia y consumidor | Estado |
|---|---|---|
| `/api/metrics` / `FinancialMovement` | `backend/app/routes.py` declara `response_model=list[FinancialMovement]`; `frontend/src/lib/financial-types.ts` define `FinancialMovement`; `frontend/src/App.tsx` solicita `/api/metrics`. | coincide en los campos inspeccionados |
| `/api/metrics/summary` / `MetricsSummaryItem` | `backend/app/routes.py` define `period`, `income`, `outcome` y `net`. El `App.tsx` inspeccionado no solicita este endpoint. | sin consumidor |

### Cálculos

`frontend/src/lib/financial-utils.ts` calcula beneficio como ingresos menos egresos y margen como beneficio dividido por ingresos, o cero si no hay ingresos. `frontend/src/lib/financial-utils.test.ts` contiene pruebas para esos casos. No se afirma que la fórmula frontend sea equivalente a una fórmula del endpoint de resumen sin una comparación que lo demuestre.

### Verificaciones

- Prueba de utilidades: no ejecutada.
- Build frontend: no ejecutado.
- Resultado: no se declara ninguna verificación como exitosa.

### Decisiones pendientes

No se requiere añadir un tipo TypeScript para `/api/metrics/summary` mientras no haya un consumidor frontend que lo necesite.

## Criterios de éxito

- Cada campo o valor permitido modificado tiene correspondencia entre modelo backend, tipo frontend y consumidor, cuando exista.
- Los cambios de comportamiento financiero están respaldados por una especificación; si no existe, el agente no inventa una.
- Los cálculos permanecen centralizados y sus casos modificados tienen pruebas pertinentes.
- Los cambios de API conservan filtros, orden cronológico e integración existente cuando aplican.
- El informe separa claramente lo comprobado, lo cambiado, los endpoints sin consumidor y lo que no se pudo verificar.

## Límites con otras skills

- `accessibility` cubre semántica y operabilidad accesible de la interfaz; esta skill no la sustituye.
- `frontend-design` cubre decisiones visuales y de contenido; esta skill no prescribe diseño.
- `vercel-react-best-practices` cubre rendimiento React/Next.js; esta skill no propone optimizaciones generales.
- Esta skill se limita a coherencia de contratos y comportamiento financiero entre FastAPI y el frontend de este repositorio.
