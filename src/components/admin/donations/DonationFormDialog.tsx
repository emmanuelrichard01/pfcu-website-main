
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Donation } from "@/types/donations";
import { Plus, Save } from "lucide-react";

interface DonationFormDialogProps {
  onAddDonation: (donation: Omit<Donation, "id">) => Promise<boolean> | boolean;
}

const DonationFormDialog = ({ onAddDonation }: DonationFormDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [newDonation, setNewDonation] = useState<Omit<Donation, "id">>({
    donorName: "",
    amount: 0,
    date: format(new Date(), "yyyy-MM-dd"),
    purpose: "General Offering",
    status: "completed",
    paymentMethod: "Cash"
  });

  const handleAddDonation = async () => {
    if (!newDonation.donorName || newDonation.amount <= 0) {
      toast({
        title: "Validation error",
        description: "Please enter donor name and a valid amount.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onAddDonation(newDonation);

      if (result) {
        // Reset form
        setNewDonation({
          donorName: "",
          amount: 0,
          date: format(new Date(), "yyyy-MM-dd"),
          purpose: "General Offering",
          status: "completed",
          paymentMethod: "Cash"
        });

        setDialogOpen(false);

        toast({
          title: "Donation added successfully",
          description: `${newDonation.donorName}'s donation has been recorded.`
        });
      }
    } catch (error) {
      console.error("Error adding donation:", error);
      toast({
        title: "Error",
        description: "There was a problem adding the donation.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild id="add-donation-trigger">
        <Button className="bg-pfcu-primary text-white hover:bg-pfcu-primary/90 transition-all duration-300 transform hover:scale-105">
          <Plus className="mr-2 h-4 w-4" />
          Add Donation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Donation</DialogTitle>
          <DialogDescription>
            Enter the details of the donation here. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="donorName" className="text-right">
              Donor Name *
            </Label>
            <Input
              id="donorName"
              value={newDonation.donorName}
              onChange={(e) => setNewDonation({ ...newDonation, donorName: e.target.value })}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount (₦) *
            </Label>
            <Input
              id="amount"
              type="number"
              value={newDonation.amount || ''}
              onChange={(e) => setNewDonation({ ...newDonation, amount: Number(e.target.value) })}
              className="col-span-3"
              min="1"
              step="0.01"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={newDonation.date}
              onChange={(e) => setNewDonation({ ...newDonation, date: e.target.value })}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="purpose" className="text-right">
              Purpose *
            </Label>
            <Select
              value={newDonation.purpose}
              onValueChange={(value) => setNewDonation({ ...newDonation, purpose: value })}
            >
              <SelectTrigger className="col-span-3" id="purpose">
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General Offering">General Offering</SelectItem>
                <SelectItem value="Project Support">Project Support</SelectItem>
                <SelectItem value="Special Offering">Special Offering</SelectItem>
                <SelectItem value="Tithe">Tithe</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paymentMethod" className="text-right">
              Payment Method *
            </Label>
            <Select
              value={newDonation.paymentMethod}
              onValueChange={(value: "Bank Transfer" | "Cash" | "Online Payment") =>
                setNewDonation({ ...newDonation, paymentMethod: value })
              }
            >
              <SelectTrigger className="col-span-3" id="paymentMethod">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Online Payment">Online Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status *
            </Label>
            <Select
              value={newDonation.status}
              onValueChange={(value: "completed" | "pending" | "failed") =>
                setNewDonation({ ...newDonation, status: value })
              }
            >
              <SelectTrigger className="col-span-3" id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email (Optional)
            </Label>
            <Input
              id="email"
              type="email"
              value={newDonation.email || ""}
              onChange={(e) => setNewDonation({ ...newDonation, email: e.target.value })}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone (Optional)
            </Label>
            <Input
              id="phone"
              value={newDonation.phone || ""}
              onChange={(e) => setNewDonation({ ...newDonation, phone: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDialogOpen(false)}
            disabled={isSubmitting}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddDonation}
            disabled={isSubmitting || !newDonation.donorName || newDonation.amount <= 0}
            className="bg-pfcu-primary text-white hover:bg-pfcu-primary/90 transition-colors duration-300"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Add Donation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DonationFormDialog;
