
import { Button } from "@/components/ui/button";

interface DonationStatsToggleProps {
  showDetails: boolean;
  toggleDetails: () => void;
}

const DonationStatsToggle = ({ 
  showDetails, 
  toggleDetails 
}: DonationStatsToggleProps) => {
  return (
    <Button 
      variant="outline"
      onClick={toggleDetails}
      className="text-pfcu-purple hover:text-pfcu-dark hover:bg-gray-50"
    >
      {showDetails ? "Hide Detailed Statistics" : "Show Detailed Statistics"}
    </Button>
  );
};

export default DonationStatsToggle;
