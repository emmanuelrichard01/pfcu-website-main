
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Clock, CreditCard, DollarSign } from "lucide-react";
import { NewDonation, PaymentOption } from "@/types/donations";

interface OnlinePaymentFormProps {
  givingOptions: PaymentOption[];
  onSubmit: (donation: NewDonation) => void;
  isProcessing: boolean;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  amount: z.string().min(1, { message: "Amount is required" }),
  phoneNumber: z.string().min(5, { message: "Phone number is required" }),
  purpose: z.string().min(1, { message: "Please select a purpose" }),
});

type OnlinePaymentFormValues = z.infer<typeof formSchema>;

const OnlinePaymentForm = ({ givingOptions, onSubmit, isProcessing }: OnlinePaymentFormProps) => {
  const form = useForm<OnlinePaymentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      phoneNumber: "",
      purpose: "General Offering",
    },
  });

  const handleSubmit = (data: OnlinePaymentFormValues) => {
    const newDonation: NewDonation = {
      donorName: data.name,
      amount: parseFloat(data.amount),
      date: new Date().toISOString().split('T')[0],
      purpose: data.purpose,
      status: "pending",
      paymentMethod: "Online Payment",
      email: data.email,
      phone: data.phoneNumber,
      paymentReference: `PFCU-${Date.now().toString().substring(6)}`,
      paymentGateway: "Paystack",
    };
    
    onSubmit(newDonation);
  };

  return (
    <div className="mb-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="font-medium text-gray-900 mb-1">Online Payment</h3>
        <p className="text-gray-600 text-sm">
          Make a secure online payment using our payment gateway.
          You'll receive an email confirmation once your payment is processed.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₦)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input placeholder="1000" type="number" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+234..." type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Donation Purpose</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    {givingOptions.map((option) => (
                      <option key={option.id} value={option.title}>
                        {option.title}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-6">
            <Button 
              type="submit"
              className="w-full bg-pfcu-purple hover:bg-pfcu-dark text-lg py-6"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Clock className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Payment
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OnlinePaymentForm;
