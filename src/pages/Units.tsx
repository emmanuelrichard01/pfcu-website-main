
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, Music, Church, Users, Video, Image, 
  Headphones, Heart, School, Pencil, Megaphone, 
  MessageSquare, HandHeart, Shield, Bell, Globe 
} from "lucide-react";

interface UnitProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  activities: string[];
  leaders: {name: string; position: string}[];
}

const UnitCard = ({ name, description, icon, activities, leaders }: UnitProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="text-pfcu-purple">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">{name}</h3>
            <p className="mb-4 text-gray-700">{description}</p>
            
            <div className="mb-4">
              <h4 className="font-bold text-sm text-pfcu-purple mb-2">Key Activities:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {activities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-sm text-pfcu-purple mb-2">Unit Leaders:</h4>
              <ul className="space-y-1 text-gray-700">
                {leaders.map((leader, index) => (
                  <li key={index}>{leader.name} - <span className="font-medium">{leader.position}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Units = () => {
  const unitsData = [
    {
      category: "Worship",
      units: [
        {
          name: "Choir Unit",
          description: "The vocal and instrumental arm of the fellowship, leading worship during services and events.",
          icon: <Music className="h-12 w-12" />,
          activities: [
            "Sunday service worship",
            "Special ministrations",
            "Music training and workshops",
            "Annual choir concert"
          ],
          leaders: [
            {name: "David Nwachukwu", position: "Director"},
            {name: "Mary Okafor", position: "Assistant Director"}
          ]
        },
        {
          name: "Prayer Unit",
          description: "Dedicated to intercession for the fellowship, university, and nation through regular prayer meetings.",
          icon: <Church className="h-12 w-12" />,
          activities: [
            "Weekly prayer meetings",
            "All-night prayer sessions",
            "Prayer chain coordination",
            "Prayer retreats"
          ],
          leaders: [
            {name: "Esther Obi", position: "Coordinator"},
            {name: "Joseph Ade", position: "Assistant Coordinator"}
          ]
        },
        {
          name: "Bible Study Unit",
          description: "Focuses on in-depth study and teaching of the Word of God to build spiritual knowledge and maturity.",
          icon: <BookOpen className="h-12 w-12" />,
          activities: [
            "Weekly Bible study sessions",
            "Topical studies",
            "Book studies",
            "Bible quiz competitions"
          ],
          leaders: [
            {name: "Faith Uzodinma", position: "Coordinator"},
            {name: "Paul Eke", position: "Assistant Coordinator"}
          ]
        }
      ]
    },
    {
      category: "Outreach",
      units: [
        {
          name: "Evangelism Unit",
          description: "Focused on sharing the gospel both on campus and in surrounding communities.",
          icon: <Users className="h-12 w-12" />,
          activities: [
            "Campus evangelism",
            "Community outreaches",
            "Evangelism training",
            "Follow-up with new converts"
          ],
          leaders: [
            {name: "James Eke", position: "Leader"},
            {name: "Ruth Okonkwo", position: "Assistant Leader"}
          ]
        },
        {
          name: "Mission Unit",
          description: "Coordinates mission trips and partnerships with churches and organizations beyond the campus.",
          icon: <Globe className="h-12 w-12" />,
          activities: [
            "Mission trips planning",
            "Missionary support",
            "Cross-cultural training",
            "Mission awareness programs"
          ],
          leaders: [
            {name: "Peter Adamu", position: "Coordinator"},
            {name: "Joy Nnamdi", position: "Assistant Coordinator"}
          ]
        },
        {
          name: "Publicity Unit",
          description: "Handles communication and promotional activities to raise awareness about fellowship events.",
          icon: <Megaphone className="h-12 w-12" />,
          activities: [
            "Event publicity",
            "Social media management",
            "Graphic design",
            "Campus announcements"
          ],
          leaders: [
            {name: "Samuel Obi", position: "Head"},
            {name: "Favour Johnson", position: "Assistant Head"}
          ]
        }
      ]
    },
    {
      category: "Media",
      units: [
        {
          name: "Drama Unit",
          description: "Uses theatrical performances to communicate spiritual messages in an engaging way.",
          icon: <Video className="h-12 w-12" />,
          activities: [
            "Drama presentations at services",
            "Annual stage productions",
            "Acting workshops",
            "Script writing"
          ],
          leaders: [
            {name: "Chioma Ede", position: "Director"},
            {name: "Victor Okeke", position: "Assistant Director"}
          ]
        },
        {
          name: "Technical Unit",
          description: "Manages sound, lighting, and all technical aspects of fellowship services and events.",
          icon: <Image className="h-12 w-12" />,
          activities: [
            "Sound system operation",
            "Lighting management",
            "Livestreaming services",
            "Equipment maintenance"
          ],
          leaders: [
            {name: "Joshua Okoro", position: "Lead"},
            {name: "Grace Eze", position: "Assistant Lead"}
          ]
        },
        {
          name: "Media Unit",
          description: "Handles audio and video recording, photography, and digital content creation.",
          icon: <Headphones className="h-12 w-12" />,
          activities: [
            "Service recording",
            "Event photography",
            "Content editing",
            "Archive management"
          ],
          leaders: [
            {name: "Michael Ojo", position: "Director"},
            {name: "Blessing Eze", position: "Assistant Director"}
          ]
        }
      ]
    },
    {
      category: "Support",
      units: [
        {
          name: "Welfare Unit",
          description: "Caters to the well-being of fellowship members through various support initiatives.",
          icon: <HandHeart className="h-12 w-12" />,
          activities: [
            "Visitation to sick members",
            "Support for members in need",
            "Birthday celebrations",
            "Welfare packages distribution"
          ],
          leaders: [
            {name: "Blessing Nwosu", position: "Coordinator"},
            {name: "John Uche", position: "Assistant Coordinator"}
          ]
        },
        {
          name: "Ushering Unit",
          description: "Ensures order and decorum during services and events, welcoming visitors and members.",
          icon: <Bell className="h-12 w-12" />,
          activities: [
            "Service coordination",
            "Visitor welcome",
            "Seating arrangement",
            "Offering collection"
          ],
          leaders: [
            {name: "Peace Adeyemi", position: "Head Usher"},
            {name: "Daniel Okafor", position: "Assistant Head Usher"}
          ]
        },
        {
          name: "Protocol Unit",
          description: "Handles logistics and ensures smooth running of events and services.",
          icon: <Shield className="h-12 w-12" />,
          activities: [
            "VIP reception",
            "Event planning",
            "Venue preparation",
            "Security coordination"
          ],
          leaders: [
            {name: "Emmanuel Ike", position: "Lead"},
            {name: "Mercy Adebayo", position: "Assistant Lead"}
          ]
        }
      ]
    },
    {
      category: "Development",
      units: [
        {
          name: "Academic Unit",
          description: "Promotes academic excellence through tutorials, study groups, and resources.",
          icon: <School className="h-12 w-12" />,
          activities: [
            "Tutorial sessions",
            "Study groups",
            "Academic counseling",
            "Resource sharing"
          ],
          leaders: [
            {name: "Grace Okoli", position: "Coordinator"},
            {name: "John Adewale", position: "Assistant Coordinator"}
          ]
        },
        {
          name: "Literary Unit",
          description: "Fosters reading, writing, and critical thinking through literary activities and publications.",
          icon: <Pencil className="h-12 w-12" />,
          activities: [
            "Fellowship magazine",
            "Writing workshops",
            "Book reviews",
            "Poetry sessions"
          ],
          leaders: [
            {name: "Victoria Chukwu", position: "Editor-in-Chief"},
            {name: "Philip Obi", position: "Assistant Editor"}
          ]
        },
        {
          name: "Counseling Unit",
          description: "Provides spiritual and emotional guidance to members facing various challenges.",
          icon: <MessageSquare className="h-12 w-12" />,
          activities: [
            "One-on-one counseling",
            "Group therapy sessions",
            "Spiritual direction",
            "Life skills workshops"
          ],
          leaders: [
            {name: "Dr. Esther Johnson", position: "Head Counselor"},
            {name: "Pastor Mike Okafor", position: "Assistant Counselor"}
          ]
        },
        {
          name: "Love & Care Unit",
          description: "Focuses on building relationships and fostering a sense of family within the fellowship.",
          icon: <Heart className="h-12 w-12" />,
          activities: [
            "Fellowship gatherings",
            "Relationship seminars",
            "Social events",
            "Member integration"
          ],
          leaders: [
            {name: "Joy Nwankwo", position: "Coordinator"},
            {name: "Paul Eze", position: "Assistant Coordinator"}
          ]
        }
      ]
    }
  ];

  return (
    <MainLayout>
      <div className="bg-pfcu-light py-16 md:py-24">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-center mb-6">Ministry Units</h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-gray-700">
            16 specialized units working together to fulfill the vision of PFCU.
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto">
          <Tabs defaultValue="Worship" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
              {unitsData.map((category) => (
                <TabsTrigger key={category.category} value={category.category}>{category.category}</TabsTrigger>
              ))}
            </TabsList>
            
            {unitsData.map((category) => (
              <TabsContent key={category.category} value={category.category} className="space-y-8">
                {category.units.map((unit) => (
                  <UnitCard key={unit.name} {...unit} />
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section className="py-16 bg-pfcu-purple text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-6">Join a Ministry Unit</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Each ministry unit offers unique opportunities to serve and grow. Find where your gifts and passions align with our fellowship needs.
          </p>
          <a 
            href="#" 
            className="bg-white text-pfcu-purple hover:bg-pfcu-gold hover:text-pfcu-dark px-6 py-3 rounded-md transition-colors inline-flex items-center font-medium"
          >
            Discover Your Ministry Fit
          </a>
        </div>
      </section>
    </MainLayout>
  );
};

export default Units;
