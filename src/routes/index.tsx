import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowRight, Lock, LineChart, CreditCard } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Confidential Micro Finance Bank — Online Banking" },
      {
        name: "description",
        content:
          "CMFB online banking: accounts, transfers, cards, beneficiaries and security controls in one calm, secure workspace.",
      },
      { property: "og:title", content: "Confidential Micro Finance Bank — Online Banking" },
      {
        property: "og:description",
        content: "Accounts, transfers, cards and security controls in one calm workspace.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-brand font-display text-base font-semibold text-white">
            C
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-semibold text-ink">Confidential</span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              Micro Finance Bank
            </span>
          </span>
        </div>
        <Link
          to="/auth"
          className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Sign in
        </Link>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 lg:pt-20">
        <div className="reveal max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
            <ShieldCheck className="size-3.5" /> Demonstration banking platform
          </p>
          <h1 className="font-display text-4xl leading-[1.05] text-ink lg:text-6xl">
            Private banking clarity, for everyday balances.
          </h1>
          <p className="mt-5 max-w-xl text-base text-ink-muted">
            Move money, control cards, track every transaction and manage security from a single
            considered workspace. Account restrictions are enforced by the bank's servers — not by
            what the interface chooses to hide.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Open a demo account <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-panel px-5 py-3 text-sm font-semibold text-ink"
            >
              Member sign in
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: LineChart,
              title: "Every dollar accounted for",
              body: "Running balances, categorised spending and a searchable ledger across all accounts.",
            },
            {
              icon: CreditCard,
              title: "Cards under your thumb",
              body: "Freeze a card instantly, adjust monthly limits and review card-level activity.",
            },
            {
              icon: Lock,
              title: "Server-enforced restrictions",
              body: "Restricted accounts cannot move money, and every blocked attempt is audited.",
            },
          ].map((f) => (
            <article key={f.title} className="panel p-6">
              <f.icon className="size-5 text-brand" />
              <h2 className="mt-4 font-display text-lg text-ink">{f.title}</h2>
              <p className="mt-2 text-sm text-ink-muted">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-line px-5 py-8">
        <p className="mx-auto max-w-6xl text-xs text-ink-muted">
          Confidential Micro Finance Bank is a demonstration application. No real accounts, real
          credentials or real money movement are involved.
        </p>
      </footer>
    </div>
  );
}
