# Componentes del dashboard, filtro de fechas y alertas

## Componentes existentes verificados

| Nombre | Ubicación | Responsabilidad relacionada |
| --- | --- | --- |
| `App` | `frontend/src/App.tsx` | Carga movimientos desde `/api/metrics`, facets desde `/api/metrics/facets`, mantiene estados de carga/error y el rango de fechas, calcula KPI y datos mensuales y compone el dashboard. Todavía no consulta `/api/metrics/alerts`. |
| `DashboardHeader` | `frontend/src/components/dashboard/dashboard-header.tsx` | Presenta el título del dashboard y un período fijo. No muestra ni gestiona fechas de filtro. |
| `DateRangeFilter` | `frontend/src/components/dashboard/date-range-filter.tsx` | Permite elegir inicio y fin independientemente, presenta el rango disponible y avisa si el rango es inválido. Recibe y emite las fechas mediante props. |
| `KPIRow` | `frontend/src/components/dashboard/kpi-row.tsx` | Presenta las métricas que recibe por la prop `metrics`. |
| `IncomeOutcomeChart` | `frontend/src/components/dashboard/income-outcome-chart.tsx` | Visualiza ingresos y egresos mensuales recibidos mediante la prop `data`. |
| `ProfitPercentChart` | `frontend/src/components/dashboard/profit-percent-chart.tsx` | Visualiza el margen mensual recibido mediante la prop `data`. |

`frontend/src/lib/financial-utils.ts` contiene los cálculos de KPI y la agregación mensual. `frontend/src/lib/financial-types.ts` declara `FinancialMovement` y los tipos de datos del dashboard. Son módulos de soporte, no componentes de interfaz. En `frontend/src/components/ui/` existen `card.tsx` y `skeleton.tsx`, usados para presentación y carga.

## Funcionalidad 1: filtro de fechas existente

`App` conserva `startDate` y `endDate`, y envía sus valores a `/api/metrics` como `start_date` y `end_date` cuando están definidos. También consulta `/api/metrics/facets` y pasa `min_date` y `max_date` al componente `DateRangeFilter`. Los KPI y gráficos reciben los resultados procesados por `App`; no realizan el filtrado por sí mismos.

## Componentes propuestos para alertas

- **Tabla de alertas:** no se encontró tabla en `frontend/src/components/`. Se necesita una presentación para las alertas debajo de la sección que contiene los dos gráficos. Debe mostrar período, gasto registrado, media de referencia e incremento porcentual.
- **Input numérico de umbral:** no se encontró un control `type="number"`. La funcionalidad requiere permitir elegir el umbral; el input y su valor seleccionado aún no existen.
- **Estado vacío de alertas:** no se encontró un mensaje vacío para alertas. Los dos gráficos sí muestran `No data available to display`, pero ese estado pertenece a sus propios datos y no representa el de la tabla.
- **`App`:** debe incorporar el consumo de `/api/metrics/alerts`, mantener el umbral seleccionado y colocar la tabla después de los gráficos. Puede reutilizar el estado `startDate`/`endDate` y enviarlos como `start_date`/`end_date` para respetar el filtro existente.
- **Tipos frontend:** `frontend/src/lib/financial-types.ts` todavía no declara tipos para la respuesta de alertas.

No se asignan nombres de componente a los elementos propuestos porque todavía no existen en el código.

## Relación con la API y el filtro

El endpoint de alertas admite `threshold` y los parámetros opcionales `start_date` y `end_date`, por lo que las fechas del filtro existente pueden acompañar la consulta de alertas. `App` ya centraliza las peticiones con `fetch`, usa `VITE_API_BASE_URL` y transmite resultados a sus componentes mediante props.

El backend actual devuelve `period` como string, sin fechas inicial/final por alerta, y calcula la media con todos los períodos anteriores, no solo tres. Para mostrar fechas de inicio y fin y la media exigida, también se requieren cambios en el contrato y cálculo backend. La lógica actual de filtros limita los movimientos antes de agruparlos; queda por definir si los períodos de referencia pueden preceder al rango activo.

No se ha verificado el comportamiento visual de la futura tabla ni del input de umbral en ejecución, ya que todavía no existen.
