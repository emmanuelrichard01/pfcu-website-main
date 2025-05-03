
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-pfcu-purple">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="text-pfcu-purple bg-pfcu-light p-4 rounded-full h-16 w-16 flex items-center justify-center">
              {icon}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 font-display">{name}</h3>
              <p className="mb-4 text-gray-700">{description}</p>
              
              <div className="mb-4">
                <h4 className="font-bold text-sm text-pfcu-purple mb-2 inline-flex items-center">
                  <span className="bg-pfcu-purple h-1 w-4 mr-2"></span>
                  Key Activities
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 pl-3">
                  {activities.map((activity, index) => (
                    <li key={index} className="text-sm">{activity}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-sm text-pfcu-purple mb-2 inline-flex items-center">
                  <span className="bg-pfcu-purple h-1 w-4 mr-2"></span>
                  Unit Leaders
                </h4>
                <ul className="space-y-1 text-gray-700 pl-3">
                  {leaders.map((leader, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{leader.name}</span> - {leader.position}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Units = () => {
  useEffect(() => {
    // Ensure page loads from the top
    window.scrollTo(0, 0);
  }, []);

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
          name: "Cell Team Unit",
          description: "Coordinates small groups and fellowships in various parts of the campus.",
          icon: <Globe className="h-12 w-12" />,
          activities: [
            "Cell group coordination",
            "Cell leader training",
            "Weekly cell meetings",
            "Cell group outreach"
          ],
          leaders: [
            {name: "Peter Adamu", position: "Coordinator"},
            {name: "Joy Nnamdi", position: "Assistant Coordinator"}
          ]
        },
        {
          name: "Editorial Unit",
          description: "Handles publications, articles, and written content for the fellowship.",
          icon: <Pencil className="h-12 w-12" />,
          activities: [
            "Newsletter production",
            "Content creation",
            "Bulletin management",
            "Documentation of events"
          ],
          leaders: [
            {name: "Samuel Obi", position: "Editor-in-Chief"},
            {name: "Favour Johnson", position: "Assistant Editor"}
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
          name: "Library Unit",
          description: "Maintains and manages the fellowship's collection of books, resources and archives.",
          icon: <Headphones className="h-12 w-12" />,
          activities: [
            "Resource cataloging",
            "Book lending system",
            "Resource acquisition",
            "Reading promotions"
          ],
          leaders: [
            {name: "Michael Ojo", position: "Librarian"},
            {name: "Blessing Eze", position: "Assistant Librarian"}
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
          name: "Sanctuary Unit",
          description: "Maintains the cleanliness and setup of the fellowship venue before and after services.",
          icon: <Shield className="h-12 w-12" />,
          activities: [
            "Venue cleaning",
            "Chair arrangement",
            "General maintenance",
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
          name: "Social Unit",
          description: "Organizes social events and activities to build fellowship among members.",
          icon: <Heart className="h-12 w-12" />,
          activities: [
            "Fellowship games",
            "Social outings",
            "Sports activities",
            "Fellowship dinner"
          ],
          leaders: [
            {name: "Victoria Chukwu", position: "Coordinator"},
            {name: "Philip Obi", position: "Assistant Coordinator"}
          ]
        },
        {
          name: "Children Unit",
          description: "Provides spiritual guidance and care for children during fellowship services.",
          icon: <MessageSquare className="h-12 w-12" />,
          activities: [
            "Children's church",
            "Bible lessons",
            "Creative activities",
            "Children's outings"
          ],
          leaders: [
            {name: "Dr. Esther Johnson", position: "Head Teacher"},
            {name: "Pastor Mike Okafor", position: "Assistant Teacher"}
          ]
        },
        {
          name: "Decorating Unit",
          description: "Responsible for beautifying the fellowship venue for services and special events.",
          icon: <Megaphone className="h-12 w-12" />,
          activities: [
            "Venue decoration",
            "Aesthetic planning",
            "Seasonal themes",
            "Special event setups"
          ],
          leaders: [
            {name: "Joy Nwankwo", position: "Lead Decorator"},
            {name: "Paul Eze", position: "Assistant Decorator"}
          ]
        }
      ]
    }
  ];

  return (
    <MainLayout>
      {/* Hero section with parallax effect */}
      <section className="relative bg-pfcu-purple overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-pfcu-dark/90 to-pfcu-purple/90"></div>
        </div>
        <div className="container mx-auto relative z-10 py-20 md:py-28 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Ministry Units
            </h1>
            <p className="text-xl text-center max-w-3xl mx-auto text-white/90">
              16 specialized units working together to fulfill the vision of PFCU.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="Worship" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 bg-pfcu-light p-1 rounded-lg">
              {unitsData.map((category) => (
                <TabsTrigger 
                  key={category.category} 
                  value={category.category}
                  className="data-[state=active]:bg-pfcu-purple data-[state=active]:text-white"
                >
                  {category.category}
                </TabsTrigger>
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

      <section className="py-16 bg-gradient-to-br from-pfcu-purple to-pfcu-dark text-white">
        <div className="container mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
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
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Units;
