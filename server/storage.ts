import { transactions, type Transaction, type InsertTransaction } from "@shared/schema";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  getTransactions(): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  deleteTransaction(id: number): Promise<void>;
}

export class JsonStorage implements IStorage {
  private filePath: string;
  private currentId: number;

  constructor() {
    this.filePath = path.join(process.cwd(), "server", "data", "transactions.json");
    this.currentId = 1;
    this.init();
  }

  private async init() {
    try {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      try {
        const data = await fs.readFile(this.filePath, "utf-8");
        const parsed = JSON.parse(data);
        if (parsed.length > 0) {
          this.currentId = Math.max(...parsed.map((t: Transaction) => t.id)) + 1;
        }
      } catch (e) {
        // File doesn't exist or is empty, write empty array
        await fs.writeFile(this.filePath, "[]");
      }
    } catch (err) {
      console.error("Failed to initialize storage:", err);
    }
  }

  private async readData(): Promise<Transaction[]> {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  private async writeData(data: Transaction[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.readData();
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const transactions = await this.readData();
    
    // Handle date - it might come as a string from the frontend
    let dateValue: Date;
    if (typeof insertTransaction.date === 'string') {
      dateValue = new Date(insertTransaction.date);
    } else {
      dateValue = insertTransaction.date instanceof Date ? insertTransaction.date : new Date(insertTransaction.date);
    }

    const newTransaction: Transaction = {
      ...insertTransaction,
      id: this.currentId++,
      date: dateValue
    };
    transactions.push(newTransaction);
    await this.writeData(transactions);
    return newTransaction;
  }

  async deleteTransaction(id: number): Promise<void> {
    let transactions = await this.readData();
    transactions = transactions.filter(t => t.id !== id);
    await this.writeData(transactions);
  }
}

export const storage = new JsonStorage();
