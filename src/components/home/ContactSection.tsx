
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactSection = () => {
  return (
    <section className="section-padding bg-pfcu-dark text-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 text-pfcu-gold">Get In Touch</h2>
          <p className="text-xl md:text-2xl font-medium text-gray-300 mb-10">
            Have questions? Reach out to us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-display font-bold mb-6">Contact Information</h3>
            <p className="mb-8 text-gray-300">
              Feel free to reach out to us with any questions or inquiries. We'd love to hear from you and help in any way we can.
            </p>
            
            <div className="space-y-6">
              <div>
                <p className="font-medium text-pfcu-gold mb-1">Address</p>
                <p className="text-gray-300">Caritas University Campus, Enugu, Nigeria</p>
              </div>
              
              <div>
                <p className="font-medium text-pfcu-gold mb-1">Email</p>
                <p className="text-gray-300">info@pfcu.org</p>
              </div>
              
              <div>
                <p className="font-medium text-pfcu-gold mb-1">Phone</p>
                <p className="text-gray-300">+234 123 456 7890</p>
              </div>
              
              <div>
                <p className="font-medium text-pfcu-gold mb-1">Fellowship Hours</p>
                <p className="text-gray-300">Sunday: 9:00 AM - 12:00 PM</p>
                <p className="text-gray-300">Wednesday: 6:00 PM - 8:00 PM (Bible Study)</p>
                <p className="text-gray-300">Friday: 7:00 PM - 9:00 PM (Prayer Meeting)</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-display font-bold mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    className="bg-white/10 border-gray-700 text-white placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your Email"
                    className="bg-white/10 border-gray-700 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                <Input
                  id="subject"
                  placeholder="Message Subject"
                  className="bg-white/10 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <Textarea
                  id="message"
                  placeholder="Your Message"
                  rows={5}
                  className="bg-white/10 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
              
              <Button className="bg-pfcu-gold hover:bg-yellow-600 text-pfcu-dark w-full">
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
