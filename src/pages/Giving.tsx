
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Copy,
  CheckCircle,
  Landmark,
  ArrowRight,
  Heart,
  ShieldCheck,
  CreditCard,
  Banknote,
  ChevronDown,
  Sparkles
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
  const [showForm, setShowForm] = useState(false);
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
        setShowForm(false);
        toast({
          title: "Transfer Notification Sent!",
          description: "We'll confirm your donation shortly. Thank you for your generosity.",
        });
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting donation:", error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: error.message || "There was a problem submitting your donation.",
        variant: "destructive",
      });
    }
  };

  const copyAccountDetails = () => {
    navigator.clipboard.writeText(siteSettings.accountNumber).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast({
        title: "Copied!",
        description: "Account number copied to clipboard",
      });
    });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        {/* Cinematic Hero */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pfcu-primary/5 via-zinc-50/0 to-zinc-50/0 dark:from-pfcu-primary/10 dark:via-zinc-950/0 dark:to-zinc-950/0" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
          </div>

          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
                <Heart size={14} className="text-pfcu-primary fill-pfcu-primary" />
                <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">Giving Back</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-heading font-bold text-zinc-900 dark:text-white tracking-tight mb-8">
                Your Generosity <br />
                <span className="text-pfcu-primary relative">
                  Seeds the Future
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-pfcu-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                  </svg>
                </span>
              </h1>

              <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Join us in advancing the Kingdom. Every seed sown goes directly into supporting our ministry, outreach, and community impactful projects.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Payment Section */}
        <section className="container mx-auto max-w-6xl px-4 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">

            {/* Left Column: Bank Card & Cash */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="relative group perspective-1000">
                <div className="absolute -inset-1 bg-gradient-to-r from-pfcu-primary to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                {/* Premium Bank Card */}
                <div className="relative h-[280px] w-full rounded-2xl bg-[#1a1a1a] shadow-2xl overflow-hidden p-8 flex flex-col justify-between border border-white/10 group-hover:transform group-hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-pfcu-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <h3 className="text-zinc-400 font-medium tracking-widest text-sm uppercase mb-1">Bank Name</h3>
                      <p className="text-2xl font-bold text-white">{siteSettings.bankName}</p>
                    </div>
                    <Landmark className="text-white/20" size={32} />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-end gap-4 mb-2">
                      <h2 className="text-4xl md:text-5xl font-mono text-white font-bold tracking-wider">{siteSettings.accountNumber}</h2>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={copyAccountDetails}
                        className="text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {copySuccess ? <CheckCircle size={20} className="text-green-400" /> : <Copy size={20} />}
                      </Button>
                    </div>
                    <p className="text-zinc-400 text-sm">Tap copy icon to copy number</p>
                  </div>

                  <div className="relative z-10">
                    <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest mb-1">Account Name</p>
                    <p className="text-white/90 font-medium truncate">{siteSettings.accountName}</p>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex gap-6 py-6 border-y border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-green-600 shrink-0" />
                  <div>
                    <p className="font-bold text-sm text-zinc-900 dark:text-white">Secure Transaction</p>
                    <p className="text-xs text-zinc-500">Direct bank grade transfer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-pfcu-primary shrink-0" />
                  <div>
                    <p className="font-bold text-sm text-zinc-900 dark:text-white">Tax Deductible</p>
                    <p className="text-xs text-zinc-500">Receipts upon request</p>
                  </div>
                </div>
              </div>

              {/* Cash Option */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 flex items-start gap-4">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400">
                  <Banknote size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Cash & Check</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{siteSettings.cashInstructions}</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Interaction Area */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {!showForm ? (
                  <motion.div
                    key="cta"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 border border-zinc-200 dark:border-zinc-800 shadow-xl text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-pfcu-primary/10 rounded-full flex items-center justify-center mx-auto text-pfcu-primary">
                      <Sparkles size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Have you led the transfer?</h2>
                      <p className="text-zinc-500">Help us track your seed by notifying the finance team. It only takes a minute.</p>
                    </div>
                    <Button
                      onClick={() => setShowForm(true)}
                      size="lg"
                      className="w-full h-14 text-lg rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all font-bold"
                    >
                      Notify Us Now
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl"
                  >
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg">Transfer Details</h3>
                      <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="text-zinc-400 hover:text-zinc-900">Cancel</Button>
                    </div>
                    <div className="p-6 md:p-8">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your Name" {...field} className="h-12 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700" />
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
                                <FormLabel className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="you@example.com" type="email" {...field} className="h-12 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-5">
                            <FormField
                              control={form.control}
                              name="amount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Amount (₦)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="5000" type="number" {...field} className="h-12 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 font-mono" />
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
                                  <FormLabel className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Phone</FormLabel>
                                  <FormControl>
                                    <Input placeholder="080..." {...field} className="h-12 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700" />
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
                                <FormLabel className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Purpose</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-12 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700">
                                      <SelectValue placeholder="Select purpose" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="General Offering">General Offering</SelectItem>
                                    <SelectItem value="Campus Outreach">Campus Outreach</SelectItem>
                                    <SelectItem value="Community Service">Community Service</SelectItem>
                                    <SelectItem value="Tithe">Tithe</SelectItem>
                                    <SelectItem value="Building Fund">Building Fund</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full h-12 bg-pfcu-primary hover:bg-pfcu-primary/90 text-white font-bold rounded-xl shadow-lg shadow-pfcu-primary/25 mt-4"
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                Processing...
                              </span>
                            ) : "Confirm Transfer"}
                          </Button>
                        </form>
                      </Form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Giving;
