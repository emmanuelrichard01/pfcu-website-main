
import { motion } from "framer-motion";
import { ArrowRight, Flame, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  return (
    <section className="py-16 md:py-32 bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold text-pfcu-primary tracking-widest uppercase mb-3 block">
              Who We Are
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-zinc-900 dark:text-white mb-4 md:mb-6 tracking-tight">
              More Than Just a <span className="text-pfcu-primary">Fellowship</span>
            </h2>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
              PFCU is a cornerstone of spiritual growth at Caritas University. Since 2005, we have been raising a generation of spiritual giants and academic leaders.
            </p>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">

          {/* 1. Main Mission (Large) - With Established Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 lg:col-span-2 row-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-8 lg:p-10 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-pfcu-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-pfcu-primary/10 transition-colors" />

            <div className="relative z-10">
              <div className="bg-pfcu-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-pfcu-primary">
                <Flame size={24} />
              </div>
              <h3 className="text-3xl font-heading font-bold mb-4 text-zinc-900 dark:text-white">Our Mission</h3>
              <p className="text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
                "To raise a generation of spiritual giants who will take over the baton of leadership and make a difference in their world."
              </p>
            </div>

            <div className="mt-8 relative z-10 flex items-end justify-between">
              <Button variant="link" className="p-0 h-auto text-pfcu-primary font-semibold text-lg group-hover:translate-x-1 transition-transform" asChild>
                <Link to="/about">Read our full history <ArrowRight className="inline ml-1 w-4 h-4" /></Link>
              </Button>

              {/* Established Badge with Fire Emoji */}
              <div className="hidden sm:flex bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full items-center gap-2 border border-zinc-200 dark:border-zinc-700">
                <span className="text-xl">🔥</span>
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Est.</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">2005</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. Stat Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900 text-white rounded-3xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group shadow-lg"
          >
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
            <div className="relative z-10">
              <div className="text-5xl font-bold font-heading mb-2 text-pfcu-primary">500+</div>
              <p className="text-zinc-400 font-medium">Active Members</p>
            </div>
          </motion.div>

          {/* 3. Image Card 1 (Vertical) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 row-span-2 relative rounded-3xl overflow-hidden shadow-sm min-h-[300px] border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
            <img
              src="/images/about-community.jpg"
              alt="Community"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <p className="text-white font-heading font-bold text-xl">One Family</p>
            </div>
          </motion.div>

          {/* 4. Motto Card (Replaces Vision) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 bg-gradient-to-br from-pfcu-primary to-purple-700 rounded-3xl p-8 shadow-lg text-white relative overflow-hidden flex flex-col justify-center min-h-[200px]"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Users size={120} />
            </div>
            <div className="relative z-10 max-w-lg">
              <div className="flex items-center gap-3 mb-4 text-white/80">
                <Globe size={20} />
                <span className="uppercase tracking-wider text-xs font-bold">Our Motto</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-heading font-bold leading-tight flex flex-col sm:flex-row sm:items-baseline gap-3">
                "Many but one in Christ."
                {/* <Users className="inline-block w-8 h-8 opacity-80" /> */}
              </h3>
            </div>
          </motion.div>

          {/* 5. Stat Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center items-center text-center group hover:border-pfcu-primary/30 transition-colors"
          >
            <div className="text-5xl font-bold font-heading mb-2 text-zinc-900 dark:text-white group-hover:text-pfcu-primary transition-colors">9</div>
            <p className="text-zinc-500 font-medium">Amazing Departments</p>
          </motion.div>

          {/* 6. Extra Image 1 */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="md:col-span-1 relative rounded-3xl overflow-hidden shadow-sm h-full min-h-[200px]"
          >
            <img
              src="/images/about-worship-bw.jpg"
              alt="Worship"
              className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </motion.div> */}

          {/* 7. Extra Image 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="md:col-span-1 relative rounded-3xl overflow-hidden shadow-sm h-full min-h-[200px]"
          >
            <img
              src="/images/pfcu-photo.jpg"
              alt="Moment"
              className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;
