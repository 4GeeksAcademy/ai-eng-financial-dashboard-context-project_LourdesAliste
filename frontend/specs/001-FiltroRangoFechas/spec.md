# Objetivo

Permitir filtrar los datos del dashboard principal por un rango de fechas y conocer el rango disponible del dataset.

# Usuario

Persona que consulta el dashboard financiero. No se ha especificado un perfil de usuario más concreto.

# Historia de usuario

Como usuario del dashboard, quiero seleccionar una fecha de inicio y una fecha de fin de forma independiente para consultar los datos del período que me interesa.

# Requisitos funcionales

- Ofrecer los campos opcionales «Fecha inicio» y «Fecha fin», seleccionables de forma independiente.
- Mostrar en los KPI y gráficos los datos correspondientes a las fechas indicadas, incluyendo ambos límites cuando estén informados.
- Mostrar todos los datos disponibles cuando ambos campos estén vacíos.
- Consultar `GET /api/metrics` enviando las fechas informadas como `start_date` y `end_date`, en formato `YYYY-MM-DD`, y omitiendo los parámetros sin valor.
- Obtener el rango disponible mediante `GET /api/metrics/facets` y mostrar la fecha más antigua (`min_date`) y la más reciente (`max_date`) cerca de los inputs.

Los parámetros y campos anteriores están confirmados en el código del backend; el frontend actualmente consulta `/api/metrics` sin parámetros. No se han verificado respuestas de la API en ejecución.

# Criterios de aceptación

Los siguientes escenarios constituyen los casos de prueba de la funcionalidad:

| Caso | Acción | Resultado esperado |
| --- | --- | --- |
| 1. Sin fechas | Dejar ambos campos vacíos. | Se omiten `start_date` y `end_date` y se muestran todos los datos disponibles. |
| 2. Solo inicio | Seleccionar únicamente una fecha de inicio. | Se envía solo `start_date` y se muestran datos desde ese día, incluido. |
| 3. Solo fin | Seleccionar únicamente una fecha de fin. | Se envía solo `end_date` y se muestran datos hasta ese día, incluido. |
| 4. Rango completo | Seleccionar una fecha de inicio anterior o igual a la fecha de fin. | Se envían ambas fechas y se muestran únicamente datos del rango, incluidos sus límites. |
| 5. Selección independiente | Cambiar o vaciar uno de los campos. | El otro campo conserva su valor. |
| 6. Formato de fechas | Seleccionar una fecha en cualquiera de los campos. | La fecha se envía a la API en formato `YYYY-MM-DD`. |
| 7. Rango disponible | Abrir el dashboard. | Se consulta `GET /api/metrics/facets` y se muestran `min_date` y `max_date` cerca de los inputs, identificadas como las fechas más antigua y más reciente disponibles. |
| 8. Consistencia del dashboard | Cambiar las fechas seleccionadas. | Los KPI y ambos gráficos reflejan los datos correspondientes al filtro seleccionado. |

# Fuera del alcance

- Otros filtros del dashboard.
- Cambios en las fórmulas financieras o en la generación de datos.