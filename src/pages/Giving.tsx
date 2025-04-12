
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { DollarSign, CreditCard, Landmark, Clock, Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface GivingFormValues {
  name: string;
  email: string;
  amount: string;
  phoneNumber: string;
}

const Giving = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const form = useForm<GivingFormValues>({
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      phoneNumber: "",
    },
  });

  const onSubmit = (data: GivingFormValues) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      console.log("Payment processed:", data);
      setIsProcessing(false);
      form.reset();
      
      toast({
        title: "Donation received!",
        description: "Thank you for your generous support of PFCU.",
      });
    }, 2000);
  };

  const givingOptions = [
    {
      title: "Support PFCU",
      description: "General support for fellowship activities",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      title: "Campus Outreach",
      description: "Evangelism and campus ministry",
      icon: <Landmark className="h-6 w-6" />,
    },
    {
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
              <Card key={option.title} className="text-center hover:shadow-lg transition-shadow">
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

          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-t-4 border-t-pfcu-gold">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Make a Donation</CardTitle>
                <CardDescription className="text-center">
                  Fill out the form below to make a secure donation
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                            Donate Now
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
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
