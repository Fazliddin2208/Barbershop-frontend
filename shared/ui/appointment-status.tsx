export function AppointmentStatus({ status }: { status: string }) {
  const label =
    status === "pending" ? "Pending" : status === "cancelled" ? "Cancelled" : status === "completed" ? "Completed" : "Confirmed";
  const tone =
    status === "pending"
      ? "bg-danger-soft text-danger"
      : status === "cancelled"
        ? "bg-surface-muted text-ink-secondary"
        : status === "completed"
          ? "bg-success-soft text-success"
          : "bg-primary-soft text-primary";
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{label}</span>;
}
