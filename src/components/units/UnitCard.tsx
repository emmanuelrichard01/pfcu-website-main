
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface UnitProps {
  name: string;
  description: string;
  icon: React.ElementType;
  activities: string[];
  leaders: {name: string; position: string}[];
}

const UnitCard = ({ name, description, icon: Icon, activities, leaders }: UnitProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-pfcu-purple">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="text-pfcu-purple bg-pfcu-light p-4 rounded-full h-16 w-16 flex items-center justify-center">
              <Icon className="h-12 w-12" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 font-display">{name}</h3>
              <p className="mb-4 text-gray-700">{description}</p>
              
              <div className="mb-4">
                <h4 className="font-bold text-sm text-pfcu-purple mb-2 inline-flex items-center">
                  <span className="bg-pfcu-purple h-1 w-4 mr-2"></span>
                  Key Activities
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 pl-3">
                  {activities.map((activity, index) => (
                    <li key={index} className="text-sm">{activity}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-sm text-pfcu-purple mb-2 inline-flex items-center">
                  <span className="bg-pfcu-purple h-1 w-4 mr-2"></span>
                  Unit Leaders
                </h4>
                <ul className="space-y-1 text-gray-700 pl-3">
                  {leaders.map((leader, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{leader.name}</span> - {leader.position}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UnitCard;
