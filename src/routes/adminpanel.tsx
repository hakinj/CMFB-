import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, ShieldCheck, Send, KeyRound, Lock, ArrowRight, Trash2, CheckCircle, Info, AlertTriangle, XCircle, Database, RefreshCw, Edit3, Check, ShieldAlert, Mail, CheckCircle2 } from "lucide-react";
import { useOverview, useAdminData, adminKey, overviewKey } from "@/hooks/use-bank";
import { adminSetStatus, claimAdmin, longDate } from "@/lib/bank";
import type { AccountStatus } from "@/lib/bank";
import { PageHeader, Skeletons } from "@/components/page-header";
import { useEffect, useRef, useState } from "react";
import { sendUserNotification, fetchUserNotifications, deleteNotification } from "@/lib/bank";

const HARDCODED_ADMIN_KEY = "SUPPERACCESS001";
const STORAGE_KEY = "super_admin_unlocked";


import {
  Users,
  Wallet,
  History,
  CreditCard,
  Bell,
  Menu,
  X,
  LayoutDashboard,
  Search,
  LogOut,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/app-shell";
import { OtpModal } from "@/components/otpModal";
import otpMail from "@/lib/otpMail";
import { toast, ToastContainer } from "react-toastify";



const STATUSES: AccountStatus[] = ["PENDING", "RESTRICTED", "ACTIVE"];

export const Route = createFileRoute("/adminpanel")({
  component: AdminAuthPage,
});

type AdminSection =
  | "dashboard"
  | "signup-account"
  | "view-accts"
  | "add-balance"
  | "transaction-history"
  | "card-detail"
  | "set-notification";

const navigation = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "signup-account",
    label: "Signup Account",
    icon: Users,
  },
  {
    id: "view-accts",
    label: "View accounts",
    icon: Users,
  },
  {
    id: "add-balance",
    label: "update records",
    icon: Wallet,
  },
  {
    id: "transaction-history",
    label: "insert Transaction History",
    icon: History,
  },
  {
    id: "card-detail",
    label: "insert Card Detail",
    icon: CreditCard,
  },
  {
    id: "set-notification",
    label: "Set Notification",
    icon: Bell,
  },
] as const;

function AdminAuthPage() {
  const [activeSection, setActiveSection] =
    useState<AdminSection>("dashboard");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeItem = navigation.find(
    (item) => item.id === activeSection,
  );

  return (
    <>
    <AdminPanelGuard />
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-4 lg:hidden">
        <h1 className="text-lg font-bold text-blue-900">
          Admin Portal
        </h1>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 hover:bg-slate-100"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <div className="flex min-h-screen">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-950 text-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
            }`}
        >
          {/* Logo */}
          <div className="border-b border-white/10 px-6 py-7">
            <h1 className="text-xl font-bold tracking-wide">
              Confidential Bank
            </h1>

            <p className="mt-2 text-xs text-slate-400">
              Administration Portal
            </p>
          </div>

          {/* Admin profile */}
          <div className="mx-4 my-6 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-blue-600 font-bold">
              A
            </div>

            <div>
              <p className="text-sm font-semibold">
                Administrator
              </p>

              <p className="text-xs text-slate-400">
                Manage your bank
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4">
            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Main Menu
            </p>

            {navigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <Icon size={19} />

                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="border-t border-white/10 p-4">
            <button
              type="button"
              onClick={()=>{
                sessionStorage.setItem(STORAGE_KEY, "false");
                window.location.reload();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={19} />
              <span>Sign Ou</span>
            </button>
          </div>
        </aside>

        {/* Main page */}
        <main className="min-w-0 flex-1">
          {/* Desktop top navigation */}
          <header className="hidden items-center justify-between border-b bg-white px-8 py-5 lg:flex">
            <div>
              <p className="text-sm text-slate-500">
                Administration
              </p>

              <h2 className="mt-1 text-xl font-bold">
                {activeItem?.label ?? "Dashboard"}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
                <Search size={17} className="text-slate-400" />

                <span className="text-sm text-slate-500">
                  Admin workspace
                </span>
              </div>
            </div>
          </header>

          {/* Content area */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 lg:hidden">
              <p className="text-sm text-slate-500">
                Administration
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {activeItem?.label ?? "Dashboard"}
              </h2>
            </div>

            {activeSection === "dashboard" && (
              <DashboardContent
                onNavigate={setActiveSection}
              />
            )}

            {activeSection === "signup-account" && (
              <CreateUserContent />
            )}

            {activeSection === "view-accts" && (
              <AdminPage />
            )}

            {activeSection === "add-balance" && (
              <AddBalanceContent />
            )}

            {activeSection === "transaction-history" && (
              <TransactionHistoryContent />
            )}

            {activeSection === "card-detail" && (
              <CardDetailContent />
            )}

            {activeSection === "set-notification" && (
              <NotificationContent />
            )}
          </div>
        </main>
      </div>
    </div>
    </>
  );
  
}

/* ------------------------------------------
   DASHBOARD
------------------------------------------- */

function DashboardContent({
  onNavigate,
}: {
  onNavigate: (section: AdminSection) => void;
}) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          Welcome to Admin Dashboard
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Manage users, balances, cards, transactions and
          notifications from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {navigation
          .filter((item) => item.id !== "dashboard")
          .map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon size={24} />
                </div>

                <h3 className="font-semibold">
                  {item.label}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Open and manage {item.label.toLowerCase()}.
                </p>
              </button>
            );
          })}
      </div>
    </div>
  );
}

/* ------------------------------------------
   CREATE USER
------------------------------------------- */

// function CreateUserContent() {
//   return (
//     <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
//       <h2 className="text-xl font-bold">
//         Create New User
//       </h2>

//       <p className="mb-7 mt-2 text-sm text-slate-500">
//         Enter the user's details to create an account.
//       </p>

//       <form
//         onSubmit={(event) => {
//           event.preventDefault();
//         }}
//         className="grid grid-cols-1 gap-5 md:grid-cols-2"
//       >
//         <FormField label="First Name" placeholder="Enter first name" />

//         <FormField label="Last Name" placeholder="Enter last name" />

//         <FormField
//           label="Email Address"
//           placeholder="user@example.com"
//           type="email"
//         />

//         <FormField
//           label="Phone Number"
//           placeholder="Enter phone number"
//           type="tel"
//         />

//         <FormField
//           label="Account Number"
//           placeholder="Enter account number"
//         />

//         <FormField
//           label="Initial Balance"
//           placeholder="0.00"
//           type="number"
//         />

//         <div className="md:col-span-2">
//           <button
//             type="submit"
//             className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
//           >
//             Create User
//           </button>
//         </div>
//       </form>


//     </section>
//   );
// }

function CreateUserContent() {


  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">('signup');

  // Auth Credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Detailed Account Opening Inputs
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ssn, setSsn] = useState("");
  const [acct_type, setacctType] = useState("");
  const [kind, setKind] = useState("");
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

  const resetForm = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setSsn("");
    setacctType("");
    setKind("");
    setDob("");
    setAddress("");
    setCity("");
    setState("");
    setZipCode("");
    setSchemerId("");
    setEmail("");
    setPassword("");
  };


  // useEffect(() => {
  //     supabase.auth.getSession().then(({ data }) => {
  //         if (data.session) navigate({ to: "/dashboard", replace: true });
  //     });
  // }, [navigate]);

  function oNclose() {
    setisOpen(false)
  }

  function generateOtp(): string {
    // Generates a integer between 1000 and 9999 inclusive
    const otpNumber = Math.floor(1000 + Math.random() * 9000);
    otpRef.current = otpNumber.toString();

    setOtp(otpNumber.toString());
    return otpNumber.toString();
  }


  const changePass = () => {
    toast.info("Contact Support", { toastId: "change-password" });
  }


  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "signup") {
        // 1. Pre-flight check: Verify if email already exists in profiles table
        const { data: existingUser, error: checkErr } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", email.trim().toLowerCase())
          .maybeSingle();

        if (checkErr) {
          throw new Error(`Failed to verify email availability: ${checkErr.message}`);
        }

        if (existingUser) {
          throw new Error("An account with this email address already exists.");
        }

        // 2. Proceed with Supabase Auth SignUp
        const { error: err } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/`,
            data: {
              first_name: firstName,
              middle_name: middleName,
              last_name: lastName,
              full_name: `${firstName} ${middleName ? middleName + " " : ""}${lastName}`,
              ssn,
              acct_type,
              kind,
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
        toast.success("Account created successfully", { toastId: "account-created" });
        resetForm();
      } else if (mode === "signin" && !isOpen) {
        const newOtp = generateOtp();

        setOtp(newOtp);
        await otpMail({ message: otpRef.current,userMail:email });
        setisOpen(true);
      } else if (mode === "signin" && isOpen) {
        console.log("executing signin now");
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (err) throw err;

        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setError("Check your inbox to confirm your email, then sign in.");
          return;
        }
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (

    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <OtpModal onClose={() => { oNclose() }} verifyOtp={otpRef.current} otpVerified={() => submit()} onResend={() => { generateOtp() }} isOpen={isOpen} />
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* <div className="hidden flex-col justify-between bg-ink px-12 py-14 text-white lg:flex">
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
            <ShieldCheck className="size-4" /> Kick off your money journey with a bank that flexes with you as life gets bigger.
          </p>
        </div> */}

        <div className="flex items-center justify-center bg-canvas px-4 py-12" >
          {/* style={{
          backgroundImage: "url('/signin3.jpeg')", backgroundRepeat: "no-repeat",
          backgroundPosition: "fit"
        }} */}
          <div className={`w-full transition-all ${mode === "signup" ? "max-w-xl" : "max-w-sm"}`}>
            <div className="mb-8 lg:hidden ">
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
                      autoComplete="current-password"
                    />




                    <Field
                      label="Date of Birth"
                      value={dob}
                      onChange={setDob}
                      type="date"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">


                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Account Type
                      </span>
                      <select
                        value={acct_type}
                        onChange={(e) => setacctType(e.target.value)}
                        required
                        className="w-full rounded-xl border border-input bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
                      >
                        <option value="" disabled>
                          Select account type...
                        </option>
                        <option value="checking">Every Checking</option>
                        <option value="savings">High-Yield Savings</option>
                      </select>
                    </label>




                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Account Type
                      </span>
                      <select
                        value={kind}
                        onChange={(e) => setKind(e.target.value)}
                        required
                        className="w-full rounded-xl border border-input bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
                      >
                        <option value="" disabled>
                          Select account type...
                        </option>
                        <option value="checking">Checking</option>
                        <option value="savings">Savings</option>
                      </select>
                    </label>
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
                autoComplete="new-password"
              />

              {error && toast.error(error, {toastId:'duplicate-account error'})}

              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {busy && <Loader2 className="size-4 animate-spin" />}
                {mode && "Create account"}
              </button>
              {mode === "signin" && <a onClick={() => { 
                changePass();
                setMode('signup')

               }} href="#">Forgot password?</a>}

            </form>


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
  autoComplete
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string } | string>;
  autoComplete?:string
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
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-input bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
      />
    </label>
  );
}
/* ------------------------------------------
   ADD BALANCE
------------------------------------------- */

