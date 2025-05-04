
import { motion } from "framer-motion";
import LeaderCard from "./leadership/LeaderCard";
import { useLeadershipData } from "./leadership/useLeadershipData";

const LeadershipSection = () => {
  const { leaders, loading, tenureInfo } = useLeadershipData();

  return (
    <section className="py-24 bg-gradient-to-b from-white to-pfcu-light">
      <div className="container px-4 mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold font-display mb-3">Our Leadership</h2>
          <div className="w-24 h-1 bg-pfcu-purple mx-auto mb-6"></div>
          <p className="text-xl font-medium text-pfcu-purple mb-2">{tenureInfo.year} Tenure Leadership</p>
          <p className="text-center max-w-2xl mx-auto mb-8 text-gray-600">
            <em className="text-pfcu-gold font-medium">"{tenureInfo.declaration}"</em> - Our leadership team is dedicated to guiding our fellowship
            through the academic year from June {tenureInfo.year.split('/')[0]} to June {tenureInfo.year.split('/')[1]}.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-pfcu-purple border-t-transparent animate-spin"></div>
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
