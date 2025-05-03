
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Timeline } from "@/components/about/Timeline";
import { motion } from "framer-motion";

const History = () => {
  useEffect(() => {
    // Ensure page loads from the top
    window.scrollTo(0, 0);
  }, []);

  const timelineEvents = [
    {
      year: "2005",
      title: "Fellowship Founding",
      description: "PFCU was established by a small group of dedicated students seeking to create a spiritual community on campus."
    },
    {
      year: "2007",
      title: "First Campus Revival",
      description: "The fellowship organized its first major campus revival, attracting hundreds of students."
    },
    {
      year: "2010",
      title: "Ministry Units Formed",
      description: "Various ministry units were established to cater to different aspects of campus spiritual life."
    },
    {
      year: "2013",
      title: "Fellowship Hall Construction",
      description: "The university allocated a dedicated space for the fellowship's activities."
    },
    {
      year: "2016",
      title: "PFCU Conference Launch",
      description: "The first annual PFCU conference was held, bringing together students from various institutions."
    },
    {
      year: "2019",
      title: "Community Outreach Expansion",
      description: "PFCU expanded its outreach programs to surrounding communities, providing spiritual and material support."
    },
    {
      year: "2022",
      title: "Digital Ministry Launch",
      description: "The fellowship embraced technology, launching online services and resources for members."
    },
    {
      year: "2025",
      title: "20th Anniversary Celebration",
      description: "PFCU celebrates 20 years of impact on campus with special events and alumni reunions."
    }
  ];

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <MainLayout>
      {/* Hero section with parallax effect */}
      <section className="relative bg-pfcu-dark overflow-hidden">
        <div 
          className="absolute inset-0 bg-[url('/lovable-uploads/542ae7a7-6ae0-4459-954e-0edf20905847.png')] bg-no-repeat bg-center opacity-10 bg-contain"
          style={{ filter: "blur(2px)" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-pfcu-dark/90 to-pfcu-dark/70"></div>
        <div className="container mx-auto relative z-10 py-20 md:py-28 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Our History
            </h1>
            <p className="text-xl text-center max-w-3xl mx-auto text-white/90">
              Tracing the journey of PFCU from its humble beginnings to its current impact.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto max-w-4xl px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl font-display font-bold mb-8 text-center"
            >
              <span className="inline-block border-b-4 border-pfcu-gold pb-2">The PFCU Story</span>
            </motion.h2>
            
            <motion.p variants={itemVariants} className="mb-6 text-gray-700 leading-relaxed text-lg">
              The Pentecostal Fellowship of Caritas University (PFCU) began in 2005 with just seven students who shared a vision for a vibrant spiritual community on campus. Meeting initially in dormitory rooms for prayer and Bible study, these pioneers laid the foundation for what would become one of the most influential student organizations at the university.
            </motion.p>
            
            <motion.p variants={itemVariants} className="mb-6 text-gray-700 leading-relaxed text-lg">
              As the fellowship grew, it faced numerous challenges, including limited meeting spaces and occasional opposition. However, the dedication of its members and the clear impact of their ministry soon earned recognition from university administrators, who eventually allocated a dedicated space for fellowship activities.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-gray-700 leading-relaxed text-lg">
              Over the years, PFCU has evolved from a small prayer group to a comprehensive spiritual force on campus, with 16 different ministry units serving various aspects of student life. Today, the fellowship continues to grow, maintaining its founding principles while adapting to meet the spiritual needs of a new generation of students.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative mb-12">
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pfcu-purple/50 to-transparent"></div>
              <h2 className="text-3xl font-display font-bold text-center bg-white relative inline-block mx-auto px-8 -mt-4">
                <span className="text-pfcu-purple">Our Journey</span>
              </h2>
            </div>
            <Timeline events={timelineEvents} />
          </motion.div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-16 bg-pfcu-light">
        <div className="container mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-display font-bold mb-8">
              <span className="inline-block border-b-4 border-pfcu-gold pb-2">Our Legacy Continues</span>
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-gray-700 leading-relaxed text-lg">
              Today's PFCU stands on the shoulders of generations of faithful students who built this ministry through dedication and sacrifice. We honor their legacy by continuing to advance the vision of spiritual growth, academic excellence, and impactful leadership.
            </p>
            <a 
              href="/about" 
              className="bg-pfcu-purple text-white hover:bg-pfcu-gold hover:text-pfcu-dark px-6 py-3 rounded-md transition-colors inline-flex items-center font-medium"
            >
              Learn More About PFCU Today
            </a>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default History;
