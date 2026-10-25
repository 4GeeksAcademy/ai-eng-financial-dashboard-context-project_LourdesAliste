/** Parámetros de fecha opcionales para GET /api/metrics. */
export interface DateRangeFilter {
  /**
   * Límite inferior inclusivo del filtro. Fecha de calendario en formato
   * YYYY-MM-DD (ISO 8601); omitir cuando no se define fecha de inicio.
   */
  start_date?: string;

  /**
   * Límite superior inclusivo del filtro. Fecha de calendario en formato
   * YYYY-MM-DD (ISO 8601); omitir cuando no se define fecha de fin.
   */
  end_date?: string;
}

/** Parámetros de consulta opcionales para GET /api/metrics/alerts. */
export interface AlertsParams {
  /**
   * Umbral de incremento como ratio decimal. La API usa 0.3 por defecto y
   * acepta valores >= 0; no declara máximo. El rango 0.01–1.0 pertenece al
   * requisito de interfaz, no a la validación actual del endpoint.
   */
  threshold?: number;

  /**
   * Límite inferior inclusivo del filtro, opcional. Fecha ISO YYYY-MM-DD;
   * el backend la recibe como date.
   */
  start_date?: string;

  /**
   * Límite superior inclusivo del filtro, opcional. Fecha ISO YYYY-MM-DD;
   * el backend la recibe como date.
   */
  end_date?: string;
}
