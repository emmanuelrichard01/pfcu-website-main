
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DonationHeaderProps {
  onAddClick: () => void;
  onExportClick: () => void;
}

const DonationHeader = ({ onAddClick, onExportClick }: DonationHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold font-display">Donations Management</h1>
        <p className="text-gray-600">Track and manage all donations to the fellowship.</p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="default" 
          className="bg-pfcu-purple hover:bg-pfcu-dark flex items-center gap-2"
          onClick={onAddClick}
        >
          <Plus size={16} />
          <span>Add Donation</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onExportClick}
        >
          <Download size={16} />
          <span>Export</span>
        </Button>
      </div>
    </div>
  );
};

export default DonationHeader;
