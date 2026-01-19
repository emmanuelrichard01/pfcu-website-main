
import { motion } from "framer-motion";
import LeaderCard from "./leadership/LeaderCard";
import { useLeadershipData } from "./leadership/useLeadershipData";

const LeadershipSection = () => {
  const { leaders, loading, tenureInfo } = useLeadershipData();

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pfcu-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pfcu-secondary/5 rounded-full blur-3xl -z-10" />

      <div className="container px-4 mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="text-pfcu-primary font-semibold tracking-wider uppercase mb-2 block">Stewardship</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Our Leadership</h2>

          <div className="inline-block relative">
            <div className="absolute inset-x-0 bottom-2 h-3 bg-pfcu-secondary/30 -z-10 transform -rotate-1"></div>
            <p className="text-2xl font-mono font-medium text-foreground relative z-10 px-2">{tenureInfo.year} Tenure</p>
          </div>

          <p className="text-center max-w-2xl mx-auto mt-8 text-muted-foreground text-lg leading-relaxed">
            <em className="text-pfcu-primary font-medium not-italic">"{tenureInfo.declaration}"</em><br />
            Dedicated to guiding our fellowship through the academic year from June {tenureInfo.year.split('/')[0]} to June {tenureInfo.year.split('/')[1]}.
          </p>
        </motion.div>

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
