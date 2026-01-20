
import { useState } from "react";
import { motion } from "framer-motion";
import { Users, ArrowRight, Sparkles, Target, Heart } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { useUnitsData } from "../components/units/useUnitsData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import JoinDialog from "../components/layout/JoinDialog";

const Departments = () => {
  const { unitsData } = useUnitsData();
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const handleJoinClick = (departmentName: string) => {
    setSelectedDepartment(departmentName);
    setJoinDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setJoinDialogOpen(open);
    if (!open) setSelectedDepartment(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 40, damping: 15 } }
  };

  return (
    <MainLayout>
      {/* --- HERO SECTION --- */}
      <div className="relative bg-white pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pfcu-primary/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pfcu-secondary/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-6 max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-pfcu-primary text-sm font-semibold tracking-wide shadow-sm">
                <Sparkles size={14} className="fill-current" />
                <span>Find Your Place to Serve</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-zinc-900 tracking-tight leading-[1.1] mb-8"
            >
              Serve. <span className="text-zinc-300">Grow.</span> <span className="text-pfcu-primary">Lead.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed mb-12"
            >
              The fellowship operates through 9 strategic departments, each serving as a vital organ in the body of Christ. Discover where your gifts can make an impact.
            </motion.p>
          </div>
        </div>
      </div>

      {/* --- DEPARTMENTS GRID --- */}
      <div className="bg-zinc-50/50 py-24 border-t border-zinc-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {unitsData.map((dept, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative bg-white rounded-[2rem] border border-zinc-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full overflow-hidden"
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-pfcu-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Card Header & Icon */}
                <div className="relative z-10 mb-6 flex justify-between items-start">
                  <div className="p-4 rounded-2xl bg-zinc-50 group-hover:bg-pfcu-primary/10 text-zinc-400 group-hover:text-pfcu-primary transition-all duration-500">
                    <dept.icon size={32} strokeWidth={1.5} />
                  </div>
                  <div className="bg-zinc-100 text-zinc-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest group-hover:bg-pfcu-primary group-hover:text-white transition-colors duration-300">
                    0{index + 1}
                  </div>
                </div>

                {/* Card Content */}
                <div className="relative z-10 flex-1">
                  <h3 className="text-2xl font-bold font-heading text-zinc-900 mb-3 group-hover:text-pfcu-primary transition-colors duration-300">
                    {dept.name}
                  </h3>
                  <p className="text-zinc-500 leading-relaxed mb-6 font-medium text-sm">
                    {dept.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {dept.activities.slice(0, 3).map((activity, i) => (
                      <span key={i} className="text-xs font-semibold px-2 py-1 bg-zinc-50 border border-zinc-100 rounded-md text-zinc-600">
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Leadership Section - INTEGRATED FROM DB */}
                <div className="relative z-10 mt-auto pt-6 border-t border-zinc-100">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Leadership</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {/* HOD */}
                    {dept.leaders.find(l => l.position.includes("Head of Department")) && (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-zinc-100">
                          <AvatarImage src={dept.leaders.find(l => l.position.includes("Head of Department"))?.image} className="object-cover" />
                          <AvatarFallback className="text-[10px] bg-pfcu-primary/5 text-pfcu-primary font-bold">
                            {dept.leaders.find(l => l.position.includes("Head of Department"))?.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-bold text-zinc-900 leading-none mb-0.5">
                            {dept.leaders.find(l => l.position.includes("Head of Department"))?.name}
                          </p>
                          <p className="text-[10px] text-pfcu-primary font-medium">Head of Department</p>
                        </div>
                      </div>
                    )}

                    {/* Assistant HOD */}
                    {dept.leaders.find(l => l.position.includes("Assistant")) && (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-zinc-100">
                          <AvatarImage src={dept.leaders.find(l => l.position.includes("Assistant"))?.image} className="object-cover" />
                          <AvatarFallback className="text-[10px] bg-zinc-50 text-zinc-400 font-bold">
                            {dept.leaders.find(l => l.position.includes("Assistant"))?.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-bold text-zinc-900 leading-none mb-0.5">
                            {dept.leaders.find(l => l.position.includes("Assistant"))?.name}
                          </p>
                          <p className="text-[10px] text-zinc-400 font-medium">Assistant Head</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleJoinClick(dept.name)}
                    className="w-full bg-zinc-900 hover:bg-pfcu-primary text-white transition-all duration-300 rounded-xl h-10 font-bold text-xs tracking-wide shadow-lg shadow-zinc-200"
                  >
                    Join Department <ArrowRight className="ml-2 w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <JoinDialog
        open={joinDialogOpen}
        onOpenChange={handleDialogClose}
        departmentName={selectedDepartment}
      />
    </MainLayout>
  );
};

export default Departments;
