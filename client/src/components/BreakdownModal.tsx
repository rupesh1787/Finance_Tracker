import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTransactions } from "@/hooks/use-transactions";
import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight, Utensils, ShoppingBag, Car, Zap, Film, HeartPulse, Briefcase, Wallet, TrendingUp, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category.toLowerCase()) {
    case 'food': return <Utensils className="h-4 w-4" />;
    case 'shopping': return <ShoppingBag className="h-4 w-4" />;
    case 'transport': return <Car className="h-4 w-4" />;
    case 'utilities': return <Zap className="h-4 w-4" />;
    case 'entertainment': return <Film className="h-4 w-4" />;
    case 'health': return <HeartPulse className="h-4 w-4" />;
    case 'salary': return <Briefcase className="h-4 w-4" />;
    case 'freelance': return <Wallet className="h-4 w-4" />;
    case 'investment': return <TrendingUp className="h-4 w-4" />;
    default: return <HelpCircle className="h-4 w-4" />;
  }
};

export function BreakdownModal({
  open,
  onOpenChange,
  type,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "income" | "expense";
}) {
  const { data: transactions } = useTransactions();

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const filtered = transactions?.filter(t => t.type === type) || [];
  
  // Group by category
  const grouped = filtered.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = {
        total: 0,
        transactions: [],
      };
    }
    acc[category].total += transaction.amount;
    acc[category].transactions.push(transaction);
    return acc;
  }, {} as Record<string, { total: number; transactions: typeof filtered }>);

  const totalAmount = Object.values(grouped).reduce((sum, cat) => sum + cat.total, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'income' ? (
              <>
                <ArrowUpRight className="w-5 h-5 text-primary" />
                <span>Income Breakdown</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="w-5 h-5 text-destructive" />
                <span>Expense Breakdown</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            Detailed view of all {type === 'income' ? 'income' : 'expenses'} by category
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(grouped).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No {type === 'income' ? 'income' : 'expenses'} yet
            </div>
          ) : (
            <>
              {Object.entries(grouped).map(([category, data], idx) => {
                const percentage = (data.total / totalAmount) * 100;
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${type === 'income' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                          <CategoryIcon category={category} />
                        </div>
                        <div>
                          <p className="font-semibold capitalize">{category}</p>
                          <p className="text-sm text-muted-foreground">{data.transactions.length} transaction{data.transactions.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                          {formatCurrency(data.total)}
                        </p>
                        <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${type === 'income' ? 'bg-primary' : 'bg-destructive'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* Show transactions for this category */}
                    <div className="space-y-2 pl-11">
                      {data.transactions.slice(0, 3).map((transaction) => (
                        <div key={transaction.id} className="text-sm flex justify-between text-muted-foreground hover:text-foreground transition-colors">
                          <span>{transaction.description}</span>
                          <span>{format(new Date(transaction.date), "MMM d")}</span>
                        </div>
                      ))}
                      {data.transactions.length > 3 && (
                        <div className="text-sm text-muted-foreground pl-2">
                          +{data.transactions.length - 3} more...
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Total */}
              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg">Total {type === 'income' ? 'Income' : 'Expenses'}</p>
                  <p className={`text-2xl font-bold ${type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                    {formatCurrency(totalAmount)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
