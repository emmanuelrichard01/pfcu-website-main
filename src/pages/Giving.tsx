import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
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
  DollarSign,
  Landmark,
  Clock,
  Heart,
  Copy,
  CheckCircle,
  Wallet,
  HandHeart,
  Banknote,
  Info
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { NewDonation, PaymentOption } from "@/types/donations";
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
  const [copySuccess, setCopySuccess] = useState(false);
  const { toast } = useToast();

  // State for dynamic settings
  const [siteSettings, setSiteSettings] = useState({
    bankName: "Opay",
    accountNumber: "8155037840",
    accountName: "Pentecostal Fellowship of Caritas University",
    cashInstructions: "You can give offering in cash during our weekly services or drop it in the offering box located at the entrance."
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings' as any)
        .select('*')
        .in('key', ['bank_name', 'account_number', 'account_name', 'cash_instructions']);

      if (data) {
        const details: any = {};
        data.forEach((item: any) => {
          if (item.key === 'bank_name') details.bankName = item.value;
          if (item.key === 'account_number') details.accountNumber = item.value;
          if (item.key === 'account_name') details.accountName = item.value;
          if (item.key === 'cash_instructions') details.cashInstructions = item.value;
        });
        if (Object.keys(details).length > 0) {
          setSiteSettings(prev => ({ ...prev, ...details }));
        }
      }
    };
    fetchSettings();
  }, []);

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

    const paymentReference = `PFCU-${Date.now().toString().substring(6)}`;

    const newDonation: NewDonation = {
      donorName: data.name,
      amount: parseFloat(data.amount),
      date: new Date().toISOString().split('T')[0],
      purpose: data.purpose,
      status: "pending",
      paymentMethod: "Bank Transfer",
      email: data.email,
      phone: data.phoneNumber,
      paymentReference: paymentReference,
      paymentGateway: "Direct Deposit",
    };

    try {
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

      if (error) throw error;

      setTimeout(() => {
        setIsProcessing(false);
        form.reset();
        toast({
          title: "Donation details submitted!",
          description: "Please complete your transfer using the account details provided.",
        });
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting donation:", error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "There was a problem submitting your donation.",
        variant: "destructive",
      });
    }
  };

  const copyAccountDetails = () => {
    navigator.clipboard.writeText(`Account Number: ${siteSettings.accountNumber} Bank Name: ${siteSettings.bankName}`).then(() => {
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
      {/* Modern Compact Hero */}
      <div className="relative bg-pfcu-dark pt-32 pb-16 md:py-36 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-pfcu-primary/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-pfcu-secondary/10 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-pfcu-secondary text-sm font-medium mb-6">
              <HandHeart size={14} />
              <span>Giving</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 tracking-tight">
              Support Our <span className="text-pfcu-primary">Fellowship</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Your generous giving helps us advance the gospel on campus and beyond.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto py-16 px-4">
        {/* Giving Options Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {givingOptions.map((option, idx) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center hover:shadow-xl transition-all hover:-translate-y-1 h-full border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <div className="mx-auto bg-pfcu-primary/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-4 text-pfcu-primary">
                    {option.icon}
                  </div>
                  <CardTitle className="text-xl font-heading">{option.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-500 text-base">
                    {option.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Column: Bank Transfer Details Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-2xl border-0 overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-800 h-full">
                <div className="h-2 bg-gradient-to-r from-pfcu-primary to-pfcu-secondary" />
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Landmark size={24} />
                    </div>
                    <CardTitle className="text-2xl font-heading font-bold">Bank Transfer</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Direct transfer to our official account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Premium Bank Card Display */}
                  <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">Bank Name</p>
                          <h3 className="text-xl font-bold">{siteSettings.bankName}</h3>
                        </div>
                        <Landmark className="text-white/20 h-10 w-10" />
                      </div>

                      <div className="mb-6">
                        <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-2">Account Number</p>
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-mono font-bold tracking-wider">{siteSettings.accountNumber}</span>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 border-0 text-white"
                            onClick={copyAccountDetails}
                          >
                            {copySuccess ? <CheckCircle size={14} /> : <Copy size={14} />}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">Account Name</p>
                        <p className="text-base font-medium opacity-90">{siteSettings.accountName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Notification Form */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Info size={18} className="text-pfcu-primary" />
                      Notify Us of Your Transfer
                    </h3>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
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
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="amount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Amount (₦)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="1000" type="number" {...field} />
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
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl>
                                    <Input placeholder="+234..." {...field} />
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
                                <FormLabel>Purpose</FormLabel>
                                <FormControl>
                                  <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                    {...field}
                                  >
                                    {givingOptions.map((option) => (
                                      <option key={option.id} value={option.title}>{option.title}</option>
                                    ))}
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-pfcu-primary hover:bg-pfcu-primary/90 mt-2"
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : "I've Made My Transfer"}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column: Cash Giving (Sticky if needed) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Cash / Check Card */}
              <Card className="shadow-lg border-zinc-200 dark:border-zinc-800 bg-amber-50/50 dark:bg-amber-950/10">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                      <Banknote size={24} />
                    </div>
                    <CardTitle className="text-2xl font-heading font-bold text-amber-900 dark:text-amber-100">Cash & Offering Box</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    <p className="whitespace-pre-wrap text-lg">{siteSettings.cashInstructions}</p>
                  </div>
                  <div className="mt-6 flex items-center gap-3 text-sm text-amber-800 dark:text-amber-200 bg-amber-100/50 dark:bg-amber-900/30 p-4 rounded-xl">
                    <Clock size={18} className="shrink-0" />
                    <span>Available during all weekly services and fellowship gatherings.</span>
                  </div>
                </CardContent>
              </Card>

              {/* Security / Trust Badge */}
              <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800">
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                    <CheckCircle size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Secure & Transparent</h3>
                  <p className="text-sm text-zinc-500">
                    All financial contributions are handled with integrity and used strictly for fellowship purposes and outreach.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Giving;
