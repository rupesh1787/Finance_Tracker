import { useSummary } from "@/hooks/use-transactions";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp, DollarSign, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { BreakdownModal } from "./BreakdownModal";

export function DashboardStats() {
  const { data: summary, isLoading } = useSummary();
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [breakdownType, setBreakdownType] = useState<"income" | "expense">("expense");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl w-full" />
        ))}
      </div>
    );
  }

  // Fallback if data is missing
  const stats = summary || { totalIncome: 0, totalExpenses: 0, balance: 0 };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const handleCardClick = (type: "income" | "expense") => {
    setBreakdownType(type);
    setBreakdownOpen(true);
  };

  const cards = [
    {
      title: "Total Balance",
      value: stats.balance,
      icon: Wallet,
      color: "text-foreground",
      bg: "bg-background",
      border: "border-border",
      clickable: false,
    },
    {
      title: "Total Income",
      value: stats.totalIncome,
      icon: ArrowUp,
      color: "text-primary",
      bg: "bg-primary/5",
      border: "border-primary/20",
      clickable: true,
      type: "income" as const,
    },
    {
      title: "Total Expenses",
      value: stats.totalExpenses,
      icon: ArrowDown,
      color: "text-destructive",
      bg: "bg-destructive/5",
      border: "border-destructive/20",
      clickable: true,
      type: "expense" as const,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => card.clickable && handleCardClick(card.type!)}
            className={`
              p-6 rounded-2xl border shadow-sm backdrop-blur-sm
              ${card.bg} ${card.border}
              ${card.clickable ? 'cursor-pointer group' : ''}
              transition-all duration-300
              ${card.clickable ? 'hover:shadow-lg hover:-translate-y-1 hover:border-border/60' : 'hover:shadow-md'}
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-medium text-muted-foreground ${card.clickable ? 'group-hover:text-foreground transition-colors' : ''}`}>
                {card.title}
                {card.clickable && (
                  <span className="text-xs ml-2 opacity-0 group-hover:opacity-100 transition-opacity">View Details</span>
                )}
              </h3>
              <div className={`p-2 rounded-full ${card.color === 'text-foreground' ? 'bg-muted' : card.bg} ${card.color} ${card.clickable ? 'group-hover:scale-110' : ''} transition-transform`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <div className={`text-3xl font-bold font-display tracking-tight ${card.color}`}>
              {formatCurrency(card.value)}
            </div>
          </motion.div>
        ))}
      </div>

      <BreakdownModal
        open={breakdownOpen}
        onOpenChange={setBreakdownOpen}
        type={breakdownType}
      />
    </>
  );
}
