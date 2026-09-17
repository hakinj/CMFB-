import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { useOverview, overviewKey } from "@/hooks/use-bank";
import { longDate, markAllNotificationsRead } from "@/lib/bank";
import { PageHeader, Skeletons } from "@/components/page-header";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — CMFB Online Banking" },
      { name: "description", content: "Security alerts, transfer receipts and account status updates." },
      { property: "og:title", content: "Notifications — CMFB Online Banking" },
      { property: "og:description", content: "Alerts, receipts and account status updates." },
    ],
  }),
  component: NotificationsPage,
});

const TONE: Record<string, string> = {
  success: "border-success/25 bg-success-soft text-success",
  warning: "border-warning/25 bg-warning-soft text-warning",
  danger: "border-danger/25 bg-danger-soft text-danger",
  info: "border-line bg-brand-soft text-brand",
};

function NotificationsPage() {
  const { data, isLoading } = useOverview();
  const queryClient = useQueryClient();

  if (isLoading || !data) return <Skeletons rows={4} />;

  const unread = data.notifications.filter((n) => !n.read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Everything the bank has flagged on your account, newest first."
        action={
          unread > 0 ? (
            <button
              onClick={() =>
                markAllNotificationsRead().then(() =>
                  queryClient.invalidateQueries({ queryKey: overviewKey }),
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-medium text-ink hover:border-brand hover:text-brand"
            >
              <CheckCheck className="size-4" /> Mark all as read
            </button>
          ) : undefined
        }
      />

      <ul className="space-y-3">
        {data.notifications.map((n) => (
          <li
            key={n.id}
            className={`reveal panel flex gap-4 p-5 ${n.read ? "opacity-70" : ""}`}
          >
            <span
              className={`grid size-10 shrink-0 place-items-center rounded-xl border ${TONE[n.kind] ?? TONE["info"]}`}
            >
              <Bell className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">{n.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{n.body}</p>
              <p className="mt-2 text-xs text-ink-muted">{longDate(n.created_at)}</p>
            </div>
          </li>
        ))}
        {data.notifications.length === 0 && (
          <li className="panel p-6 text-sm text-ink-muted">You have no notifications.</li>
        )}
      </ul>
    </div>
  );
}
