# Objetivo

Mostrar en el dashboard los períodos con incrementos inesperados del gasto y el promedio de referencia.

# Usuario

Usuario del dashboard financiero. El proyecto no define un perfil más específico.

# Historia de usuario

Como usuario del dashboard, quiero consultar las alertas de gasto bajo los gráficos para identificar los períodos con incrementos inesperados.

# Requisitos funcionales

- Mostrar debajo de los gráficos existentes una tabla con cuatro columnas: período identificado por su fecha inicial y final, gasto registrado, media de referencia e incremento porcentual.
- Cada alerta debe identificar el intervalo en el que se detectó el incremento inesperado que supera el umbral configurado. La duración del intervalo no se fija a priori como diaria, semanal o mensual: corresponde al intervalo identificado por los datos y el criterio de detección.
- Calcular la media de referencia utilizando exclusivamente los tres períodos anteriores a la alerta, de la misma granularidad.
- Permitir configurar el umbral mediante un input numérico. Aceptar ratios entre `0.01` y `1.0`, con valor inicial `0.3`.
- Obtener las alertas mediante `GET /api/metrics/alerts?threshold=<ratio>`.
- Cuando la Funcionalidad 1 tenga un rango activo, respetar `start_date` y `end_date` seleccionados; si no hay rango, mostrar las alertas del dataset disponible. La media de referencia sigue usando los tres períodos anteriores de la misma granularidad.
- Mostrar un mensaje explícito de estado vacío cuando no haya alertas para el umbral seleccionado.

El modelo del backend y la respuesta consultada confirman los campos `period`, `outcome_total`, `baseline_average` e `increase_ratio`. `increase_ratio` es una fracción decimal que se presenta como porcentaje. El endpoint admite `threshold` como `float` (por defecto `0.3`) y `start_date` y `end_date`; actualmente solo valida que el umbral sea mayor o igual a cero. La respuesta actual no proporciona las fechas inicial y final de cada alerta.

El endpoint actual agrupa por día, semana o mes, con mes como valor predeterminado, y calcula `baseline_average` con todos los períodos anteriores. Por tanto, requiere cambios para cumplir la media de exactamente tres períodos y para devolver las fechas de inicio y fin de cada alerta. No se define cómo el criterio de detección determina esos límites. También queda pendiente aclarar si los tres períodos de referencia pueden quedar antes de `start_date` cuando hay un rango activo; el endpoint actual filtra los movimientos por fecha antes de calcular las alertas.

# Criterios de aceptación

Los siguientes escenarios constituyen los casos de prueba de la funcionalidad:

1. **Tabla de alertas:** con alertas disponibles, se muestran debajo de los gráficos las cuatro columnas período (con fecha inicial y final), gasto registrado (`outcome_total`), media de referencia (`baseline_average`) e incremento porcentual (`increase_ratio`).
2. **Umbral inicial y límites:** al abrir el dashboard el input muestra `0.3`; permite valores entre `0.01` y `1.0`.
3. **Consulta por umbral:** al seleccionar un umbral, se solicita `GET /api/metrics/alerts` con ese valor en el parámetro `threshold`.
4. **Media de referencia:** cada alerta muestra la media calculada exclusivamente con los tres períodos inmediatamente anteriores, todos de la misma granularidad; el período de la alerta se identifica con su fecha inicial y final.
5. **Incremento porcentual:** el valor mostrado corresponde al incremento del gasto respecto de la media de referencia y se presenta como porcentaje.
6. **Estado vacío:** si la respuesta no contiene alertas para el umbral seleccionado, se muestra un mensaje explícito de estado vacío.
7. **Rango de fechas:** con un rango activo de la Funcionalidad 1, las alertas respetan `start_date` y `end_date`; su media usa los tres períodos anteriores de la misma granularidad. Sin rango activo, se consultan las alertas del dataset disponible.

La verificación de los límites de fecha de cada período queda pendiente de definir el criterio que determina esos límites y de ampliar el contrato actual, que solo devuelve `period` como string. También queda pendiente aclarar si los períodos de referencia pueden preceder al inicio del rango activo.

# Cambios necesarios por capa

- **Backend:** actualizar el cálculo de la media para usar solo los tres períodos anteriores de igual granularidad y ampliar la respuesta de cada alerta para incluir sus fechas inicial y final, una vez definido cómo se determinan.
- **Frontend:** consumir y mostrar las fechas de cada alerta, presentar la media de referencia y el incremento porcentual, consultar las alertas respetando el rango de fechas activo y mostrar el estado vacío.

# Fuera del alcance

- Otras métricas, filtros o visualizaciones no indicados en estos requisitos.
