
import { motion } from "framer-motion";
import LeaderCard from "./leadership/LeaderCard";
import { useLeadershipData } from "./leadership/useLeadershipData";

const LeadershipSection = () => {
  const { leaders, loading, tenureInfo } = useLeadershipData();

  return (
    <section className="section-padding bg-background relative overflow-hidden py-16 md:py-24">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pfcu-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pfcu-secondary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6">

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-8 text-left">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-pfcu-primary font-bold tracking-widest uppercase text-xs mb-3 block">
              Stewardship
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight text-zinc-900 dark:text-white">
              Our <span className="text-pfcu-primary">Leadership</span>
            </h2>

            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-pfcu-primary/5 border border-pfcu-primary/20 rounded-lg text-pfcu-primary font-mono text-sm font-semibold mb-2">
                {tenureInfo.year} Tenure
              </span>
              <h3 className="text-xl font-heading font-medium italic text-zinc-800 dark:text-zinc-200">
                "{tenureInfo.declaration}"
              </h3>
            </div>

            <p className="text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-xl">
              Dedicated to guiding our fellowship through the academic year from June {tenureInfo.year.split('/')[0]} to June {tenureInfo.year.split('/')[1]}.
            </p>
          </motion.div>

          {/* Optional: Add a decorative element or link on the right if needed to balance, or just empty div to maintain flex structure if strictly copying others */}
          <div className="hidden md:block"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pfcu-primary"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.map((leader, index) => (
              <LeaderCard key={leader.name + index} leader={leader} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LeadershipSection;
