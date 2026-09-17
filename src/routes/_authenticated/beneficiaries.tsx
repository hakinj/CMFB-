import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, UserPlus } from "lucide-react";
import { useExtras, extrasKey } from "@/hooks/use-bank";
import { addBeneficiary, removeBeneficiary, maskAccount } from "@/lib/bank";
import { PageHeader, Skeletons } from "@/components/page-header";

export const Route = createFileRoute("/_authenticated/beneficiaries")({
  head: () => ({
    meta: [
      { title: "Beneficiaries — CMFB Online Banking" },
      { name: "description", content: "Save and manage the payees you send money to most often." },
      { property: "og:title", content: "Beneficiaries — CMFB Online Banking" },
      { property: "og:description", content: "Save and manage your regular payees." },
    ],
  }),
  component: BeneficiariesPage,
});

function BeneficiariesPage() {
  const { data, isLoading } = useExtras();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => queryClient.invalidateQueries({ queryKey: extrasKey });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await addBeneficiary({
        name: name.trim(),
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        nickname: nickname.trim(),
      });
      setName("");
      setBankName("");
      setAccountNumber("");
      setNickname("");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this payee.");
    } finally {
      setBusy(false);
    }
  }

  if (isLoading || !data) return <Skeletons rows={3} />;

  return (
    <div>
      <PageHeader
        title="Beneficiaries"
        subtitle="Keep your regular payees on file so transfers take seconds."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <form onSubmit={submit} className="reveal panel space-y-4 p-6">
          <h2 className="font-display text-lg text-ink">Add a payee</h2>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="input-base"
          />
          <input
            required
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="Bank name"
            className="input-base"
          />
          <input
            required
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Account number"
            className="input-base numeral"
          />
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nickname (optional)"
            className="input-base"
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            <UserPlus className="size-4" />
            {busy ? "Saving…" : "Save payee"}
          </button>
        </form>

        <div className="reveal panel p-6">
          <h2 className="font-display text-lg text-ink">Saved payees</h2>
          <ul className="mt-4 divide-y divide-line">
            {data.beneficiaries.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {b.name}
                    {b.nickname ? <span className="text-ink-muted"> · {b.nickname}</span> : null}
                  </p>
                  <p className="truncate text-xs text-ink-muted">
                    {b.bank_name} · {maskAccount(b.account_number)}
                  </p>
                </div>
                <button
                  onClick={() => removeBeneficiary(b.id).then(refresh)}
                  aria-label={`Remove ${b.name}`}
                  className="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-ink-muted hover:border-danger hover:text-danger"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
            {data.beneficiaries.length === 0 && (
              <li className="py-6 text-sm text-ink-muted">No payees saved yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
