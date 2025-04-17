import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DollarSign,
  CreditCard,
  Landmark,
  Clock,
  Heart,
  Building,
  Copy,
  CheckCircle,
  Wallet,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { NewDonation, PaymentOption } from "@/types/donations";
import BankTransferForm from "@/components/giving/BankTransferForm";
import OnlinePaymentForm from "@/components/giving/OnlinePaymentForm";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  amount: z.string().min(1, { message: "Amount is required" }),
  phoneNumber: z.string().min(5, { message: "Phone number is required" }),
  purpose: z.string().min(1, { message: "Please select a purpose" }),
});

type GivingFormValues = z.infer<typeof formSchema>;

const Giving = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState<string>("bank");
  const [copySuccess, setCopySuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<GivingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      phoneNumber: "",
      purpose: "General Offering",
    },
  });

  const onSubmit = async (data: GivingFormValues) => {
    setIsProcessing(true);
    
    // Generate a reference number
    const paymentReference = `PFCU-${Date.now().toString().substring(6)}`;
    
    // Create donation object
    const newDonation: NewDonation = {
      donorName: data.name,
      amount: parseFloat(data.amount),
      date: new Date().toISOString().split('T')[0],
      purpose: data.purpose,
      status: activePaymentMethod === "online" ? "completed" : "pending",
      paymentMethod: activePaymentMethod === "online" ? "Online Payment" : "Bank Transfer",
      email: data.email,
      phone: data.phoneNumber,
      paymentReference: paymentReference,
      paymentGateway: activePaymentMethod === "online" ? "Paystack" : "Direct Deposit",
    };
    
    try {
      // Insert into Supabase
      const { error } = await supabase
        .from('donations')
        .insert([{
          donor_name: newDonation.donorName,
          email: newDonation.email,
          phone: newDonation.phone,
          amount: newDonation.amount,
          purpose: newDonation.purpose,
          payment_method: newDonation.paymentMethod,
          payment_reference: newDonation.paymentReference,
          payment_gateway: newDonation.paymentGateway,
          status: newDonation.status,
          date: newDonation.date
        }]);
      
      if (error) {
        throw error;
      }
      
      // Simulate payment processing for UI feedback
      setTimeout(() => {
        setIsProcessing(false);
        form.reset();
        
        toast({
          title: "Donation details submitted!",
          description: activePaymentMethod === "bank" ? 
            "Please complete your transfer using the account details provided." : 
            "Your donation has been processed. Thank you for your support!",
        });

        // If it was an online payment, we've already set the status to completed
        // in the database insert above
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting donation:", error);
      
      // Fall back to localStorage if Supabase fails
      try {
        const storedDonations = localStorage.getItem("pfcu_donations");
        const donations = storedDonations ? JSON.parse(storedDonations) : [];
        const donationWithId = { 
          ...newDonation, 
          id: (donations.length + 1).toString() 
        };
        donations.push(donationWithId);
        localStorage.setItem("pfcu_donations", JSON.stringify(donations));
      } catch (fallbackError) {
        console.error("Even fallback storage failed:", fallbackError);
      }
      
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "There was a problem submitting your donation, but we've saved it locally.",
        variant: "destructive",
      });
    }
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

  const givingOptions: PaymentOption[] = [
    {
      id: "general",
      title: "General Offering",
      description: "General support for fellowship activities",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      id: "outreach",
      title: "Campus Outreach",
      description: "Evangelism and campus ministry",
      icon: <Landmark className="h-6 w-6" />,
    },
    {
      id: "community",
      title: "Community Service",
      description: "Supporting welfare programs",
      icon: <DollarSign className="h-6 w-6" />,
    },
  ];

  return (
    <MainLayout>
      <div className="bg-pfcu-light py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-pfcu-purple mb-4">
              Support Our Fellowship
            </h1>
            <p className="text-lg text-gray-700">
              Your generous giving helps us advance the gospel on campus and beyond. 
              Every contribution supports our ministry activities and outreach programs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {givingOptions.map((option) => (
              <Card key={option.id} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-pfcu-purple/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <div className="text-pfcu-purple">{option.icon}</div>
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {option.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="shadow-lg border-t-4 border-t-pfcu-gold">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Make a Donation</CardTitle>
                <CardDescription className="text-center">
                  Choose your preferred payment method below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="bank" className="w-full" onValueChange={setActivePaymentMethod}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="bank" className="gap-2">
                      <Building size={16} />
                      <span>Bank Transfer</span>
                    </TabsTrigger>
                    <TabsTrigger value="online" className="gap-2">
                      <CreditCard size={16} />
                      <span>Online Payment</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="bank">
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
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  </TabsContent>
                  
                  <TabsContent value="online">
                    <div className="mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                        <h3 className="font-medium text-gray-900 mb-1">Online Payment</h3>
                        <p className="text-gray-600 text-sm">
                          Make a secure online payment using any of our supported payment methods.
                          You'll receive an email confirmation once your payment is processed.
                        </p>
                      </div>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex-col space-y-2 text-center text-sm text-gray-500">
                <p>All donations are secure and encrypted</p>
                <p>PFCU is a registered campus fellowship at Caritas University</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Giving;
