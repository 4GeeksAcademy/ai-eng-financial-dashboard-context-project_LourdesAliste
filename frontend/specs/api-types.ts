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
