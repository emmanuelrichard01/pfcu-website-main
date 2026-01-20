import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Facebook, Twitter as TwitterIcon, Instagram, Linkedin,
  Heart, BookOpen, Users, ArrowRight, Clock, Target, Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// --- Types ---
interface LeaderProps {
  name: string;
  role: string;
  bio?: string;
  initial: string;
  profileImage?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface TenureData {
  year: string;
  declaration: string;
}

interface AlumniTestimonyProps {
  name: string;
  graduationYear: string;
  role: string;
  testimony: string;
  initial: string;
}

// --- Icons ---
const MissionIcon = () => <Target className="w-8 h-8 text-pfcu-primary" />;
const VisionIcon = () => <Sparkles className="w-8 h-8 text-pfcu-secondary" />;
const CommunityIcon = () => <Users className="w-8 h-8 text-indigo-500" />;

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- State for Leadership ---
  const [leaders, setLeaders] = useState<LeaderProps[]>([]);
  const [tenureInfo, setTenureInfo] = useState<TenureData>({
    year: "2024/2025",
    declaration: "Many but one in Christ"
  });
  const [loading, setLoading] = useState(true);

  // --- Fetch Leadership Data ---
  useEffect(() => {
    const fetchLeaders = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('leaders')
          .select('*')
          .order('position_order', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const mappedLeaders: LeaderProps[] = data.map(leader => ({
            name: leader.name,
            role: leader.position,
            initial: leader.initial,
            bio: leader.bio || undefined,
            profileImage: leader.profile_image || undefined,
            socialMedia: {
              facebook: leader.facebook_url || undefined,
              twitter: leader.twitter_url || undefined,
              instagram: leader.instagram_url || undefined,
              linkedin: leader.linkedin_url || undefined,
            }
          }));
          setLeaders(mappedLeaders);
        } else {
          // Fallback defaults
          const defaultLeaders = [
            { name: "Emmanuel R.C. Moghalu", role: "Pastor/President", initial: "EM", bio: "Leading with vision and purpose" },
            { name: "Chisom C. Mbagwu", role: "Assistant Pastor/VP", initial: "CM", bio: "Supporting the team and community" },
            { name: "Joshua E. Aforue", role: "General Secretary", initial: "JA", bio: "Keeping records and documentation" },
            { name: "Emmanuella Y. Ufe", role: "Assistant General Secretary", initial: "EU", bio: "Managing resources and finances" },
            { name: "Dorci F. Donald", role: "P.R.O & Provost", initial: "DD", bio: "Maintaining public relations" },
            { name: "Samuel C. Oyenze", role: "Financial Secretary", initial: "SO", bio: "Ensuring order and discipline" }
          ];
          setLeaders(defaultLeaders);
        }
      } catch (error) {
        console.error("Error fetching leaders:", error);
      } finally {
        setLoading(false);
      }
    };

    const storedTenure = localStorage.getItem("pfcu_tenure");
    if (storedTenure) {
      const parsedTenure = JSON.parse(storedTenure);
      setTenureInfo({
        year: parsedTenure.year,
        declaration: parsedTenure.slogan || parsedTenure.declaration || "Many but one in Christ"
      });
    }

