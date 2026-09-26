import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Snowflake, Sun } from "lucide-react";
import { useExtras, extrasKey } from "@/hooks/use-bank";
import { money, setCardFrozen, setCardLimit } from "@/lib/bank";
import { PageHeader, Skeletons } from "@/components/page-header";

export const Route = createFileRoute("/_authenticated/cards")({
  head: () => ({
    meta: [
      { title: "Cards — CMFB Online Banking" },
      { name: "description", content: "Freeze your CMFB debit and credit cards and set monthly spend limits." },
      { property: "og:title", content: "Cards — CMFB Online Banking" },
      { property: "og:description", content: "Freeze cards and manage monthly spend limits." },
    ],
  }),
  component: CardsPage,
});

function CardsPage() {
  const { data, isLoading } = useExtras();
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: extrasKey });

  if (isLoading || !data) return <Skeletons rows={2} />;

  const cards = data.cards ?? [];

  return (
    <div>
      <PageHeader
        title="Cards"
        subtitle="Freeze a card instantly and control how much it can spend each month."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((rawCard: any) => {
          // Normalize card object with safe fallbacks
          const isFrozen = Boolean(
            rawCard.frozen ?? rawCard.is_frozen ?? rawCard.status === "frozen"
          );
          const monthlyLimit = Number(rawCard.monthly_limit ?? rawCard.limit ?? 5000);
          const expMonth = String(rawCard.exp_month ?? rawCard.expiry_month ?? 12).padStart(2, "0");
          const expYear = String(rawCard.exp_year ?? rawCard.expiry_year ?? 28).slice(-2);
          const last4 = rawCard.last4 ?? rawCard.last_four ?? "0000";

          return (
            <section key={rawCard.id} className="reveal panel p-6">
              <div
                className={
                  isFrozen
                    ? "rounded-2xl bg-ink-muted p-5 text-white transition-colors"
                    : "rounded-2xl bg-ink p-5 text-white transition-colors"
                }
              >
                <div className="flex items-start justify-between">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                    {rawCard.brand || "Visa"}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    {rawCard.card_type || rawCard.type || "Debit"}
                  </p>
                </div>
                <p className="numeral mt-8 text-lg tracking-[0.28em]">•••• •••• •••• {last4}</p>
                <div className="mt-5 flex items-end justify-between text-xs text-white/70">
                  <span>{rawCard.label || rawCard.cardholder_name || "Primary Card"}</span>
                  <span className="numeral">
                    {expMonth}/{expYear}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {isFrozen ? "Card frozen" : "Card active"}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {isFrozen ? "No new purchases will be approved." : "Purchases are being approved."}
                  </p>
                </div>
                <button
                  onClick={() => setCardFrozen(rawCard.id, !isFrozen).then(refresh)}
                  className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  {isFrozen ? <Sun className="size-4" /> : <Snowflake className="size-4" />}
                  {isFrozen ? "Unfreeze" : "Freeze"}
                </button>
              </div>

              <label className="mt-5 block border-t border-line pt-4">
                <span className="mb-1.5 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Monthly limit
                  <span className="numeral text-ink">{money(monthlyLimit)}</span>
                </span>
                <input
                  type="range"
                  min={500}
                  max={20000}
                  step={500}
                  defaultValue={monthlyLimit}
                  onMouseUp={(e) => setCardLimit(rawCard.id, Number(e.currentTarget.value)).then(refresh)}
                  onTouchEnd={(e) => setCardLimit(rawCard.id, Number(e.currentTarget.value)).then(refresh)}
                  className="w-full accent-[var(--brand)]"
                />
              </label>
            </section>
          );
        })}
        {cards.length === 0 && (
          <p className="panel p-6 text-sm text-ink-muted">No cards have been issued yet.</p>
        )}
      </div>
    </div>
  );
}