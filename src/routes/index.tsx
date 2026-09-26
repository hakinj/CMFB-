import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  LineChart, 
  CreditCard, 
  Building2, 
  Smartphone, 
  CheckCircle2,
  Landmark,
  Headphones,
  Scale
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Confidential Bank & Trust — Online Banking" },
      {
        name: "description",
        content:
          "Confidential Bank online banking: personal checking, business treasury solutions, cards, and FDIC-insured security in one unified platform.",
      },
      { property: "og:title", content: "Confidential Bank & Trust — Commercial Banking" },
      {
        property: "og:description",
        content: "Accounts, wire transfers, card management and server-enforced security controls.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-line/60 bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-brand font-display text-base font-semibold text-white shadow-sm">
              C
            </span>
            <span className="leading-tight">
              <span className="block font-display text-sm font-semibold text-ink">Confidential</span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                Bank & Trust, N.A.
              </span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-muted">
            <a href="#personal" className="hover:text-ink transition-colors">Personal</a>
            <a href="#business" className="hover:text-ink transition-colors">Business</a>
            <a href="#security" className="hover:text-ink transition-colors">Security</a>
            <a href="#about" className="hover:text-ink transition-colors">About Us</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="rounded-xl border border-line bg-panel px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
            >
              Sign In
            </Link>
            <Link
              to="/auth"
              className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
            >
              Open Account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Fixed Background Image */}
      <section 
        className="relative flex min-h-[85vh] items-center justify-center bg-fixed bg-cover bg-center text-white" 
        style={{ backgroundImage: "url('/landing1.jpeg')" }}
      >
        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/80 to-slate-900/60" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-24">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand/20 border border-brand/30 px-3.5 py-1 text-xs font-medium text-emerald-300 backdrop-blur-sm">
              <ShieldCheck className="size-4" /> Member FDIC • Equal Housing Lender
            </p>
            <h1 className="font-display text-4xl leading-[1.05] sm:text-6xl font-bold tracking-tight">
              Private banking clarity, for everyday balances.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed">
              Move money via Fedwire and ACH, manage commercial cards, and monitor accounts with enterprise-grade security controls.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600 shadow-lg shadow-brand/20"
              >
                Open an Account Today <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 transition-colors"
              >
                Online Banking Sign In
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/15 pt-6 text-xs text-slate-300">
              <div>
                <p className="font-semibold text-white text-base">$250,000</p>
                <p className="text-slate-400">FDIC Deposit Insurance</p>
              </div>
              <div>
                <p className="font-semibold text-white text-base">Same-Day</p>
                <p className="text-slate-400">ACH & Wire Settlement</p>
              </div>
              <div>
                <p className="font-semibold text-white text-base">256-Bit</p>
                <p className="text-slate-400">AES Bank Encryption</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Banking Core Features */}
      <section id="personal" className="border-y border-line bg-panel/60 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">Corporate & Commercial Banking</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl text-ink">Engineered for financial accuracy</h2>
            <p className="mt-3 text-sm text-ink-muted">
              Built to US banking standards with real-time auditability and GAAP-compliant reporting.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: LineChart,
                title: "Real-Time Ledger & Analytics",
                body: "Sub-account tracking, automated reconciliation, and immediate reporting across personal checking and business money market accounts.",
              },
              {
                icon: CreditCard,
                title: "Visa® Commercial Card Controls",
                body: "Issue physical and virtual business debit cards, enforce merchant category code (MCC) blocks, and adjust spending limits in real time.",
              },
              {
                icon: Lock,
                title: "Server-Enforced Audits",
                body: "Restricted or frozen accounts cannot process outgoing wires or transfers. Blocked attempts are immediately flagged in audit logs.",
              },
            ].map((f) => (
              <article key={f.title} className="rounded-2xl border border-line bg-panel p-8 shadow-sm">
                <div className="inline-flex p-3.5 rounded-xl bg-brand-soft text-brand mb-5">
                  <f.icon className="size-6" />
                </div>
                <h3 className="font-display text-xl text-ink">{f.title}</h3>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section 1 (Using landing2.jpg) */}
      <section id="business" className="mx-auto max-w-7xl px-5 py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-3xl border border-line bg-panel shadow-xl">
              <img
                src="/landing2.jpg"
                alt="Personal and Business Wealth Planning"
                className="h-[400px] w-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">Wealth Management & Treasury</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl text-ink">
              Seamless financial management for families & enterprise teams
            </h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              Managing liquidity requires zero friction. Confidential Bank provides automated ACH transfers, dual-custody authorization for corporate accounts, and official e-statements.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "No monthly maintenance fees on qualifying deposit accounts",
                "Automated recurring bill pay, corporate payroll, and scheduled transfers",
                "Export official bank statements directly to QuickBooks, Xero, or PDF",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-ink">
                  <CheckCircle2 className="size-4 text-brand shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Section 2 (Using landing3.jpg) */}
      <section id="security" className="border-t border-line/60 bg-panel/30 py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">Institutional Security</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl text-ink">
                Bank securely from anywhere in the world
              </h2>
              <p className="mt-4 text-ink-muted leading-relaxed">
                Whether reviewing personal budgets from home or initiating high-value domestic wires, our multi-factor authentication protects your capital across every channel.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-line bg-panel p-4">
                  <Smartphone className="size-5 text-brand mb-2" />
                  <p className="font-semibold text-sm">Passkeys & Hardware 2FA</p>
                  <p className="text-xs text-ink-muted mt-1">FIDO2 WebAuthn and hardware security key support.</p>
                </div>
                <div className="rounded-xl border border-line bg-panel p-4">
                  <Building2 className="size-5 text-brand mb-2" />
                  <p className="font-semibold text-sm">US Regulated</p>
                  <p className="text-xs text-ink-muted mt-1">Supervised by the Federal Reserve & OCC.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="overflow-hidden rounded-3xl border border-line bg-panel shadow-xl">
                <img
                  src="/landing3.jpg"
                  alt="Couple reviewing home finances on laptop"
                  className="h-[400px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* US Commercial Bank Footer */}
      <footer className="border-t border-line bg-panel pt-16 pb-12 text-xs">
        <div className="mx-auto max-w-7xl px-5">
          {/* Main Navigation Links */}
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 pb-12 border-b border-line">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="grid size-8 place-items-center rounded-lg bg-brand font-display text-sm font-semibold text-white">
                  C
                </span>
                <span className="font-display text-base font-semibold text-ink">
                  Confidential Bank & Trust, N.A.
                </span>
              </div>
              <p className="text-ink-muted leading-relaxed pr-4 mb-4">
                Confidential Bank & Trust, N.A. is a full-service national banking association offering personal, business, and commercial treasury management services across the United States.
              </p>
              <div className="space-y-2 text-ink-muted">
                <p className="flex items-center gap-2"><Landmark className="size-3.5 text-brand" /> Corporate Headquarters: 100 Financial Plaza, New York, NY 10005</p>
                <p className="flex items-center gap-2"><Headphones className="size-3.5 text-brand" /> Customer Support: 1-800-555-CMFB (24/7 Toll-Free)</p>
              </div>
            </div>

            <div>
              <p className="font-semibold uppercase tracking-wider text-ink mb-4">Personal Banking</p>
              <ul className="space-y-2.5 text-ink-muted">
                <li><Link to="/auth" className="hover:text-ink transition-colors">Checking Accounts</Link></li>
                <li><Link to="/auth" className="hover:text-ink transition-colors">High-Yield Savings</Link></li>
                <li><Link to="/auth" className="hover:text-ink transition-colors">Certificates of Deposit (CDs)</Link></li>
                <li><Link to="/auth" className="hover:text-ink transition-colors">Visa® Debit Cards</Link></li>
                <li><Link to="/auth" className="hover:text-ink transition-colors">Mortgages & Home Equity</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-semibold uppercase tracking-wider text-ink mb-4">Commercial Banking</p>
              <ul className="space-y-2.5 text-ink-muted">
                <li><Link to="/auth" className="hover:text-ink transition-colors">Business Checking</Link></li>
                <li><Link to="/auth" className="hover:text-ink transition-colors">Treasury & Payroll</Link></li>
                <li><Link to="/auth" className="hover:text-ink transition-colors">Merchant Services</Link></li>
                <li><Link to="/auth" className="hover:text-ink transition-colors">Commercial Lending</Link></li>
                <li><Link to="/auth" className="hover:text-ink transition-colors">SBA Loans</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-semibold uppercase tracking-wider text-ink mb-4">Regulatory & Safety</p>
              <ul className="space-y-2.5 text-ink-muted">
                <li><Link to="/auth" className="hover:text-ink transition-colors">FDIC Coverage Info</Link></li>
                <li><Link to="/auth" className="hover:text-ink transition-colors">USA PATRIOT Act Notice</Link></li>
                <li><Link to="/auth" className="hover:text-ink transition-colors">Security & Anti-Fraud</Link></li>
                <li><Link to="/auth" className="hover:text-ink transition-colors">Privacy Notice</Link></li>
                <li><Link to="/auth" className="hover:text-ink transition-colors">Online Banking Guarantee</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-semibold uppercase tracking-wider text-ink mb-4">Support & Disclosures</p>
              <ul className="space-y-2.5 text-ink-muted">
                <li><Link to="/auth" className="hover:text-ink transition-colors">Branch & ATM Finder</Link></li>
                <li><Link to="/auth" className="hover:text-ink transition-colors">Fee Schedule & Disclosures</Link></li>
                <li><Link to="/auth" className="hover:text-ink transition-colors">Routing Numbers (ABA)</Link></li>
                <li><Link to="/auth" className="hover:text-ink transition-colors">Accessibility Statement</Link></li>
                <li><Link to="/auth" className="hover:text-ink transition-colors">Ethics & Whistleblower</Link></li>
              </ul>
            </div>
          </div>

          {/* Legal Disclaimers */}
          <div className="py-8 border-b border-line text-[11px] text-ink-muted leading-relaxed space-y-3">
            <p>
              <strong>Deposit Insurance Notice:</strong> Bank deposits are insured by the Federal Deposit Insurance Corporation (FDIC) up to $250,000 per depositor, per insured bank, for each account ownership category.
            </p>
            <p>
              <strong>Lending Disclaimer:</strong> Equal Housing Lender. All loans and lines of credit are subject to credit approval, verification, and collateral evaluation. Terms and conditions are subject to change without notice.
            </p>
            <p>
              <strong>Fraud & Security Reminder:</strong> Confidential Bank & Trust will never contact you via unsolicited phone calls, text messages, or emails asking for your online banking password, PIN, one-time passcode (OTP), or debit card security code. If you receive a suspicious request, do not respond and contact our Fraud Department at 1-800-555-CMFB immediately.
            </p>
          </div>

          {/* Copyright & Sub-links */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-ink-muted text-[11px]">
            <p>© {new Date().getFullYear()} Confidential Bank & Trust, N.A. Member FDIC. NMLS ID #492810. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#privacy" className="hover:text-ink">Privacy Policy</a>
              <a href="#terms" className="hover:text-ink">Terms of Use</a>
              <a href="#security" className="hover:text-ink">Security Center</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}