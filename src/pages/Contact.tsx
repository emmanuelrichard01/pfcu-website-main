import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Copy, Check, ArrowRight, MessageSquare, Sparkles } from "lucide-react";
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Contact = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { settings, loading } = useSiteSettings();

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success(`${type} copied to clipboard`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent successfully!", {
        description: "We'll get back to you as soon as possible."
      });
      // Reset form here if needed
    }, 1500);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">

        {/* Cinematic Hero (Giving Style) */}
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
                <MessageSquare size={14} className="text-pfcu-primary fill-pfcu-primary" />
                <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">Get in Touch</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-heading font-bold text-zinc-900 dark:text-white tracking-tight mb-8">
                Let's Start a <br />
                <span className="text-pfcu-primary relative">
                  Conversation.
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-pfcu-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                  </svg>
                </span>
              </h1>

              <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Whether you have questions about our ministries, prayer requests, or just want to say hello, we're here to listen.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto max-w-6xl px-4 md:px-8 pb-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">

            {/* Left Column: Contact Details (Refined Cards) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 hover:shadow-xl hover:border-pfcu-primary/20 transition-all duration-300 group hover:scale-[1.02]">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-pfcu-primary group-hover:bg-pfcu-primary group-hover:text-white transition-all duration-300">
                    <Mail size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-heading mb-2 text-zinc-900 dark:text-white">Email Us</h3>
                    <p className="text-zinc-500 mb-4 text-sm leading-relaxed">
                      For general inquiries, partnership opportunities, or feedback.
                    </p>
                    <button
                      onClick={() => handleCopy(settings.contactEmail, "Email")}
                      className="text-zinc-900 dark:text-white font-medium hover:text-pfcu-primary transition-colors flex items-center gap-2 group/btn"
                    >
                      {loading ? "Loading..." : settings.contactEmail}
                      {copied === "Email" ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="opacity-0 group-hover/btn:opacity-100 transition-opacity text-zinc-400" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 group hover:scale-[1.02]">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <MapPin size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-heading mb-2 text-zinc-900 dark:text-white">Visit Us</h3>
                    <p className="text-zinc-500 mb-4 text-sm leading-relaxed">
                      Come worship with us at our main campus sanctuary.
                    </p>
                    <a href="#" className="text-zinc-900 dark:text-white font-medium hover:text-blue-500 transition-colors flex items-center gap-2">
                      {loading ? "Loading..." : settings.contactAddress}
                      <ArrowRight size={16} className="text-zinc-400" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300 group hover:scale-[1.02]">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <Phone size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-heading mb-2 text-zinc-900 dark:text-white">Call Us</h3>
                    <p className="text-zinc-500 mb-4 text-sm leading-relaxed">
                      Mon-Fri from 8am to 5pm.
                    </p>
                    <button
                      onClick={() => handleCopy(settings.contactPhone, "Phone Number")}
                      className="text-zinc-900 dark:text-white font-medium hover:text-emerald-500 transition-colors flex items-center gap-2 group/btn"
                    >
                      {loading ? "Loading..." : settings.contactPhone}
                      {copied === "Phone Number" ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="opacity-0 group-hover/btn:opacity-100 transition-opacity text-zinc-400" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: High-End Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl relative overflow-hidden">

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-pfcu-primary/10 rounded-full flex items-center justify-center text-pfcu-primary">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Send a Message</h3>
                    <p className="text-sm text-zinc-500">We usually respond within 24 hours.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2 sm:col-span-1 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">First Name</label>
                      <Input
                        required
                        placeholder="Jane"
                        className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 h-12 rounded-xl focus:border-pfcu-primary focus:ring-pfcu-primary/20 text-base placeholder:text-zinc-400 text-zinc-900 dark:text-white"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Last Name</label>
                      <Input
                        required
                        placeholder="Doe"
                        className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 h-12 rounded-xl focus:border-pfcu-primary focus:ring-pfcu-primary/20 text-base placeholder:text-zinc-400 text-zinc-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                    <Input
                      required
                      type="email"
                      placeholder="jane@example.com"
                      className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 h-12 rounded-xl focus:border-pfcu-primary focus:ring-pfcu-primary/20 text-base placeholder:text-zinc-400 text-zinc-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Message</label>
                    <Textarea
                      required
                      placeholder="Tell us how we can help..."
                      rows={5}
                      className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 rounded-xl focus:border-pfcu-primary focus:ring-pfcu-primary/20 text-base resize-none placeholder:text-zinc-400 text-zinc-900 dark:text-white p-4"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 hover:scale-[1.01] transition-all duration-300 text-base font-bold shadow-lg mt-2"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white dark:border-zinc-900"></div>
                    ) : (
                      <>Send Message <Send className="ml-2 w-4 h-4" /></>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
