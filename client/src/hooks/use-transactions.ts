import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type errorSchemas } from "@shared/routes";
import { fullUrl } from "@/lib/queryClient";
import { type InsertTransaction, type Transaction, type Summary } from "@shared/schema";
import { z } from "zod";

// Helper to log Zod errors
function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useTransactions() {
  return useQuery({
    queryKey: [api.transactions.list.path],
    queryFn: async () => {
      const res = await fetch(fullUrl(api.transactions.list.path));
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      return parseWithLogging(api.transactions.list.responses[200], data, "transactions.list");
    },
  });
}

export function useSummary() {
  return useQuery({
    queryKey: [api.transactions.summary.path],
    queryFn: async () => {
      const res = await fetch(fullUrl(api.transactions.summary.path));
      if (!res.ok) throw new Error("Failed to fetch summary");
      const data = await res.json();
      return parseWithLogging(api.transactions.summary.responses[200], data, "transactions.summary");
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertTransaction) => {
      // Ensure numeric types are correct before sending
      const payload = {
        ...data,
        amount: Number(data.amount), // Backend expects integer cents
      };

      const res = await fetch(fullUrl(api.transactions.create.path), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Validation failed");
        }
        throw new Error("Failed to create transaction");
      }
      
      const responseData = await res.json();
      return parseWithLogging(api.transactions.create.responses[201], responseData, "transactions.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.transactions.summary.path] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.transactions.delete.path, { id });
      const res = await fetch(fullUrl(url), { method: "DELETE" });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("Transaction not found");
        throw new Error("Failed to delete transaction");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.transactions.summary.path] });
    },
  });
}
