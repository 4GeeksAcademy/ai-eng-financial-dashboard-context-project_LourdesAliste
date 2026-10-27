# Contexto técnico

## Stack

- **Frontend:** React y TypeScript con Vite. Usa Recharts para los gráficos y Vitest para pruebas. La interfaz declara español como idioma, usa IBM Plex Sans desde Google Fonts con fallback de sistema, y mantiene los scripts en [frontend/package.json](../frontend/package.json).
- **Backend:** Python con FastAPI y Uvicorn; las dependencias están en [backend/requirements.txt](../backend/requirements.txt) y el contenedor en [backend/Dockerfile](../backend/Dockerfile).
- **Entorno integrado:** Docker Compose define los servicios `frontend` y `backend` en [docker-compose.yml](../docker-compose.yml).

## Estructura principal

- `frontend/src/main.tsx`: punto de entrada de React.
- `frontend/src/App.tsx`: carga `/api/metrics`, `/api/metrics/facets` y `/api/metrics/alerts`, valida los payloads con parsers y compone el dashboard con estados de carga/error.
- `frontend/src/components/dashboard/`: tarjetas KPI y gráficos.
- `frontend/src/lib/financial-types.ts`: tipos TypeScript y parsers runtime para movimientos, facets y alertas.
- `frontend/src/lib/financial-types.test.ts`: pruebas de payloads válidos e inválidos para esos parsers.
- `frontend/src/lib/financial-utils.ts`: cálculos KPI y agregación mensual.
- `frontend/src/lib/financial-utils.test.ts`: pruebas de los cálculos frontend.
- `backend/app/main.py`: crea la aplicación FastAPI y registra el router.
- `backend/app/routes.py`: modelos Pydantic, endpoints, generación de movimientos, filtros, orden y agregaciones.
- `backend/tests/test_routes.py`: pruebas de salud y rutas de métricas.

## Comunicación frontend-backend

1. `App.tsx` hace una petición a `/api/metrics`; `VITE_API_BASE_URL` puede usarse como prefijo opcional.
2. Vite reenvía `/api` a `http://backend:8000`, según [frontend/vite.config.ts](../frontend/vite.config.ts).
3. En Docker Compose, `backend` es el nombre del servicio; esta resolución no está garantizada si Vite se ejecuta fuera de la red de Compose.
4. FastAPI define `/health` y endpoints bajo `/api/metrics`, incluidos filtros, facets, resúmenes, categorías principales, comparaciones, alertas y segmentos B2B/B2C. La documentación interactiva está en `/docs`.
5. `GET /api/metrics/alerts` devuelve alertas con `period`, `start_date`, `end_date`, `outcome_total`, `baseline_average` e `increase_ratio`. Los candidatos respetan el rango de fechas; la referencia usa los tres períodos anteriores de la misma granularidad, aunque precedan al inicio del rango. El límite de alerta es el primer y último día con egresos incluidos en el período.

## Datos y cálculos

- Las rutas generan datos de ejemplo con semilla `42`: 30 movimientos por cada uno de 12 meses. Los años se asignan respecto a `date.today()`; no son un período calendario fijo ni datos persistidos en el flujo revisado.
- El frontend calcula beneficio como ingresos menos egresos. El porcentaje es beneficio dividido por ingresos, o cero cuando no hay ingresos.
- El título del dashboard está fijado en `2024 - Año completo`; no debe usarse como fuente del período real de los datos.
- Los modelos de respuesta del backend y los tipos TypeScript son contratos duplicados y deben mantenerse sincronizados.
- Los fetchers del frontend pasan las respuestas JSON por parsers en `financial-types.ts`; los tipos TypeScript por sí solos no validan datos en ejecución.
- Los gráficos incluyen tablas `sr-only` con sus datos; `App.tsx` comunica carga y errores con estados ARIA.

## Comandos

Ejecutar desde la raíz del repositorio:

```bash
docker compose up --build
```

Con los servicios levantados:

```bash
docker compose exec backend pytest
docker compose exec frontend npm test
docker compose exec frontend npm run build
docker compose exec frontend npm run lint
```

Los comandos están documentados en [README.es.md](../README.es.md) y sus scripts frontend en [frontend/package.json](../frontend/package.json). No se afirma que se hayan ejecutado durante esta revisión.

## Verificación manual

- Frontend: `http://localhost:5173`
- API: `http://localhost:8000/health` y `http://localhost:8000/api/metrics`
- Documentación de API: `http://localhost:8000/docs`

## Herramientas y skills del agente

### frontend-design

**Finalidad**: orientar decisiones visuales de interfaz, adecuadas al propósito del producto.

**Cuándo usarla**: al crear o modificar pantallas, componentes, tipografía, contenido o estructura visual.

**Criterios de validación**: las elecciones responden al dashboard financiero y al brief; copy, tipografía y jerarquía son coherentes; se preservan usabilidad responsive y accesibilidad.

### financial-api-contracts

**Finalidad**: mantener coherentes contratos API y comportamiento financiero observable entre FastAPI y React/TypeScript.

**Cuándo usarla**: al cambiar o auditar endpoints, modelos Pydantic, tipos, parsers runtime, KPI, agregaciones, comparaciones o alertas.

**Criterios de validación**: contrastar campos y valores entre backend, tipos, parsers y consumidores; probar payloads/cálculos afectados; distinguir comportamiento de código de requisitos de negocio.

**Límites**: no sustituye accesibilidad, diseño frontend ni rendimiento React; no convierte las fórmulas actuales en requisitos de negocio aprobados.

### accessibility

**Finalidad**: orientar la implementación y auditoría de accesibilidad web según WCAG 2.2.

**Cuándo usarla**: al crear o revisar controles, formularios, gráficos, estados dinámicos, navegación por teclado o soporte para lectores de pantalla.

**Criterios de validación**: comprobar nombre/rol/valor, operación por teclado y foco visible, contraste mínimo 4.5:1 para texto normal y 3:1 para texto grande/controles, objetivos de al menos 24x24 CSS px, alternativas textuales y anuncios dinámicos; no afirmar pruebas manuales que no se hayan ejecutado.

### vercel-react-best-practices

**Finalidad**: orientar optimizaciones de rendimiento React y Next.js.

**Cuándo usarla**: al implementar o revisar fetching, bundle, renderizado o renders repetidos de componentes React.

**Criterios de validación**: seleccionar una regla pertinente, demostrar el patrón en el código y usar una verificación proporcional; no recomendar memoización u otras optimizaciones sin evidencia de trabajo evitado o costo relevante.