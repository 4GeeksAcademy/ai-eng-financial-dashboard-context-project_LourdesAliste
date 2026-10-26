# Plan técnico

- **Backend:** sin cambios. La API ya admite ambos límites opcionales.
- **Frontend:** agregar controles de fecha y validación del rango; consultar facets y métricas desde `App.tsx`. Al cambiar filtros, cancelar o ignorar respuestas anteriores para que solo se refleje la selección vigente.
- **Fechas en gráficos:** corregir la agrupación mensual para extraer año y mes de `create_date` sin desplazamiento por zona horaria. Es necesario porque podría mostrar movimientos filtrados en el mes equivocado.
- **Archivos:** `App.tsx`, nuevo `date-range-filter.tsx`, `financial-types.ts`, `financial-utils.ts` y su prueba existente `financial-utils.test.ts`.
- **Verificación:** frontend `npm run build` y `npm run lint`; ejecutar `npm test` para la agrupación y comprobar manualmente filtros, fechas invertidas y cambios rápidos de rango.
- **Riesgo residual:** el cambio toca la agregación mensual existente; cubrir el cambio de mes causado por fechas ISO en la prueba existente reduce ese riesgo.
