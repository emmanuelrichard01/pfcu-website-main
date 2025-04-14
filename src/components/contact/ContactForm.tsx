
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const ContactForm = () => {
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
  );
};

export default ContactForm;
