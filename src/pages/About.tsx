
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Timeline } from "@/components/about/Timeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Facebook, Twitter as TwitterIcon, Instagram, Linkedin, Heart, BookOpen, Users } from "lucide-react";
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
const MissionIcon = () => <Heart className="w-8 h-8 text-pfcu-primary" />;
const VisionIcon = () => <BookOpen className="w-8 h-8 text-pfcu-primary" />;
const CommunityIcon = () => <Users className="w-8 h-8 text-pfcu-primary" />;

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
    { year: "2005", title: "Fellowship Founding", description: "PFCU was established by a small group of dedicated students seeking to create a spiritual community on campus." },
    { year: "2010", title: "Ministry Units Formed", description: "Various ministry units were established to cater to different aspects of campus spiritual life." },
    { year: "2016", title: "PFCU Conference Launch", description: "The first annual PFCU conference was held, bringing together students from various institutions." },
    { year: "2022", title: "Digital Ministry Launch", description: "The fellowship embraced technology, launching online services and resources for members." },
    { year: "2025", title: "20th Anniversary", description: "PFCU celebrates 20 years of impact on campus with special events and alumni reunions." }
  ];

  const alumniTestimonies = [
    { name: "Dr. Emmanuel Okonkwo", graduationYear: "2010", role: "Medical Doctor", testimony: "PFCU shaped my approach to medicine by teaching me to see patients not just as cases but as whole persons.", initial: "EO" },
    { name: "Ada Nwosu", graduationYear: "2012", role: "Corporate Lawyer", testimony: "The leadership skills I developed at PFCU have been invaluable. I learned to stand firm in my convictions.", initial: "AN" },
    { name: "Pastor Chinedu Eze", graduationYear: "2008", role: "Full-time Minister", testimony: "My calling to full-time ministry was confirmed during my time at PFCU.", initial: "CE" },
  ];

  return (
    <MainLayout>
      {/* --- HERO SECTION --- */}
      {/* --- HERO SECTION --- */}
      <div className="relative bg-pfcu-dark pt-32 pb-16 md:py-36 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-pfcu-primary/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-pfcu-secondary/10 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-pfcu-secondary text-sm font-medium mb-6">
              <BookOpen size={14} />
              <span>Who We Are</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 tracking-tight">
              About <span className="text-pfcu-primary">PFCU</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Foster spiritual growth, academic excellence, and leadership development in a Christ-centered community.
            </p>
          </motion.div>
        </div>
      </div>

      {/* --- MISSION & VISION (BENTO GRID) --- */}
      <section className="py-24 bg-zinc-50 dark:bg-black/50 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-zinc-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-zinc-500 font-medium tracking-wide uppercase text-sm">The pillars that sustain us</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-[800px] md:h-[600px]">
            {/* Mission Card - Wide (Top Left) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 relative group overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-10 hover:shadow-2xl hover:shadow-pfcu-primary/5 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-pfcu-primary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-pfcu-primary/10 transition-colors" />
              <div className="relative h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-pfcu-primary/10 text-pfcu-primary flex items-center justify-center mb-6">
                    <MissionIcon />
                  </div>
                  <h3 className="text-3xl font-display font-bold text-zinc-900 dark:text-white mb-4">Our Mission</h3>
                  <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-lg">
                    To create a vibrant spiritual community that nurtures personal faith, academic excellence, and leadership skills in every student.
                  </p>
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-pfcu-primary/20 to-transparent mt-8" />
              </div>
            </motion.div>

            {/* Vision Card - Tall (Right) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:row-span-2 relative group overflow-hidden rounded-[2.5rem] bg-zinc-900 dark:bg-black border border-zinc-800 p-10 flex flex-col text-white shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-zinc-950" />
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/10">
                  <VisionIcon />
                </div>
                <div className="mt-auto">
                  <h3 className="text-3xl font-display font-bold text-white mb-6">Our Vision</h3>
                  <p className="text-lg text-zinc-300 font-light leading-relaxed mb-8">
                    A fellowship where every member is empowered to grow spiritually and develop leadership skills for global impact.
                  </p>
                  <ul className="space-y-4 text-zinc-400 text-sm">
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-pfcu-primary" /> Global Influence
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Academic Giants
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Spiritual Depth
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Community Card - Wide (Bottom Left) */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2 relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-pfcu-primary to-purple-800 p-10 text-white hover:shadow-xl transition-shadow"
            >
              <div className="absolute top-0 right-0 w-full h-full bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
              <div className="relative z-10 flex items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur-md border border-white/20">
                    <CommunityIcon />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-3">Community</h3>
                  <p className="text-white/80 font-medium leading-relaxed max-w-sm">
                    Providing opportunities for service, worship, and engagement, helping members discover their gifts.
                  </p>
                </div>
                {/* Abstract Decoration */}
                <div className="hidden md:block w-32 h-32 opacity-20 bg-white rounded-full blur-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- HISTORY TIMELINE --- */}
      <section className="py-20 bg-zinc-50 border-y border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-pfcu-primary font-semibold tracking-wider uppercase text-sm">Our Jounrey</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 text-zinc-900">History & Milestones</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Timeline events={timelineEvents} />
          </div>
        </div>
      </section>

      {/* --- LEADERSHIP SECTION --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-pfcu-primary font-semibold tracking-wider uppercase text-sm">{tenureInfo.year} Tenure</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 text-zinc-900">Our Leadership</h2>
            <p className="text-zinc-500 mt-4 max-w-2xl mx-auto italic">"{tenureInfo.declaration}"</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-pfcu-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leaders.map((leader, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-zinc-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                      <Avatar className="w-24 h-24 border-4 border-zinc-50 shadow-sm mb-6">
                        {leader.profileImage ? (
                          <AvatarImage src={leader.profileImage} alt={leader.name} className="object-cover" />
                        ) : (
                          <AvatarFallback className="bg-zinc-100 text-zinc-500 text-xl font-bold font-display">{leader.initial}</AvatarFallback>
                        )}
                      </Avatar>

                      <h3 className="text-xl font-bold text-zinc-900 mb-1 font-heading">{leader.name}</h3>
                      <span className="inline-block px-3 py-1 bg-pfcu-primary/5 text-pfcu-primary text-xs font-semibold rounded-full mb-4">
                        {leader.role}
                      </span>

                      {leader.bio && <p className="text-sm text-zinc-500 mb-6 leading-relaxed line-clamp-3">{leader.bio}</p>}

                      <div className="flex gap-4 mt-auto">
                        {leader.socialMedia?.facebook && <a href={leader.socialMedia.facebook} className="text-zinc-400 hover:text-pfcu-primary transition-colors"><Facebook size={18} /></a>}
                        {leader.socialMedia?.twitter && <a href={leader.socialMedia.twitter} className="text-zinc-400 hover:text-pfcu-primary transition-colors"><TwitterIcon size={18} /></a>}
                        {leader.socialMedia?.instagram && <a href={leader.socialMedia.instagram} className="text-zinc-400 hover:text-pfcu-primary transition-colors"><Instagram size={18} /></a>}
                        {leader.socialMedia?.linkedin && <a href={leader.socialMedia.linkedin} className="text-zinc-400 hover:text-pfcu-primary transition-colors"><Linkedin size={18} /></a>}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- ALUMNI SECTION --- */}
      <section className="py-20 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-zinc-400 font-semibold tracking-wider uppercase text-sm">Legacy</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 text-white">Our Alumni Network</h2>
            <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">Making a difference in various sectors around the world.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {alumniTestimonies.map((alumni, i) => (
              <Card key={i} className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12 border border-zinc-700">
                      <AvatarFallback className="bg-zinc-800 text-zinc-300 font-bold">{alumni.initial}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-white text-lg leading-tight">{alumni.name}</h4>
                      <p className="text-zinc-500 text-xs uppercase tracking-wide">{alumni.role} • Class of {alumni.graduationYear}</p>
                    </div>
                  </div>
                  <p className="text-zinc-300 italic text-sm leading-relaxed">"{alumni.testimony}"</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-full px-8 h-12 font-semibold">
              Join Alumni Network
            </Button>
          </div>
        </div>
      </section>

    </MainLayout>
  );
};

export default About;
