
import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube, Mail, Phone, MapPin, Heart, ArrowRight, Send } from "lucide-react";
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
    <footer className="bg-zinc-950 text-white relative overflow-hidden pt-20 pb-10 border-t border-white/5 font-sans">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-pfcu-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">

          {/* Brand Column */}
          <div className="md:col-span-5 lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors overflow-hidden p-1 shadow-lg shadow-black/20">
                <img src="/pfcu-logo.png" alt="PFCU Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-heading font-bold tracking-tight text-white group-hover:text-pfcu-primary transition-colors">PFCU</span>
            </Link>

            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Empowering the next generation through Christ-centered community, spiritual growth, and academic excellence.
            </p>

            <div className="flex gap-3">
              <SocialLink href="https://www.instagram.com/pfcu_/" icon={<Instagram size={18} />} label="Instagram" />
              <SocialLink href="https://x.com/Pfcu_" icon={<Twitter size={18} />} label="X (Twitter)" />
              <SocialLink href="https://t.me/PfcuCatalogue" icon={<Send size={18} />} label="Telegram" />
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6 opacity-90">Explore</h4>
              <ul className="space-y-3">
                <FooterLink to="/" label="Home" />
                <FooterLink to="/about" label="About Us" />
                <FooterLink to="/departments" label="Departments" />
                <FooterLink to="/events" label="Events" />
                <FooterLink to="/sermons" label="Sermons" />
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6 opacity-90">Service Times</h4>
              <ul className="space-y-4">
                <ServiceTime day="On Sundays" time="7:00 AM" label="Sunday Service" />
                <ServiceTime day="On Saturdays" time="8:30 AM" label="Departments Meeting" />
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6 opacity-90">Contact</h4>
              <ul className="space-y-4">
                <ContactInfo icon={<MapPin size={16} />} text={contactInfo.address} />
                <ContactInfo icon={<Phone size={16} />} text={contactInfo.phone} />
                <ContactInfo icon={<Mail size={16} />} text={contactInfo.email} />

                <li className="pt-4">
                  <Link to="/contact">
                    <Button variant="outline" className="h-9 px-4 rounded-full border-zinc-700 bg-transparent text-zinc-300 hover:text-white hover:bg-white/5 hover:border-zinc-500 transition-all w-full justify-between group">
                      <span className="text-xs font-semibold">Get Directions</span>
                      <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600 font-medium border-t border-white/5 pt-8">
          <p>&copy; {new Date().getFullYear()} PFCU. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-zinc-400 transition-colors">Terms of Service</Link>
            <span className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
              Made with <Heart size={10} className="text-rose-500 fill-rose-500 animate-pulse" /> in Christ
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper components
const SocialLink = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-pfcu-primary hover:text-white hover:border-pfcu-primary hover:-translate-y-1 transition-all duration-300 shadow-sm"
  >
    {icon}
  </a>
);

const FooterLink = ({ to, label }: { to: string, label: string }) => (
  <li>
    <Link
      to={to}
      className="text-zinc-400 text-sm hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
    >
      {label}
    </Link>
  </li>
);

const ServiceTime = ({ day, time, label }: { day: string, time: string, label: string }) => (
  <li className="flex flex-col gap-0.5">
    <span className="text-white text-sm font-medium">{label}</span>
    <div className="flex items-baseline gap-2 text-xs">
      <span className="text-zinc-500">{day}</span>
      <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
      <span className="text-zinc-400 font-mono">{time}</span>
    </div>
  </li>
);

const ContactInfo = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <li className="flex items-center gap-3 text-zinc-400 text-sm group">
    <span className="text-zinc-600 group-hover:text-pfcu-primary transition-colors">{icon}</span>
    <span className="group-hover:text-zinc-300 transition-colors">{text}</span>
  </li>
);

export default Footer;
