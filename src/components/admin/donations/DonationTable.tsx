

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
  Edit,
  FileText
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
        return (
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100 shadow-none">
            <Check size={12} className="mr-1" /> Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100 shadow-none">
            <Clock size={12} className="mr-1" /> Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-red-100 shadow-none">
            <X size={12} className="mr-1" /> Failed
          </Badge>
        );
      default:
        return <Badge variant="outline" className="text-zinc-500">{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Bank Transfer":
        return <Building size={14} className="text-zinc-400" />;
      case "Online Payment":
        return <CreditCard size={14} className="text-zinc-400" />;
      case "Cash":
        return <Wallet size={14} className="text-zinc-400" />;
      default:
        return <CreditCard size={14} className="text-zinc-400" />;
    }
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
            <TableHead className="font-semibold uppercase text-xs text-zinc-500 tracking-wider">Donor</TableHead>
            <TableHead className="font-semibold uppercase text-xs text-zinc-500 tracking-wider">Amount</TableHead>
            <TableHead className="font-semibold uppercase text-xs text-zinc-500 tracking-wider">Date</TableHead>
            <TableHead className="font-semibold uppercase text-xs text-zinc-500 tracking-wider">Purpose</TableHead>
            <TableHead className="font-semibold uppercase text-xs text-zinc-500 tracking-wider">Method</TableHead>
            <TableHead className="font-semibold uppercase text-xs text-zinc-500 tracking-wider">Status</TableHead>
            <TableHead className="text-right font-semibold uppercase text-xs text-zinc-500 tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDonations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-16">
                <div className="flex flex-col items-center justify-center text-zinc-500">
                  <div className="h-12 w-12 bg-zinc-100 rounded-full flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 opacity-40" />
                  </div>
                  <p className="text-sm font-medium text-zinc-900">No donations found</p>
                  <p className="text-xs text-zinc-500 mt-1">Try adjusting your filters or search query.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredDonations.map((donation) => (
              <TableRow key={donation.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                  {donation.donorName}
                  {donation.email && (
                    <div className="text-xs text-zinc-500 font-normal mt-0.5">{donation.email}</div>
                  )}
                </TableCell>
                <TableCell className="font-semibold text-zinc-700 dark:text-zinc-300">
                  ₦{donation.amount.toLocaleString()}
                </TableCell>
                <TableCell className="text-zinc-500 text-sm">
                  {format(new Date(donation.date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                    {donation.purpose}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    {getPaymentMethodIcon(donation.paymentMethod)}
                    <span>{donation.paymentMethod}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(donation.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => viewDonationDetails(donation)}
                      className="h-8 w-8 text-zinc-400 hover:text-zinc-900"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(donation.id, "completed")}
                          disabled={donation.status === "completed" || isChangingStatus}
                          className="text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
                        >
                          <Check className="mr-2 h-3.5 w-3.5" />
                          <span>Completed</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(donation.id, "pending")}
                          disabled={donation.status === "pending" || isChangingStatus}
                          className="text-amber-600 focus:text-amber-700 focus:bg-amber-50"
                        >
                          <Clock className="mr-2 h-3.5 w-3.5" />
                          <span>Pending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(donation.id, "failed")}
                          disabled={donation.status === "failed" || isChangingStatus}
                          className="text-red-600 focus:text-red-700 focus:bg-red-50"
                        >
                          <X className="mr-2 h-3.5 w-3.5" />
                          <span>Failed</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600 focus:text-red-700 focus:bg-red-50"
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" />
                              <span>Delete</span>
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
                                {isDeleting && deletingId === donation.id ? "Deleting..." : "Delete"}
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
            <DialogTitle className="font-heading text-xl">Donation Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected donation.
            </DialogDescription>
          </DialogHeader>

          {selectedDonation && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Donor</h4>
                  <p className="text-base font-medium text-zinc-900">{selectedDonation.donorName}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount</h4>
                  <p className="text-base font-medium text-zinc-900">₦{selectedDonation.amount.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Purpose</h4>
                  <p className="text-sm text-zinc-700 bg-zinc-100 inline-block px-2 py-1 rounded">{selectedDonation.purpose}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</h4>
                  <p className="text-sm text-zinc-700">{format(new Date(selectedDonation.date), "MMMM d, yyyy")}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Payment Method</h4>
                  <div className="flex items-center gap-1.5 text-sm">
                    {getPaymentMethodIcon(selectedDonation.paymentMethod)}
                    <span>{selectedDonation.paymentMethod}</span>
                  </div>
                  {selectedDonation.paymentGateway && (
                    <p className="text-xs text-zinc-500 mt-0.5">{selectedDonation.paymentGateway}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</h4>
                  <div>{getStatusBadge(selectedDonation.status)}</div>
                </div>
              </div>

              {(selectedDonation.email || selectedDonation.phone) && (
                <>
                  <div className="h-px bg-zinc-100" />
                  <div className="grid grid-cols-2 gap-4">
                    {selectedDonation.email && (
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Email</h4>
                        <p className="text-sm text-zinc-700">{selectedDonation.email}</p>
                      </div>
                    )}
                    {selectedDonation.phone && (
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Phone</h4>
                        <p className="text-sm text-zinc-700">{selectedDonation.phone}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {selectedDonation.paymentReference && (
                <>
                  <div className="h-px bg-zinc-100" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Payment Reference</h4>
                    <p className="text-xs font-mono bg-zinc-100 p-2 rounded text-zinc-600 block break-all">{selectedDonation.paymentReference}</p>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter className="flex sm:justify-between items-center bg-zinc-50 -mx-6 -mb-6 p-4 mt-2">
            <div className="flex items-center text-xs text-zinc-400">
              <span className="mr-2">ID:</span>
              <code className="font-mono">
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

