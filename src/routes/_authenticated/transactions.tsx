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

  const normalizedList = useMemo(() => {
    const rawList = data?.transactions ?? [];

    return rawList.map((t: any) => {
      const isCredit =
        t.direction === "credit" ||
        t.type === "credit" ||
        t.type === "INCOMING" ||
        t.type === "CREDIT";

      return {
        ...t,
        description: t.description || "Transaction",
        category: t.category || "General",
        counterparty: t.counterparty || "",
        reference: t.reference || "N/A",
        direction: isCredit ? ("credit" as const) : ("debit" as const),
        amount: Number(t.amount ?? 0),
        balance_after: Number(t.balance_after ?? t.balance ?? 0),
        created_at: t.created_at || new Date().toISOString(),
      };
    });
  }, [data?.transactions]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return normalizedList.filter((t) => {
      if (direction !== "all" && t.direction !== direction) return false;
      if (!q) return true;
      return (
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.counterparty.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q)
      );
    });
  }, [normalizedList, query, direction]);

  if (isLoading || !data?.profile) return <Skeletons rows={5} />;

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="A complete, searchable record of money moving in and out of your accounts."
      />

      <div className="reveal panel overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <div className="relative min-w-55 flex-1">
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

        <div className="w-full">
  {/* MOBILE VIEW (Stacked List / Card Layout) */}
  <div className="block divide-y divide-line/60 md:hidden">
    {rows.map((t) => (
      <div key={t.id} className="flex items-center justify-between gap-3 py-3.5 px-1">
        {/* Left Side: Category Badge, Description & Date */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-ink text-sm">
              {t.description}
            </span>
            {t.category && (
              <span className="shrink-0 rounded-full bg-line/40 px-2 py-0.5 text-[10px] font-medium text-ink-muted uppercase tracking-wider">
                {t.category}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-ink-muted">
            <span className="whitespace-nowrap">{longDate(t.created_at)}</span>
            {t.counterparty && (
              <>
                <span>•</span>
                <span className="truncate">{t.counterparty}</span>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Amount & Running Balance */}
        <div className="shrink-0 text-right whitespace-nowrap">
          <p
            className={`numeral text-sm font-semibold ${
              t.direction === "credit" ? "text-success" : "text-ink"
            }`}
          >
            {t.direction === "credit" ? "+" : "−"}
            {money(t.amount)}
          </p>
          <p className="numeral text-xs text-ink-muted mt-0.5">
            Bal: {money(t.balance_after)}
          </p>
        </div>
      </div>
    ))}

    {rows.length === 0 && (
      <div className="py-10 text-center text-sm text-ink-muted">
        No transactions match your search.
      </div>
    )}
  </div>

  {/* DESKTOP VIEW (Full Table with Single-Line Enforcements) */}
  <div className="hidden overflow-x-auto md:block">
    <table className="w-full min-w-[700px] text-sm table-fixed">
      <thead>
        <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
          <th className="w-[18%] px-4 py-3 font-medium whitespace-nowrap">Date</th>
          <th className="w-[28%] px-4 py-3 font-medium whitespace-nowrap">Description</th>
          <th className="w-[14%] px-4 py-3 font-medium whitespace-nowrap">Category</th>
          <th className="w-[16%] px-4 py-3 font-medium whitespace-nowrap">Reference</th>
          <th className="w-[12%] px-4 py-3 text-right font-medium whitespace-nowrap">Amount</th>
          <th className="w-[12%] px-4 py-3 text-right font-medium whitespace-nowrap">Balance</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line/60">
        {rows.map((t) => (
          <tr key={t.id} className="hover:bg-line/20 transition-colors">
            <td className="whitespace-nowrap px-4 py-3.5 text-xs text-ink-muted">
              {longDate(t.created_at)}
            </td>
            <td className="px-4 py-3.5 max-w-0">
              <p className="truncate font-medium text-ink" title={t.description}>
                {t.description}
              </p>
              {t.counterparty && (
                <p className="truncate text-xs text-ink-muted" title={t.counterparty}>
                  {t.counterparty}
                </p>
              )}
            </td>
            <td className="px-4 py-3.5 max-w-0">
              <span className="truncate block text-xs text-ink-muted" title={t.category}>
                {t.category}
              </span>
            </td>
            <td className="numeral px-4 py-3.5 max-w-0 text-xs text-ink-muted">
              <span className="truncate block font-mono" title={t.reference}>
                {t.reference}
              </span>
            </td>
            <td
              className={`numeral px-4 py-3.5 text-right font-medium whitespace-nowrap ${
                t.direction === "credit" ? "text-success" : "text-ink"
              }`}
            >
              {t.direction === "credit" ? "+" : "−"}
              {money(t.amount)}
            </td>
            <td className="numeral px-4 py-3.5 text-right text-ink-muted whitespace-nowrap">
              {money(t.balance_after)}
            </td>
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
    </div>
  );
}