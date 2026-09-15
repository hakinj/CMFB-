import { useQuery } from "@tanstack/react-query";
import { fetchOverview } from "@/lib/bank";

export const overviewKey = ["cmfb", "overview"] as const;

export function useOverview() {
  return useQuery({
    queryKey: overviewKey,
    queryFn: fetchOverview,
    staleTime: 10_000,
  });
}
