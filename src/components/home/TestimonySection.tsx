
import { Card, CardContent } from "@/components/ui/card";
import { Quote, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
      className="h-full"
    >
      <Card className="h-full border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 group">
        <CardContent className="p-8 relative flex flex-col h-full">
          <Quote className="text-pfcu-primary mb-6 w-10 h-10 opacity-80" />

          <p className="text-gray-300 italic mb-8 relative z-10 text-lg leading-relaxed flex-grow font-light">
            "{text}"
          </p>

          <div className="flex items-center pt-6 border-t border-white/10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pfcu-primary to-orange-500 flex items-center justify-center mr-4 text-white font-bold text-lg shadow-lg">
              {name.charAt(0)}
            </div>
            <div>
              <p className="font-heading font-bold text-white group-hover:text-pfcu-secondary transition-colors">{name}</p>
              <p className="text-sm text-gray-400">{role}</p>
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
    <section className="section-padding bg-pfcu-dark relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[#000000] z-0" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-pfcu-primary/10 rounded-full blur-[100px]" />

      <div className="container max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-4 rounded-full bg-white/5 border border-white/10 text-pfcu-secondary text-sm font-medium mb-4 tracking-wide">TESTIMONIALS</span>
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-white">Hear From Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-pfcu-secondary to-yellow-200">Family</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">Real stories from real people whose lives have been impacted through their time at PFCU.</p>
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
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-300 text-lg mb-4">Ready to be part of our community?</p>
          <Link to="/contact" className="inline-flex items-center text-white hover:text-pfcu-secondary font-semibold text-lg transition-colors group">
            Share Your Own Testimony
            <ChevronRight className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonySection;
