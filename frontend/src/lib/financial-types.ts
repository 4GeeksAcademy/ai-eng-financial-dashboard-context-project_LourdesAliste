export type OperationType = 'income' | 'outcome'
export type Category = 'suppliers' | 'sales' | 'operational' | 'administrative' | 'others'
export type BusinessType = 'B2B' | 'B2C'

export interface FinancialMovement {
  create_date: string // ISO date
  amount: number
  operation_type: OperationType
  category: Category
  business_type: BusinessType
}

export interface FacetsResponse {
  operation_types: OperationType[]
  business_types: BusinessType[]
  categories: Category[]
  min_date: string
  max_date: string
}

export interface DateRangeFilter {
  start_date?: string
  end_date?: string
}

export interface AlertEntry {
  period: string
  start_date: string
  end_date: string
  outcome_total: number
  baseline_average: number
  increase_ratio: number
}

export type AlertsResponse = AlertEntry[]

export interface AlertsParams extends DateRangeFilter {
  threshold?: number
}

export interface KPIMetrics {
  totalIncome: number
  totalOutcome: number
  profit: number
  profitPercent: number
}

export interface MonthlyDataPoint {
  month: string
  income: number
  outcome: number
  profitPercent: number
}
