import { useTransactions } from "@/hooks/use-transactions";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  '#ef4444', // Red 500
  '#f97316', // Orange 500
  '#f59e0b', // Amber 500
  '#84cc16', // Lime 500
  '#10b981', // Emerald 500
  '#06b6d4', // Cyan 500
  '#3b82f6', // Blue 500
  '#8b5cf6', // Violet 500
];

export function ExpenseChart() {
  const { data: transactions, isLoading } = useTransactions();

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full rounded-2xl" />;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border">
        No data to display
      </div>
    );
  }

  const expenses = transactions.filter(t => t.type === 'expense');

  if (expenses.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border">
        No expenses recorded yet
      </div>
    );
  }

  // Aggregate expenses by category
  const data = Object.values(expenses.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = { name: curr.category, value: 0 };
    }
    acc[curr.category].value += curr.amount;
    return acc;
  }, {} as Record<string, { name: string; value: number }>));

  // Convert cents to dollars for display
  const chartData = data.map(item => ({
    ...item,
    value: item.value / 100
  })).sort((a, b) => b.value - a.value);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-lg)'
            }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend 
            formatter={(value) => <span className="capitalize text-sm font-medium text-muted-foreground ml-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
