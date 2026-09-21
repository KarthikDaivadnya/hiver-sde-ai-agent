interface EvaluationMetricProps {
  label: string;
  value: string;
}

export function EvaluationMetric({ label, value }: EvaluationMetricProps) {
  return (
    <div className="rounded-xl border border-border bg-canvas p-4">
      <p className="text-xs text-subtle">{label}</p>
      <p className="mt-1 font-mono text-xl font-semibold text-ink">{value}</p>
    </div>
  );
}
