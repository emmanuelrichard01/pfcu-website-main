
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactSection = () => {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/5 -z-20" />
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-pfcu-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="container max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-pfcu-primary font-semibold tracking-wider uppercase mb-2 block">Reach Out</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Get In Touch</h2>
          <p className="text-xl font-light text-muted-foreground mb-10 max-w-2xl mx-auto">
            Have questions? Want to join a unit? Our team is always ready to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="bg-pfcu-primary text-white p-10 rounded-3xl relative overflow-hidden shadow-2xl">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <h3 className="text-2xl font-heading font-bold mb-8">Contact Information</h3>
              <p className="mb-10 text-white/80 leading-relaxed font-light">
                Feel free to reach out to us with any questions or inquiries. We'd love to hear from you and help in any way we can.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-pfcu-secondary mb-1">Address</p>
                    <p className="text-white/90">Caritas University Campus, Enugu, Nigeria</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-pfcu-secondary mb-1">Email</p>
                    <p className="text-white/90">info@pfcu.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-pfcu-secondary mb-1">Phone</p>
                    <p className="text-white/90">+234 123 456 7890</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-border">
            <h3 className="text-2xl font-heading font-bold mb-2">Send us a Message</h3>
            <p className="text-muted-foreground mb-8">We usually respond within 24 hours.</p>

            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    className="h-12 rounded-xl bg-muted/30 focus:bg-white transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your Email"
                    className="h-12 rounded-xl bg-muted/30 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input
                  id="subject"
                  placeholder="Message Subject"
                  className="h-12 rounded-xl bg-muted/30 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea
                  id="message"
                  placeholder="How can we help you?"
                  rows={5}
                  className="rounded-xl bg-muted/30 focus:bg-white transition-colors resize-none p-4"
                />
              </div>

              <Button size="lg" className="w-full h-12 rounded-xl bg-black hover:bg-black/80 text-white font-medium shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
