
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface LeaderCardProps {
  name: string;
  position: string;
  initial: string;
}

const LeaderCard = ({ name, position, initial }: LeaderCardProps) => {
  return (
    <div className="text-center">
      <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-pfcu-gold">
        <AvatarFallback className="bg-pfcu-purple text-white text-2xl">
          {initial}
        </AvatarFallback>
      </Avatar>
      <h3 className="font-display text-xl font-bold mb-1">{name}</h3>
      <p className="text-pfcu-purple font-medium">{position}</p>
    </div>
  );
};

const LeadershipSection = () => {
  const leaders = [
    {
      name: "John Doe",
      position: "Pastor/President",
      initial: "JD",
    },
    {
      name: "Jane Smith",
      position: "Assistant Pastor/VP",
      initial: "JS",
    },
    {
      name: "David Johnson",
      position: "General Secretary",
      initial: "DJ",
    },
    {
      name: "Mary Williams",
      position: "Treasurer",
      initial: "MW",
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">Our Leadership</h2>
          <p className="section-subtitle">Meet the team guiding our fellowship</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {leaders.map((leader) => (
            <LeaderCard key={leader.name} {...leader} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
