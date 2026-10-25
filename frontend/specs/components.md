# Componentes del dashboard y funcionalidades relacionadas

## Componentes existentes verificados

| Nombre | Ubicación | Responsabilidad relacionada |
| --- | --- | --- |
| `App` | `frontend/src/App.tsx` | Carga movimientos, facets y alertas; mantiene los estados del rango de fechas y umbral; calcula KPI y datos mensuales; compone el dashboard y pasa resultados por props. No contiene una vista comparativa B2B/B2C. |
| `DashboardHeader` | `frontend/src/components/dashboard/dashboard-header.tsx` | Presenta el título del dashboard y un período fijo. No muestra ni gestiona fechas de filtro. |
| `DateRangeFilter` | `frontend/src/components/dashboard/date-range-filter.tsx` | Permite elegir inicio y fin independientemente, presenta el rango disponible y avisa si el rango es inválido. Recibe y emite las fechas mediante props. |
| `KPIRow` | `frontend/src/components/dashboard/kpi-row.tsx` | Presenta las métricas que recibe por la prop `metrics`. |
| `IncomeOutcomeChart` | `frontend/src/components/dashboard/income-outcome-chart.tsx` | Visualiza ingresos y egresos mensuales recibidos mediante la prop `data`. |
| `ProfitPercentChart` | `frontend/src/components/dashboard/profit-percent-chart.tsx` | Visualiza el margen mensual recibido mediante la prop `data`. |
| `AlertsTable` | `frontend/src/components/dashboard/alerts-table.tsx` | Muestra alertas, input numérico de umbral, carga/error y estado vacío a partir de sus props. |

`frontend/src/lib/financial-utils.ts` contiene los cálculos de KPI y la agregación mensual. `frontend/src/lib/financial-types.ts` declara `FinancialMovement` y los tipos de datos del dashboard. Son módulos de soporte, no componentes de interfaz. En `frontend/src/components/ui/` existen `card.tsx` y `skeleton.tsx`, usados para presentación y carga.

## Funcionalidad 1: filtro de fechas existente

`App` conserva `startDate` y `endDate`, y envía sus valores a `/api/metrics` como `start_date` y `end_date` cuando están definidos. También consulta `/api/metrics/facets` y pasa `min_date` y `max_date` al componente `DateRangeFilter`. Los KPI y gráficos reciben los resultados procesados por `App`; no realizan el filtrado por sí mismos.

## Funcionalidad 2: alertas existentes

- `App` consulta `/api/metrics/alerts` con el umbral seleccionado y las fechas activas, y coloca `AlertsTable` después de los gráficos.
- `AlertsTable` muestra las fechas, gasto, media, incremento porcentual, control del umbral y estado vacío/error/carga. No hay otros componentes de tabla en `frontend/src/components/`.
- `frontend/src/lib/financial-types.ts` declara `AlertEntry`, `AlertsResponse` y `AlertsParams`; son tipos de datos, no componentes de interfaz.

## Funcionalidad 3: vista comparativa B2B/B2C

### Elementos existentes relacionados

- `App` y `DateRangeFilter` ya mantienen y transmiten el rango de fechas utilizado por el dashboard.
- `FinancialMovement` en `frontend/src/lib/financial-types.ts` incluye `business_type` (`B2B` o `B2C`), `category`, `amount` y `create_date`.
- El frontend ya usa gráficos y recibe sus datos por props, pero los gráficos actuales muestran ingresos/egresos y margen mensuales, no una comparación B2B/B2C.

### Elementos de interfaz todavía no encontrados

- No existe una vista comparativa con secciones B2B y B2C en paralelo.
- No hay tablas de categorías para cada grupo ni un único gráfico de ingresos comparativos.
- No hace falta introducir otro input de fecha según el código inspeccionado: `DateRangeFilter` ya permite elegir el rango.
- No se encontraron componentes de navegación entre vistas; `main.tsx` monta directamente `App`.

### Relación entre componentes y datos

Actualmente `App` no consulta `/api/metrics/categories/top` ni `/api/metrics/summary` y no transmite datos comparativos a componentes. El backend ofrece esos endpoints y `GET /api/metrics/facets`; sus respuestas no se consumen para esta funcionalidad.

`facets` devuelve categorías globales, no un desglose por grupo. `categories/top` acepta `business_type`, fechas, `operation_type` y `limit`, y devuelve `category`, `operation_type` y `total_amount`, sin porcentaje ni total de ingresos del grupo. `summary` admite grupo y fechas y devuelve `period`, `income`, `outcome` y `net`. Las respuestas reales consultadas para categorías top contenían dos categorías de ingreso por grupo; no se verificó que hubiera cinco disponibles.

No se ha verificado la presentación visual de una comparativa porque esa vista no existe en el código actual.
