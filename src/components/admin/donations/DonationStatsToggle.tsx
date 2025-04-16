
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
      variant="link" 
      onClick={toggleDetails}
      className="text-pfcu-purple p-0 hover:text-pfcu-dark hover:no-underline"
    >
      {showDetails ? "Hide Detailed Statistics" : "Show Detailed Statistics"}
    </Button>
  );
};

export default DonationStatsToggle;
