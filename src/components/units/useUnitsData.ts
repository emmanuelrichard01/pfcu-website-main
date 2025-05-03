import { 
  BookOpen, Music, Church, Users, Video, Image, 
  Headphones, Heart, School, Pencil, Megaphone, 
  MessageSquare, HandHeart, Shield, Bell, Globe,
  LucideIcon
} from "lucide-react";

export interface UnitData {
  name: string;
  description: string;
  icon: LucideIcon;
  activities: string[];
  leaders: { name: string; position: string }[];
}

export interface CategoryData {
  category: string;
  units: UnitData[];
}

export const useUnitsData = () => {
  const unitsData: CategoryData[] = [
    {
      category: "Worship",
      units: [
        {
          name: "Choir Unit",
          description: "The vocal and instrumental arm of the fellowship, leading worship during services and events.",
          icon: Music,
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
          icon: Church,
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
          description: "Focused on in-depth study and understanding of the scriptures, promoting spiritual growth and knowledge.",
          icon: BookOpen,
          activities: [
            "Weekly Bible study sessions",
            "Thematic Bible discussions",
            "Scripture memorization challenges",
            "Bible quizzes and competitions"
          ],
          leaders: [
            {name: "Ruth Eze", position: "Coordinator"},
            {name: "Caleb Okoro", position: "Assistant Coordinator"}
          ]
        }
      ]
    },
    {
      category: "Outreach",
      units: [
        {
          name: "Evangelism Unit",
          description: "Committed to spreading the gospel through various outreach programs and activities.",
          icon: Megaphone,
          activities: [
            "Campus evangelism",
            "Community outreaches",
            "Distribution of gospel tracts",
            "Organizing evangelistic events"
          ],
          leaders: [
            {name: "Samuel Ibe", position: "Coordinator"},
            {name: "Blessing Uche", position: "Assistant Coordinator"}
          ]
        },
        {
          name: "Missions Unit",
          description: "Dedicated to supporting and participating in local and international missions projects.",
          icon: Globe,
          activities: [
            "Supporting missionaries",
            "Organizing mission trips",
            "Raising funds for mission projects",
            "Awareness campaigns for global missions"
          ],
          leaders: [
            {name: "Grace Okeke", position: "Coordinator"},
            {name: "Peter Zion", position: "Assistant Coordinator"}
          ]
        }
      ]
    },
    {
      category: "Media",
      units: [
        {
          name: "Technical Unit",
          description: "Responsible for managing and maintaining the technical equipment and systems for fellowship events.",
          icon: Headphones,
          activities: [
            "Sound system setup and operation",
            "Lighting and visual effects",
            "Recording and broadcasting services",
            "Technical support for events"
          ],
          leaders: [
            {name: "Daniel Chukwu", position: "Coordinator"},
            {name: "Esther James", position: "Assistant Coordinator"}
          ]
        },
        {
          name: "Publicity Unit",
          description: "Focused on promoting fellowship events and activities through various media channels.",
          icon: Megaphone,
          activities: [
            "Creating promotional materials",
            "Managing social media accounts",
            "Distributing flyers and posters",
            "Public relations and media outreach"
          ],
          leaders: [
            {name: "Favour Eze", position: "Coordinator"},
            {name: "Miracle Okoro", position: "Assistant Coordinator"}
          ]
        },
        {
          name: "Graphics & Media Unit",
          description: "Dedicated to creating visual content and managing media resources for the fellowship.",
          icon: Image,
          activities: [
            "Designing graphics for events",
            "Creating video content",
            "Managing photo archives",
            "Developing multimedia presentations"
          ],
          leaders: [
            {name: "Cynthia Okeke", position: "Coordinator"},
            {name: "Joshua Peter", position: "Assistant Coordinator"}
          ]
        },
        {
          name: "Editorial Unit",
          description: "Responsible for creating written content and managing publications for the fellowship.",
          icon: Pencil,
          activities: [
            "Writing articles for the fellowship magazine",
            "Editing and proofreading content",
            "Managing the fellowship website",
            "Creating newsletters and email campaigns"
          ],
          leaders: [
            {name: "Ruth David", position: "Coordinator"},
            {name: "Caleb Joseph", position: "Assistant Coordinator"}
          ]
        },
        {
          name: "Social Media Unit",
          description: "Focused on engaging and growing the fellowship's online community through social media platforms.",
          icon: MessageSquare,
          activities: [
            "Creating engaging social media content",
            "Managing social media accounts",
            "Responding to online inquiries",
            "Analyzing social media metrics"
          ],
          leaders: [
            {name: "Samuel Ibe", position: "Coordinator"},
            {name: "Blessing Uche", position: "Assistant Coordinator"}
          ]
        },
        {
          name: "Video Unit",
          description: "Dedicated to producing high-quality video content for the fellowship's events and activities.",
          icon: Video,
          activities: [
            "Filming events and activities",
            "Editing and producing videos",
            "Managing video archives",
            "Creating promotional videos"
          ],
          leaders: [
            {name: "Grace Okeke", position: "Coordinator"},
            {name: "Peter Zion", position: "Assistant Coordinator"}
          ]
        }
      ]
    },
    {
      category: "Support",
      units: [
        {
          name: "Welfare Unit",
          description: "Committed to providing support and care for the physical and emotional well-being of fellowship members.",
          icon: HandHeart,
          activities: [
            "Providing assistance to members in need",
            "Organizing welfare programs",
            "Offering counseling and support",
            "Visiting sick members"
          ],
          leaders: [
            {name: "Esther Obi", position: "Coordinator"},
            {name: "Joseph Ade", position: "Assistant Coordinator"}
          ]
        },
        {
          name: "Security Unit",
          description: "Responsible for ensuring the safety and security of fellowship members and property during events and activities.",
          icon: Shield,
          activities: [
            "Providing security during events",
            "Managing access control",
            "Responding to security incidents",
            "Conducting safety training"
          ],
          leaders: [
            {name: "David Nwachukwu", position: "Coordinator"},
            {name: "Mary Okafor", position: "Assistant Coordinator"}
          ]
        },
        {
          name: "Ushering Unit",
          description: "Dedicated to providing a welcoming and orderly environment during fellowship services and events.",
          icon: Users,
          activities: [
            "Greeting and seating attendees",
            "Distributing materials",
            "Collecting offerings",
            "Maintaining order during services"
          ],
          leaders: [
            {name: "Ruth Eze", position: "Coordinator"},
            {name: "Caleb Okoro", position: "Assistant Coordinator"}
          ]
        }
      ]
    },
    {
      category: "Development",
      units: [
        {
          name: "Follow-Up Unit",
          description: "Focused on connecting with and integrating new members into the fellowship community.",
          icon: Heart,
          activities: [
            "Contacting new members",
            "Providing information about the fellowship",
            "Inviting new members to events",
            "Connecting new members with mentors"
          ],
          leaders: [
            {name: "Samuel Ibe", position: "Coordinator"},
            {name: "Blessing Uche", position: "Assistant Coordinator"}
          ]
        },
        {
          name: "Academic Unit",
          description: "Committed to supporting and promoting academic excellence among fellowship members.",
          icon: School,
          activities: [
            "Organizing tutorials and study groups",
            "Providing academic resources",
            "Mentoring students",
            "Recognizing academic achievements"
          ],
          leaders: [
            {name: "Grace Okeke", position: "Coordinator"},
            {name: "Peter Zion", position: "Assistant Coordinator"}
          ]
        },
        {
          name: "Protocol Unit",
          description: "Responsible for managing logistics and ensuring smooth operations during fellowship events and activities.",
          icon: Bell,
          activities: [
            "Coordinating transportation",
            "Managing accommodations",
            "Providing event support",
            "Ensuring smooth operations"
          ],
          leaders: [
            {name: "Cynthia Okeke", position: "Coordinator"},
            {name: "Joshua Peter", position: "Assistant Coordinator"}
          ]
        }
      ]
    }
  ];

  return { unitsData };
};
