import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTransactionSchema, type InsertTransaction } from "@shared/schema";
import { useCreateTransaction } from "@/hooks/use-transactions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Frontend validation schema - we handle the amount conversion to cents later
const formSchema = insertTransactionSchema.extend({
  amount: z.coerce.number().positive("Amount must be positive"),
  date: z.coerce.date(),
});

type FormValues = z.infer<typeof formSchema>;

export function TransactionForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const createTransaction = useCreateTransaction();
  const [dateOpen, setDateOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "" as any,
      type: "expense",
      category: "food",
      date: new Date(),
    },
  });

  const onSubmit = (values: FormValues) => {
    // Convert dollars to cents for backend
    const payload: InsertTransaction = {
      ...values,
      amount: Math.round(values.amount * 100),
    };

    createTransaction.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Transaction added",
          description: "Your transaction has been recorded successfully.",
        });
        form.reset({
          description: "",
          amount: "" as any,
          type: values.type, // Keep last used type
          category: "food",
          date: new Date(),
        });
        onSuccess?.();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const transactionType = form.watch("type");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Transaction Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4"
                >
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem value="income" className="peer sr-only" />
                    </FormControl>
                    <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all duration-200">
                      <span className="text-lg font-bold">Income</span>
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem value="expense" className="peer sr-only" />
                    </FormControl>
                    <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-destructive peer-data-[state=checked]:text-destructive cursor-pointer transition-all duration-200">
                      <span className="text-lg font-bold">Expense</span>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
                    <Input 
                      placeholder="0.00" 
                      type="number" 
                      step="0.01" 
                      className="pl-7 text-lg font-medium"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-lg font-medium">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {transactionType === "income" ? (
                      <>
                        <SelectItem value="salary">Salary</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                        <SelectItem value="other">Other Income</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="food">Food & Dining</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="other">Other Expense</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="What was this for?" className="text-lg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal text-lg h-12",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setDateOpen(false);
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className={cn(
            "w-full h-12 text-lg font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl",
            transactionType === 'income' 
              ? "bg-primary hover:bg-primary/90 shadow-primary/25" 
              : "bg-destructive hover:bg-destructive/90 shadow-destructive/25"
          )}
          disabled={createTransaction.isPending}
        >
          {createTransaction.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-5 w-5" />
              Add Transaction
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
