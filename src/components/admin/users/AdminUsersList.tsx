
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Trash2, Shield, ShieldCheck, Mail, Calendar, AlertCircle } from "lucide-react";
import { AdminUser } from "@/types/admin";

interface AdminUsersListProps {
  isLoading: boolean;
  adminUsers: AdminUser[];
  currentUserIsSuperAdmin: boolean;
  currentUserId?: string | null;
  onToggleSuperAdmin: (adminId: string, userId: string, isSuperAdmin: boolean) => void;
  onDeleteAdmin: (adminId: string, userId: string, adminEmail: string) => void;
}

const AdminUsersList = ({
  isLoading,
  adminUsers,
  currentUserIsSuperAdmin,
  currentUserId,
  onToggleSuperAdmin,
  onDeleteAdmin
}: AdminUsersListProps) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-medium">Email</TableHead>
            <TableHead className="font-medium">Role</TableHead>
            <TableHead className="font-medium">Created At</TableHead>
            <TableHead className="text-right font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <div className="flex justify-center">
                  <div className="w-6 h-6 border-2 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : adminUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <AlertCircle className="h-8 w-8 text-gray-400" />
                  <p>No admin users found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            adminUsers.map((admin) => {
              const isSelf = admin.user_id === currentUserId;
              
              return (
                <TableRow key={admin.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {admin.email}
                    {isSelf && (
                      <Badge variant="outline" className="ml-2">You</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {admin.is_super_admin ? (
                      <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Super Admin</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1 text-gray-600">
                        <Shield className="h-3 w-3" />
                        <span>Admin</span>
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    {new Date(admin.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {currentUserIsSuperAdmin && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onToggleSuperAdmin(admin.id, admin.user_id, admin.is_super_admin)}
                          className={admin.is_super_admin ? "text-amber-500 hover:text-amber-600" : "text-gray-500"}
                          title={admin.is_super_admin ? "Demote to Admin" : "Promote to Super Admin"}
                        >
                          <Award className="h-4 w-4" />
                        </Button>
                        
                        {!isSelf && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => onDeleteAdmin(admin.id, admin.user_id, admin.email)}
                            title="Delete Admin"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminUsersList;
