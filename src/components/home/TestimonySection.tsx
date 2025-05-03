
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";

interface TestimonyCardProps {
  text: string;
  name: string;
  role: string;
  delay?: number;
}

const TestimonyCard = ({ text, name, role, delay = 0 }: TestimonyCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full border-none bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-white">
        <CardContent className="p-8 relative">
          <Quote className="absolute top-8 left-8 w-16 h-16 text-pfcu-gold opacity-10" />
          <div className="pt-10 pb-4">
            <p className="text-gray-700 italic mb-8 relative z-10 text-lg leading-relaxed">{text}</p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-pfcu-purple/20 flex items-center justify-center mr-4 text-pfcu-purple font-bold">
                {name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-pfcu-purple">{name}</p>
                <p className="text-sm text-gray-500">{role}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TestimonySection = () => {
  const testimonies = [
    {
      text: "PFCU has been my spiritual home away from home. Through the fellowship, I've grown in my faith and formed lifelong friendships that have supported me throughout my academic journey.",
      name: "Sarah Johnson",
      role: "4th Year Student",
    },
    {
      text: "Being part of the Choir Unit has helped me discover and develop my musical gifts while serving God. I'm grateful for the leadership opportunities and mentorship I've received at PFCU.",
      name: "Michael Okafor",
      role: "3rd Year Student",
    },
    {
      text: "The fellowship provided me with the spiritual foundation I needed during my university years. Now as an alumnus, I still cherish those moments and continue to apply the principles I learned.",
      name: "Grace Adebayo",
      role: "PFCU Alumni",
    },
  ];

  return (
    <section className="section-padding py-24 bg-gradient-to-b from-white to-pfcu-light">
      <div className="container max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-pfcu-purple/20 text-pfcu-purple text-sm font-medium mb-4">Testimonies</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-pfcu-purple">Hear From Our Members</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Real stories from real people whose lives have been impacted through their time at PFCU.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonies.map((testimony, index) => (
            <TestimonyCard 
              key={index} 
              {...testimony} 
              delay={index * 0.2} 
            />
          ))}
        </div>
        
        {/* Call to Action */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-700 text-lg mb-4">Ready to be part of our community?</p>
          <Link to="/contact" className="inline-flex items-center text-pfcu-purple hover:text-pfcu-gold font-semibold text-lg transition-colors">
            Share Your Own Testimony
            <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// Add missing import
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default TestimonySection;
