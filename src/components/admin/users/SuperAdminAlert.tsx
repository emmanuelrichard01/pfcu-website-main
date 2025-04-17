
import React from "react";
import { Award } from "lucide-react";

interface SuperAdminAlertProps {
  isVisible: boolean;
}

const SuperAdminAlert = ({ isVisible }: SuperAdminAlertProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
      <div className="flex items-center gap-2">
        <Award className="text-amber-600 h-5 w-5" />
        <p className="text-amber-800">
          You are a Super Admin. You can manage all other admins.
        </p>
      </div>
    </div>
  );
};

export default SuperAdminAlert;
