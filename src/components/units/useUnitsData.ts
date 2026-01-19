import {
  BookOpen, Music, Church, Users, Video, Image,
  Headphones, Heart, School, Pencil, Megaphone,
  MessageSquare, HandHeart, Shield, Bell, Globe,
  LucideIcon, Palette, Baby, Smile
} from "lucide-react";

export interface UnitData {
  name: string;
  description: string;
  icon: LucideIcon;
  activities: string[];
  leaders: { name: string; position: string }[];
}

export const useUnitsData = () => {
  // Flattened structure for the 9 departments
  const unitsData: UnitData[] = [
    {
      name: "Christian Education Department",
      description: "Dedicated to the spiritual growth of the church through systematic biblical teaching and academic excellence. A merger of Bible Study, Library, and Academic units.",
      icon: BookOpen,
      activities: [
        "Weekly Bible Study sessions",
        "Managing the church library",
        "Organizing academic tutorials",
        "Discipleship classes"
      ],
      leaders: [
        { name: "Sis. Grace Okafor", position: "Head of Department" },
        { name: "Bro. David Adebayo", position: "Assistant Head" }
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
      ],
      leaders: [
        { name: "Bro. John Obi", position: "Head of Department" },
        { name: "Sis. Ruth Benson", position: "Assistant Head" }
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
      ],
      leaders: [
        { name: "Sis. Amaka Nnamdi", position: "Head of Department" },
        { name: "Bro. Peter Cole", position: "Assistant Head" }
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
      ],
      leaders: [
        { name: "Bro. Samuel Kalu", position: "Head of Department" },
        { name: "Sis. Sarah James", position: "Assistant Head" }
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
      ],
      leaders: [
        { name: "Sis. Joy Eze", position: "Head of Department" },
        { name: "Bro. Micheal Tobi", position: "Assistant Head" }
      ]
    },
    {
      name: "Intercessory Department",
      description: " The spiritual powerhouse of the fellowship, standing in the gap through fervent prayer. Formerly the Prayer Unit.",
      icon: Shield, // Shield represents spiritual covering/protection
      activities: [
        "Weekly prayer chain",
        "Intercession for the fellowship",
        "Organizing prayer retreats",
        "Vigil coordination"
      ],
      leaders: [
        { name: "Bro. Ezekiel Danjuma", position: "Head of Department" },
        { name: "Sis. Esther Paul", position: "Assistant Head" }
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
      ],
      leaders: [
        { name: "Sis. Blessing Okon", position: "Head of Department" },
        { name: "Bro. Daniel Etim", position: "Assistant Head" }
      ]
    },
    {
      name: "PFCU Little Angel’s Department",
      description: "Nurturing the next generation in the way of the Lord. Formerly the Children's Unit.",
      icon: Baby,
      activities: [
        "Children's Sunday School",
        "Bible lessons and crafts",
        "Organizing children's day events",
        "Mentoring and guidance"
      ],
      leaders: [
        { name: "Sis. Mary Johnson", position: "Head of Department" },
        { name: "Bro. Isaac George", position: "Assistant Head" }
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
      ],
      leaders: [
        { name: "Bro. Victor Chima", position: "Head of Department" },
        { name: "Sis. Grace Emmanuel", position: "Assistant Head" }
      ]
    }
  ];

  return { unitsData };
};
