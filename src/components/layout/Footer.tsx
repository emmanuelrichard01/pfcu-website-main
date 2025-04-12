
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-pfcu-dark text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-display font-bold text-pfcu-gold mb-6">PFCU</h3>
            <p className="text-gray-300 mb-6">
              The Pentecostal Fellowship of Caritas University, fostering spiritual growth and
              community since 2005.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-pfcu-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-pfcu-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-pfcu-gold transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-pfcu-gold transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-pfcu-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-pfcu-gold transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/units" className="text-gray-300 hover:text-pfcu-gold transition-colors">Ministry Units</Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-pfcu-gold transition-colors">Events</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-pfcu-gold transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Service Times</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <p className="font-medium">Sunday Service</p>
                <p>9:00 AM - 12:00 PM</p>
              </li>
              <li>
                <p className="font-medium">Bible Study</p>
                <p>Wednesday, 6:00 PM - 8:00 PM</p>
              </li>
              <li>
                <p className="font-medium">Prayer Meeting</p>
                <p>Friday, 7:00 PM - 9:00 PM</p>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Information</h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-pfcu-gold mt-1 flex-shrink-0" />
                <span>Caritas University Campus, Enugu, Nigeria</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-pfcu-gold flex-shrink-0" />
                <span>+234 123 456 7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-pfcu-gold flex-shrink-0" />
                <span>info@pfcu.org</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Pentecostal Fellowship of Caritas University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
