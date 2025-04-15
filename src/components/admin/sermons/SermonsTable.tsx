
import { useState } from "react";
import { Edit, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

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

interface SermonsTableProps {
  sermons: Sermon[];
  loading: boolean;
  onEdit: (sermon: Sermon) => void;
  onDelete: (sermon: Sermon) => void;
  searchQuery: string;
}

const SermonsTable = ({ 
  sermons, 
  loading, 
  onEdit, 
  onDelete, 
  searchQuery 
}: SermonsTableProps) => {
  const filteredSermons = sermons.filter(sermon =>
    sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sermon.preacher.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Preacher</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-4 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-500 mt-2">Loading sermons...</p>
              </TableCell>
            </TableRow>
          ) : filteredSermons.length > 0 ? (
            filteredSermons.map((sermon) => (
              <TableRow key={sermon.id}>
                <TableCell className="font-medium flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-gray-400" />
                  {sermon.title}
                </TableCell>
                <TableCell>{sermon.preacher}</TableCell>
                <TableCell>{new Date(sermon.sermon_date).toLocaleDateString()}</TableCell>
                <TableCell>{sermon.duration || 'N/A'}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" onClick={() => onEdit(sermon)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600"
                    onClick={() => onDelete(sermon)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                {searchQuery ? (
                  <p className="text-gray-500">No sermons match your search criteria</p>
                ) : (
                  <p className="text-gray-500">No sermons have been added yet</p>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SermonsTable;
