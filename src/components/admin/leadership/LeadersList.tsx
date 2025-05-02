
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
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Profile</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Social Media</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaders.map((leader) => (
          <TableRow key={leader.id} className="hover:bg-gray-50 transition-colors duration-200">
            <TableCell>
              <Avatar className="h-10 w-10">
                {leader.profileImage ? (
                  <AvatarImage src={leader.profileImage} alt={leader.name} />
                ) : (
                  <AvatarFallback className="bg-pfcu-purple text-white">
                    {leader.initial}
                  </AvatarFallback>
                )}
              </Avatar>
            </TableCell>
            <TableCell className="font-medium">{leader.name}</TableCell>
            <TableCell>{leader.position}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                {leader.socialMedia?.facebook && <Facebook className="h-4 w-4 text-gray-500" />}
                {leader.socialMedia?.twitter && <TwitterIcon className="h-4 w-4 text-gray-500" />}
                {leader.socialMedia?.instagram && <Instagram className="h-4 w-4 text-gray-500" />}
                {leader.socialMedia?.linkedin && <Linkedin className="h-4 w-4 text-gray-500" />}
                {!leader.socialMedia?.facebook && 
                  !leader.socialMedia?.twitter && 
                  !leader.socialMedia?.instagram && 
                  !leader.socialMedia?.linkedin && 
                  <span className="text-xs text-gray-400">None</span>}
              </div>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                className="hover:bg-gray-100 transition-colors duration-200"
                onClick={() => onEdit(leader)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                onClick={() => onDelete(leader)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LeadersList;
