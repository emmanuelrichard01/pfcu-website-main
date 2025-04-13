
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, User } from "lucide-react";

interface RoleSelectionProps {
  onComplete: () => void;
}

const RoleSelection = ({ onComplete }: RoleSelectionProps) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleRoleSelection = (isAdmin: boolean) => {
    if (isAdmin) {
      navigate("/admin/login");
    } else {
      // Stay on the homepage
    }
    setOpen(false);
    onComplete();
    
    // Save the selection in localStorage so we don't show this again
    localStorage.setItem("pfcu_role_selected", "true");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-center">Welcome to PFCU</DialogTitle>
          <DialogDescription className="text-center">
            <span className="block font-semibold text-pfcu-gold italic text-lg mb-4">
              "Many but one in Christ"
            </span>
            Please select your role to continue:
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 pt-4">
          <Button
            variant="outline"
            className="flex flex-col items-center p-6 h-auto gap-2 hover:bg-pfcu-light hover:border-pfcu-purple border-2 transition-all"
            onClick={() => handleRoleSelection(false)}
          >
            <User size={36} className="text-pfcu-purple mb-2" />
            <span className="font-medium text-lg">Regular User</span>
            <span className="text-xs text-gray-500">Visit the main site</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center p-6 h-auto gap-2 hover:bg-pfcu-light hover:border-pfcu-purple border-2 transition-all"
            onClick={() => handleRoleSelection(true)}
          >
            <Shield size={36} className="text-pfcu-purple mb-2" />
            <span className="font-medium text-lg">Admin</span>
            <span className="text-xs text-gray-500">Login to admin panel</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelection;
