
import { useState, useEffect } from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useLeadership } from "@/hooks/useLeadership";
import LeaderForm from "@/components/admin/leadership/LeaderForm";
import LeadersList from "@/components/admin/leadership/LeadersList";
import TenureForm from "@/components/admin/leadership/TenureForm";

interface LeaderData {
  id?: string;
  name: string;
  position: string;
  initial: string;
  bio?: string;
  profileImage?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface TenureData {
  year: string;
  declaration: string;
}

const AdminLeadership = () => {
  const { leaders, loading, addLeader, updateLeader, deleteLeader } = useLeadership();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLeader, setEditingLeader] = useState<LeaderData | null>(null);
  const [tenureData, setTenureData] = useState<TenureData>({
    year: "2024/2025",
    declaration: "Many but one in Christ"
  });
  
  const { toast } = useToast();

  const emptyLeader: LeaderData = {
    name: "",
    position: "",
    initial: "",
    bio: "",
    profileImage: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: ""
    }
  };

  useEffect(() => {
    // Load tenure data from localStorage
    const storedTenure = localStorage.getItem("pfcu_tenure");
    if (storedTenure) {
      const parsedTenure = JSON.parse(storedTenure);
      setTenureData({
        year: parsedTenure.year,
        declaration: parsedTenure.slogan || "Many but one in Christ" // Convert slogan to declaration
      });
    }
  }, []);

  const handleOpenDialog = (leader?: LeaderData) => {
    if (leader) {
      setEditingLeader({
        ...leader,
        socialMedia: {
          facebook: leader.socialMedia?.facebook || "",
          twitter: leader.socialMedia?.twitter || "",
          instagram: leader.socialMedia?.instagram || "",
          linkedin: leader.socialMedia?.linkedin || ""
        }
      });
    } else {
      setEditingLeader(null);
    }
    
    setIsDialogOpen(true);
  };

  const handleLeaderSubmit = async (data: LeaderData) => {
    setIsSubmitting(true);
    
    try {
      let success = false;
      
      if (editingLeader?.id) {
        // Update existing leader
        success = await updateLeader(editingLeader.id, data);
      } else {
        // Add new leader
        success = await addLeader(data);
      }
      
      if (success) {
        setIsDialogOpen(false);
        setEditingLeader(null);
      }
    } catch (error) {
      console.error("Leader save error:", error);
      toast({
        title: "Error",
        description: "There was an error saving the leader information.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLeader = async (leaderToDelete: LeaderData) => {
    if (leaderToDelete.id) {
      await deleteLeader(leaderToDelete.id);
    }
  };

  const handleTenureSubmit = (data: TenureData) => {
    setTenureData(data);
    
    // Store using the old "slogan" field for backward compatibility
    localStorage.setItem("pfcu_tenure", JSON.stringify({
      year: data.year,
      slogan: data.declaration
    }));
    
    toast({
      title: "Tenure information updated",
      description: "The tenure year and declaration have been updated."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Leadership Management</h1>
          <p className="text-gray-600">Manage fellowship leadership information</p>
        </div>
        
        <Button 
          className="bg-pfcu-purple hover:bg-pfcu-dark transition-colors duration-300"
          onClick={() => handleOpenDialog()}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Leader
        </Button>
      </div>

      {/* Tenure Information Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Tenure Information</h2>
        <TenureForm 
          initialData={tenureData} 
          onSubmit={handleTenureSubmit}
        />
      </div>

      {/* Leaders Table */}
      <div className="border rounded-lg overflow-hidden">
        <LeadersList 
          leaders={leaders}
          loading={loading}
          onEdit={handleOpenDialog}
          onDelete={handleDeleteLeader}
        />
      </div>

      {/* Add/Edit Leader Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {editingLeader?.id ? "Edit Leader Information" : "Add New Leader"}
            </DialogTitle>
            <DialogDescription>
              {editingLeader?.id 
                ? "Update the information for this leadership position"
                : "Add a new leader to the current tenure leadership"
              }
            </DialogDescription>
          </DialogHeader>
          
          <LeaderForm
            initialData={editingLeader || emptyLeader}
            isSubmitting={isSubmitting}
            onSubmit={handleLeaderSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeadership;
