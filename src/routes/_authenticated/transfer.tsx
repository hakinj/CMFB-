import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldAlert, CheckCircle2, ArrowLeftRight } from "lucide-react";
import { useOverview, useExtras, overviewKey, extrasKey } from "@/hooks/use-bank";
import { money, sendTransfer, statusCopy, maskAccount } from "@/lib/bank";
import { PageHeader, StatusNotice, Skeletons } from "@/components/page-header";

export const Route = createFileRoute("/_authenticated/transfer")({
  head: () => ({
    meta: [
      { title: "Send a transfer — CMFB Online Banking" },
      { name: "description", content: "Move money to a saved payee or a new account, with server-side checks." },
      { property: "og:title", content: "Send a transfer — CMFB Online Banking" },
      { property: "og:description", content: "Move money with server-enforced account checks." },
    ],
  }),
  component: TransferPage,
});

function TransferPage() {
  const { data, isLoading } = useOverview();
  const extras = useExtras();
  const queryClient = useQueryClient();

  const [fromAccount, setFromAccount] = useState("");
  const [toName, setToName] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{ reference: string; balance: number } | null>(null);

  if (isLoading || !data?.profile) return <Skeletons rows={4} />;

  const selected = fromAccount || data.accounts[0]?.id || "";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setReceipt(null);
    setBusy(true);
    try {
      const result = await sendTransfer({
        fromAccount: selected,
        toName: toName.trim(),
        toAccount: toAccount.trim(),
        amount: Number(amount),
        memo: memo.trim(),
      });
      setReceipt(result);
      setToName("");
      setToAccount("");
      setAmount("");
      setMemo("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer could not be completed.");
    } finally {
      setBusy(false);
      queryClient.invalidateQueries({ queryKey: overviewKey });
      queryClient.invalidateQueries({ queryKey: extrasKey });
    }
  }

  return (
    <div>
      <PageHeader
        title="Send money"
        subtitle="Transfers are validated on the bank's servers. Accounts that are not active cannot send money."
      />
      <StatusNotice status={data.profile.status} blurb={statusCopy[data.profile.status].blurb} />

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={submit} className="reveal panel space-y-4 p-6">
          <Field label="From account">
            <select
              value={selected}
              onChange={(e) => setFromAccount(e.target.value)}
              className="input-base"
            >
              {data.accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} · {maskAccount(a.account_number)} · {money(a.balance, a.currency)}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Payee name">
              <input
                required
                value={toName}
                onChange={(e) => setToName(e.target.value)}
                placeholder="Maya Ellison"
                className="input-base"
              />
            </Field>
            <Field label="Payee account number">
              <input
                required
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                placeholder="000123456789"
                className="input-base numeral"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Amount (USD)">
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="250.00"
                className="input-base numeral"
              />
            </Field>
            <Field label="Memo (optional)">
              <input
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Rent — September"
                className="input-base"
              />
            </Field>
          </div>

          {error && (
            <p className="flex items-start gap-2 rounded-xl border border-danger/25 bg-danger-soft px-4 py-3 text-sm text-danger">
              <ShieldAlert className="mt-0.5 size-4 shrink-0" />
              {error}
            </p>
          )}

          {receipt && (
            <div className="rounded-xl border border-success/25 bg-success-soft px-4 py-3 text-sm text-success">
              <p className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="size-4" /> Transfer sent
              </p>
              <p className="numeral mt-1">
                Reference {receipt.reference} · New balance {money(receipt.balance)}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <ArrowLeftRight className="size-4" />
            {busy ? "Submitting…" : "Review and send"}
          </button>
        </form>

        <aside className="reveal panel p-6">
          <h2 className="font-display text-lg text-ink">Saved payees</h2>
          <p className="mt-1 text-sm text-ink-muted">Tap a payee to fill in their details.</p>
          <ul className="mt-4 space-y-2">
            {(extras.data?.beneficiaries ?? []).map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => {
                    setToName(b.name);
                    setToAccount(b.account_number);
                  }}
                  className="w-full rounded-xl border border-line px-4 py-3 text-left transition-colors hover:border-brand hover:bg-brand-soft"
                >
                  <p className="text-sm font-medium text-ink">{b.name}</p>
                  <p className="text-xs text-ink-muted">
                    {b.bank_name} · {maskAccount(b.account_number)}
                  </p>
                </button>
              </li>
            ))}
            {(extras.data?.beneficiaries ?? []).length === 0 && (
              <li className="text-sm text-ink-muted">No saved payees yet.</li>
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
