import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertTransactionSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.transactions.list.path, async (req, res) => {
    const transactions = await storage.getTransactions();
    // Sort by date desc
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(transactions);
  });

  app.post(api.transactions.create.path, async (req, res) => {
    try {
      // Extend schema to coerce string dates to Date objects
      const bodySchema = insertTransactionSchema.extend({
        amount: z.coerce.number().positive("Amount must be positive"),
        date: z.coerce.date().optional().default(() => new Date()),
      });
      
      const input = bodySchema.parse(req.body);
      const transaction = await storage.createTransaction(input);
      res.status(201).json(transaction);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.delete(api.transactions.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    await storage.deleteTransaction(id);
    res.status(204).send();
  });

  app.get(api.transactions.summary.path, async (req, res) => {
    const transactions = await storage.getTransactions();
    
    const summary = transactions.reduce((acc, curr) => {
      if (curr.type === 'income') {
        acc.totalIncome += curr.amount;
      } else {
        acc.totalExpenses += curr.amount;
      }
      return acc;
    }, { totalIncome: 0, totalExpenses: 0, balance: 0 });

    summary.balance = summary.totalIncome - summary.totalExpenses;
    
    res.json(summary);
  });

  return httpServer;
}
