import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  amount: integer("amount").notNull(), // Storing in cents to avoid floating point issues
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  category: text("category").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({ 
  id: true 
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// Summary type for the dashboard (can be calculated on frontend, but defining shared type is good)
export type Summary = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
};
