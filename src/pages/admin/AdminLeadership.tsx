
import { useState, useEffect } from "react";
import { Plus, Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useLeadership } from "@/hooks/useLeadership";
import { useDepartmentLeaders } from "@/hooks/useDepartmentLeaders";
import LeaderForm from "@/components/admin/leadership/LeaderForm";
import LeadersList from "@/components/admin/leadership/LeadersList";
import TenureForm from "@/components/admin/leadership/TenureForm";
import DepartmentLeadersList from "@/components/admin/leadership/DepartmentLeadersList";

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
  const { departmentLeaders, loading: deptLoading, updateDepartmentLeader } = useDepartmentLeaders();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLeader, setEditingLeader] = useState<LeaderData | null>(null);
  const [activeTab, setActiveTab] = useState("fellowship");
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
        declaration: parsedTenure.slogan || "Many but one in Christ"
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
        success = await updateLeader(editingLeader.id, data);
      } else {
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
          <p className="text-gray-600">Manage fellowship and department leadership</p>
        </div>

        {activeTab === "fellowship" && (
          <Button
            className="bg-pfcu-primary text-white hover:bg-pfcu-primary/90 transition-colors duration-300"
            onClick={() => handleOpenDialog()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Leader
          </Button>
        )}
      </div>

      {/* Tenure Information Section */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
        <div className="bg-zinc-50/50 dark:bg-zinc-900/50 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Tenure Information</h2>
          <p className="text-sm text-zinc-500 mt-1">Update the current leadership year and declaration.</p>
        </div>
        <div className="p-6">
          <TenureForm
            initialData={tenureData}
            onSubmit={handleTenureSubmit}
          />
        </div>
      </div>

      {/* Tabs for Leadership Types */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
          <TabsTrigger value="fellowship" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Fellowship Leaders
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Department Leaders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fellowship" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100">Fellowship Leaders</h2>
          </div>
          <LeadersList
            leaders={leaders}
            loading={loading}
            onEdit={handleOpenDialog}
            onDelete={handleDeleteLeader}
          />
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100">Department Leaders</h2>
              <p className="text-sm text-zinc-500 mt-1">Manage HOD and Assistant HOD for each department.</p>
            </div>
          </div>
          <DepartmentLeadersList
            leaders={departmentLeaders}
            loading={deptLoading}
            onUpdate={updateDepartmentLeader}
          />
        </TabsContent>
      </Tabs>

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
