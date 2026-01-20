import { useState, useEffect, useCallback } from "react";
import {
  BookOpen, Music, Church, Users, Video, Image,
  Headphones, Heart, School, Pencil, Megaphone,
  MessageSquare, HandHeart, Shield, Bell, Globe,
  LucideIcon, Palette, Baby, Smile
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface UnitLeader {
  name: string;
  position: string;
  course?: string;
  level?: string;
  image?: string;
}

export interface UnitData {
  name: string;
  description: string;
  icon: LucideIcon;
  activities: string[];
  leaders: UnitLeader[];
}

interface DepartmentLeaderData {
  department_name: string;
  hod_name: string | null;
  hod_course: string | null;
  hod_level: string | null;
  hod_image: string | null;
  assistant_hod_name: string | null;
  assistant_hod_course: string | null;
  assistant_hod_level: string | null;
  assistant_hod_image: string | null;
}

// Static department data (descriptions, icons, activities)
const staticDepartmentData: Omit<UnitData, 'leaders'>[] = [
  {
    name: "Christian Education Department",
    description: "Dedicated to the spiritual growth of the church through systematic biblical teaching and academic excellence. A merger of Bible Study, Library, and Academic units.",
    icon: BookOpen,
    activities: [
      "Weekly Bible Study sessions",
      "Managing the church library",
      "Organizing academic tutorials",
      "Discipleship classes"
    ]
  },
  {
    name: "Chaplaincy Department",
    description: "Ensures the smooth running of services through orderliness and sanctuary maintenance. Combines Sanctuary and Ushering units.",
    icon: Church,
    activities: [
      "Sanctuary cleaning and maintenance",
      "Ushering and protocol services",
      "Orderly conduct of services",
      "Welcoming first-time guests"
    ]
  },
  {
    name: "Beautification Department",
    description: "Responsible for the aesthetic appeal of the fellowship venue, creating an atmosphere conducive for worship. Formerly the Decorating Unit.",
    icon: Palette,
    activities: [
      "Venue decoration for services",
      "Special event stage design",
      "Maintenance of decorative items",
      "Creative set designs"
    ]
  },
  {
    name: "Media and Communications Department",
    description: "The voice and image of the fellowship, managing internal and external communications. Combines Editorial and Social Media units.",
    icon: MessageSquare,
    activities: [
      "Social media management",
      "Content creation and publications",
      "Photography and visual documentation",
      "Public relations"
    ]
  },
  {
    name: "Creative Arts and Performance Department",
    description: "Expressing the gospel through drama, dance, and creative arts. Formerly the Drama Unit.",
    icon: Smile,
    activities: [
      "Drama ministrations",
      "Spoken word poetry",
      "Dance presentations",
      "Play scriptwriting and directing"
    ]
  },
  {
    name: "Intercessory Department",
    description: "The spiritual powerhouse of the fellowship, standing in the gap through fervent prayer. Formerly the Prayer Unit.",
    icon: Shield,
    activities: [
      "Weekly prayer chain",
      "Intercession for the fellowship",
      "Organizing prayer retreats",
      "Vigil coordination"
    ]
  },
  {
    name: "Outreach and Care Department",
    description: "Extending the love of Christ to the community and caring for the welfare of members. Merges Evangelism, Welfare, and Cell units.",
    icon: HandHeart,
    activities: [
      "Campus evangelism drives",
      "Member welfare and visitation",
      "Hospital and prison outreaches",
      "Cell group coordination"
    ]
  },
  {
    name: "PFCU Little Angel's Department",
    description: "Nurturing the next generation in the way of the Lord. Formerly the Children's Unit.",
    icon: Baby,
    activities: [
      "Children's Sunday School",
      "Bible lessons and crafts",
      "Organizing children's day events",
      "Mentoring and guidance"
    ]
  },
  {
    name: "Worship Department",
    description: "Leading the fellowship in spirit-filled worship and managing technical production. Merges Choir and Technical units.",
    icon: Music,
    activities: [
      "Praise and worship leading",
      "Choir ministrations",
      "Sound and equipment management",
      "Music training"
    ]
  }
];

// Fallback leaders (used if database is unavailable)
const fallbackLeaders: Record<string, UnitLeader[]> = {
  "Christian Education Department": [
    { name: "Ogunmilade David Adebayo", position: "Head of Department", course: "Computer Engineering", level: "400 Level" },
    { name: "Esther Muomelite", position: "Assistant Head", course: "Computer Engineering", level: "300 Level" }
  ],
  "Chaplaincy Department": [
    { name: "TBD", position: "Head of Department" },
    { name: "Chiazor Nnadi Chisom Oluwatoyin", position: "Assistant Head", course: "English", level: "400 Level" }
  ],
  "Beautification Department": [
    { name: "Okeke Collins Ugochukwu", position: "Head of Department", course: "Computer Engineering", level: "500 Level" },
    { name: "John Ali Mary Ugbede-Ojo", position: "Assistant Head", course: "IRPM", level: "400 Level" }
  ],
  "Media and Communications Department": [
    { name: "Anthony Favour Ufedo-Ojo", position: "Head of Department", course: "Computer Science", level: "300 Level" },
    { name: "TBD", position: "Assistant Head" }
  ],
  "Creative Arts and Performance Department": [
    { name: "Ituen, Affon Bobby", position: "Head of Department", course: "Chemical Engineering", level: "500 Level" },
    { name: "Pam Valentina Yeipyeng", position: "Assistant Head", course: "Microbiology", level: "400 Level" }
  ],
  "Intercessory Department": [
    { name: "Oyetunde Segun Israel", position: "Head of Department", course: "Estate Management", level: "400 Level" },
    { name: "Ojong Bella Valentine", position: "Assistant Head", course: "Estate Management", level: "400 Level" }
  ],
  "Outreach and Care Department": [
    { name: "Daniel Donald-Ogar", position: "Head of Department", course: "Computer Engineering", level: "400 Level" },
    { name: "Monday Blessing Debekeme", position: "Assistant Head", course: "Microbiology", level: "400 Level" }
  ],
  "PFCU Little Angel's Department": [
    { name: "Dibie Great", position: "Head of Department", course: "Chemical Engineering", level: "500 Level" },
    { name: "Ujuetta Angel", position: "Assistant Head", course: "Microbiology", level: "400 Level" }
  ],
  "Worship Department": [
    { name: "Ezinwa-Mbalewe Chibeze", position: "Head of Department", course: "Electrical & Electronics Engineering", level: "400 Level" },
    { name: "Apeh Peace Ene", position: "Assistant Head", course: "Architecture", level: "400 Level" }
  ]
};

export const useUnitsData = () => {
  const [unitsData, setUnitsData] = useState<UnitData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaders = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('department_leaders' as any)
        .select('*');

      let leaderMap: Record<string, UnitLeader[]> = { ...fallbackLeaders };

      if (!error && data) {
        const dbLeaders = data as unknown as DepartmentLeaderData[];
        dbLeaders.forEach((leader) => {
          const leaders: UnitLeader[] = [];

          if (leader.hod_name) {
            leaders.push({
              name: leader.hod_name,
              position: "Head of Department",
              course: leader.hod_course || undefined,
              level: leader.hod_level || undefined,
              image: leader.hod_image || undefined
            });
          }

          if (leader.assistant_hod_name) {
            leaders.push({
              name: leader.assistant_hod_name,
              position: "Assistant Head",
              course: leader.assistant_hod_course || undefined,
              level: leader.assistant_hod_level || undefined,
              image: leader.assistant_hod_image || undefined
            });
          }

          if (leaders.length > 0) {
            leaderMap[leader.department_name] = leaders;
          }
        });
      }

      // Merge static data with dynamic leaders
      const mergedData: UnitData[] = staticDepartmentData.map((dept) => ({
        ...dept,
        leaders: leaderMap[dept.name] || fallbackLeaders[dept.name] || []
      }));

      setUnitsData(mergedData);
    } catch (error) {
      console.error("Error fetching department leaders:", error);
      // Use fallback data on error
      const fallbackData: UnitData[] = staticDepartmentData.map((dept) => ({
        ...dept,
        leaders: fallbackLeaders[dept.name] || []
      }));
      setUnitsData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaders();
  }, [fetchLeaders]);

  return { unitsData, loading, refetch: fetchLeaders };
};
