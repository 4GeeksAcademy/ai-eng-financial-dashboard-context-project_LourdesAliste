# Componentes del dashboard y filtro de fechas

## Componentes existentes verificados

| Nombre | Ubicación | Responsabilidad relacionada |
| --- | --- | --- |
| `App` | `frontend/src/App.tsx` | Carga movimientos desde `/api/metrics`, mantiene estados de carga y error, calcula KPI y datos mensuales y compone la vista del dashboard. No contiene filtros ni inputs de fecha. |
| `DashboardHeader` | `frontend/src/components/dashboard/dashboard-header.tsx` | Presenta el título del dashboard y un período fijo. No muestra ni gestiona fechas de filtro. |
| `KPIRow` | `frontend/src/components/dashboard/kpi-row.tsx` | Presenta las métricas que recibe por la prop `metrics`. |
| `IncomeOutcomeChart` | `frontend/src/components/dashboard/income-outcome-chart.tsx` | Visualiza ingresos y egresos mensuales recibidos mediante la prop `data`. |
| `ProfitPercentChart` | `frontend/src/components/dashboard/profit-percent-chart.tsx` | Visualiza el margen mensual recibido mediante la prop `data`. |

`frontend/src/lib/financial-utils.ts` contiene los cálculos de KPI y la agregación mensual a partir de los movimientos. `frontend/src/lib/financial-types.ts` declara `FinancialMovement` y los tipos de datos consumidos por los componentes. Son módulos de soporte, no componentes de interfaz.

## Elementos de interfaz requeridos que no se encontraron

En el código frontend inspeccionado no hay componentes o controles de filtro por fechas. La funcionalidad requiere elementos visibles para:

- Seleccionar fecha de inicio y fecha de fin de forma independiente.
- Mostrar un mensaje informativo cuando el inicio sea posterior al fin.
- Mostrar cerca de los campos la fecha más antigua (`min_date`) y la más reciente (`max_date`) disponibles.

Estos son requisitos de la funcionalidad; no representan componentes existentes ni nombres asignados a componentes futuros.

## Relaciones entre componentes y datos

Actualmente, `App` solicita la lista de movimientos a `/api/metrics`, entrega esa lista a `computeKPIs` y `computeMonthlyData`, y pasa los resultados a `KPIRow` y a los dos gráficos mediante sus props. Así, KPI y gráficos muestran los datos recibidos por `App`; ninguno de esos componentes realiza el filtrado.

El código frontend actual no consulta `/api/metrics/facets`. Los contratos documentados para `FacetsResponse` y `DateRangeFilter` están en `frontend/specs/api-types.ts` y `frontend/specs/param-types.ts`; esos archivos no implementan componentes ni consumo de API.

## Información pendiente de confirmar

No se ha verificado el comportamiento visual en ejecución. Tampoco existe actualmente una relación entre el período fijo mostrado por `DashboardHeader` y las fechas de los datos o un futuro filtro.
