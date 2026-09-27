import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/app-shell";
import { OtpModal } from "@/components/otpModal";
import otpMail from "@/lib/otpMail";

type Authsearch ={
  mod:'signin' | 'signup'
}

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — Confidential Bank & Trust" },
      {
        name: "description",
        content:
          "Sign in or open an account with Confidential Bank online banking.",
      },
      { property: "og:title", content: "Sign in — Confidential Bank & Trust" },
      {
        property: "og:description",
        content: "Secure online banking access for members.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): Authsearch => {
    return {
      mod: search['mod'] === 'signup' ? 'signup' : 'signin',
    }
  },

  component: AuthPage,
});

function AuthPage() {
  const { mod } = Route.useSearch()

  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">(mod );

  // Auth Credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Detailed Account Opening Inputs
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ssn, setSsn] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [schemerId, setSchemerId] = useState("");
  

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setisOpen] = useState<boolean | undefined>()
  const [otp, setOtp] = useState('')
  const otpRef = useRef<string>("");


  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  function oNclose(){
    setisOpen(false)
  }

  function generateOtp(): string {
  // Generates a integer between 1000 and 9999 inclusive
  const otpNumber = Math.floor(1000 + Math.random() * 9000);
    otpRef.current = otpNumber.toString();

  setOtp(otpNumber.toString());
  return otpNumber.toString();
}

 




  async function submit(e?: React.FormEvent) {

     e?.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "signup") {
         console.log('execution sigup now')
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              first_name: firstName,
              middle_name: middleName,
              last_name: lastName,
              full_name: `${firstName} ${middleName ? middleName + " " : ""}${lastName}`,
              ssn,
              dob,
              address,
              city,
              state,
              zip_code: zipCode,
              schemer_id: schemerId,
            },
          },
        });
        if (err) throw err;
      }else if(mode ==='signin' && !isOpen){
      const newOtp = generateOtp();

       setOtp(newOtp);
        await otpMail({message:otpRef.current})
        setisOpen(true);
         console.log(otp);
        
         console.log('execution in login now');

      }else if(mode ==='signin' && isOpen) {
        console.log('execution sigin now')
        setisOpen(false)
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
    
   <>
   <OtpModal onClose={()=>{oNclose()}} verifyOtp={otpRef.current} otpVerified={() => submit()} onResend={()=>{generateOtp()}} isOpen={isOpen}/>
     <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink px-12 py-14 text-white lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-white font-display text-base font-semibold text-ink">
            C
          </span>
          <span className="text-sm font-medium tracking-wide">Confidential Bank & Trust</span>
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
        <div className={`w-full transition-all ${mode === "signup" ? "max-w-xl" : "max-w-sm"}`}>
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {mode === "signin" ? "Sign in to online banking" : "Open your account"}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {mode === "signin"
              ? "Use your member email and password."
              : "Complete the mandatory compliance details to apply for an account."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field
                    label="First Name"
                    value={firstName}
                    onChange={setFirstName}
                    type="text"
                    placeholder="Jane"
                    required
                  />
                  <Field
                    label="Middle Name"
                    value={middleName}
                    onChange={setMiddleName}
                    type="text"
                    placeholder="Ann"
                  />
                  <Field
                    label="Last Name"
                    value={lastName}
                    onChange={setLastName}
                    type="text"
                    placeholder="Doe"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Social Security Number (SSN)"
                    value={ssn}
                    onChange={setSsn}
                    type="password"
                    placeholder="XXX-XX-XXXX"
                    required
                  />
                  <Field
                    label="Date of Birth"
                    value={dob}
                    onChange={setDob}
                    type="date"
                    required
                  />
                </div>

                <Field
                  label="Street Address"
                  value={address}
                  onChange={setAddress}
                  type="text"
                  placeholder="123 Main Street, Apt 4B"
                  required
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field
                    label="City"
                    value={city}
                    onChange={setCity}
                    type="text"
                    placeholder="New York"
                    required
                  />
                  <Field
                    label="State"
                    value={state}
                    onChange={setState}
                    type="text"
                    placeholder="NY"
                    required
                  />
                  <Field
                    label="Zip Code"
                    value={zipCode}
                    onChange={setZipCode}
                    type="text"
                    placeholder="10001"
                    required
                  />
                </div>

                <Field
                  label="Referrer Id"
                  value={schemerId}
                  onChange={setSchemerId}
                  type="text"
                  placeholder="SCH-12345"
                />
              </>
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
            {mode === "signin" ? "New to Confidential Bank? " : "Already a member? "}
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
  </>
    
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