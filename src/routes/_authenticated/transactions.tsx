import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useOverview } from "@/hooks/use-bank";
import { money, longDate } from "@/lib/bank";
import { PageHeader, Skeletons } from "@/components/page-header";

export const Route = createFileRoute("/_authenticated/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — CMFB Online Banking" },
      { name: "description", content: "Search and review every transaction on your CMFB accounts." },
      { property: "og:title", content: "Transactions — CMFB Online Banking" },
      { property: "og:description", content: "Search and review your account activity." },
    ],
  }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const { data, isLoading } = useOverview();
  const [query, setQuery] = useState("");
  const [direction, setDirection] = useState<"all" | "credit" | "debit">("all");

  const rows = useMemo(() => {
    const list = data?.transactions ?? [];
    const q = query.trim().toLowerCase();
    return list.filter((t) => {
      if (direction !== "all" && t.direction !== direction) return false;
      if (!q) return true;
      return (
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.counterparty ?? "").toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q)
      );
    });
  }, [data, query, direction]);

  if (isLoading || !data?.profile) return <Skeletons rows={5} />;

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="A complete, searchable record of money moving in and out of your accounts."
      />

      <div className="reveal panel overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search description, category or reference"
              className="w-full rounded-lg border border-line bg-canvas py-2 pl-9 pr-3 text-sm text-ink outline-none focus:border-brand"
            />
          </div>
          <div className="flex gap-1 rounded-lg border border-line p-1">
            {(["all", "credit", "debit"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setDirection(key)}
                className={
                  direction === key
                    ? "rounded-md bg-brand px-3 py-1.5 text-xs font-semibold capitalize text-white"
                    : "rounded-md px-3 py-1.5 text-xs font-medium capitalize text-ink-muted hover:text-ink"
                }
              >
                {key === "all" ? "All" : key === "credit" ? "Money in" : "Money out"}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
                <th className="px-4 py-3 text-right font-medium">Balance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-b border-line/60 last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 text-ink-muted">{longDate(t.created_at)}</td>
                  <td className="px-4 py-3">
                    <p className="text-ink">{t.description}</p>
                    {t.counterparty && <p className="text-xs text-ink-muted">{t.counterparty}</p>}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{t.category}</td>
                  <td className="numeral px-4 py-3 text-xs text-ink-muted">{t.reference}</td>
                  <td
                    className={
                      t.direction === "credit"
                        ? "numeral px-4 py-3 text-right font-medium text-success"
                        : "numeral px-4 py-3 text-right font-medium text-ink"
                    }
                  >
                    {t.direction === "credit" ? "+" : "−"}
                    {money(t.amount)}
                  </td>
                  <td className="numeral px-4 py-3 text-right text-ink-muted">{money(t.balance_after)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink-muted">
                    No transactions match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
