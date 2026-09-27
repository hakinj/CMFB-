import { createFileRoute, Link } from "@tanstack/react-router";
import { Landmark, PiggyBank } from "lucide-react";
import { useOverview } from "@/hooks/use-bank";
import { money, shortDate, statusCopy } from "@/lib/bank";
import { PageHeader, StatusNotice, Skeletons } from "@/components/page-header";

export const Route = createFileRoute("/_authenticated/accounts")({
  head: () => ({
    meta: [
      { title: "Accounts — CMFB Online Banking" },
      { name: "description", content: "Your CMFB deposit accounts, balances and account details." },
      { property: "og:title", content: "Accounts — CMFB Online Banking" },
      { property: "og:description", content: "Deposit accounts, balances and routing details." },
    ],
  }),
   component: AccountsPage,
});

function AccountsPage() {
  const { data, isLoading } = useOverview();

  if (isLoading || !data?.profile) return <Skeletons rows={3} />;

  const accounts = data.accounts ?? [];
  const rawTransactions = data.transactions ?? [];




  return (
    <div>
      <PageHeader
        title="Accounts"
        subtitle="Every deposit account held with Confidential BANK & TRUST."
      />
      {data.profile.status && statusCopy[data.profile.status] && (
        <StatusNotice status={data.profile.status} blurb={statusCopy[data.profile.status].blurb} />
      )}

      

      <div className="grid gap-4 md:grid-cols-2">
        {accounts.map((rawAccount: any) => {
          // Fallback mappings for dynamic database columns
          const account = {
            ...rawAccount,
            kind: rawAccount.kind || rawAccount.account_type?.toLowerCase() || "checking",
            name: rawAccount.name || `${rawAccount.account_type || "Checking"} Account`,
            routing_number: rawAccount.routing_number || "121000358",
            currency: rawAccount.currency || "USD",
          };

          const recent = rawTransactions
            .filter((t: any) => t.account_id === account.id)
            .slice(0, 4)
            .map((t: any) => {
              const isCredit =
                t.direction === "credit" ||
                t.type === "credit" ||
                t.type === "INCOMING" ||
                t.type === "CREDIT";

              return {
                ...t,
                direction: isCredit ? ("credit" as const) : ("debit" as const),
              };
            });

          const Icon = account.kind.includes("saving") ? PiggyBank : Landmark;

          return (
            <section key={account.id} className="reveal panel p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium text-ink">{account.name}</p>
                    <p className="text-xs uppercase tracking-wide text-ink-muted">{account.kind}</p>
                  </div>
                </div>
                <p className="numeral font-display text-2xl text-ink">
                  {money(account.balance, account.currency)}
                </p>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
                <div>
                  <dt className="text-xs text-ink-muted">Account number</dt>
                  <dd className="numeral text-ink">{account.account_number}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-muted">Routing number</dt>
                  <dd className="numeral text-ink">{account.routing_number}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-muted">Opened</dt>
                  <dd className="text-ink">{shortDate(account.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-muted">Currency</dt>
                  <dd className="text-ink">{account.currency}</dd>
                </div>
              </dl>

              {recent.length > 0 && (
                <ul className="mt-4 space-y-2 border-t border-line pt-4">
                  {recent.map((t) => (
                    <li key={t.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate text-ink-muted">{t.description}</span>
                      <span
                        className={
                          t.direction === "credit"
                            ? "numeral shrink-0 text-success"
                            : "numeral shrink-0 text-ink"
                        }
                      >
                        {t.direction === "credit" ? "+" : "−"}
                        {money(t.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                to="/transactions"
                className="mt-5 inline-flex text-sm font-medium text-brand hover:underline"
              >
                View all activity
              </Link>
            </section>
          );
        })}
      </div>
    </div>
  );
}