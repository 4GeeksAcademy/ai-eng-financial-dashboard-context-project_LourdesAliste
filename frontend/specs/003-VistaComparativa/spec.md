# Objetivo

Comparar los ingresos y las principales categorías de los grupos B2B y B2C para un rango de fechas.

# Usuario

Usuario del dashboard financiero. El proyecto no define un perfil más específico.

# Historia de usuario

Como usuario del dashboard, quiero comparar los ingresos de B2B y B2C y sus principales categorías dentro de un rango de fechas.

# Requisitos funcionales

- Mostrar una nueva vista con dos secciones en paralelo: B2B y B2C.
- Mostrar en cada sección una tabla de las cinco categorías principales de ingresos del grupo, con nombre de categoría, total de ingresos y porcentaje respecto del total de ingresos de ese grupo para el mismo rango.
- Mostrar debajo de las tablas un único gráfico que compare los ingresos totales de B2B y B2C para el rango seleccionado.
- Permitir filtrar la comparación por fechas en formato `YYYY-MM-DD`.
- Obtener las categorías disponibles mediante `GET /api/metrics/facets` y obtener las categorías principales mediante `GET /api/metrics/categories/top?operation_type=income&limit=5`, distinguiendo los grupos B2B y B2C.

El backend confirma que `/api/metrics/facets` devuelve `business_types` y una lista global `categories`, sin desglose por grupo. `/api/metrics/categories/top` admite `operation_type`, `limit`, `business_type`, `start_date` y `end_date`, y devuelve `category`, `operation_type` y `total_amount`; no devuelve el porcentaje ni el total de ingresos del grupo. `/api/metrics/summary` admite grupo y fechas y devuelve `period`, `income`, `outcome` y `net`.

En las respuestas reales consultadas, `categories/top` devolvió dos categorías de ingreso para cada grupo, no cinco. No se puede confirmar que cada grupo tenga cinco categorías disponibles. Tampoco se puede obtener de facets la lista de categorías desglosada por grupo; el requisito de categorías disponibles por grupo queda pendiente de aclaración sobre el contrato esperado.

# Criterios de aceptación

Los siguientes escenarios constituyen los casos de prueba de la funcionalidad:

1. **Secciones comparativas:** la vista muestra las secciones B2B y B2C en paralelo.
2. **Categorías principales:** cada sección muestra las categorías de ingreso disponibles del grupo, ordenadas por total y con un máximo de cinco filas.
3. **Datos de tabla:** cada fila muestra el nombre de la categoría y su total de ingresos; también muestra su porcentaje respecto del total de ingresos del mismo grupo y rango.
4. **Gráfico comparativo:** debajo de las tablas hay un único gráfico que compara los ingresos totales de B2B y B2C.
5. **Filtro de fechas:** seleccionar un rango envía las fechas en formato `YYYY-MM-DD` y la comparación refleja ese rango.
6. **Categorías disponibles:** la vista consulta `GET /api/metrics/facets` para conocer los tipos de negocio y categorías disponibles. El contrato actual no permite verificar un desglose de categorías por grupo.
7. **Categorías top por grupo:** se consultan las categorías de ingresos mediante `GET /api/metrics/categories/top` para B2B y B2C con `operation_type=income` y `limit=5`.
8. **Actualización coherente:** al cambiar el rango, se actualizan las dos tablas y el gráfico comparativo.

# Fuera del alcance

- Otras métricas, grupos o visualizaciones no indicados en estos requisitos.
