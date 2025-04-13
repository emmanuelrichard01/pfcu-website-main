
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { FileText, Search, Play, Download } from "lucide-react";
import { motion } from "framer-motion";

// Sample sermon data
const sampleSermons = [
  {
    id: 1,
    title: "The Power of Faith",
    preacher: "Pastor Emmanuel R.C. Moghalu",
    description: "Discover how faith can move mountains in your spiritual journey.",
    date: "April 2, 2025",
    duration: "45 min",
    audioUrl: "#" // In a real app, this would be the URL to the audio file
  },
  {
    id: 2,
    title: "Walking in Love",
    preacher: "Pastor Chisom C. Mbagwu",
    description: "Learn the principles of walking in love and how it transforms your relationships.",
    date: "March 26, 2025",
    duration: "38 min",
    audioUrl: "#"
  },
  {
    id: 3,
    title: "Divine Purpose",
    preacher: "Pastor Emmanuel R.C. Moghalu",
    description: "Understanding God's purpose for your life and how to align with it.",
    date: "March 19, 2025",
    duration: "42 min",
    audioUrl: "#"
  },
  {
    id: 4,
    title: "Spiritual Growth",
    preacher: "Pastor Chisom C. Mbagwu",
    description: "Keys to growing spiritually and maturing in your faith walk.",
    date: "March 12, 2025",
    duration: "40 min",
    audioUrl: "#"
  },
];

const SermonCard = ({ sermon }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card 
        className="overflow-hidden transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`h-40 bg-pfcu-purple/10 flex items-center justify-center transition-all duration-300 ${isHovered ? 'bg-pfcu-purple/20' : ''}`}>
          <FileText className={`w-16 h-16 text-pfcu-purple transition-all duration-300 ${isHovered ? 'scale-110' : ''}`} />
        </div>
        <CardHeader>
          <CardTitle>{sermon.title}</CardTitle>
          <CardDescription>{sermon.preacher}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{sermon.description}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{sermon.date}</span>
            <span>{sermon.duration}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button className="bg-pfcu-purple hover:bg-pfcu-dark">
            <Play className="mr-2 h-4 w-4" /> Listen
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const Sermons = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredSermons = searchTerm 
    ? sampleSermons.filter(sermon => 
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        sermon.preacher.toLowerCase().includes(searchTerm.toLowerCase()))
    : sampleSermons;

  return (
    <MainLayout>
      <div className="bg-pfcu-purple text-white py-20">
        <div className="container text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-display font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Sermons Archive
          </motion.h1>
          <motion.p 
            className="text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Listen to inspiring messages from our fellowship leaders
          </motion.p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <motion.h2 
              className="text-2xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Latest Sermons
            </motion.h2>
            <motion.div 
              className="relative w-full md:w-64"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                className="pl-9"
                placeholder="Search sermons..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSermons.map((sermon) => (
              <SermonCard key={sermon.id} sermon={sermon} />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Sermons;
