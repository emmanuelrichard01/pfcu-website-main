
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";

interface AdminUsersHeaderProps {
  onAddAdmin: () => void;
}

const AdminUsersHeader = ({ onAddAdmin }: AdminUsersHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-pfcu-purple/10 rounded-lg">
          <Users className="h-6 w-6 text-pfcu-purple" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-display">Admin Users</h1>
          <p className="text-gray-600">Manage admin access to the PFCU panel</p>
        </div>
      </div>

      <Button
        className="bg-pfcu-primary hover:bg-pfcu-primary/90 text-white shadow-sm font-semibold transition-all hover:scale-[1.02]"
        onClick={onAddAdmin}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Add Admin
      </Button>
    </div>
  );
};

export default AdminUsersHeader;
