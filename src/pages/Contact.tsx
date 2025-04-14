
import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Phone, Mail, MapPin, Clock, Instagram } from "lucide-react";
import GoogleMap from "@/components/map/GoogleMap";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll respond shortly.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="bg-pfcu-light py-16 md:py-24">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-center mb-6">Contact Us</h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-gray-700">
            We'd love to hear from you. Reach out with any questions or inquiries.
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Get In Touch</h2>
              <p className="mb-8 text-gray-700">
                Have questions about our fellowship? Want to join a ministry unit? Need spiritual guidance? 
                We're here to help. Fill out the form and we'll get back to you as soon as possible.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-pfcu-purple/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-pfcu-purple" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Phone</h3>
                    <p className="text-gray-700">+234 123 456 7890</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-pfcu-purple/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-pfcu-purple" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Email</h3>
                    <p className="text-gray-700">info@pfcu.org</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-pfcu-purple/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-pfcu-purple" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Location</h3>
                    <p className="text-gray-700">Main Fellowship Hall<br />Caritas University Campus<br />Enugu, Nigeria</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-pfcu-purple/10 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-pfcu-purple" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Meeting Times</h3>
                    <p className="text-gray-700">
                      Sunday: 9:00 AM - 12:00 PM<br />
                      Wednesday: 6:00 PM - 8:00 PM (Bible Study)<br />
                      Friday: 7:00 PM - 9:00 PM (Prayer Meeting)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-pfcu-purple/10 p-3 rounded-full">
                    <Instagram className="h-6 w-6 text-pfcu-purple" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Social Media</h3>
                    <a href="https://instagram.com/pfcu_" target="_blank" rel="noopener noreferrer" className="text-pfcu-purple hover:underline">
                      @pfcu_
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Send a Message</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Message Subject"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows={5}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full bg-pfcu-purple hover:bg-pfcu-dark text-white" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-6">Visit Us</h2>
          <p className="mb-8 max-w-2xl mx-auto text-gray-700">
            We're located on the Caritas University campus. Our fellowship hall is easy to find, 
            and we welcome visitors at all our services and events.
          </p>
          <div className="h-96 w-full rounded-lg overflow-hidden">
            <GoogleMap address="Caritas University, Enugu, Nigeria" height="380px" />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
