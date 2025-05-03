
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const fadeInUp = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      }
    }
  };

  return (
    <footer className="bg-gradient-to-b from-pfcu-dark to-black text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pfcu-gold via-pfcu-purple to-pfcu-gold"></div>
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-pfcu-purple/10 to-transparent opacity-20 pointer-events-none"></div>
      
      {/* Wave pattern at top */}
      <div className="absolute top-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full text-white/5 fill-current">
          <path d="M0,64L48,64C96,64,192,64,288,53.3C384,43,480,21,576,21.3C672,21,768,43,864,48C960,53,1056,43,1152,42.7C1248,43,1344,53,1392,58.7L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>

      <div className="container pt-16 pb-8 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <motion.div variants={fadeInUp}>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white rounded-full p-2 shadow-glow">
                <img 
                  src="/lovable-uploads/542ae7a7-6ae0-4459-954e-0edf20905847.png" 
                  alt="PFCU Logo" 
                  className="h-12 w-12"
                />
              </div>
              <h3 className="text-3xl font-display font-bold text-pfcu-gold">PFCU</h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              The Pentecostal Fellowship of Caritas University, fostering spiritual growth and
              community since 2005.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Facebook size={20} />} />
              <SocialLink href="https://www.instagram.com/pfcu_/" icon={<Instagram size={20} />} />
              <SocialLink href="#" icon={<Twitter size={20} />} />
              <SocialLink href="#" icon={<Youtube size={20} />} />
            </div>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <h4 className="text-lg font-bold mb-6 text-pfcu-gold">Quick Links</h4>
            <ul className="space-y-3">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/about" label="About Us" />
              <FooterLink to="/units" label="Ministry Units" />
              <FooterLink to="/events" label="Events" />
              <FooterLink to="/sermons" label="Sermons" />
              <FooterLink to="/contact" label="Contact Us" />
            </ul>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <h4 className="text-lg font-bold mb-6 text-pfcu-gold">Service Times</h4>
            <ul className="space-y-4">
              <ServiceTime title="Sunday Service" time="9:00 AM - 12:00 PM" />
              <ServiceTime title="Bible Study" time="Wednesday, 6:00 PM - 8:00 PM" />
              <ServiceTime title="Prayer Meeting" time="Friday, 7:00 PM - 9:00 PM" />
            </ul>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <h4 className="text-lg font-bold mb-6 text-pfcu-gold">Contact Information</h4>
            <ul className="space-y-4">
              <ContactInfo icon={<MapPin size={20} />} text="Caritas University Campus, Enugu, Nigeria" />
              <ContactInfo icon={<Phone size={20} />} text="+234 123 456 7890" />
              <ContactInfo icon={<Mail size={20} />} text="info@pfcu.org" />
            </ul>
          </motion.div>
        </motion.div>
        
        {/* Newsletter Signup */}
        <motion.div 
          className="mt-16 p-8 bg-gradient-to-r from-pfcu-purple/20 to-pfcu-purple/10 rounded-xl border border-pfcu-purple/20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h4 className="text-xl font-bold text-pfcu-gold mb-2">Stay Updated</h4>
              <p className="text-gray-300">Subscribe to our newsletter for weekly updates and announcements</p>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pfcu-gold"
              />
              <button className="px-6 py-2 bg-pfcu-gold text-pfcu-dark font-medium rounded-md hover:bg-yellow-400 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p>&copy; {new Date().getFullYear()} Pentecostal Fellowship of Caritas University. All rights reserved.</p>
          <p className="flex items-center mt-4 md:mt-0">
            Made with <Heart className="mx-1 text-red-500" size={14} /> in Christ Jesus
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

// Helper components
const SocialLink = ({ href, icon }: { href: string, icon: React.ReactNode }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pfcu-gold hover:text-pfcu-dark transition-colors"
  >
    {icon}
  </a>
);

const FooterLink = ({ to, label }: { to: string, label: string }) => (
  <li>
    <Link 
      to={to} 
      className="text-gray-300 hover:text-pfcu-gold transition-colors hover:translate-x-1 inline-block transform"
    >
      {label}
    </Link>
  </li>
);

const ServiceTime = ({ title, time }: { title: string, time: string }) => (
  <li className="bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors">
    <p className="font-medium text-pfcu-gold">{title}</p>
    <p className="text-sm text-gray-300">{time}</p>
  </li>
);

const ContactInfo = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <li className="flex items-start space-x-3 group">
    <span className="text-pfcu-gold mt-1 flex-shrink-0 p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
      {icon}
    </span>
    <span className="text-gray-300">{text}</span>
  </li>
);

export default Footer;
