import { useTransactions, useDeleteTransaction } from "@/hooks/use-transactions";
import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight, Trash2, Utensils, ShoppingBag, Car, Zap, Film, HeartPulse, Briefcase, Wallet, TrendingUp, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category.toLowerCase()) {
    case 'food': return <Utensils className="h-5 w-5" />;
    case 'shopping': return <ShoppingBag className="h-5 w-5" />;
    case 'transport': return <Car className="h-5 w-5" />;
    case 'utilities': return <Zap className="h-5 w-5" />;
    case 'entertainment': return <Film className="h-5 w-5" />;
    case 'health': return <HeartPulse className="h-5 w-5" />;
    case 'salary': return <Briefcase className="h-5 w-5" />;
    case 'freelance': return <Wallet className="h-5 w-5" />;
    case 'investment': return <TrendingUp className="h-5 w-5" />;
    default: return <HelpCircle className="h-5 w-5" />;
  }
};

export function TransactionList() {
  const { data: transactions, isLoading, error } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive bg-destructive/10 rounded-xl">
        <p>Failed to load transactions. Please try again later.</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-card/50">
        <div className="bg-muted p-4 rounded-full mb-4">
          <Wallet className="h-8 w-8 opacity-50" />
        </div>
        <h3 className="text-lg font-semibold">No transactions yet</h3>
        <p className="text-sm">Add your first income or expense to get started.</p>
      </div>
    );
  }

  // Sort by date descending (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {sortedTransactions.map((transaction) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="group relative flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:shadow-lg hover:border-border/80 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className={`
                p-3 rounded-full 
                ${transaction.type === 'income' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}
              `}>
                <CategoryIcon category={transaction.category} />
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground capitalize">{transaction.description}</h4>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <span className="capitalize">{transaction.category}</span>
                  <span>•</span>
                  <span>{format(new Date(transaction.date), "MMM d, yyyy")}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className={`text-right font-bold text-lg ${transaction.type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                {transaction.type === 'income' ? '+' : '-'}${(transaction.amount / 100).toFixed(2)}
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently remove this transaction from your records.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => deleteTransaction.mutate(transaction.id)}
                      className="bg-destructive hover:bg-destructive/90 text-white"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
