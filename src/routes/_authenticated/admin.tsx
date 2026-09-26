import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { useOverview, useAdminData, adminKey, overviewKey } from "@/hooks/use-bank";
import { adminSetStatus, claimAdmin, longDate } from "@/lib/bank";
import type { AccountStatus } from "@/lib/bank";
import { PageHeader, Skeletons } from "@/components/page-header";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin console — CMFB Online Banking" },
      { name: "description", content: "Review members, change account status and read the bank's audit trail." },
      { property: "og:title", content: "Admin console — CMFB Online Banking" },
      { property: "og:description", content: "Member status controls and the bank audit trail." },
    ],
  }),
  component: AdminPage,
});

// Normalized uppercase list for display
const STATUSES: AccountStatus[] = ["PENDING", "RESTRICTED", "ACTIVE"];

function AdminPage() {
  const overview = useOverview();
  const isAdmin = overview.data?.isAdmin ?? false;
  const { data, isLoading } = useAdminData(isAdmin);
  const queryClient = useQueryClient();

  if (overview.isLoading) return <Skeletons rows={3} />;

  if (!isAdmin) {
    return (
      <div>
        <PageHeader title="Admin console" subtitle="This area is limited to bank staff." />
        <div className="panel p-6">
          <p className="text-sm text-ink-muted">
            You don't have staff access. In this demo you can grant yourself the admin role to explore
            the controls.
          </p>
          <button
            onClick={() =>
              claimAdmin().then(() => queryClient.invalidateQueries({ queryKey: overviewKey }))
            }
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            <ShieldCheck className="size-4" /> Grant demo admin access
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !data) return <Skeletons rows={4} />;

  const profiles = data.profiles ?? [];
  const auditLogs = data.audit ?? [];

  return (
    <div>
      <PageHeader
        title="Admin console"
        subtitle="Change a member's account status and review every action recorded by the bank."
      />

      <section className="reveal panel mb-5 overflow-hidden">
        <h2 className="border-b border-line px-5 py-4 font-display text-lg text-ink">Members</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-5 py-3 font-medium">Member</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Set status</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p: any) => {
                // Normalize database status ('active') to uppercase ('ACTIVE')
                const normalizedStatus = (p.status || "active").toUpperCase() as AccountStatus;

                return (
                  <tr key={p.id} className="border-b border-line/60 last:border-0">
                    <td className="px-5 py-3">
                      <p className="text-ink">{p.full_name || p.email || "Member"}</p>
                      <p className="text-xs text-ink-muted">{p.email}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-ink-muted">
                      {p.created_at ? longDate(p.created_at) : "N/A"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          normalizedStatus === "ACTIVE"
                            ? "rounded-full bg-success-soft px-3 py-1 text-[11px] font-semibold text-success"
                            : normalizedStatus === "PENDING"
                              ? "rounded-full bg-warning-soft px-3 py-1 text-[11px] font-semibold text-warning"
                              : "rounded-full bg-danger-soft px-3 py-1 text-[11px] font-semibold text-danger"
                        }
                      >
                        {normalizedStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
                        {STATUSES.map((s) => (
                          <button
                            key={s}
                            disabled={s === normalizedStatus}
                            onClick={() =>
                              adminSetStatus(p.id, s.toLowerCase() as any).then(() => {
                                queryClient.invalidateQueries({ queryKey: adminKey });
                                queryClient.invalidateQueries({ queryKey: overviewKey });
                              })
                            }
                            className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-40"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="reveal panel p-6">
        <h2 className="font-display text-lg text-ink">Audit trail</h2>
        <ul className="mt-4 space-y-3">
          {auditLogs.map((log: any) => (
            <li key={log.id} className="border-b border-line/60 pb-3 last:border-0 last:pb-0">
              <p className="text-sm text-ink">{log.detail || log.action || "System action logged"}</p>
              <p className="mt-1 text-xs text-ink-muted">
                {log.action} · {log.created_at ? longDate(log.created_at) : "N/A"}
              </p>
            </li>
          ))}
          {auditLogs.length === 0 && <li className="text-sm text-ink-muted">Nothing recorded yet.</li>}
        </ul>
      </section>
    </div>
  );
}