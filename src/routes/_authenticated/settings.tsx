import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Save } from "lucide-react";
import { useOverview, useExtras, overviewKey } from "@/hooks/use-bank";
import { updateProfile, claimAdmin, longDate, statusCopy } from "@/lib/bank";
import { PageHeader, Skeletons } from "@/components/page-header";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Profile & security — CMFB Online Banking" },
      { name: "description", content: "Update your contact details, security settings and review account activity." },
      { property: "og:title", content: "Profile & security — CMFB Online Banking" },
      { property: "og:description", content: "Contact details, security settings and account activity." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { data, isLoading } = useOverview();
  const extras = useExtras();
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const profile = data?.profile;

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name);
    setPhone(profile.phone ?? "");
    setAddress(profile.address ?? "");
    setTwoFactor(profile.two_factor_enabled);
  }, [profile]);

  if (isLoading || !profile) return <Skeletons rows={4} />;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setSaved(false);
    try {
      await updateProfile({ fullName, phone, address, twoFactorEnabled: twoFactor });
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: overviewKey });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Profile & security"
        subtitle="Your details, security preferences and a log of everything that happened on this account."
      />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <form onSubmit={save} className="reveal panel space-y-4 p-6">
          <h2 className="font-display text-lg text-ink">Personal details</h2>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
              Full name
            </span>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-base" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
              Email
            </span>
            <input value={profile.email} disabled className="input-base opacity-60" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
                Phone
              </span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-base" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
                Address
              </span>
              <input value={address} onChange={(e) => setAddress(e.target.value)} className="input-base" />
            </label>
          </div>

          <label className="flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3">
            <span>
              <span className="block text-sm font-medium text-ink">Two-step verification</span>
              <span className="block text-xs text-ink-muted">
                Ask for a second factor when signing in (simulated in this demo).
              </span>
            </span>
            <input
              type="checkbox"
              checked={twoFactor}
              onChange={(e) => setTwoFactor(e.target.checked)}
              className="size-5 accent-[var(--brand)]"
            />
          </label>

          {saved && <p className="text-sm text-success">Your details were saved.</p>}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            <Save className="size-4" /> {busy ? "Saving…" : "Save changes"}
          </button>
        </form>

        <div className="space-y-4">
          <section className="reveal panel p-6">
            <h2 className="font-display text-lg text-ink">Account status</h2>
            <p className="mt-2 text-sm text-ink-muted">{statusCopy[profile.status].blurb}</p>
            {!data?.isAdmin && (
              <button
                onClick={() =>
                  claimAdmin().then(() => queryClient.invalidateQueries({ queryKey: overviewKey }))
                }
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-medium text-ink hover:border-brand hover:text-brand"
              >
                <ShieldCheck className="size-4" /> Enable demo admin console
              </button>
            )}
          </section>

          <section className="reveal panel p-6">
            <h2 className="font-display text-lg text-ink">Security activity</h2>
            <ul className="mt-4 space-y-3">
              {(extras.data?.audit ?? []).slice(0, 12).map((log) => (
                <li key={log.id} className="border-b border-line/60 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm text-ink">{log.detail}</p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {log.action} · {longDate(log.created_at)}
                  </p>
                </li>
              ))}
              {(extras.data?.audit ?? []).length === 0 && (
                <li className="text-sm text-ink-muted">No activity recorded yet.</li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
