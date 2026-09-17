import { useQuery } from "@tanstack/react-query";
import { fetchOverview, fetchExtras, fetchAdminData } from "@/lib/bank";

export const overviewKey = ["cmfb", "overview"] as const;

export function useOverview() {
  return useQuery({
    queryKey: overviewKey,
    queryFn: fetchOverview,
    staleTime: 10_000,
  });
}

export const extrasKey = ["cmfb", "extras"] as const;
export const adminKey = ["cmfb", "admin"] as const;

export function useExtras() {
  return useQuery({ queryKey: extrasKey, queryFn: fetchExtras, staleTime: 10_000 });
}

export function useAdminData(enabled: boolean) {
  return useQuery({ queryKey: adminKey, queryFn: fetchAdminData, enabled, staleTime: 10_000 });
}
