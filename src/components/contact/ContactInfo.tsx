
import { Phone, Mail, MapPin, Clock, Instagram } from "lucide-react";

const ContactInfo = () => {
  return (
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
  );
};

export default ContactInfo;
