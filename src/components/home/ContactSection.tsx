
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="relative py-16 md:py-32 bg-zinc-950 overflow-hidden text-white">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -top-[20%] right-[-10%] w-[600px] h-[600px] bg-pfcu-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-24">

          {/* Left: Info */}
          <div className="flex flex-col justify-center">
            <span className="text-pfcu-primary font-bold tracking-widest uppercase text-xs mb-3 block">
              Get in Touch
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 tracking-tight">
              Let's Start a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">Conversation.</span>
            </h2>
            <p className="text-lg text-zinc-400 font-light leading-relaxed mb-12 max-w-md">
              Whether you have questions about our ministries, services, or just want to say hello, we're here for you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4 group">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl group-hover:bg-pfcu-primary/20 group-hover:border-pfcu-primary/30 transition-colors">
                  <MapPin className="text-white w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Visit Us</h4>
                  <p className="text-zinc-400">Caritas University Campus,<br />Enugu, Nigeria</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl group-hover:bg-pfcu-primary/20 group-hover:border-pfcu-primary/30 transition-colors">
                  <Mail className="text-white w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Email Us</h4>
                  <p className="text-zinc-400">info@pfcu.org</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl group-hover:bg-pfcu-primary/20 group-hover:border-pfcu-primary/30 transition-colors">
                  <Phone className="text-white w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Call Us</h4>
                  <p className="text-zinc-400">+234 123 456 7890</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pfcu-primary/20 to-transparent rounded-3xl blur-2xl -z-10 opacity-50" />
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-10 rounded-3xl">
              <h3 className="text-2xl font-bold font-heading mb-6">Send a Message</h3>

              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Name</label>
                    <Input
                      placeholder="John Doe"
                      className="bg-black/20 border-white/10 focus:border-pfcu-primary/50 text-white placeholder:text-white/20 h-12 rounded-xl"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Email</label>
                    <Input
                      placeholder="john@example.com"
                      type="email"
                      className="bg-black/20 border-white/10 focus:border-pfcu-primary/50 text-white placeholder:text-white/20 h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Subject</label>
                  <Input
                    placeholder="How can we help?"
                    className="bg-black/20 border-white/10 focus:border-pfcu-primary/50 text-white placeholder:text-white/20 h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Message</label>
                  <Textarea
                    placeholder="Your message..."
                    rows={5}
                    className="bg-black/20 border-white/10 focus:border-pfcu-primary/50 text-white placeholder:text-white/20 rounded-xl resize-none"
                  />
                </div>

                <Button className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-base transition-colors">
                  Send Message <Send className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
