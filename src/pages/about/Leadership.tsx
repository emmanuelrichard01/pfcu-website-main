
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

interface LeaderProps {
  name: string;
  role: string;
  bio: string;
  initial: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
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
          <p className="text-gray-600 text-sm mb-4">{bio}</p>
          
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
  const executiveTeam = [
    {
      name: "John Doe",
      role: "Pastor/President",
      bio: "John has been leading the fellowship with vision and passion since 2022. He is completing his degree in Theology.",
      initial: "JD",
      socialMedia: {
        facebook: "https://facebook.com",
        instagram: "https://instagram.com/pfcu_"
      }
    },
    {
      name: "Sarah Johnson",
      role: "Vice President",
      bio: "Sarah oversees the daily operations of the fellowship and coordinates between different units.",
      initial: "SJ",
      socialMedia: {
        instagram: "https://instagram.com/pfcu_"
      }
    },
    {
      name: "Michael Okafor",
      role: "General Secretary",
      bio: "Michael handles all administrative tasks and maintains records for the fellowship.",
      initial: "MO",
      socialMedia: {
        instagram: "https://instagram.com/pfcu_"
      }
    },
    {
      name: "Grace Adebayo",
      role: "Treasurer",
      bio: "Grace manages the financial affairs of the fellowship with integrity and transparency.",
      initial: "GA",
      socialMedia: {
        instagram: "https://instagram.com/pfcu_"
      }
    }
  ];

  const unitLeaders = [
    {
      name: "David Nwachukwu",
      role: "Choir Director",
      bio: "David leads the choir unit with his exceptional musical talent and organizational skills.",
      initial: "DN"
    },
    {
      name: "Esther Obi",
      role: "Prayer Coordinator",
      bio: "Esther coordinates prayer activities and leads the prayer warriors unit.",
      initial: "EO"
    },
    {
      name: "James Eke",
      role: "Evangelism Leader",
      bio: "James leads outreach efforts both on campus and in surrounding communities.",
      initial: "JE"
    },
    {
      name: "Blessing Nwosu",
      role: "Welfare Coordinator",
      bio: "Blessing ensures the well-being of fellowship members through various support initiatives.",
      initial: "BN"
    },
    {
      name: "Joshua Okoro",
      role: "Technical Lead",
      bio: "Joshua manages all technical aspects of fellowship services and events.",
      initial: "JO"
    },
    {
      name: "Faith Uzodinma",
      role: "Bible Study Coordinator",
      bio: "Faith organizes and facilitates Bible study sessions for spiritual growth.",
      initial: "FU"
    }
  ];

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
          <h2 className="text-3xl font-display font-bold mb-8 text-center">Executive Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {executiveTeam.map((leader) => (
              <LeaderCard key={leader.name} {...leader} />
            ))}
          </div>
          
          <h2 className="text-3xl font-display font-bold mb-8 text-center mt-16">Unit Leaders</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {unitLeaders.map((leader) => (
              <LeaderCard key={leader.name} {...leader} />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Leadership;
