
import { useState } from "react";
import { Edit, FileText, Trash2, Clock, Mic, ListMusic } from "lucide-react";
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
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title & Description</TableHead>
            <TableHead>Preacher</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12">
                <div className="flex justify-center items-center gap-2 text-zinc-500">
                  <Clock className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading library...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredSermons.length > 0 ? (
            filteredSermons.map((sermon) => (
              <TableRow key={sermon.id} className="group">
                <TableCell className="max-w-[300px]">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate block">{sermon.title}</span>
                    {sermon.duration && (
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <ListMusic size={12} />
                        <span>{sermon.duration}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                      <Mic size={12} />
                    </div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{sermon.preacher}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-zinc-500 dark:text-zinc-400">
                  {new Date(sermon.sermon_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(sermon)}
                      className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={() => onDelete(sermon)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12">
                <div className="flex flex-col items-center justify-center text-zinc-500">
                  <FileText className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">{searchQuery ? "No matching sermons found" : "No sermons uploaded yet"}</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SermonsTable;
