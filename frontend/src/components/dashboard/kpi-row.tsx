import { KPICard } from './kpi-card'
import { type KPIMetrics } from '@/lib/financial-types'
import { formatCurrency, formatPercent } from '@/lib/financial-utils'
import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from 'lucide-react'

interface KPIRowProps {
  metrics: KPIMetrics | null
  loading?: boolean
}

export function KPIRow({ metrics, loading }: KPIRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KPICard
        label="Total de ingresos"
        value={metrics ? formatCurrency(metrics.totalIncome) : '—'}
        helperText="Ingresos acumulados de todos los movimientos"
        icon={TrendingUp}
        variant="income"
        loading={loading}
      />
      <KPICard
        label="Total de egresos"
        value={metrics ? formatCurrency(metrics.totalOutcome) : '—'}
        helperText="Egresos totales de todas las categorías"
        icon={TrendingDown}
        variant="outcome"
        loading={loading}
      />
      <KPICard
        label="Beneficio"
        value={metrics ? formatCurrency(metrics.profit) : '—'}
        helperText="Ingresos menos egresos"
        icon={DollarSign}
        variant="profit"
        loading={loading}
      />
      <KPICard
        label="Margen de beneficio"
        value={metrics ? formatPercent(metrics.profitPercent) : '—'}
        helperText="Beneficio como porcentaje de los ingresos"
        icon={BarChart2}
        variant="profitPercent"
        loading={loading}
      />
    </div>
  )
}
