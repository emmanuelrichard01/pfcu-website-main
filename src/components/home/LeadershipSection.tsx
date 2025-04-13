
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface LeaderCardProps {
  name: string;
  position: string;
  initial: string;
}

const LeaderCard = ({ name, position, initial }: LeaderCardProps) => {
  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-pfcu-gold">
        <AvatarFallback className="bg-pfcu-purple text-white text-2xl">
          {initial}
        </AvatarFallback>
      </Avatar>
      <h3 className="font-display text-xl font-bold mb-1">{name}</h3>
      <p className="text-pfcu-purple font-medium">{position}</p>
    </motion.div>
  );
};

const LeadershipSection = () => {
  const leaders = [
    {
      name: "Emmanuel R.C. Moghalu",
      position: "Pastor/President",
      initial: "EM",
    },
    {
      name: "Chisom C. Mbagwu",
      position: "Assistant Pastor/VP",
      initial: "CM",
    },
    {
      name: "Joshua E. Aforue",
      position: "General Secretary",
      initial: "JA",
    },
    {
      name: "Emmanuella Y. Ufe",
      position: "Asst. Secretary & Treasurer",
      initial: "EU",
    },
    {
      name: "Dorci F. Donald",
      position: "P.R.O & Financial Secretary",
      initial: "DD",
    },
    {
      name: "Samuel C. Oyenze",
      position: "Provost",
      initial: "SO",
    },
  ];

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
          <p className="section-subtitle">2024/2025 Tenure Leadership</p>
          <p className="text-center max-w-2xl mx-auto mb-8 text-gray-600">
            <em>Many but one in Christ</em> - Our leadership team is dedicated to guiding our fellowship
            through the academic year from June 2024 to June 2025.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {leaders.map((leader) => (
            <LeaderCard key={leader.name} {...leader} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
