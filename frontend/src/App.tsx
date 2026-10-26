import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DateRangeFilter as DateRangeFilterControl } from "@/components/dashboard/date-range-filter";
import { AlertsTable } from "@/components/dashboard/alerts-table";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { IncomeOutcomeChart } from "@/components/dashboard/income-outcome-chart";
import { ProfitPercentChart } from "@/components/dashboard/profit-percent-chart";
import {
  type AlertsParams,
  type AlertsResponse,
  type DateRangeFilter,
  type FacetsResponse,
  type FinancialMovement,
  type KPIMetrics,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function fetchFinancialData(
  filters: DateRangeFilter,
  signal: AbortSignal,
): Promise<FinancialMovement[]> {
  const query = new URLSearchParams();
  if (filters.start_date) query.set("start_date", filters.start_date);
  if (filters.end_date) query.set("end_date", filters.end_date);
  const queryString = query.toString();
  const url = `${API_BASE_URL}/api/metrics${queryString ? `?${queryString}` : ""}`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }
  return response.json();
}

async function fetchFacets(): Promise<FacetsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/metrics/facets`);
  if (!response.ok) {
    throw new Error(`Failed to fetch available date range: ${response.status}`);
  }
  return response.json();
}

async function fetchAlerts(
  params: AlertsParams,
  signal: AbortSignal,
): Promise<AlertsResponse> {
  const query = new URLSearchParams({
    threshold: String(params.threshold ?? 0.3),
  });
  if (params.start_date) query.set("start_date", params.start_date);
  if (params.end_date) query.set("end_date", params.end_date);
  const response = await fetch(
    `${API_BASE_URL}/api/metrics/alerts?${query.toString()}`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch alerts: ${response.status}`);
  }
  return response.json();
}

function App() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [alerts, setAlerts] = useState<AlertsResponse>([]);
  const [facets, setFacets] = useState<FacetsResponse | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [threshold, setThreshold] = useState(0.3);
  const [loading, setLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertsError, setAlertsError] = useState<string | null>(null);
  const invalidRange = Boolean(startDate && endDate && startDate > endDate);

  function updateStartDate(value: string) {
    setStartDate(value);
    setLoading(!(value && endDate && value > endDate));
    setAlertsLoading(!(value && endDate && value > endDate));
    setError(null);
    setAlertsError(null);
  }

  function updateEndDate(value: string) {
    setEndDate(value);
    setLoading(!(startDate && value && startDate > value));
    setAlertsLoading(!(startDate && value && startDate > value));
    setError(null);
    setAlertsError(null);
  }

  function updateThreshold(value: number) {
    setThreshold(value);
    setAlertsLoading(true);
    setAlertsError(null);
  }

  useEffect(() => {
    fetchFacets()
      .then(setFacets)
      .catch(() => {
        setError(
          "No se pudo cargar el rango de fechas disponible. Revisa la API de backend.",
        );
      });
  }, []);

  useEffect(() => {
    if (invalidRange) return;

    const controller = new AbortController();
    const filters: DateRangeFilter = {
      ...(startDate ? { start_date: startDate } : {}),
      ...(endDate ? { end_date: endDate } : {}),
    };

    fetchFinancialData(filters, controller.signal)
      .then((movements) => {
        setMetrics(computeKPIs(movements));
        setMonthlyData(computeMonthlyData(movements));
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError(
            "No se pudo cargar la informacion financiera. Revisa la API de backend.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [startDate, endDate, invalidRange]);

  useEffect(() => {
    if (invalidRange) return;

    const controller = new AbortController();
    const params: AlertsParams = {
      threshold,
      ...(startDate ? { start_date: startDate } : {}),
      ...(endDate ? { end_date: endDate } : {}),
    };

    fetchAlerts(params, controller.signal)
      .then(setAlerts)
      .catch(() => {
        if (!controller.signal.aborted) {
          setAlertsError("No se pudieron cargar las alertas.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setAlertsLoading(false);
      });

    return () => controller.abort();
  }, [startDate, endDate, invalidRange, threshold]);

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <DashboardHeader period="2024 - Full Year" />

          <DateRangeFilterControl
            startDate={startDate}
            endDate={endDate}
            minDate={facets?.min_date ?? null}
            maxDate={facets?.max_date ?? null}
            invalidRange={invalidRange}
            onStartDateChange={updateStartDate}
            onEndDateChange={updateEndDate}
          />

          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground">
              {error}
            </div>
          ) : null}

          <section aria-label="Key performance indicators">
            <KPIRow metrics={metrics} loading={loading} />
          </section>

          <section
            aria-label="Financial charts"
            className="grid grid-cols-1 gap-4 xl:grid-cols-2"
          >
            <IncomeOutcomeChart data={monthlyData} loading={loading} />
            <ProfitPercentChart data={monthlyData} loading={loading} />
          </section>

          <AlertsTable
            alerts={alerts}
            threshold={threshold}
            loading={alertsLoading}
            error={alertsError}
            onThresholdChange={updateThreshold}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
