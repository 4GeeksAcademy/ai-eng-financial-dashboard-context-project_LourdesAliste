interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  minDate: string | null;
  maxDate: string | null;
  invalidRange: boolean;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export function DateRangeFilter({
  startDate,
  endDate,
  minDate,
  maxDate,
  invalidRange,
  onStartDateChange,
  onEndDateChange,
}: DateRangeFilterProps) {
  return (
    <section aria-label="Filtro de rango de fechas" className="space-y-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Fecha inicio
          <input
            type="date"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            className="h-10 rounded-md border border-border bg-background px-3 text-foreground"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Fecha fin
          <input
            type="date"
            value={endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            className="h-10 rounded-md border border-border bg-background px-3 text-foreground"
          />
        </label>
      </div>

      {minDate && maxDate ? (
        <p className="text-sm text-muted-foreground">
          Rango disponible: {minDate} a {maxDate}
        </p>
      ) : null}

      {invalidRange ? (
        <p role="alert" className="text-sm text-destructive">
          El rango no es válido. La fecha de inicio debe ser anterior o igual a
          la fecha de fin.
        </p>
      ) : null}
    </section>
  );
}