    fetchLeaders();
  }, []);

  // --- Static Data ---
  const timelineEvents = [
    { year: "2005", title: "Inception", description: "Founded by a small group of students seeking spiritual depth." },
    { year: "2010", title: "Expansion", description: "Establishment of specialized ministry departments." },
    { year: "2016", title: "First Conference", description: "Inaugural PFCU annual conference held." },
    { year: "2022", title: "Digital Era", description: "Launch of online resources and hybrid services." },
    { year: "2025", title: "20th Anniversary", description: "Celebrating two decades of impact and growth." }
  ];

  const alumniTestimonies = [
    { name: "Dr. Emmanuel Okonkwo", graduationYear: "2010", role: "Medical Doctor", testimony: "PFCU shaped my approach to medicine by teaching me to see patients not just as cases but as whole persons.", initial: "EO" },
    { name: "Ada Nwosu", graduationYear: "2012", role: "Corporate Lawyer", testimony: "The leadership skills I developed at PFCU have been invaluable. I learned to stand firm in my convictions.", initial: "AN" },
    { name: "Pastor Chinedu Eze", graduationYear: "2008", role: "Full-time Minister", testimony: "My calling to full-time ministry was confirmed during my time at PFCU.", initial: "CE" },
  ];

  return (
    <MainLayout>
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="md:w-1/2 z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pfcu-primary/5 border border-pfcu-primary/10 text-pfcu-primary text-sm font-semibold tracking-wide mb-8">
                <span className="w-2 h-2 rounded-full bg-pfcu-primary animate-pulse"></span>
                Who We Are
              </div>
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-zinc-900 leading-[1.1] mb-8 tracking-tight">
                Faith. <br />
                <span className="text-pfcu-primary">Fellowship.</span> <br />
                Future.
              </h1>
              <p className="text-lg md:text-xl text-zinc-500 leading-relaxed max-w-lg mb-10">
                We are a vibrant community of students and a home away from home, fostering spiritual growth, academic excellence, and leadership development in a Christ-centered environment.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/departments">
                  <Button className="h-12 px-8 rounded-full bg-pfcu-primary text-white hover:bg-pfcu-primary/90 shadow-lg shadow-pfcu-primary/20 transition-all hover:scale-105">
                    Join Our Community
                  </Button>
                </Link>
                <Button variant="outline" className="h-12 px-8 rounded-full border-zinc-200 hover:bg-zinc-50 text-zinc-900 transition-all hover:scale-105">
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="md:w-1/2 relative flex justify-center md:justify-end"
            >
              <div className="relative w-full max-w-md">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-zinc-200/50">
                  <img
                    src="/images/about-worship-bw.jpg"
                    alt="PFCU Worship Service"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <p className="font-heading text-2xl font-bold mb-2">"In His Presence."</p>
                    <p className="text-white/80 text-sm">Experience the depth of our worship.</p>
                  </div>
                </div>

                {/* Decorative "Fresh" Element - Overlapping */}
                <motion.div
                  initial={{ opacity: 0, scale: 0, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
                  className="absolute -left-12 top-12 z-20 hidden md:block"
                >
                  <div className="bg-white p-4 rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 flex items-center gap-3 transform -rotate-6 hover:rotate-0 transition-transform duration-300 cursor-default">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-xl">
                      🌱
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 text-sm">Growing Together</p>
                      <p className="text-xs text-zinc-500">In Faith & Love</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-pfcu-secondary/20 rounded-full blur-3xl z-[-1]"></div>
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-pfcu-primary/10 rounded-full blur-3xl z-[-1]"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- VALUES BENTO GRID --- */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-16 md:flex justify-between items-end">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-zinc-900 mb-6">Driven by Purpose</h2>
              <p className="text-zinc-500 text-lg">Our core values guide everything we do, shaping our community and our impact on campus and beyond.</p>
            </div>
            <div className="hidden md:block">
              <ArrowRight className="w-12 h-12 text-zinc-300 -rotate-45" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
            {/* Mission */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-white rounded-[2rem] p-10 shadow-sm border border-zinc-100 flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-pfcu-primary/5 rounded-full -mr-20 -mt-20 transition-all group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-pfcu-primary/10 flex items-center justify-center mb-8">
                  <MissionIcon />
                </div>
                <h3 className="text-2xl font-heading font-bold text-zinc-900 mb-4">Our Mission</h3>
                <p className="text-zinc-500 text-lg leading-relaxed max-w-md">
                  To create a vibrant spiritual community that nurtures personal faith, academic excellence, and leadership skills in every student.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-zinc-900 rounded-[2rem] p-10 shadow-sm flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black opacity-50"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8 backdrop-blur-sm">
                  <VisionIcon />
                </div>
                <h3 className="text-2xl font-heading font-bold text-white mb-4">Our Vision</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Empowering members to grow spiritually and develop leadership skills for global impact.
                </p>
              </div>
              <div className="relative z-10 mt-8">
                <div className="h-1 w-20 bg-pfcu-secondary rounded-full"></div>
              </div>
            </motion.div>

            {/* Community (Fills width on mobile, 1 col on desktop bottom) */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2rem] p-10 shadow-sm border border-zinc-100 flex flex-col justify-center relative overflow-hidden group"
            >
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full transition-all group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                  <CommunityIcon />
                </div>
                <h3 className="text-xl font-heading font-bold text-zinc-900 mb-2">Community</h3>
                <p className="text-zinc-500">
                  A place to belong, serve, and discover your unique gifts.
                </p>
              </div>
            </motion.div>

            {/* Stat/Extra */}
            {/* Stat/Extra */}
            <Link to="/departments" className="md:col-span-2 block">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-r from-pfcu-primary to-pfcu-dark rounded-[2rem] p-10 shadow-lg text-white flex items-center justify-between relative overflow-hidden h-full cursor-pointer"
              >
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10 max-w-lg">
                  <h3 className="text-3xl font-heading font-bold mb-4">Join 500+ Students</h3>
                  <p className="text-white/80">Be part of a movement that is transforming lives on campus.</p>
                </div>
                <ArrowRight className="relative z-10 w-10 h-10 text-white opacity-80" />
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* --- TIMELINE --- */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-20">
            <span className="text-pfcu-primary font-bold tracking-widest uppercase text-xs">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4 text-zinc-900">Milestones & History</h2>
          </div>

          <div className="relative border-l-2 border-zinc-100 ml-4 md:ml-0 md:pl-0 space-y-16">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative md:flex items-center gap-10 group"
              >
                {/* Dot */}
                <div className="absolute -left-[9px] top-0 md:relative md:left-auto md:top-auto w-4 h-4 rounded-full bg-white border-4 border-zinc-200 group-hover:border-pfcu-primary transition-colors z-10"></div>

                {/* Content */}
                <div className="ml-8 md:ml-0 md:w-1/3 md:text-right">
                  <span className="text-5xl font-bold text-zinc-100 group-hover:text-pfcu-primary/20 transition-colors font-heading">{event.year}</span>
                </div>
                <div className="ml-8 md:ml-0 md:w-2/3 pt-2 md:pt-0">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">{event.title}</h3>
                  <p className="text-zinc-500">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LEADERSHIP --- */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4 border-pfcu-primary/20 text-pfcu-primary bg-pfcu-primary/5 rounded-full px-4 py-1">{tenureInfo.year} Tenure</Badge>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-zinc-900 mb-6">Meet Our Leaders</h2>
            <p className="text-zinc-500 text-lg italic">"{tenureInfo.declaration}"</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-pfcu-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leaders.map((leader, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden group">
                    <CardContent className="p-0">
                      <div className="p-8 pb-0 flex justify-center">
                        <div className="relative w-32 h-32">
                          <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                            {leader.profileImage ? (
                              <AvatarImage src={leader.profileImage} alt={leader.name} className="object-cover" />
                            ) : (
                              <AvatarFallback className="bg-zinc-100 text-zinc-400 text-2xl font-bold">{leader.initial}</AvatarFallback>
                            )}
                          </Avatar>
                          <div className="absolute bottom-0 right-0 w-8 h-8 bg-pfcu-primary text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                            <span className="text-[10px] font-bold">{index + 1}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-8 text-center">
                        <h3 className="text-lg font-bold text-zinc-900 font-heading mb-1">{leader.name}</h3>
                        <p className="text-pfcu-primary text-sm font-medium mb-4">{leader.role}</p>

                        {leader.bio && (
                          <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-2 group-hover:line-clamp-none transition-all">
                            {leader.bio}
                          </p>
                        )}

                        <div className="flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                          {leader.socialMedia?.instagram && <a href={leader.socialMedia.instagram} className="text-zinc-300 hover:text-pfcu-primary"><Instagram size={18} /></a>}
                          {leader.socialMedia?.twitter && <a href={leader.socialMedia.twitter} className="text-zinc-300 hover:text-pfcu-primary"><TwitterIcon size={18} /></a>}
                          {leader.socialMedia?.linkedin && <a href={leader.socialMedia.linkedin} className="text-zinc-300 hover:text-pfcu-primary"><Linkedin size={18} /></a>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- ALUMNI --- */}
      <section className="py-24 bg-pfcu-dark text-white relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pfcu-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pfcu-secondary/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <span className="text-pfcu-secondary font-bold tracking-widest uppercase text-xs">Our Legacy</span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mt-2">Alumni Network</h2>
            </div>
            <p className="text-zinc-400 max-w-md text-right md:text-left">
              Our graduates are making waves across the globe, carrying the torch of excellence and faith in their respective fields.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {alumniTestimonies.map((alumni, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-6">
                  <Avatar className="h-12 w-12 border border-white/20">
                    <AvatarFallback className="bg-white/10 text-white font-bold">{alumni.initial}</AvatarFallback>
                  </Avatar>
                  <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-none font-normal">Class of {alumni.graduationYear}</Badge>
                </div>
                <p className="text-zinc-300 italic mb-6 leading-relaxed">"{alumni.testimony}"</p>
                <div>
                  <h4 className="font-heading font-bold text-lg">{alumni.name}</h4>
                  <p className="text-pfcu-secondary text-sm">{alumni.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <div className="inline-flex flex-col items-center">
              <h3 className="text-2xl font-heading font-bold mb-4">Are you an Alumnus?</h3>
              <Button className="rounded-full bg-white text-pfcu-dark hover:bg-zinc-200 px-8 h-12 font-bold">
                Reconnect With Us
              </Button>
            </div>
          </div>
        </div>
      </section>

    </MainLayout>
  );
};

// Missing Loader Import Fix
const Loader2 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default About;
