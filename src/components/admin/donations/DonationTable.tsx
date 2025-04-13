
import { useState } from "react";
import { format } from "date-fns";
import { 
  MoreHorizontal, 
  Check, 
  Clock, 
  X,
  Trash2,
  CreditCard,
  Wallet,
  Building
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Donation } from "@/types/donations";
import { useToast } from "@/components/ui/use-toast";

interface DonationTableProps {
  filteredDonations: Donation[];
  donations: Donation[];
  onDeleteDonation: (id: string) => void;
}

const DonationTable = ({ filteredDonations, donations, onDeleteDonation }: DonationTableProps) => {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleStatusChange = (id: string, newStatus: "completed" | "pending" | "failed") => {
    const updatedDonations = donations.map(d => {
      if (d.id === id) {
        return { ...d, status: newStatus };
      }
      return d;
    });
    
    localStorage.setItem("pfcu_donations", JSON.stringify(updatedDonations));
    
    toast({
      title: "Status updated",
      description: `Donation status changed to ${newStatus}.`,
    });
    
    // Force a reload to refresh the data
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800"><Check size={14} className="mr-1" /> Completed</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-800"><Clock size={14} className="mr-1" /> Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-800"><X size={14} className="mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Bank Transfer":
        return <Building size={16} className="mr-1" />;
      case "Online Payment":
        return <CreditCard size={16} className="mr-1" />;
      case "Cash":
        return <Wallet size={16} className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Donor Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDonations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No donations found
              </TableCell>
            </TableRow>
          ) : (
            filteredDonations.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell className="font-medium">
                  {donation.donorName}
                  {donation.email && (
                    <div className="text-xs text-muted-foreground mt-1">{donation.email}</div>
                  )}
                  {donation.phone && (
                    <div className="text-xs text-muted-foreground">{donation.phone}</div>
                  )}
                </TableCell>
                <TableCell>₦{donation.amount.toLocaleString()}</TableCell>
                <TableCell>{format(new Date(donation.date), "MMM dd, yyyy")}</TableCell>
                <TableCell>{donation.purpose}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getPaymentMethodIcon(donation.paymentMethod)}
                    <span>{donation.paymentMethod}</span>
                  </div>
                  {donation.paymentGateway && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {donation.paymentGateway}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {donation.paymentReference || "-"}
                </TableCell>
                <TableCell>{getStatusBadge(donation.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(donation.id, "completed")}
                        disabled={donation.status === "completed"}
                      >
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(donation.id, "pending")}
                        disabled={donation.status === "pending"}
                      >
                        Mark as Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(donation.id, "failed")}
                        disabled={donation.status === "failed"}
                      >
                        Mark as Failed
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem 
                            onSelect={(e) => e.preventDefault()}
                            className="text-red-600 focus:text-red-600"
                          >
                            Delete Donation
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this donation record.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => onDeleteDonation(donation.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DonationTable;
