import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AlertsResponse } from "@/lib/financial-types";
import { formatCurrency } from "@/lib/financial-utils";

interface AlertsTableProps {
  alerts: AlertsResponse;
  threshold: number;
  loading: boolean;
  error: string | null;
  onThresholdChange: (value: number) => void;
}

export function AlertsTable({
  alerts,
  threshold,
  loading,
  error,
  onThresholdChange,
}: AlertsTableProps) {
  const [thresholdInput, setThresholdInput] = useState(String(threshold));

  function handleThresholdChange(value: string, numericValue: number) {
    setThresholdInput(value);
    if (Number.isFinite(numericValue) && numericValue >= 0.01 && numericValue <= 1) {
      onThresholdChange(numericValue);
    }
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <CardTitle className="text-base font-semibold">Alertas de gasto</CardTitle>
          <CardDescription>Períodos con incremento sobre la media de referencia</CardDescription>
        </div>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Umbral de alerta
          <input
            type="number"
            min="0.01"
            max="1"
            step="0.01"
            value={thresholdInput}
            onChange={(event) =>
              handleThresholdChange(event.currentTarget.value, event.currentTarget.valueAsNumber)
            }
            className="h-10 w-32 rounded-md border border-border bg-background px-3 text-foreground"
          />
        </label>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p role="status" className="py-8 text-center text-sm text-muted-foreground">
            Cargando alertas...
          </p>
        ) : error ? (
          <p role="alert" className="py-8 text-center text-sm text-destructive">
            {error}
          </p>
        ) : alerts.length === 0 ? (
          <p role="status" className="py-8 text-center text-sm text-muted-foreground">
            No se detectaron anomalías para este umbral.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted-foreground">
                <tr>
                  <th scope="col" className="px-3 py-3">Período</th>
                  <th scope="col" className="px-3 py-3">Gasto registrado</th>
                  <th scope="col" className="px-3 py-3">Media de referencia</th>
                  <th scope="col" className="px-3 py-3">Incremento</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr
                    key={`${alert.period}-${alert.start_date}-${alert.end_date}`}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="whitespace-nowrap px-3 py-3">
                      {alert.start_date === alert.end_date
                        ? alert.start_date
                        : `${alert.start_date} - ${alert.end_date}`}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatCurrency(alert.outcome_total)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatCurrency(alert.baseline_average)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {(alert.increase_ratio * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}