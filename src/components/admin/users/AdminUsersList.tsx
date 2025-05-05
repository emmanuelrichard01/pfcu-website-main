
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
import { Award, Trash2 } from "lucide-react";
import { AdminUser } from "@/types/admin";

interface AdminUsersListProps {
  isLoading: boolean;
  adminUsers: AdminUser[];
  currentUserIsSuperAdmin: boolean;
  onToggleSuperAdmin: (adminId: string, userId: string, isSuperAdmin: boolean) => void;
  onDeleteAdmin: (adminId: string, userId: string, adminEmail: string) => void;
}

const AdminUsersList = ({
  isLoading,
  adminUsers,
  currentUserIsSuperAdmin,
  onToggleSuperAdmin,
  onDeleteAdmin
}: AdminUsersListProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                No admin users found
              </TableCell>
            </TableRow>
          ) : (
            adminUsers.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.email}</TableCell>
                <TableCell>
                  {admin.is_super_admin ? (
                    <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">Super Admin</Badge>
                  ) : (
                    <Badge variant="outline">Admin</Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(admin.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  {currentUserIsSuperAdmin && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onToggleSuperAdmin(admin.id, admin.user_id, admin.is_super_admin)}
                        className={admin.is_super_admin ? "text-amber-500" : "text-gray-500"}
                        title={admin.is_super_admin ? "Demote to Admin" : "Promote to Super Admin"}
                      >
                        <Award className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => onDeleteAdmin(admin.id, admin.user_id, admin.email)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminUsersList;
