
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

interface LeaderProps {
  name: string;
  role: string;
  bio?: string;
  initial: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface TenureData {
  year: string;
  slogan: string;
}

const LeaderCard = ({ name, role, bio, initial, socialMedia }: LeaderProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="bg-pfcu-purple h-24"></div>
        <div className="px-6 pb-6 -mt-12">
          <Avatar className="w-24 h-24 border-4 border-white mb-4">
            <AvatarFallback className="bg-pfcu-gold text-pfcu-dark text-xl font-bold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold mb-1">{name}</h3>
          <p className="text-pfcu-purple font-medium mb-3">{role}</p>
          {bio && <p className="text-gray-600 text-sm mb-4">{bio}</p>}
          
          {socialMedia && (
            <div className="flex gap-3">
              {socialMedia.facebook && (
                <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pfcu-purple">
                  <Facebook size={18} />
                </a>
              )}
              {socialMedia.twitter && (
                <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pfcu-purple">
                  <Twitter size={18} />
                </a>
              )}
              {socialMedia.instagram && (
                <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pfcu-purple">
                  <Instagram size={18} />
                </a>
              )}
              {socialMedia.linkedin && (
                <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pfcu-purple">
                  <Linkedin size={18} />
                </a>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Leadership = () => {
  const [leaders, setLeaders] = useState<LeaderProps[]>([]);
  const [tenureInfo, setTenureInfo] = useState<TenureData>({
    year: "2024/2025",
    slogan: "Many but one in Christ"
  });

  useEffect(() => {
    // Fetch leadership data from localStorage (in real app, this would be an API call)
    const storedLeaders = localStorage.getItem("pfcu_leaders");
    const storedTenure = localStorage.getItem("pfcu_tenure");
    
    if (storedLeaders) {
      const leaderData = JSON.parse(storedLeaders);
      // Map the data structure if needed
      const formattedLeaders = leaderData.map((leader: any) => ({
        name: leader.name,
        role: leader.position,
        initial: leader.initial,
        bio: "",
        socialMedia: {
          instagram: "https://instagram.com/pfcu_"
        }
      }));
      setLeaders(formattedLeaders);
    } else {
      // Fallback data if none exists
      setLeaders([
        {
          name: "Emmanuel R.C. Moghalu",
          role: "Pastor/President",
          bio: "Leading the fellowship with vision and passion since 2024.",
          initial: "EM",
          socialMedia: {
            instagram: "https://instagram.com/pfcu_"
          }
        },
        {
          name: "Chisom C. Mbagwu",
          role: "Assistant Pastor/VP",
          bio: "Assists in overseeing the daily operations of the fellowship.",
          initial: "CM",
          socialMedia: {
            instagram: "https://instagram.com/pfcu_"
          }
        },
        // ... and so on for other leaders
      ]);
    }
    
    if (storedTenure) {
      setTenureInfo(JSON.parse(storedTenure));
    }
  }, []);

  return (
    <MainLayout>
      <div className="bg-pfcu-light py-16 md:py-24">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-center mb-6">Our Leadership</h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-gray-700">
            Meet the dedicated team guiding our fellowship with vision and purpose.
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">Current Leadership Team</h2>
          <p className="text-center max-w-2xl mx-auto mb-8">
            <strong>{tenureInfo.year} Tenure</strong> - <em>{tenureInfo.slogan}</em>
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {leaders.map((leader) => (
              <LeaderCard key={leader.name} {...leader} />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Leadership;
