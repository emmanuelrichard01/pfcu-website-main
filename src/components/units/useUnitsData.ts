
import { 
  BookOpen, Music, Church, Users, Video, Image, 
  Headphones, Heart, School, Pencil, Megaphone, 
  MessageSquare, HandHeart, Shield, Bell, Globe 
} from "lucide-react";

export const useUnitsData = () => {
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

  return { unitsData };
};
