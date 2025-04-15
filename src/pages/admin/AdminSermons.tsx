
import { useState } from "react";
import SermonHeader from "@/components/admin/sermons/SermonHeader";
import SermonsTable from "@/components/admin/sermons/SermonsTable";
import AddSermonDialog from "@/components/admin/sermons/AddSermonDialog";
import EditSermonDialog from "@/components/admin/sermons/EditSermonDialog";
import DeleteSermonDialog from "@/components/admin/sermons/DeleteSermonDialog";
import { useSermons } from "@/hooks/useSermons";

interface Sermon {
  id: string;
  title: string;
  preacher: string;
  sermon_date: string;
  description: string | null;
  duration: string | null;
  audio_url: string | null;
  cover_image: string | null;
  created_at: string;
}

const AdminSermons = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  
  // Use the custom hook for sermon data and operations
  const { sermons, loading, fetchSermons, deleteSermon } = useSermons();
  
  const handleEdit = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedSermon) {
      deleteSermon(selectedSermon.id);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <SermonHeader 
        onAddClick={() => setIsAddDialogOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <SermonsTable 
        sermons={sermons}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchQuery={searchQuery}
      />

      <AddSermonDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSermonAdded={fetchSermons}
      />

      <EditSermonDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        sermon={selectedSermon}
        onSermonUpdated={fetchSermons}
      />

      <DeleteSermonDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default AdminSermons;
