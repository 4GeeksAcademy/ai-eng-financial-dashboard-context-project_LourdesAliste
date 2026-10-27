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

const operationTypes = ['income', 'outcome'] as const
const categories = ['suppliers', 'sales', 'operational', 'administrative', 'others'] as const
const businessTypes = ['B2B', 'B2C'] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isOneOf<T extends string>(value: unknown, options: readonly T[]): value is T {
  return typeof value === 'string' && options.includes(value as T)
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsedDate = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value
}

function isArrayOf<T>(value: unknown, guard: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(guard)
}

function isFinancialMovement(value: unknown): value is FinancialMovement {
  return (
    isRecord(value) &&
    isIsoDate(value.create_date) &&
    typeof value.amount === 'number' &&
    Number.isFinite(value.amount) &&
    isOneOf(value.operation_type, operationTypes) &&
    isOneOf(value.category, categories) &&
    isOneOf(value.business_type, businessTypes)
  )
}

function isFacetsResponse(value: unknown): value is FacetsResponse {
  return (
    isRecord(value) &&
    isArrayOf(value.operation_types, (item): item is OperationType => isOneOf(item, operationTypes)) &&
    isArrayOf(value.business_types, (item): item is BusinessType => isOneOf(item, businessTypes)) &&
    isArrayOf(value.categories, (item): item is Category => isOneOf(item, categories)) &&
    isIsoDate(value.min_date) &&
    isIsoDate(value.max_date)
  )
}

function isAlertEntry(value: unknown): value is AlertEntry {
  return (
    isRecord(value) &&
    typeof value.period === 'string' &&
    isIsoDate(value.start_date) &&
    isIsoDate(value.end_date) &&
    typeof value.outcome_total === 'number' &&
    Number.isFinite(value.outcome_total) &&
    typeof value.baseline_average === 'number' &&
    Number.isFinite(value.baseline_average) &&
    typeof value.increase_ratio === 'number' &&
    Number.isFinite(value.increase_ratio)
  )
}

export function parseFinancialMovements(value: unknown): FinancialMovement[] {
  if (!isArrayOf(value, isFinancialMovement)) {
    throw new Error('Invalid /api/metrics response')
  }
  return value
}

export function parseFacetsResponse(value: unknown): FacetsResponse {
  if (!isFacetsResponse(value)) {
    throw new Error('Invalid /api/metrics/facets response')
  }
  return value
}

export function parseAlertsResponse(value: unknown): AlertsResponse {
  if (!isArrayOf(value, isAlertEntry)) {
    throw new Error('Invalid /api/metrics/alerts response')
  }
  return value
}
