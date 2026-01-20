
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
      className="section-padding relative overflow-hidden bg-background py-24 md:py-32"
    >
      <div className="container max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
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
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-foreground tracking-tight">
                About Our <span className="text-pfcu-primary">Fellowship</span>
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
              We are a vibrant community of believers committed to the spiritual development of students through various Departments and activities. With 9 different ministry Departments, there's a place for everyone to serve and grow.
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

          {/* Hero Image / Bento Grid Element */}
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
            <div className="relative h-[550px] w-full overflow-hidden rounded-3xl shadow-2xl border border-white/20 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-pfcu-primary/20 to-transparent mix-blend-overlay z-10" />
              <img
                src="/images/about-community.jpg"
                alt="PFCU Fellowship Community"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent flex flex-col items-center justify-start p-10 z-20">
                <p className="font-heading font-medium text-3xl italic text-white drop-shadow-md text-center pt-8">"Many members, one body."</p>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block z-30 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <div className="flex items-center gap-4">
                <div className="bg-pfcu-secondary/20 p-3 rounded-full">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Established</p>
                  <p className="text-2xl font-bold text-pfcu-dark">2005</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Modern Bento Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {[
            { value: "9", label: "Specialized Departments", desc: "Find your place to serve" },
            { value: "1K+", label: "Student Members", desc: "Growing community" },
            { value: "50+", label: "Yearly Events", desc: "Worship & connection" },
            { value: "100%", label: "Jesus Centered", desc: "Our core foundation" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-pfcu-primary/20 hover:bg-white hover:shadow-xl transition-all duration-300 group"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                    ease: "easeOut"
                  }
                }
              }}
            >
              <p className="text-4xl md:text-5xl font-heading font-bold text-pfcu-primary mb-2 group-hover:scale-110 transition-transform origin-left">{stat.value}</p>
              <p className="text-lg font-bold text-gray-900">{stat.label}</p>
              <p className="text-sm text-muted-foreground">{stat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
