
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, Facebook, Twitter as TwitterIcon, Instagram, Linkedin } from "lucide-react";

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

interface LeadersListProps {
  leaders: LeaderData[];
  loading: boolean;
  onEdit: (leader: LeaderData) => void;
  onDelete: (leader: LeaderData) => void;
}

const LeadersList = ({ leaders, loading, onEdit, onDelete }: LeadersListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-pfcu-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-zinc-500">Loading leaders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
            <TableHead className="font-semibold uppercase text-xs text-zinc-500 tracking-wider">Profile</TableHead>
            <TableHead className="font-semibold uppercase text-xs text-zinc-500 tracking-wider">Name</TableHead>
            <TableHead className="font-semibold uppercase text-xs text-zinc-500 tracking-wider">Position</TableHead>
            <TableHead className="font-semibold uppercase text-xs text-zinc-500 tracking-wider">Social Media</TableHead>
            <TableHead className="text-right font-semibold uppercase text-xs text-zinc-500 tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-16">
                <div className="flex flex-col items-center justify-center text-zinc-500">
                  <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                    <span className="text-xl font-bold opacity-40">L</span>
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">No leaders found</p>
                  <p className="text-xs text-zinc-500 mt-1">Add a new leader to get started.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            leaders.map((leader) => (
              <TableRow key={leader.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                <TableCell>
                  <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-700">
                    {leader.profileImage ? (
                      <AvatarImage src={leader.profileImage} alt={leader.name} />
                    ) : (
                      <AvatarFallback className="bg-pfcu-primary text-white font-medium text-sm">
                        {leader.initial}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">{leader.name}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                    {leader.position}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {leader.socialMedia?.facebook && <div className="p-1.5 rounded-full bg-zinc-50 dark:bg-zinc-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors cursor-default"><Facebook className="h-3.5 w-3.5" /></div>}
                    {leader.socialMedia?.twitter && <div className="p-1.5 rounded-full bg-zinc-50 dark:bg-zinc-800 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-900/20 dark:hover:text-sky-400 transition-colors cursor-default"><TwitterIcon className="h-3.5 w-3.5" /></div>}
                    {leader.socialMedia?.instagram && <div className="p-1.5 rounded-full bg-zinc-50 dark:bg-zinc-800 hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-900/20 dark:hover:text-pink-400 transition-colors cursor-default"><Instagram className="h-3.5 w-3.5" /></div>}
                    {leader.socialMedia?.linkedin && <div className="p-1.5 rounded-full bg-zinc-50 dark:bg-zinc-800 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-500 transition-colors cursor-default"><Linkedin className="h-3.5 w-3.5" /></div>}
                    {!leader.socialMedia?.facebook &&
                      !leader.socialMedia?.twitter &&
                      !leader.socialMedia?.instagram &&
                      !leader.socialMedia?.linkedin &&
                      <span className="text-xs text-zinc-400 italic">No socials</span>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      onClick={() => onEdit(leader)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => onDelete(leader)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadersList;
