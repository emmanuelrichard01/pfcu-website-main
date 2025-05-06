
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
  Building,
  Eye,
  Edit
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Donation } from "@/types/donations";
import { useToast } from "@/components/ui/use-toast";

interface DonationTableProps {
  filteredDonations: Donation[];
  donations: Donation[];
  onDeleteDonation: (id: string) => Promise<boolean>;
  onUpdateStatus: (id: string, status: "completed" | "pending" | "failed") => Promise<boolean>;
}

const DonationTable = ({ 
  filteredDonations, 
  donations, 
  onDeleteDonation,
  onUpdateStatus 
}: DonationTableProps) => {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const handleStatusChange = async (id: string, newStatus: "completed" | "pending" | "failed") => {
    setIsChangingStatus(true);
    try {
      const success = await onUpdateStatus(id, newStatus);
      
      if (success) {
        toast({
          title: "Status updated",
          description: `Donation status changed to ${newStatus}.`,
        });
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update donation status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsChangingStatus(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setDeletingId(id);
    
    try {
      const success = await onDeleteDonation(id);
      
      if (success) {
        toast({
          title: "Donation deleted",
          description: "The donation has been deleted successfully.",
        });
      } else {
        throw new Error("Failed to delete donation");
      }
    } catch (error) {
      console.error("Error deleting donation:", error);
      toast({
        title: "Error deleting donation",
        description: "There was a problem deleting this donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };
  
  const viewDonationDetails = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsViewingDetails(true);
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
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDonations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No donations found
              </TableCell>
            </TableRow>
          ) : (
            filteredDonations.map((donation) => (
              <TableRow key={donation.id} className="group hover:bg-muted/50">
                <TableCell className="font-medium">
                  {donation.donorName}
                  {donation.email && (
                    <div className="text-xs text-muted-foreground mt-1">{donation.email}</div>
                  )}
                  {donation.phone && (
                    <div className="text-xs text-muted-foreground">{donation.phone}</div>
                  )}
                </TableCell>
                <TableCell className="font-medium">₦{donation.amount.toLocaleString()}</TableCell>
                <TableCell>{format(new Date(donation.date), "MMM dd, yyyy")}</TableCell>
                <TableCell>{donation.purpose}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getPaymentMethodIcon(donation.paymentMethod)}
                    <span>{donation.paymentMethod}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(donation.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => viewDonationDetails(donation)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                    
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
                          disabled={donation.status === "completed" || isChangingStatus}
                          className="text-green-600 focus:text-green-600"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(donation.id, "pending")}
                          disabled={donation.status === "pending" || isChangingStatus}
                          className="text-amber-600 focus:text-amber-600"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(donation.id, "failed")}
                          disabled={donation.status === "failed" || isChangingStatus}
                          className="text-red-600 focus:text-red-600"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Mark as Failed
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
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
                                onClick={() => handleDelete(donation.id)}
                                disabled={isDeleting && deletingId === donation.id}
                              >
                                {isDeleting && deletingId === donation.id ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                  </>
                                ) : (
                                  "Delete"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Donation Details Dialog */}
      <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected donation.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDonation && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Donor</h4>
                  <p className="text-base font-semibold">{selectedDonation.donorName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Amount</h4>
                  <p className="text-base font-semibold">₦{selectedDonation.amount.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Purpose</h4>
                  <p className="text-base">{selectedDonation.purpose}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                  <p className="text-base">{format(new Date(selectedDonation.date), "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Payment Method</h4>
                  <div className="flex items-center mt-1">
                    {getPaymentMethodIcon(selectedDonation.paymentMethod)}
                    <span>{selectedDonation.paymentMethod}</span>
                  </div>
                  {selectedDonation.paymentGateway && (
                    <p className="text-xs text-muted-foreground mt-1">{selectedDonation.paymentGateway}</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <div className="mt-1">{getStatusBadge(selectedDonation.status)}</div>
                </div>
              </div>
              
              {(selectedDonation.email || selectedDonation.phone) && (
                <>
                  <div className="h-px bg-border my-4" />
                  <div className="grid grid-cols-2 gap-4">
                    {selectedDonation.email && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                        <p className="text-base">{selectedDonation.email}</p>
                      </div>
                    )}
                    {selectedDonation.phone && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                        <p className="text-base">{selectedDonation.phone}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {selectedDonation.paymentReference && (
                <>
                  <div className="h-px bg-border my-4" />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Payment Reference</h4>
                    <p className="text-sm font-mono bg-muted p-2 rounded mt-1">{selectedDonation.paymentReference}</p>
                  </div>
                </>
              )}
            </div>
          )}
          
          <DialogFooter className="flex space-x-2 sm:justify-between">
            <div className="flex items-center text-sm">
              <span className="text-muted-foreground">ID: </span>
              <code className="ml-1 text-xs font-mono bg-muted px-1 py-0.5 rounded">
                {selectedDonation?.id.substring(0, 8)}...
              </code>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsViewingDetails(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonationTable;
