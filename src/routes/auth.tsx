import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/app-shell";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — Confidential Micro Finance Bank" },
      {
        name: "description",
        content:
          "Sign in or open a demo account with Confidential Micro Finance Bank online banking.",
      },
      { property: "og:title", content: "Sign in — Confidential Micro Finance Bank" },
      {
        property: "og:description",
        content: "Secure online banking access for CMFB members.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setError("Check your inbox to confirm your email, then sign in.");
        return;
      }
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink px-12 py-14 text-white lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-white font-display text-base font-semibold text-ink">
            C
          </span>
          <span className="text-sm font-medium tracking-wide">Confidential Micro Finance Bank</span>
        </Link>
        <div className="max-w-md space-y-4">
          <h2 className="font-display text-4xl leading-tight">
            Banking built on restraint, clarity and control.
          </h2>
          <p className="text-sm text-white/70">
            Every balance, transfer and card control in one calm workspace. Account restrictions are
            enforced by the bank's servers, never by the screen you're looking at.
          </p>
        </div>
        <p className="flex items-center gap-2 text-xs text-white/50">
          <ShieldCheck className="size-4" /> Demonstration environment — no real money moves here.
        </p>
      </div>

      <div className="flex items-center justify-center bg-canvas px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {mode === "signin" ? "Sign in to online banking" : "Open your demo account"}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {mode === "signin"
              ? "Use your CMFB member email and password."
              : "New profiles start restricted until the bank activates them."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <Field
                label="Full name"
                value={fullName}
                onChange={setFullName}
                type="text"
                placeholder="Jordan Avery"
                required
              />
            )}
            <Field
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="you@example.com"
              required
            />
            <Field
              label="Password"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="At least 8 characters"
              required
            />

            {error && (
              <p className="rounded-lg bg-danger-soft px-3 py-2 text-xs text-danger">{error}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-muted">
            {mode === "signin" ? "New to CMFB? " : "Already a member? "}
            <button
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError("");
              }}
              className="font-semibold text-brand hover:underline"
            >
              {mode === "signin" ? "Open an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder ?? ""}
        required={required ?? false}
        className="w-full rounded-xl border border-input bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
      />
    </label>
  );
}
