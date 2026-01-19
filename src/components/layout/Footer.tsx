
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [contactInfo, setContactInfo] = useState({
    address: "Caritas University, Enugu",
    phone: "+234 123 456 7890",
    email: "fellowship@pfcu.org"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings' as any)
        .select('*')
        .in('key', ['contact_address', 'contact_phone', 'contact_email']);

      if (data) {
        const settingsData = data as any[];
        const newInfo = { ...contactInfo };
        settingsData.forEach(setting => {
          if (setting.key === 'contact_address') newInfo.address = setting.value;
          if (setting.key === 'contact_phone') newInfo.phone = setting.value;
          if (setting.key === 'contact_email') newInfo.email = setting.value;
        });
        setContactInfo(newInfo);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-zinc-950 text-white relative overflow-hidden pt-24 pb-12 border-t border-white/5">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-pfcu-primary/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-20">

          {/* Brand Column */}
          <div className="md:col-span-5 lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors overflow-hidden p-1">
                <img src="/pfcu-logo.png" alt="PFCU Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-heading font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">PFCU</span>
            </Link>

            <p className="text-zinc-400 text-base leading-relaxed max-w-sm">
              Empowering the next generation through christ-centered community, spiritual growth, and academic excellence.
            </p>

            <div className="flex gap-3">
              <SocialLink href="#" icon={<Facebook size={18} />} />
              <SocialLink href="https://www.instagram.com/pfcu_/" icon={<Instagram size={18} />} />
              <SocialLink href="#" icon={<Twitter size={18} />} />
              <SocialLink href="#" icon={<Youtube size={18} />} />
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 opacity-90">Explore</h4>
              <ul className="space-y-3">
                <FooterLink to="/" label="Home" />
                <FooterLink to="/about" label="About Us" />
                <FooterLink to="/departments" label="Departments" />
                <FooterLink to="/events" label="Events" />
                <FooterLink to="/sermons" label="Sermons" />
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 opacity-90">Service Times</h4>
              <ul className="space-y-4">
                <ServiceTime day="Sunday" time="9:00 AM" label="Main Service" />
                <ServiceTime day="Wednesday" time="6:00 PM" label="Bible Study" />
                <ServiceTime day="Friday" time="7:00 PM" label="Prayer & Worship" />
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 opacity-90">Contact</h4>
              <ul className="space-y-4">
                <ContactInfo icon={<MapPin size={16} />} text={contactInfo.address} />
                <ContactInfo icon={<Phone size={16} />} text={contactInfo.phone} />
                <ContactInfo icon={<Mail size={16} />} text={contactInfo.email} />

                <li className="pt-4">
                  <Link to="/contact">
                    <Button variant="outline" className="h-10 px-4 rounded-full border-zinc-700 bg-transparent text-zinc-300 hover:text-white hover:bg-white/5 hover:border-zinc-500 transition-all w-full justify-between group">
                      <span className="text-sm">Get Directions</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section - Linear Style */}
        <div className="border-y border-white/5 py-12 mb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-heading font-bold text-white mb-2">Join our Weekly Newsletter</h3>
              <p className="text-zinc-500 text-sm">Updates on events, sermons, and community stories.</p>
            </div>

            <div className="w-full lg:w-auto max-w-md flex relative">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full lg:w-80 h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-pfcu-primary/50 focus:ring-1 focus:ring-pfcu-primary/20 transition-all pr-24"
              />
              <Button className="absolute right-1 top-1 bottom-1 h-8 px-4 bg-white text-zinc-950 hover:bg-zinc-200 rounded-md text-xs font-semibold shadow-sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600 font-medium">
          <p>&copy; {new Date().getFullYear()} PFCU. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="#" className="hover:text-zinc-400 transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-zinc-400 transition-colors">Terms</Link>
            <span className="flex items-center gap-1.5">
              Made with <Heart size={10} className="text-rose-500 fill-rose-500" /> in Christ
            </span>
          </div>
        </div>
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
    className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-pfcu-primary hover:text-white hover:border-pfcu-primary transition-all duration-300"
  >
    {icon}
  </a>
);

const FooterLink = ({ to, label }: { to: string, label: string }) => (
  <li>
    <Link
      to={to}
      className="text-zinc-400 text-sm hover:text-white hover:translate-x-0.5 inline-block transition-all duration-200"
    >
      {label}
    </Link>
  </li>
);

const ServiceTime = ({ day, time, label }: { day: string, time: string, label: string }) => (
  <li className="flex flex-col gap-0.5">
    <span className="text-white text-sm font-medium">{label}</span>
    <div className="flex items-baseline justify-between gap-4 text-xs">
      <span className="text-zinc-500">{day}</span>
      <span className="flex-1 h-px bg-zinc-800/50 border-t border-dashed border-zinc-800"></span>
      <span className="text-zinc-400 font-mono">{time}</span>
    </div>
  </li>
);

const ContactInfo = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <li className="flex items-center gap-3 text-zinc-400 text-sm">
    <span className="text-zinc-600">{icon}</span>
    <span>{text}</span>
  </li>
);

export default Footer;
