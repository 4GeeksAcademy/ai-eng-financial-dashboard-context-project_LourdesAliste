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
