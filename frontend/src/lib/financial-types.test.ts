import { describe, expect, it } from 'vitest'
import {
  parseAlertsResponse,
  parseFacetsResponse,
  parseFinancialMovements,
} from './financial-types'

describe('API response validators', () => {
  it('accepts valid financial movements and rejects invalid fields', () => {
    const movement = {
      create_date: '2024-01-10',
      amount: 125.5,
      operation_type: 'income',
      category: 'sales',
      business_type: 'B2B',
    }

    expect(parseFinancialMovements([movement])).toEqual([movement])
    expect(() => parseFinancialMovements([{ ...movement, operation_type: 'refund' }])).toThrow(
      'Invalid /api/metrics response',
    )
    expect(() => parseFinancialMovements([{ ...movement, create_date: '2024-02-30' }])).toThrow(
      'Invalid /api/metrics response',
    )
  })

  it('accepts valid facets and rejects unsupported values', () => {
    const facets = {
      operation_types: ['income', 'outcome'],
      business_types: ['B2B', 'B2C'],
      categories: ['sales', 'suppliers'],
      min_date: '2024-01-01',
      max_date: '2024-12-31',
    }

    expect(parseFacetsResponse(facets)).toEqual(facets)
    expect(() => parseFacetsResponse({ ...facets, operation_types: ['refund'] })).toThrow(
      'Invalid /api/metrics/facets response',
    )
  })

  it('accepts valid alerts and rejects non-numeric fields', () => {
    const alerts = [
      {
        period: '2024-05',
        start_date: '2024-05-01',
        end_date: '2024-05-31',
        outcome_total: 1600,
        baseline_average: 1000,
        increase_ratio: 0.6,
      },
    ]

    expect(parseAlertsResponse(alerts)).toEqual(alerts)
    expect(() => parseAlertsResponse([{ ...alerts[0], outcome_total: '1600' }])).toThrow(
      'Invalid /api/metrics/alerts response',
    )
  })
})