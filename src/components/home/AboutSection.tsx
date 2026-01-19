
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
      className="section-padding relative overflow-hidden bg-background"
    >
      <div className="container max-w-7xl mx-auto relative z-10">
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
              <span className="inline-block py-1 px-4 rounded-full bg-pfcu-primary/10 border border-pfcu-primary/20 text-pfcu-primary text-sm font-semibold tracking-wide mb-6">
                ESTABLISHED 2005
              </span>
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-foreground tracking-tight">
                About Our <span className="text-gradient">Fellowship</span>
              </h2>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="mb-6 text-muted-foreground text-xl leading-relaxed font-light"
            >
              The Pentecostal Fellowship of Caritas University (PFCU) has been a cornerstone of spiritual growth and community on campus since 2005. Our fellowship is built on the principles of faith, love, and service.
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="mb-10 text-muted-foreground text-lg leading-relaxed"
            >
              We are a vibrant community of believers committed to the spiritual development of students through various units and activities. With 16 different ministry units, there's a place for everyone to serve and grow.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <Button
                asChild
                className="rounded-full bg-pfcu-primary text-white hover:bg-pfcu-primary/90 text-lg px-8 py-6 h-auto shadow-lg shadow-pfcu-primary/25 transition-all hover:scale-105"
              >
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="order-1 md:order-2 relative"
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
            <div className="absolute inset-0 bg-gradient-to-tr from-pfcu-primary to-pfcu-secondary rounded-[2rem] transform rotate-3 scale-[1.03] opacity-50 blur-lg -z-10" />
            <div className="relative h-[500px] w-full overflow-hidden rounded-[2rem] shadow-2xl border border-white/20">
              <img
                src="/lovable-uploads/33b8fdb0-4798-480e-ab47-40a91d170deb.png"
                alt="PFCU Fellowship Worship"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col items-center justify-end p-8">
                <div className="text-white text-center mb-4">
                  <p className="font-heading font-medium text-2xl italic">"Many but one in Christ"</p>
                </div>
              </div>
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
              className="p-8 rounded-3xl bg-white/5 border border-border backdrop-blur-sm hover:border-pfcu-primary/30 transition-colors"
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
              <p className="text-4xl md:text-5xl font-heading font-bold text-gradient mb-3">{stat.value}</p>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
