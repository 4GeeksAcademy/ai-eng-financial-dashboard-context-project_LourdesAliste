/**
 * Respuesta de GET /api/metrics/facets. Las fechas del backend son de tipo
 * Python date; min_date y max_date se calculan a partir de
 * FinancialMovement.create_date. Ese campo representa la misma fecha de
 * calendario que frontend/src/lib/financial-types.ts declara como create_date
 * (string ISO). No se ha comprobado aquí una respuesta HTTP en ejecución.
 */
export interface FacetsResponse {
  /**
   * Tipos de operación presentes en el dataset. Valores válidos:
   * "income" (ingreso) y "outcome" (egreso).
   */
  operation_types: ("income" | "outcome")[];

  /** Tipos de negocio presentes en el dataset. Valores válidos: "B2B" y "B2C". */
  business_types: ("B2B" | "B2C")[];

  /**
   * Categorías presentes en el dataset. Valores válidos: "suppliers", "sales",
   * "operational", "administrative" y "others".
   */
  categories: (
    | "suppliers"
    | "sales"
    | "operational"
    | "administrative"
    | "others"
  )[];

  /** Fecha más antigua de los movimientos del dataset; formato de fecha ISO YYYY-MM-DD. */
  min_date: string;

  /** Fecha más reciente de los movimientos del dataset; formato de fecha ISO YYYY-MM-DD. */
  max_date: string;
}

/**
 * Una alerta devuelta por GET /api/metrics/alerts.
 * start_date y end_date corresponden al primer y último día con gastos del
 * intervalo de anomalía.
 */
export interface AlertEntry {
  /**
   * Etiqueta del período agregado: YYYY-MM-DD para día, YYYY-Www para semana
   * ISO o YYYY-MM para mes. El endpoint usa mes por defecto.
   */
  period: string;

  /** Fecha del primer gasto incluido en la anomalía; formato ISO YYYY-MM-DD. */
  start_date: string;

  /** Fecha del último gasto incluido en la anomalía; formato ISO YYYY-MM-DD. */
  end_date: string;

  /** Total de gastos del período, como número redondeado a dos decimales. */
  outcome_total: number;

  /**
  * Media aritmética de los gastos de los tres períodos inmediatamente
  * anteriores, de la misma granularidad, redondeada a dos decimales.
   */
  baseline_average: number;

  /**
   * Incremento relativo respecto a baseline_average, como ratio decimal
   * redondeado a cuatro decimales; no es un porcentaje entre 0 y 100. La API
   * no declara un límite superior para este valor.
   */
  increase_ratio: number;
}

/**
 * Cuerpo de respuesta de GET /api/metrics/alerts: una lista JSON de alertas,
 * sin objeto contenedor.
 */
export type AlertsResponse = AlertEntry[];
