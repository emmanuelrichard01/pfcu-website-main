
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
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
import { Building, Clock, Copy, CheckCircle, Wallet, DollarSign } from "lucide-react";
import { NewDonation, PaymentOption } from "@/types/donations";

interface BankTransferFormProps {
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

type BankTransferFormValues = z.infer<typeof formSchema>;

const BankTransferForm = ({ givingOptions, onSubmit, isProcessing }: BankTransferFormProps) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<BankTransferFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      phoneNumber: "",
      purpose: "General Offering",
    },
  });

  const handleSubmit = (data: BankTransferFormValues) => {
    const newDonation: NewDonation = {
      donorName: data.name,
      amount: parseFloat(data.amount),
      date: new Date().toISOString().split('T')[0],
      purpose: data.purpose,
      status: "pending",
      paymentMethod: "Bank Transfer",
      email: data.email,
      phone: data.phoneNumber,
      paymentReference: `PFCU-${Date.now().toString().substring(6)}`,
      paymentGateway: "Direct Deposit",
    };
    
    onSubmit(newDonation);
  };

  const copyAccountDetails = () => {
    navigator.clipboard.writeText("Account Number: 8155037840 Bank Name: Opay").then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
      toast({
        title: "Copied!",
        description: "Account details copied to clipboard",
      });
    });
  };

  return (
    <div className="mb-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Bank Account Details</h3>
            <p className="text-gray-600 text-sm mb-1">Account Number: <span className="font-medium">8155037840</span></p>
            <p className="text-gray-600 text-sm">Bank Name: <span className="font-medium">Opay</span></p>
            <p className="text-gray-600 text-sm mt-2">Account Name: <span className="font-medium">Pentecostal Fellowship of Caritas University</span></p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={copyAccountDetails}
          >
            {copySuccess ? <CheckCircle size={14} className="text-green-600" /> : <Copy size={14} />}
            <span>{copySuccess ? "Copied" : "Copy"}</span>
          </Button>
        </div>
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

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-4">
            <h4 className="text-amber-800 font-medium text-sm flex items-center gap-2">
              <Clock size={16} />
              Important
            </h4>
            <p className="text-amber-700 text-sm mt-1">
              After making your transfer, click the button below to notify us about your donation. This helps us track and confirm your contribution.
            </p>
          </div>

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
                  <Wallet className="mr-2 h-5 w-5" />
                  I've Made My Transfer
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BankTransferForm;
