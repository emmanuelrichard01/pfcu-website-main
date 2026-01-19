
import { useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { useUnitsData } from "../components/units/useUnitsData";
import UnitCard from "../components/units/UnitCard";
import JoinDialog from "../components/layout/JoinDialog";

const Departments = () => {
  const { unitsData } = useUnitsData();
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <MainLayout>
      {/* Modern Compact Hero (Matching Sermons.tsx) */}
      <div className="relative bg-pfcu-dark pt-32 pb-16 md:py-36 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-pfcu-primary/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-pfcu-secondary/10 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-pfcu-secondary text-sm font-medium mb-6">
              <Users size={14} />
              <span>Kingdom Service</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 tracking-tight">
              Our Departments
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              The fellowship operates through 9 strategic departments, each serving as a vital organ in the body of Christ. Find where you fit in.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4 md:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {unitsData.map((dept, index) => (
            <motion.div key={index} variants={itemVariants}>
              <UnitCard
                name={dept.name}
                description={dept.description}
                icon={dept.icon}
                activities={dept.activities}
                leaders={dept.leaders}
                onJoin={() => setJoinDialogOpen(true)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <JoinDialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen} />
    </MainLayout>
  );
};

export default Departments;
