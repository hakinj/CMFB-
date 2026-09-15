import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Account = Database["public"]["Tables"]["accounts"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type Beneficiary = Database["public"]["Tables"]["beneficiaries"]["Row"];
export type Card = Database["public"]["Tables"]["cards"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
export type AccountStatus = Database["public"]["Enums"]["account_status"];

export const money = (value: number | string, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(Number(value));

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const longDate = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const maskAccount = (value: string) => `•••• ${value.slice(-4)}`;

export const statusCopy: Record<AccountStatus, { label: string; blurb: string }> = {
  PENDING: {
    label: "Pending review",
    blurb: "Your profile is being reviewed. Outgoing money movement stays disabled until review completes.",
  },
  RESTRICTED: {
    label: "Restricted",
    blurb: "Outgoing transfers are disabled on this account. Contact the bank or use the admin console to activate it.",
  },
  ACTIVE: {
    label: "Active",
    blurb: "All banking workflows are enabled on this account.",
  },
};

async function requireUserId() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not signed in");
  return data.user.id;
}

export async function fetchOverview() {
  const userId = await requireUserId();
  const [profile, accounts, transactions, notifications, roles] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("accounts").select("*").eq("user_id", userId).order("created_at"),
    supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(250),
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase.from("user_roles").select("role").eq("user_id", userId),
  ]);

  const error =
    profile.error ?? accounts.error ?? transactions.error ?? notifications.error ?? roles.error;
  if (error) throw new Error(error.message);

  return {
    userId,
    profile: profile.data as Profile | null,
    accounts: (accounts.data ?? []) as Account[],
    transactions: (transactions.data ?? []) as Transaction[],
    notifications: (notifications.data ?? []) as Notification[],
    isAdmin: (roles.data ?? []).some((r) => r.role === "admin"),
  };
}

export async function provisionDemo() {
  const { error } = await supabase.rpc("provision_demo");
  if (error) throw new Error(error.message);
}

export async function sendTransfer(input: {
  fromAccount: string;
  toName: string;
  toAccount: string;
  amount: number;
  memo: string;
}) {
  const { data, error } = await supabase.rpc("make_transfer", {
    _from_account: input.fromAccount,
    _to_name: input.toName,
    _to_account: input.toAccount,
    _amount: input.amount,
    _memo: input.memo,
  });
  if (error) {
    if (error.message.includes("ACCOUNT_NOT_ACTIVE")) {
      throw new Error(
        "Transfer blocked: this account is not ACTIVE. The block was applied and recorded by the bank's servers.",
      );
    }
    if (error.message.includes("INSUFFICIENT_FUNDS")) {
      throw new Error("Transfer declined: not enough available balance in the selected account.");
    }
    throw new Error(error.message);
  }
  return data as unknown as { reference: string; balance: number };
}
