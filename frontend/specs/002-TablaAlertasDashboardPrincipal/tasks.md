# Tareas: tabla de alertas de anomalías

## Backend

- [x] T1. Definir los límites de cada intervalo de anomalía y si los tres períodos de referencia pueden preceder al rango activo.
- [x] T2. Actualizar el cálculo para usar exclusivamente los tres períodos anteriores de la misma granularidad y ampliar la respuesta con las fechas inicial y final definidas.
- [x] T3. Actualizar las pruebas backend para validar la media y los campos nuevos de respuesta.

## Frontend

- [x] T4. Añadir los tipos de alertas a los tipos frontend, alineados con `api-types.ts` y `param-types.ts`.
- [x] T5. Conectar en `App.tsx` la consulta de alertas con el umbral y el rango de fechas activo.
- [x] T6. Incorporar debajo de los gráficos la tabla, el input de umbral y el estado vacío.

## Verificación

- [ ] T7. Ejecutar las pruebas backend y `npm test`, `npm run build` y `npm run lint`; verificar uno por uno los criterios de aceptación de `spec.md`.
