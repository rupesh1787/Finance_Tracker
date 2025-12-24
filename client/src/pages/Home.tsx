import { DashboardStats } from "@/components/DashboardStats";
import { TransactionList } from "@/components/TransactionList";
import { TransactionForm } from "@/components/TransactionForm";
import { ExpenseChart } from "@/components/ExpenseChart";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-body pb-20">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden bg-foreground text-background dark:bg-muted/10 pb-20 pt-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-20" />
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-background dark:text-foreground">
                Financial Overview
              </h1>
              <p className="text-background/80 dark:text-muted-foreground mt-2 text-lg">
                Track your income and expenses with ease.
              </p>
            </div>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-full px-8"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  New Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display">Add Transaction</DialogTitle>
                  <DialogDescription>
                    Record a new income or expense item.
                  </DialogDescription>
                </DialogHeader>
                <TransactionForm onSuccess={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content Card - pulled up to overlap header */}
      <div className="container max-w-5xl mx-auto px-4 -mt-12 relative z-20">
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold font-display">Recent Activity</h2>
            </div>
            <TransactionList />
          </div>

          {/* Expense Breakdown Column */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-display">Expense Breakdown</h2>
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <ExpenseChart />
            </div>
            
            {/* Quick Tips or Advice Card could go here */}
            <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-primary/20 p-6">
              <h3 className="font-bold text-primary mb-2">Pro Tip</h3>
              <p className="text-sm text-muted-foreground">
                Tracking small daily expenses can help you identify spending habits and save up to 15% more each month.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              size="icon" 
              className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/30"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">Add Transaction</DialogTitle>
              <DialogDescription>
                Record a new income or expense item.
              </DialogDescription>
            </DialogHeader>
            <TransactionForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
