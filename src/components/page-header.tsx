import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="reveal mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink lg:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusNotice({ status, blurb }: { status: string; blurb: string }) {
  if (status === "ACTIVE") return null;
  return (
    <div className="mb-6 rounded-xl border border-warning/25 bg-warning-soft px-4 py-3 text-sm text-warning">
      <span className="font-semibold">Account {status.toLowerCase()}. </span>
      {blurb}
    </div>
  );
}

export function Skeletons({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}
