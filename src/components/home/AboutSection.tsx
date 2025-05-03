
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const AboutSection = () => {
  const fadeInUp = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="section-padding py-24 bg-white"
    >
      <div className="container max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            className="order-2 md:order-1"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block py-1 px-3 rounded-full bg-pfcu-light text-pfcu-purple text-sm font-medium mb-4">Est. 2005</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-pfcu-purple">About Our Fellowship</h2>
            </motion.div>
            
            <motion.p 
              variants={fadeInUp}
              className="mb-6 text-gray-700 text-lg leading-relaxed"
            >
              The Pentecostal Fellowship of Caritas University (PFCU) has been a cornerstone of spiritual growth and community on campus since 2005. Our fellowship is built on the principles of faith, love, and service.
            </motion.p>
            
            <motion.p 
              variants={fadeInUp}
              className="mb-8 text-gray-700 text-lg leading-relaxed"
            >
              We are a vibrant community of believers committed to the spiritual development of students through various units and activities. With 16 different ministry units, there's a place for everyone to serve and grow.
            </motion.p>
            
            <motion.div variants={fadeInUp}>
              <Button 
                asChild 
                className="bg-pfcu-purple hover:bg-pfcu-dark text-white group flex items-center gap-2 text-lg px-6 py-6 h-auto shadow-md hover:shadow-xl transition-all"
              >
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="order-1 md:order-2 overflow-hidden rounded-2xl shadow-xl"
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { 
                opacity: 1, 
                scale: 1,
                transition: {
                  duration: 0.8,
                  ease: "easeOut"
                }
              }
            }}
          >
            <div className="relative h-96 w-full overflow-hidden group">
              {/* Replace with actual image when available */}
              <div className="absolute inset-0 bg-gradient-to-br from-pfcu-purple/80 to-pfcu-dark/90 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-1000">
                <span className="text-white text-7xl font-display font-bold">PFCU</span>
              </div>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-pfcu-dark to-transparent opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </motion.div>
        </div>
        
        {/* Statistics */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {[
            { value: "2005", label: "Year Founded" },
            { value: "16+", label: "Ministry Units" },
            { value: "1000+", label: "Student Members" },
            { value: "12+", label: "Years of Impact" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="p-6 rounded-xl bg-pfcu-light border border-pfcu-purple/10"
              variants={{
                hidden: { y: 40, opacity: 0 },
                visible: { 
                  y: 0, 
                  opacity: 1,
                  transition: {
                    duration: 0.6,
                    ease: "easeOut"
                  }
                }
              }}
            >
              <p className="text-3xl md:text-4xl font-display font-bold text-pfcu-purple mb-2">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
