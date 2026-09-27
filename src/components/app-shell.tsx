import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Landmark,
  ArrowLeftRight,
  Receipt,
  CreditCard,
  Users,
  Bell,
  Settings,
  ShieldCheck,
  Menu,
  LogOut,
  Headset ,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { provisionDemo, statusCopy } from "@/lib/bank";
import { useOverview, overviewKey } from "@/hooks/use-bank";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/accounts", label: "Accounts", icon: Landmark },
  { to: "/transfer", label: "Transfer", icon: ArrowLeftRight },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/cards", label: "Cards", icon: CreditCard },
  { to: "/beneficiaries", label: "Beneficiaries", icon: Users },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/customerService", label: "customer care", icon: Headset },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-brand font-display text-base font-semibold text-white">
        C
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-sm font-semibold text-ink">
            Confidential
          </span>
          <span className="block text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            BANK & TRUST
          </span>
        </span>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data, isLoading, error } = useOverview();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // First sign-in creates the demo banking profile server-side, then refetches.
  useEffect(() => {
    if (!isLoading && data && !data.profile) {
      provisionDemo()
        .then(() => queryClient.invalidateQueries({ queryKey: overviewKey }))
        .catch(() => undefined);
    }
  }, [isLoading, data, queryClient]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { mod: 'signin' }, replace: true });
  }

  const unread = data?.notifications.filter((n) => !n.read).length ?? 0;
  const status = data?.profile?.status;

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-brand text-white shadow-sm"
                : "text-ink-muted hover:bg-brand-soft hover:text-brand",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.to === "/notifications" && unread > 0 && (
              <span className="rounded-full bg-danger px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {unread}
              </span>
            )}
          </Link>
        );
      })}
      {data?.isAdmin && (
        <Link
          to="/admin"
          className={cn(
            "mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            pathname === "/admin"
              ? "bg-ink text-white"
              : "text-ink-muted hover:bg-muted hover:text-ink",
          )}
        >
          <ShieldCheck className="size-4" />
          Admin console
        </Link>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex w-full max-w-350">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-line bg-panel/70 px-4 py-6 lg:flex">
          <div className="space-y-8">
            <Link to="/dashboard">
              <Logo />
            </Link>
            {nav}
          </div>
          <SidebarFooter name={data?.profile?.full_name} email={data?.profile?.email} onSignOut={signOut} />
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-canvas/85 px-4 py-3 backdrop-blur-xl lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="grid size-9 place-items-center rounded-lg border border-line bg-panel lg:hidden"
              >
                <Menu className="size-4" />
              </button>
              <div className="lg:hidden">
                <Logo compact />
              </div>
              <p className="hidden text-sm text-ink-muted lg:block">
                Secure online banking you can trust!
              </p>
            </div>
            <div className="flex items-center gap-2">
              {status && (
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
                    status === "ACTIVE"
                      ? "bg-success-soft text-success"
                      : status === "PENDING"
                        ? "bg-warning-soft text-warning"
                        : "bg-danger-soft text-danger",
                  )}
                >
                  {'RESTRICTED'}
                </span>
              )}
              <Link
                to="/notifications"
                className="relative grid size-9 place-items-center rounded-lg border border-line bg-panel text-ink-muted hover:text-brand"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                {unread > 0 && (
                  <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-danger text-[9px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </Link>
            </div>
          </header>

          <main className="px-4 py-6 lg:px-8 lg:py-8">
            {error ? (
              <p className="panel p-6 text-sm text-danger">
                We couldn't load your banking data. Please refresh and try again.
              </p>
            ) : (
              children
            )}
          </main>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col justify-between bg-panel px-4 py-6 shadow-xl">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <Logo />
                <button onClick={() => setOpen(false)} aria-label="Close menu">
                  <X className="size-5 text-ink-muted" />
                </button>
              </div>
              {nav}
            </div>
            <SidebarFooter
              name={data?.profile?.full_name}
              email={data?.profile?.email}
              onSignOut={signOut}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarFooter({
  name,
  email,
  onSignOut,
}: {
  name?: string | undefined;
  email?: string | undefined;
  onSignOut: () => void;
}) {
  return (
    <div className="space-y-3 border-t border-line pt-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{name || "Member"}</p>
        <p className="truncate text-xs text-ink-muted">{email || ""}</p>
      </div>
      <button
        onClick={onSignOut}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-ink-muted transition-colors hover:bg-danger-soft hover:text-danger"
      >
        <LogOut className="size-4" /> Sign out
      </button>
    </div>
  );
}
