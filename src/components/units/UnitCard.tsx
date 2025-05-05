
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface UnitProps {
  name: string;
  description: string;
  icon: LucideIcon;
  activities: string[];
  leaders: {name: string; position: string}[];
}

const UnitCard = ({ name, description, icon: Icon, activities, leaders }: UnitProps) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-16">
            <div className="text-pfcu-purple bg-pfcu-light/70 p-4 rounded-full h-16 w-16 flex items-center justify-center">
              <Icon className="h-8 w-8" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-3 font-display text-gray-900">{name}</h3>
            <p className="mb-5 text-gray-700 leading-relaxed">{description}</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-sm text-pfcu-purple mb-3 flex items-center">
                  <span className="bg-pfcu-purple h-1 w-4 mr-2 rounded-full"></span>
                  Key Activities
                </h4>
                <ul className="space-y-2 text-gray-700">
                  {activities.map((activity, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <svg className="h-4 w-4 text-pfcu-purple/70 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-pfcu-purple mb-3 flex items-center">
                  <span className="bg-pfcu-purple h-1 w-4 mr-2 rounded-full"></span>
                  Unit Leaders
                </h4>
                <ul className="space-y-2 text-gray-700">
                  {leaders.map((leader, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{leader.name}</span>
                      <span className="text-gray-500 block text-xs">{leader.position}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitCard;