// function AddBalanceContent() {
//     return (
//         <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
//             <h2 className="text-xl font-bold">
//                 Add Balance
//             </h2>

//             <p className="mb-7 mt-2 text-sm text-slate-500">
//                 Add funds to an existing user's account.
//             </p>

//             <form
//                 onSubmit={(event) => event.preventDefault()}
//                 className="max-w-2xl space-y-5"
//             >
//                 <FormField
//                     label="Account Number"
//                     placeholder="Enter account number"
//                 />

//                 <FormField
//                     label="Amount"
//                     placeholder="Enter amount"
//                     type="number"
//                 />

//                 <FormField
//                     label="Transaction Reference"
//                     placeholder="Enter reference"
//                 />

//                 <button
//                     type="submit"
//                     className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800"
//                 >
//                     Add Balance
//                 </button>
//             </form>
//         </section>
//     );
// }

type TableName = "profiles" | "accounts" | "transactions" | "cards" | "notifications";

const TARGET_TABLES: { name: TableName; label: string }[] = [
  { name: "profiles", label: "User Profiles" },
  { name: "accounts", label: "Bank Accounts" },
  { name: "transactions", label: "Transactions" },
  { name: "cards", label: "Issued Cards" },
  { name: "notifications", label: "Notifications" },
];


export function AddBalanceContent() {
  const [targetEmail, setTargetEmail] = useState("");
  const [activeUserEmail, setActiveUserEmail] = useState("");
  const [selectedTable, setSelectedTable] = useState<TableName>("profiles");
  const [records, setRecords] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Mode States
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch Records for Specific User Email
  const loadUserData = async (email: string, table: TableName) => {
    if (!email.trim()) {
      toast.error("Please enter a user email address.");
      return;
    }

    setLoading(true);
    setEditingRowId(null);
    try {
      const { data, error } = await (supabase.rpc as any)("super_admin_get_user_records", {
        target_table: table,
        target_email: email.trim().toLowerCase(),
      });

      if (error) throw error;

      const recordList = Array.isArray(data) ? data : [];
      setRecords(recordList);
      setActiveUserEmail(email.trim().toLowerCase());
      toast.success(`Loaded ${recordList.length} record(s) for ${email}.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to load user records.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUserData(targetEmail, selectedTable);
  };

  const handleTableChange = (newTable: TableName) => {
    setSelectedTable(newTable);
    if (activeUserEmail) {
      loadUserData(activeUserEmail, newTable);
    }
  };

  // Extract columns dynamically (ts(2769) fix: fallback object)
  const availableColumns = Object.keys(records[0] ?? {});

  // Local text filter across columns
  const filteredRecords = records.filter((rec) =>
    Object.values(rec).some((val) =>
      String(val ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const startEdit = (rowId: string, colName: string, currentValue: any) => {
    setEditingRowId(rowId);
    setEditingColumn(colName);
    setEditValue(currentValue !== null && currentValue !== undefined ? String(currentValue) : "");
  };

  // Save Column Update
  const handleSaveUpdate = async (rowId: string) => {
    if (!editingColumn) return;

    setIsSaving(true);
    try {
      // 1. Cleanly format created_at timestamps before sending to Supabase
      const payloadValue =
        editingColumn === "created_at"
          ? new Date(editValue).toISOString()
          : editValue;

      // 2. Dispatch RPC with formatted value
      const { error } = await (supabase.rpc as any)("super_admin_update_record", {
        target_table: selectedTable,
        lookup_value: rowId,
        lookup_type: "id",
        column_name: editingColumn,
        new_value: payloadValue, // <-- Pass payloadValue here
      });

      if (error) throw error;

      toast.success(`Updated column "${editingColumn}".`, { toastId: 'column update' });

      // 3. Update local state
      setRecords((prev) =>
        prev.map((r) =>
          r["id"] === rowId ? { ...r, [editingColumn]: payloadValue } : r
        )
      );

      setEditingRowId(null);
      setEditingColumn(null);
    } catch (err: any) {
      toast.error(`Update failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Record
  const handleDeleteRecord = async (rowId: string) => {
    if (!window.confirm(`Permanently delete this entry from ${selectedTable}?`)) {
      return;
    }

    setDeletingId(rowId);
    try {
      const { error } = await (supabase.rpc as any)("super_admin_delete_record", {
        target_table: selectedTable,
        lookup_value: rowId,
        lookup_type: "id",
      });

      if (error) throw error;

      toast.success("Record deleted successfully.", { toastId: 'column deleted' });
      // Bracket notation fix for ts(4111)
      setRecords((prev) => prev.filter((r) => r["id"] !== rowId));
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="reveal panel p-4 sm:p-6 border-l-4 border-l-rose-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-rose-500/10 p-2.5 text-rose-500 shrink-0">
              <ShieldAlert className="size-5 sm:size-6" />
            </div>
            <div>
              <h1 className="font-display text-base sm:text-xl text-ink font-bold">
                User-Scoped Super Admin Control
              </h1>
              <p className="text-xs text-ink-muted">
                Inspect, modify, or delete specific table entries by user email.
              </p>
            </div>
          </div>

          {activeUserEmail && (
            <button
              onClick={() => loadUserData(activeUserEmail, selectedTable)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand cursor-pointer shrink-0 w-full sm:w-auto"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh User Data
            </button>
          )}
        </div>
      </section>

      {/* Lookup Toolbar */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Email Lookup Input */}
        <form onSubmit={handleSearchSubmit} className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-muted mb-1.5">
            Target User Email
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="email"
                required
                placeholder="enter.user@example.com"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="w-full rounded-xl border border-line bg-surface pl-9 pr-3.5 py-2.5 sm:py-2 text-sm text-ink outline-none focus:border-brand"
              />
              <Mail className="absolute left-3 top-3 sm:top-2.5 size-4 text-ink-muted" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 sm:py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer shrink-0 w-full sm:w-auto"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
              Fetch Records
            </button>
          </div>
        </form>

        {/* Table Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-muted mb-1.5">
            Select Table
          </label>
          <div className="relative">
            <select
              value={selectedTable}
              onChange={(e) => handleTableChange(e.target.value as TableName)}
              className="w-full appearance-none rounded-xl border border-line bg-surface px-3.5 py-2.5 sm:py-2 text-sm font-medium text-ink outline-none focus:border-brand"
            >
              {TARGET_TABLES.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.label} ({t.name})
                </option>
              ))}
            </select>
            <Database className="pointer-events-none absolute right-3 top-3 sm:top-2.5 size-4 text-ink-muted" />
          </div>
        </div>
      </div>

      {/* Record Search Bar */}
      {records.length > 0 && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-muted mb-1.5">
            Filter Loaded Rows
          </label>
          <input
            type="text"
            placeholder="Search within loaded results..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-3.5 py-2 text-xs text-ink outline-none focus:border-brand"
          />
        </div>
      )}

      {/* Data Table Container */}
      <section className="reveal panel overflow-hidden">
        <div className="border-b border-line px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Target User:{" "}
            <strong className="text-ink font-mono break-all">
              {activeUserEmail || "No Email Selected"}
            </strong>{" "}
            | Table: <strong className="text-ink font-mono">{selectedTable}</strong> (
            {filteredRecords.length} records)
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-ink-muted">
            <Loader2 className="size-5 animate-spin mr-2" /> Querying user records...
          </div>
        ) : !activeUserEmail ? (
          <p className="py-16 text-center text-sm text-ink-muted px-4">
            Enter a user email above and click <strong>Fetch Records</strong> to view their data.
          </p>
        ) : records.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-muted px-4">
            No entries found in <span className="font-mono">{selectedTable}</span> for{" "}
            <strong>{activeUserEmail}</strong>.
          </p>
        ) : (
          <>
            {/* MOBILE VIEW: Responsive Stacked Cards (< md breakpoint) */}
            <div className="block md:hidden divide-y divide-line/60">
              {filteredRecords.map((row) => {
                const rowId = row["id"];
                const isDeleting = deletingId === rowId;

                return (
                  <div key={rowId} className="p-4 space-y-3 bg-surface/20">
                    <div className="flex items-center justify-between pb-2 border-b border-line/40">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-ink-muted">
                        ID: {String(rowId).slice(0, 8)}...
                      </span>
                      <button
                        onClick={() => handleDeleteRecord(rowId)}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-1 text-xs font-medium text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-lg disabled:opacity-40"
                      >
                        {isDeleting ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
                        Delete Entry
                      </button>
                    </div>

                    <div className="grid gap-2.5">
                      {availableColumns.map((col) => {
                        if (col === "id") return null;
                        const isEditingThisCell = editingRowId === rowId && editingColumn === col;
                        const cellValue = row[col];

                        return (
                          <div key={col} className="flex flex-col gap-1 text-xs">
                            <span className="font-mono text-[10px] uppercase text-ink-muted font-semibold">
                              {col}
                            </span>
                            {isEditingThisCell ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="w-full rounded border border-brand bg-surface px-2 py-1.5 text-xs text-ink outline-none"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveUpdate(rowId)}
                                  disabled={isSaving}
                                  className="rounded bg-emerald-500/10 p-1.5 text-emerald-500 shrink-0"
                                >
                                  {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingRowId(null);
                                    setEditingColumn(null);
                                  }}
                                  className="rounded bg-rose-500/10 p-1.5 text-rose-500 shrink-0"
                                >
                                  <X className="size-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between bg-surface p-2 rounded-lg border border-line/50">
                                <span className="font-mono text-ink text-xs break-all pr-2">
                                  {cellValue === null || cellValue === undefined ? (
                                    <span className="text-ink-muted italic">NULL</span>
                                  ) : col === "created_at" && cellValue ? (
                                    new Date(cellValue).toLocaleString()
                                  ) : typeof cellValue === "boolean" ? (
                                    cellValue ? "true" : "false"
                                  ) : (
                                    String(cellValue)
                                  )}
                                </span>
                                <button
                                  onClick={() => startEdit(rowId, col, cellValue)}
                                  className="p-1 text-ink-muted hover:text-brand shrink-0"
                                >
                                  <Edit3 className="size-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP VIEW: Full Horizontal Scroll Table (>= md breakpoint) */}
            <div className="hidden md:block w-full overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-line bg-surface/50 text-ink-muted uppercase tracking-wider font-semibold">
                    <th className="px-4 py-3 text-right">Actions</th>
                    {availableColumns.map((col) => (
                      <th key={col} className="px-4 py-3 whitespace-nowrap font-mono">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {filteredRecords.map((row) => {
                    const rowId = row["id"];
                    const isDeleting = deletingId === rowId;

                    return (
                      <tr key={rowId} className="hover:bg-surface/30 transition-colors">
                        {/* Actions Column */}
                        <td className="px-4 py-2 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteRecord(rowId)}
                            disabled={isDeleting}
                            title="Delete Entry"
                            className="rounded-lg p-1 text-ink-muted transition-colors hover:bg-rose-500/10 hover:text-rose-500 disabled:opacity-40 cursor-pointer"
                          >
                            {isDeleting ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
                          </button>
                        </td>

                        {/* Columns */}
                        {availableColumns.map((col) => {
                          const isEditingThisCell = editingRowId === rowId && editingColumn === col;
                          const cellValue = row[col];

                          return (
                            <td key={col} className="px-4 py-2 whitespace-nowrap max-w-[240px]">
                              {isEditingThisCell ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="w-full rounded border border-brand bg-surface px-2 py-1 text-xs text-ink outline-none"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSaveUpdate(rowId)}
                                    disabled={isSaving}
                                    className="rounded bg-emerald-500/10 p-1 text-emerald-500 hover:bg-emerald-500/20"
                                  >
                                    {isSaving ? (
                                      <Loader2 className="size-3 animate-spin" />
                                    ) : (
                                      <Check className="size-3" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingRowId(null);
                                      setEditingColumn(null);
                                    }}
                                    className="rounded bg-rose-500/10 p-1 text-rose-500 hover:bg-rose-500/20"
                                  >
                                    <X className="size-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="group flex items-center justify-between gap-2">
                                  <span className="truncate font-mono text-ink">
                                    {cellValue === null || cellValue === undefined ? (
                                      <span className="text-ink-muted italic">NULL</span>
                                    ) : col === "created_at" && cellValue ? (
                                      new Date(cellValue).toLocaleString()
                                    ) : typeof cellValue === "boolean" ? (
                                      cellValue ? "true" : "false"
                                    ) : (
                                      String(cellValue)
                                    )}
                                  </span>
                                  {col !== "id" && (
                                    <button
                                      onClick={() => startEdit(rowId, col, cellValue)}
                                      title={`Edit ${col}`}
                                      className="opacity-0 group-hover:opacity-100 p-0.5 text-ink-muted hover:text-brand transition-opacity cursor-pointer"
                                    >
                                      <Edit3 className="size-3" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------
   TRANSACTION HISTORY
------------------------------------------- */

// function TransactionHistoryContent() {
//     return (
//         <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
//             <h2 className="text-xl font-bold">
//                 Transaction History
//             </h2>

//             <p className="mb-6 mt-2 text-sm text-slate-500">
//                 Search for a user's transactions.
//             </p>

//             <form
//                 onSubmit={(event) => event.preventDefault()}
//                 className="mb-6 flex flex-col gap-3 sm:flex-row"
//             >
//                 <input
//                     type="text"
//                     placeholder="Search by account number or reference"
//                     className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
//                 />

//                 <button
//                     type="submit"
//                     className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800"
//                 >
//                     Search
//                 </button>
//             </form>

//             <div className="overflow-x-auto">
//                 <table className="w-full min-w-[600px] text-left text-sm">
//                     <thead className="bg-slate-50 text-slate-500">
//                         <tr>
//                             <th className="p-4 font-semibold">Reference</th>
//                             <th className="p-4 font-semibold">Account</th>
//                             <th className="p-4 font-semibold">Type</th>
//                             <th className="p-4 font-semibold">Amount</th>
//                             <th className="p-4 font-semibold">Status</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         <tr>
//                             <td
//                                 colSpan={5}
//                                 className="p-8 text-center text-slate-400"
//                             >
//                                 Transaction records will appear here.
//                             </td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>
//         </section>
//     );
// }


interface AccountOption {
  id: string;
  account_number: string;
  account_type?: string;
  kind?: string;
  balance?: number;
}

function TransactionHistoryContent() {
  // Search State
  const [emailQuery, setEmailQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Found User & Accounts State
  const [foundUserId, setFoundUserId] = useState<string | null>(null);
  const [userAccounts, setUserAccounts] = useState<AccountOption[]>([]);

  // Transaction Payload Form State
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [direction, setDirection] = useState<"debit" | "credit">("credit");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Transfer");
  const [state, setState] = useState("completed");
  const [reference, setReference] = useState("");
  const [createdAt, setCreatedAt] = useState(""); // Holds ISO / datetime-local string

  // Submit status
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Lookup user by email in profiles/auth and retrieve their accounts
  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailQuery.trim()) return;

    setSearching(true);
    setSearchError("");
    setFoundUserId(null);
    setUserAccounts([]);
    setSelectedAccountId("");

    try {
      // Find matching profile by email
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .eq("email", emailQuery.trim())
        .single();

      if (profileErr || !profile) {
        throw new Error("No user found with that email address.");
      }

      setFoundUserId(profile.id);

      // Retrieve all accounts tied to this user_id
      const { data: accounts, error: acctErr } = await (supabase
        .from("accounts") as any)
        .select("user_id, account_number, name, kind, balance")
        .eq("user_id", profile.id);

      if (acctErr) {
        throw new Error(`Failed to fetch user accounts: ${acctErr.message}`);
      }

      if (!accounts || accounts.length === 0) {
        throw new Error("User found, but no bank accounts exist for this user.");
      }

      setUserAccounts(accounts);
      setSelectedAccountId(accounts[0].user_id); // Auto-select primary account
    } catch (err: any) {
      setSearchError(err.message || "Search failed.");
    } finally {
      setSearching(false);
    }
  };





  // 2. Insert transaction record
  const handleSubmitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!foundUserId || !selectedAccountId) {
      setFormMessage({ type: "error", text: "Please search and select a valid user and account first." });
      return;
    }

    setSubmitting(true);
    setFormMessage(null);

    try {
      const payload: Record<string, any> = {
        user_id: foundUserId,
        account_id: selectedAccountId,
        direction,
        amount: parseFloat(amount) || 0,
        description: description || null,
        category: category || "General",
        state: state || "completed",
        reference: reference || `TXN-${Date.now()}`,
      };

      // Optional manual date override
      if (createdAt) {
        payload["created_at"] = new Date(createdAt).toISOString();
      }

      const { error: insertErr } = await supabase.from("transactions").insert(payload);

      if (insertErr) throw insertErr;

      setFormMessage({ type: "success", text: "Transaction posted successfully!" });

      toast.success('Transaction posted successfully!', { toastId: "transaction successful" })

      // Reset transaction form fields
      setAmount("");
      setDescription("");

      setReference("");

      setCreatedAt("");
    } catch (err: any) {
      setFormMessage({ type: "error", text: err.message || "Failed to post transaction." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
     

      <div className="mx-auto max-w-2xl rounded-2xl border border-input bg-panel p-6 shadow-sm">
         <ToastContainer position="top-right" autoClose={3000} />
        <h2 className="mb-4 text-lg font-semibold text-ink">Admin Transaction Entry</h2>

        {/* Step 1: User Lookup Form */}
        <form onSubmit={handleSearchUser} className="mb-6 rounded-xl border border-input/60 bg-panel-subtle p-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
              Find User by Email
            </span>
            <div className="flex gap-2">
              <input
                type="email"
                value={emailQuery}
                onChange={(e) => setEmailQuery(e.target.value)}
                placeholder="user@example.com"
                required
                className="w-full rounded-xl border border-input bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
              />
              <button
                type="submit"
                disabled={searching}
                className="whitespace-nowrap rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow hover:opacity-90 disabled:opacity-50"
              >
                {searching ? "Searching..." : "Lookup User"}
              </button>
            </div>
          </label>

          {searchError && <p className="mt-2 text-xs text-red-500">{searchError}</p>}
        </form>

        {/* Step 2: Transaction Payload Form */}
        {foundUserId && (
          <form onSubmit={handleSubmitTransaction} className="space-y-4">
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-xs text-green-700 dark:text-green-300">
              <strong>Target User ID:</strong> {foundUserId}
            </div>

            {/* Account Selector */}
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
                Select User Account
              </span>
              <div className="relative">
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  required
                  className="w-full appearance-none rounded-xl border border-input bg-panel px-3.5 py-2.5 pr-10 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
                >
                  {userAccounts.map((acct) => (
                    <option key={acct.id} value={acct.id}>
                      {acct.account_number} ({acct.account_type || acct.kind || "Account"}) - Bal: ${acct.balance ?? 0}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-ink-muted">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </label>

            {/* Direction Dropdown (debit or credit only) */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Direction
                </span>
                <div className="relative">
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as "debit" | "credit")}
                    required
                    className="w-full appearance-none rounded-xl border border-input bg-panel px-3.5 py-2.5 pr-10 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
                  >
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-ink-muted">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </label>

              {/* Amount */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Amount
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full rounded-xl border border-input bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Category */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Category
                </span>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Deposit, Wire, Transfer"
                  className="w-full rounded-xl border border-input bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
                />
              </label>

              {/* Description */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Description
                </span>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Transaction notes or details..."
                  className="w-full rounded-xl border border-input bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
                />
              </label>

              {/* State */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
                  State
                </span>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="completed, pending, failed"
                  className="w-full rounded-xl border border-input bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Counterparty */}


              {/* Reference */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
                </span>
                <input
                  type="hidden"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Optional custom reference string"
                  className="w-full rounded-xl border border-input bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


              {/* Date & Time (created_at override) */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Created At (Date & Time)
                </span>
                <input
                  type="datetime-local"
                  value={createdAt}
                  onChange={(e) => setCreatedAt(e.target.value)}
                  className="w-full rounded-xl border border-input bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
                />
              </label>
            </div>



            {/* Status Message */}
            {formMessage && (
              <p
                className={`text-sm ${formMessage.type === "success" ? "text-green-600" : "text-red-500"
                  }`}
              >
                {formMessage.text}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Posting Transaction..." : "Insert Transaction"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------
   CARD DETAILS
------------------------------------------- */

// function CardDetailContent() {
//     return (
//         <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
//             <h2 className="text-xl font-bold">
//                 Card Details
//             </h2>

//             <p className="mb-7 mt-2 text-sm text-slate-500">
//                 Find a user's card details using their account number.
//             </p>

//             <form
//                 onSubmit={(event) => event.preventDefault()}
//                 className="flex max-w-2xl flex-col gap-4 sm:flex-row"
//             >
//                 <input
//                     type="text"
//                     placeholder="Enter account number"
//                     className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
//                 />

//                 <button
//                     type="submit"
//                     className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800"
//                 >
//                     Search Card
//                 </button>
//             </form>

//             <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">
//                 Card details will appear here.
//             </div>
//         </section>
//     );


export function CardDetailContent() {
  // Lookup states
  const [emailSearch, setEmailSearch] = useState("");
  const [lookingUp, setLookingUp] = useState(false);
  const [foundUserId, setFoundUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(undefined);;

  // Card Form Inputs
  const [label, setLabel] = useState("Everyday Debit");
  const [brand, setBrand] = useState("CMFB Visa");
  const [last4, setLast4] = useState("5934");
  const [expMonth, setExpMonth] = useState<number>(8);
  const [expYear, setExpYear] = useState<number>(2029);
  const [cardType, setCardType] = useState("debit");
  const [frozen, setFrozen] = useState(true);
  const [monthlyLimit, setMonthlyLimit] = useState("11500.00");

  // Custom Date/Time input (defaults to current date-time for local selector)
  const [createdAt, setCreatedAt] = useState(
    new Date().toISOString().slice(0, 16)
  );

  // Status message state
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 1. Search User & Fetch Associated Accounts
  const handleUserSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSearch.trim()) return;

    setLookingUp(true);
    setStatus(null);
    setFoundUserId(null);
    setAccounts([]);
    setSelectedAccountId("");

    try {
      // Lookup profile by email
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("email", emailSearch.trim())
        .single();

      if (profileErr || !profile) {
        setStatus({ type: "error", text: "User profile not found." });
        return;
      }

      setFoundUserId(profile.id);
      setUserName(profile.full_name || profile.email);

      // Fetch user's active bank accounts
      const { data: userAccounts, error: acctErr } = await supabase
        .from("accounts")
        .select("id, account_number, balance")
        .eq("user_id", profile.id);

      if (acctErr || !userAccounts || userAccounts.length === 0) {
        setStatus({ type: "error", text: "User found, but has no active accounts." });
        return;
      }

      setAccounts(userAccounts);
      setSelectedAccountId(userAccounts[0]?.id);
    } catch (err: any) {
      setStatus({ type: "error", text: err.message || "Failed to lookup user." });
    } finally {
      setLookingUp(false);
    }
  };

  // 2. Insert Card Details
  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundUserId || !selectedAccountId) {
      setStatus({ type: "error", text: "Please look up and select a target account first." });
      return;
    }

    const cleanLast4 = last4.replace(/\D/g, "").slice(-4);
    if (cleanLast4.length < 4) {
      setStatus({ type: "error", text: "Please provide 4 digits for the last4 field." });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      // Build insert payload matching schema exactly
      const payload: Record<string, any> = {
        user_id: foundUserId,
        account_id: selectedAccountId,
        label,
        brand,
        last4: cleanLast4,
        exp_month: Number(expMonth),
        exp_year: Number(expYear),
        card_type: cardType,
        frozen,
        monthly_limit: parseFloat(monthlyLimit) || 0,
      };

      // Set custom created_at timestamp if selected
      if (createdAt) {
        payload["created_at"] = new Date(createdAt).toISOString();
      }

      const { data, error } = await (supabase
        .from("cards") as any)
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      setStatus({
        type: "success",
        text: `Card (${data.label} - ...${data.last4}) successfully issued for ${userName}!`,
      });
      toast.success("Card created successfully!", { toastId: "card-creation successful" });
      // Reset card numbers
      setLast4("");
    } catch (err: any) {
      setStatus({ type: "error", text: err.message || "Failed to create card record." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-line bg-surface p-6 shadow-sm">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-lg font-semibold text-ink">Issue & Register Bank Card</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Find customer by email, map account UUID, and insert custom card specifications.
      </p>

      {/* STEP 1: USER SEARCH */}
      <form onSubmit={handleUserSearch} className="mt-6 flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium uppercase text-ink-muted">
            User Email Address
          </label>
          <input
            type="email"
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
            placeholder="user@example.com"
            className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary"
            required
          />
        </div>
        <button
          type="submit"
          disabled={lookingUp}
          className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {lookingUp ? "Searching..." : "Lookup"}
        </button>
      </form>

      {/* STEP 2: CARD INSERT FORM */}
      {foundUserId && (
        <form onSubmit={handleCreateCard} className="mt-6 space-y-4 border-t border-line/60 pt-6">
          <div className="rounded-lg bg-line/20 p-3 text-xs text-ink-muted">
            Customer: <span className="font-semibold text-ink">{userName}</span>
          </div>

          {/* Account Selection */}
          <div>
            <label className="block text-xs font-medium uppercase text-ink-muted">
              Target Account (account_id)
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary"
              required
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  Acc: {acc.account_number} (Bal: ${acc.balance?.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {/* Label & Brand (Dropdown Options) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase text-ink-muted">
                Card Label
              </label>
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary"
              >
                <option value="Everyday Debit">Everyday Debit</option>
                <option value="Signature Credit">Signature Credit</option>
                <option value="Primary Debit">Primary Debit</option>
                <option value="Business Platinum">Business Platinum</option>
                <option value="Virtual Shopping">Virtual Shopping</option>
                <option value="Savings Card">Savings Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase text-ink-muted">
                Card Brand
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary"
              >
                <option value="CMFB Visa">Visa</option>
                <option value="CMFB Mastercard">Mastercard</option>
              </select>
            </div>
          </div>

          {/* Last 4 & Card Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase text-ink-muted">
                Last 4 Digits
              </label>
              <input
                type="text"
                value={last4}
                onChange={(e) => setLast4(e.target.value)}
                maxLength={4}
                placeholder="5934"
                className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase text-ink-muted">
                Card Type
              </label>
              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary"
              >
                <option value="debit">debit</option>
                <option value="credit">credit</option>
                <option value="virtual">virtual</option>
              </select>
            </div>
          </div>

          {/* Expiry Month & Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase text-ink-muted">
                Expiry Month (exp_month)
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={expMonth}
                onChange={(e) => setExpMonth(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase text-ink-muted">
                Expiry Year (exp_year)
              </label>
              <input
                type="number"
                min={2024}
                max={2040}
                value={expYear}
                onChange={(e) => setExpYear(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          {/* Monthly Limit & Frozen Flag */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-medium uppercase text-ink-muted">
                Monthly Limit (monthly_limit)
              </label>
              <input
                type="number"
                step="0.01"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                placeholder="11500.00"
                className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                required
              />
            </div>

            <div className="mt-5 flex items-center gap-2">
              <input
                type="checkbox"
                id="frozen-status"
                checked={frozen}
                onChange={(e) => setFrozen(e.target.checked)}
                className="h-4 w-4 rounded border-line text-primary focus:ring-primary"
              />
              <label htmlFor="frozen-status" className="text-sm font-medium text-ink">
                Set as Frozen (`frozen = true`)
              </label>
            </div>
          </div>

          {/* Transaction-style Created At Date-Time Selector */}
          <div>
            <label className="block text-xs font-medium uppercase text-ink-muted">
              Created At Timestamp (created_at)
            </label>
            <input
              type="datetime-local"
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {submitting ? "Inserting Record..." : "Insert Card Record"}
          </button>
        </form>
      )}

      {/* Status Alert Display */}
      {status && (
        <div
          className={`mt-4 rounded-lg p-3 text-sm ${status.type === "success"
            ? "bg-success/10 text-success"
            : "bg-red-500/10 text-red-500"
            }`}
        >
          {status.text}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------
   SET NOTIFICATION
------------------------------------------- */

// function NotificationContent() {
//     return (
//         <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
//             <h2 className="text-xl font-bold">
//                 Set Notification
//             </h2>

//             <p className="mb-7 mt-2 text-sm text-slate-500">
//                 Create a notification for your users.
//             </p>

//             <form
//                 onSubmit={(event) => event.preventDefault()}
//                 className="max-w-2xl space-y-5"
//             >
//                 <div>
//                     <label
//                         htmlFor="notification-title"
//                         className="mb-2 block text-sm font-medium"
//                     >
//                         Notification Title
//                     </label>

//                     <input
//                         id="notification-title"
//                         type="text"
//                         placeholder="Enter notification title"
//                         className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
//                     />
//                 </div>

//                 <div>
//                     <label
//                         htmlFor="notification-message"
//                         className="mb-2 block text-sm font-medium"
//                     >
//                         Message
//                     </label>

//                     <textarea
//                         id="notification-message"
//                         rows={5}
//                         placeholder="Write your notification here..."
//                         className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
//                     />
//                 </div>

//                 <div>
//                     <label
//                         htmlFor="notification-audience"
//                         className="mb-2 block text-sm font-medium"
//                     >
//                         Audience
//                     </label>

//                     <select
//                         id="notification-audience"
//                         className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
//                     >
//                         <option value="all">All Users</option>
//                         <option value="individual">Individual User</option>
//                     </select>
//                 </div>

//                 <button
//                     type="submit"
//                     className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800"
//                 >
//                     Send Notification
//                 </button>
//             </form>
//         </section>
//     );
// }


export function NotificationContent() {
  const [emailQuery, setEmailQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string; full_name?: string } | null>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [kind, setKind] = useState("info");
  const [isSending, setIsSending] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 1. Search User by Email
  const handleUserSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailQuery.trim()) return;

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .eq("email", emailQuery.trim().toLowerCase())
        .single();

      if (error || !data) {
        toast.error("User account not found.");
        setSelectedUser(null);
        setNotifications([]);
        return;
      }

      setSelectedUser(data);
      toast.success("Account loaded.");
      await loadUserNotifications(data.id);
    } catch (err: any) {
      toast.error(err.message || "User search failed.");
    } finally {
      setIsSearching(false);
    }
  };

  // 2. Load Notifications for User
  const loadUserNotifications = async (userId: string) => {
    setIsLoadingNotifications(true);
    try {
      const list = await fetchUserNotifications(userId);
      setNotifications(list ?? []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load notifications.");
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  // 3. Dispatch Notification
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error("Lookup a user account first.");
      return;
    }
    if (!title.trim() || !body.trim()) {
      toast.error("Title and message body are required.");
      return;
    }

    setIsSending(true);
    try {
      await sendUserNotification(selectedUser.id, title, body, kind);
      toast.success("Notification delivered.");

      setTitle("");
      setBody("");
      setKind("info");
      toast.success('nofiication pushed successfully', { toastId: 'notification success' })
      await loadUserNotifications(selectedUser.id);
    } catch (err: any) {
      toast.error(err.message || "Failed to send notification.");
    } finally {
      setIsSending(false);
    }
  };

  // 4. Delete Notification
  const handleDelete = async (notificationId: string) => {
    setDeletingId(notificationId);
    try {
      await deleteNotification(notificationId);
      toast.success("Notification deleted.");
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (err: any) {
      toast.error(err.message || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const renderKindIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="size-4 text-emerald-500 shrink-0" />;
      case "warning":
        return <AlertTriangle className="size-4 text-amber-500 shrink-0" />;
      case "danger":
        return <XCircle className="size-4 text-rose-500 shrink-0" />;
      default:
        return <Info className="size-4 text-sky-500 shrink-0" />;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* LEFT: DISPATCH PANEL */}
      <section className="reveal panel p-5 sm:p-6">
        <div className="flex items-center gap-2 border-b border-line pb-4 mb-5">
          <Bell className="size-5 text-brand" />
          <h2 className="font-display text-base sm:text-lg text-ink">Dispatch Notification</h2>
        </div>

        <form onSubmit={handleUserSearch} className="mb-6 space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Find User by Email
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              required
              placeholder="member@example.com"
              value={emailQuery}
              onChange={(e) => setEmailQuery(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3.5 py-2 text-sm text-ink outline-none focus:border-brand"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {isSearching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
              Search
            </button>
          </div>
        </form>

        {selectedUser ? (
          <div className="mb-6 rounded-xl border border-line/80 bg-surface/50 p-3.5 text-xs text-ink">
            <p className="font-semibold text-sm">{selectedUser.full_name || "Account Selected"}</p>
            <p className="text-ink-muted">{selectedUser.email}</p>
            <p className="mt-1 font-mono text-[10px] text-ink-muted/80">User ID: {selectedUser.id}</p>
          </div>
        ) : (
          <p className="mb-6 rounded-xl border border-dashed border-line p-3.5 text-center text-xs text-ink-muted">
            Search an email address above to select a recipient.
          </p>
        )}

        <form onSubmit={handleSendNotification} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink-muted mb-1.5">
              Title
            </label>
            <input
              type="text"
              required
              placeholder="Welcome to Confidential Micro Finance Bank"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!selectedUser}
              className="w-full rounded-xl border border-line bg-surface px-3.5 py-2 text-sm text-ink outline-none focus:border-brand disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink-muted mb-1.5">
              Kind
            </label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              disabled={!selectedUser}
              className="w-full rounded-xl border border-line bg-surface px-3.5 py-2 text-sm text-ink outline-none focus:border-brand disabled:opacity-50"
            >
              <option value="info">info</option>
              <option value="success">success</option>
              <option value="warning">warning</option>
              <option value="danger">danger</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink-muted mb-1.5">
              Body
            </label>
            <textarea
              rows={3}
              required
              placeholder="Your profile is ready. Account verification is pending review."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={!selectedUser}
              className="w-full rounded-xl border border-line bg-surface px-3.5 py-2 text-sm text-ink outline-none focus:border-brand disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={!selectedUser || isSending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {isSending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Send Notification
          </button>
        </form>
      </section>

      {/* RIGHT: NOTIFICATIONS VIEWER & DELETE */}
      <section className="reveal panel p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-line pb-4 mb-5">
          <h2 className="font-display text-base sm:text-lg text-ink">
            {selectedUser ? `Notifications: ${selectedUser.email}` : "Account Notifications"}
          </h2>
          {selectedUser && (
            <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-semibold text-ink-muted">
              {notifications.length} Total
            </span>
          )}
        </div>

        {!selectedUser ? (
          <div className="py-12 text-center text-sm text-ink-muted">
            Search for a user on the left to view and manage their notification history.
          </div>
        ) : isLoadingNotifications ? (
          <div className="flex items-center justify-center py-12 text-sm text-ink-muted">
            <Loader2 className="size-5 animate-spin mr-2" /> Loading records...
          </div>
        ) : (
          <div className="space-y-3 max-h-[520px] overflow-y-auto scrollbar-thin pr-1">
            {notifications.map((item) => {
              const isDeleting = deletingId === item.id;

              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-line/60 bg-surface/30 p-4 transition-all hover:border-line"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5">{renderKindIcon(item.kind)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-ink truncate">{item.title}</p>
                        {!item.read && (
                          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[9px] font-bold text-brand uppercase">
                            Unread
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-ink-muted break-words leading-relaxed">{item.body}</p>
                      <p className="mt-2 text-[10px] font-mono text-ink-muted/70">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeleting}
                    title="Delete Notification"
                    className="shrink-0 rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-rose-500/10 hover:text-rose-500 disabled:opacity-40 cursor-pointer"
                  >
                    {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                  </button>
                </div>
              );
            })}

            {notifications.length === 0 && (
              <p className="py-8 text-center text-sm text-ink-muted">
                No notifications found for this account.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------
   REUSABLE FORM FIELD
------------------------------------------- */

function FormField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

/* ------------------------------------------
   View Account
------------------------------------------- */





export function AdminPage() {
  const overview = useOverview();
  const isAdmin = overview.data?.isAdmin ?? false;

  const { data, isLoading } = useAdminData(true);
  const queryClient = useQueryClient();

  // Track loading states per user ID
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [verifyingUserId, setVerifyingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  if (overview.isLoading) return <Skeletons rows={3} />;
  if (isLoading || !data) return <Skeletons rows={4} />;

  const profiles = data.profiles ?? [];
  const auditLogs = data.audit ?? [];

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setUpdatingUserId(userId);
    try {
      await adminSetStatus(userId, newStatus.toLowerCase() as any);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminKey }),
        queryClient.invalidateQueries({ queryKey: overviewKey }),
      ]);

      toast.success(`Account status updated to ${newStatus}`, { toastId: 'updated user-success' });
    } catch (error: any) {
      console.error("Failed to update status:", error);
      toast.error(error.message || "Failed to update member status.", { toastId: 'fail to update-user' });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleVerifyEmail = async (userId: string) => {
    setVerifyingUserId(userId);
    try {
      const { error } = await (supabase.rpc as any)("admin_verify_user_email", {
        target_user_id: userId,
      });

      if (error) throw error;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminKey }),
        queryClient.invalidateQueries({ queryKey: overviewKey }),
      ]);

      toast.success("User email verified successfully!", { toastId: 'user-email verified success' });
    } catch (error: any) {
      console.error("Failed to verify user email:", error);
      toast.error(error.message || "Failed to verify email.", { toastId: 'error verifying-user email' });
    } finally {
      setVerifyingUserId(null);
    }
  };

  const handleDeleteUserAccount = async (userId: string, userEmail: string) => {
    if (
      !window.confirm(
        `PERMANENT ACTION:\nAre you sure you want to permanently delete user "${userEmail}"?\n\nThis will purge their profile, accounts, transactions, cards, notifications, beneficiaries, and auth login.`
      )
    ) {
      return;
    }

    setDeletingUserId(userId);
    try {
      const { error } = await (supabase.rpc as any)("admin_delete_full_user_account", {
        target_user_id: userId,
      });

      if (error) throw error;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminKey }),
        queryClient.invalidateQueries({ queryKey: overviewKey }),
      ]);

      toast.success(`User account (${userEmail}) deleted successfully.,`, { toastId: 'user-deleted success ' });
    } catch (error: any) {
      console.error("Failed to delete user account:", error);
      toast.error(error.message || "Failed to delete user account.", { toastId: 'error-deleting-user' });
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* MEMBERS SECTION */}
      <section className="reveal panel mb-5 overflow-hidden">
        <h2 className="border-b border-line px-4 py-3 font-display text-base text-ink sm:px-5 sm:py-4 sm:text-lg">
          Members
        </h2>

        {/* MOBILE LIST VIEW (Visible on small screens < 640px) */}
        <div className="block divide-y divide-line/60 sm:hidden">
          {profiles.map((p: any) => {
            const normalizedStatus = (p.status || "active").toUpperCase() as AccountStatus;
            const isUpdating = updatingUserId === p.id;
            const isVerifying = verifyingUserId === p.id;
            const isDeleting = deletingUserId === p.id;

            return (
              <div key={p.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{p.full_name || p.email || "Member"}</p>
                    <p className="truncate text-xs text-ink-muted">{p.email}</p>
                  </div>
                  <span
                    className={
                      normalizedStatus === "ACTIVE"
                        ? "shrink-0 rounded-full bg-success-soft px-2.5 py-0.5 text-[10px] font-semibold text-success"
                        : normalizedStatus === "PENDING"
                          ? "shrink-0 rounded-full bg-warning-soft px-2.5 py-0.5 text-[10px] font-semibold text-warning"
                          : "shrink-0 rounded-full bg-danger-soft px-2.5 py-0.5 text-[10px] font-semibold text-danger"
                    }
                  >
                    {normalizedStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-ink-muted">
                  <span>Joined: {p.created_at ? longDate(p.created_at) : "N/A"}</span>
                </div>

                {/* Verify & Delete Actions */}
                <div className="pt-1 space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                    Actions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      disabled={isVerifying || isDeleting}
                      onClick={() => handleVerifyEmail(p.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brand hover:text-brand disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isVerifying ? (
                        <Loader2 className="size-3 animate-spin text-ink-muted" />
                      ) : (
                        <CheckCircle2 className="size-3.5 text-emerald-500" />
                      )}
                      Verify Email
                    </button>

                    <button
                      disabled={isDeleting || isVerifying}
                      onClick={() => handleDeleteUserAccount(p.id, p.email)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-500 transition-colors hover:bg-rose-500/20 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <Loader2 className="size-3 animate-spin text-rose-500" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                      Delete Account
                    </button>
                  </div>
                </div>

                {/* Status Change Buttons */}
                <div className="pt-1">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                    Set status
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUSES.map((s) => {
                      const isCurrent = s === normalizedStatus;
                      return (
                        <button
                          key={s}
                          disabled={isCurrent || isUpdating || isDeleting}
                          onClick={() => handleStatusChange(p.id, s)}
                          className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink-muted cursor-pointer disabled:cursor-not-allowed"
                        >
                          {isUpdating && !isCurrent && (
                            <Loader2 className="size-3 animate-spin text-ink-muted" />
                          )}
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {profiles.length === 0 && (
            <p className="p-6 text-center text-sm text-ink-muted">No registered members found.</p>
          )}
        </div>

        {/* DESKTOP TABLE VIEW (Visible on screens >= 640px) */}
        <div className="hidden sm:block w-full overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-5 py-3 font-medium">Member</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Verify User</th>
                <th className="px-5 py-3 font-medium">Delete Account</th>
                <th className="px-5 py-3 text-right font-medium">Set status</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p: any) => {
                const normalizedStatus = (p.status || "active").toUpperCase() as AccountStatus;
                const isUpdating = updatingUserId === p.id;
                const isVerifying = verifyingUserId === p.id;
                const isDeleting = deletingUserId === p.id;

                return (
                  <tr key={p.id} className="border-b border-line/60 last:border-0">
                    <td className="px-5 py-3 max-w-[200px]">
                      <p className="truncate font-medium text-ink">{p.full_name || p.email || "Member"}</p>
                      <p className="truncate text-xs text-ink-muted">{p.email}</p>
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
                    <td className="px-5 py-3 whitespace-nowrap">
                      <button
                        disabled={isVerifying || isDeleting}
                        onClick={() => handleVerifyEmail(p.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brand hover:text-brand disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                      >
                        {isVerifying ? (
                          <Loader2 className="size-3 animate-spin text-ink-muted" />
                        ) : (
                          <CheckCircle2 className="size-3.5 text-emerald-500" />
                        )}
                        Verify Email
                      </button>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <button
                        disabled={isDeleting || isVerifying}
                        onClick={() => handleDeleteUserAccount(p.id, p.email)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-500 transition-colors hover:bg-rose-500/20 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                      >
                        {isDeleting ? (
                          <Loader2 className="size-3 animate-spin text-rose-500" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                        Delete Account
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {STATUSES.map((s) => {
                          const isCurrent = s === normalizedStatus;
                          return (
                            <button
                              key={s}
                              disabled={isCurrent || isUpdating || isDeleting}
                              onClick={() => handleStatusChange(p.id, s)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink-muted cursor-pointer disabled:cursor-not-allowed"
                            >
                              {isUpdating && !isCurrent && (
                                <Loader2 className="size-3 animate-spin text-ink-muted" />
                              )}
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-ink-muted">
                    No registered members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* AUDIT TRAIL SECTION */}
      <section className="reveal panel p-4 sm:p-6">
        <h2 className="font-display text-base sm:text-lg text-ink">Audit trail</h2>
        <ul className="mt-4 space-y-3">
          {auditLogs.map((log: any) => (
            <li key={log.id} className="border-b border-line/60 pb-3 last:border-0 last:pb-0">
              <p className="text-sm text-ink break-words">{log.detail || log.action || "System action logged"}</p>
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


export function AdminPanelGuard() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [passkeyInput, setPasskeyInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);

  // Check if session is already granted
  useEffect(() => {
    const savedStatus = sessionStorage.getItem(STORAGE_KEY);
    if (savedStatus === "true") {
      setIsUnlocked(true);
    }
    setIsCheckingSession(false);
  }, []);


  const handleVerifyKey = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (passkeyInput.trim().toLocaleUpperCase() === HARDCODED_ADMIN_KEY) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setIsUnlocked(true);
    } else {
      setErrorMessage("Invalid Super Admin Key. Access Denied.");
      setPasskeyInput("");
    }
  };

  if (isCheckingSession) {
    return null; // Prevents UI flicker while checking session storage
  }

  return (
    <>
      {/* 1. Modal Overlay Backdrop */}
      {!isUnlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-rose-500/30 bg-surface p-6 shadow-2xl transition-all">
            {/* Header Badge */}
            <div className="flex items-center gap-3 border-b border-line pb-4">
              <div className="rounded-xl bg-rose-500/10 p-2.5 text-rose-500 shrink-0">
                <ShieldAlert className="size-6" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-ink">
                  Restricted Access
                </h2>
                <p className="text-xs text-ink-muted">
                  Super Admin Authorization Required
                </p>
              </div>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerifyKey} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
                  Enter Admin Passkey
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Enter security key..."
                    value={passkeyInput}
                    onChange={(e) => setPasskeyInput(e.target.value)}
                    className="w-full rounded-xl border border-line bg-surface pl-9 pr-3.5 py-2.5 text-sm font-mono text-ink outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                  <KeyRound className="absolute left-3 top-3 size-4 text-ink-muted" />
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 p-2.5 text-xs text-rose-500 font-medium">
                  <Lock className="size-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <span>Authorize Admin Panel</span>
                <ArrowRight className="size-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Admin Panel Content (Rendered only after authentication) */}
      <div className={!isUnlocked ? "blur-md pointer-events-none select-none" : ""}>
        {}
      </div>
    </>
  );
}