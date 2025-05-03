
import { motion } from "framer-motion";
import LeaderCard from "./leadership/LeaderCard";
import { useLeadershipData } from "./leadership/useLeadershipData";

const LeadershipSection = () => {
  const { leaders, loading, tenureInfo } = useLeadershipData();

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Our Leadership</h2>
          <p className="section-subtitle">{tenureInfo.year} Tenure Leadership</p>
          <p className="text-center max-w-2xl mx-auto mb-8 text-gray-600">
            <em>{tenureInfo.declaration}</em> - Our leadership team is dedicated to guiding our fellowship
            through the academic year from June {tenureInfo.year.split('/')[0]} to June {tenureInfo.year.split('/')[1]}.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
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
