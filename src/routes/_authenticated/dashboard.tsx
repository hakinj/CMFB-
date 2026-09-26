import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  CreditCard,
  Users,
  Eye,
} from "lucide-react";
import { useOverview } from "@/hooks/use-bank";
import { money, shortDate, maskAccount, statusCopy } from "@/lib/bank";
import { PageHeader, StatusNotice, Skeletons } from "@/components/page-header";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Overview — CMFB Online Banking" },
      { name: "description", content: "Balances, recent activity and quick banking actions." },
      { property: "og:title", content: "Overview — CMFB Online Banking" },
      { property: "og:description", content: "Balances, recent activity and quick actions." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data, isLoading } = useOverview();

  if (isLoading || !data?.profile) {
    return (
      <div className="space-y-4">
        <div className="h-9 w-56 animate-pulse rounded-lg bg-muted" />
        <Skeletons rows={4} />
      </div>
    );
  }

  const accounts = data.accounts ?? [];
  const rawTransactions = data.transactions ?? [];

  // Normalize transactions to account for database column 'type' instead of 'direction'
  const transactions = rawTransactions.map((t: any) => {
    const isCredit =
      t.direction === "credit" ||
      t.type === "credit" ||
      t.type === "INCOMING" ||
      t.type === "CREDIT";

    return {
      ...t,
      direction: isCredit ? ("credit" as const) : ("debit" as const),
      category: t.category || t.type || "General",
    };
  });

  const total = accounts.reduce((sum, a) => sum + Number(a.balance || 0), 0);
  const recent = transactions.slice(0, 6);
  const month = transactions.filter(
    (t) => new Date(t.created_at).getTime() > Date.now() - 30 * 864e5,
  );
  const inflow = month
    .filter((t) => t.direction === "credit")
    .reduce((s, t) => s + Number(t.amount || 0), 0);
  const outflow = month
    .filter((t) => t.direction === "debit")
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  const firstName = data.profile.full_name
    ? data.profile.full_name.split(" ")[0]
    : data.profile.first_name || "member";

  return (
    <div>
      <PageHeader
        title={`Good day, ${firstName}`}
        subtitle="Here's where your money stands today across Confidential Micro Finance Bank."
      />
      {data.profile.status && statusCopy[data.profile.status] && (
        <StatusNotice
          status={data.profile.status}
          blurb={statusCopy[data.profile.status].blurb}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="reveal rounded-2xl bg-ink p-6 text-white lg:col-span-1">
          <p className="text-xs uppercase tracking-[0.18em] text-white/50">Total balance</p>
          <p className="numeral mt-3 font-display text-4xl">{money(total)}</p>
          <p className="mt-1 text-xs text-white/60">
            Across {accounts.length} account{accounts.length === 1 ? "" : "s"}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-[11px] text-white/60">In · 30d</p>
              <p className="numeral mt-1 font-medium">{money(inflow)}</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-[11px] text-white/60">Out · 30d</p>
              <p className="numeral mt-1 font-medium">{money(outflow)}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {accounts.map((a: any) => (
            <Link key={a.id} to="/accounts" className="panel reveal block p-5 transition-shadow hover:shadow-md">
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                {a.kind || a.account_type || "Deposit Account"}
              </p>
              <p className="mt-1 font-display text-lg text-ink">
                {a.name || `${a.account_type || "Checking"} Account`}
              </p>
              <p className="numeral mt-4 text-2xl font-semibold text-ink">{money(a.balance)}</p>
              <p className="numeral mt-1 text-xs text-ink-muted">{maskAccount(a.account_number)}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <QuickAction to="/transfer" icon={ArrowLeftRight} label="Send a transfer" />
        <QuickAction to="/cards" icon={CreditCard} label="Manage cards" />
        <QuickAction to="/beneficiaries" icon={Users} label="Beneficiaries" />
      </div>

      <section className="panel mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg text-ink">Recent activity</h2>
          <Link to="/transactions" className="inline-flex items-center gap-1 text-sm text-brand hover:underline">
            <Eye className="size-3.5" /> View all
          </Link>
        </div>
        <ul className="divide-y divide-line">
          {recent.map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-5 py-3.5">
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-full ${
                  t.direction === "credit" ? "bg-success-soft text-success" : "bg-muted text-ink-muted"
                }`}
              >
                {t.direction === "credit" ? (
                  <ArrowDownLeft className="size-4" />
                ) : (
                  <ArrowUpRight className="size-4" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{t.description}</p>
                <p className="text-xs text-ink-muted">
                  {t.category} · {shortDate(t.created_at)}
                </p>
              </div>
              <span
                className={`numeral text-sm font-semibold ${
                  t.direction === "credit" ? "text-success" : "text-ink"
                }`}
              >
                {t.direction === "credit" ? "+" : "−"}
                {money(t.amount)}
              </span>
            </li>
          ))}
          {recent.length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-ink-muted">No activity yet.</li>
          )}
        </ul>
      </section>
    </div>
  );
}

function QuickAction({
  to,
  icon: Icon,
  label,
}: {
  to: "/transfer" | "/cards" | "/beneficiaries";
  icon: typeof ArrowLeftRight;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="panel flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-ink transition-colors hover:text-brand"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
        <Icon className="size-4" />
      </span>
      {label}
    </Link>
  );
}