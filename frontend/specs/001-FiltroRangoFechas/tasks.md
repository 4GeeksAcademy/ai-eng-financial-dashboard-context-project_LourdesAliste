# Tareas: filtro de rango de fechas

## Backend

Sin cambios: la API ya admite ambos límites opcionales.

## Frontend

- [x] T1. Crear `date-range-filter.tsx` con campos independientes, aviso para rangos invertidos y visualización del rango disponible.
- [x] T2. Actualizar `App.tsx` para consultar facets, conectar el filtro y enviar `start_date` y `end_date` en `YYYY-MM-DD`, omitiendo los campos vacíos.
- [x] T3. Evitar que respuestas de peticiones anteriores sobrescriban los resultados del rango vigente.
- [x] T4. Corregir la agrupación mensual de fechas ISO en `financial-utils.ts` y ajustar la prueba existente en `financial-utils.test.ts`.

## Verificación

- [ ] T5. Ejecutar `npm test`, `npm run build` y `npm run lint`; verificar manualmente todos los criterios de aceptación de `spec.md`, incluidos filtros parciales, rango vacío o inválido, rango disponible y actualización de KPI y gráficos.