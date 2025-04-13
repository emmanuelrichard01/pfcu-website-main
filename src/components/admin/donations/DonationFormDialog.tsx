
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
import { NewDonation } from "@/types/donations";

interface DonationFormDialogProps {
  onAddDonation: (donation: NewDonation) => void;
}

const DonationFormDialog = ({ onAddDonation }: DonationFormDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDonation, setNewDonation] = useState<NewDonation>({
    donorName: "",
    amount: 0,
    date: format(new Date(), "yyyy-MM-dd"),
    purpose: "General Offering",
    status: "completed",
    paymentMethod: "Cash"
  });

  const handleAddDonation = () => {
    onAddDonation(newDonation);
    setNewDonation({
      donorName: "",
      amount: 0,
      date: format(new Date(), "yyyy-MM-dd"),
      purpose: "General Offering",
      status: "completed",
      paymentMethod: "Cash"
    });
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-pfcu-purple hover:bg-pfcu-dark text-white">
          Add Donation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Donation</DialogTitle>
          <DialogDescription>
            Enter the details of the donation here. All fields are required.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="donorName" className="text-right">
              Donor Name
            </Label>
            <Input
              id="donorName"
              value={newDonation.donorName}
              onChange={(e) => setNewDonation({...newDonation, donorName: e.target.value})}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount (₦)
            </Label>
            <Input
              id="amount"
              type="number"
              value={newDonation.amount}
              onChange={(e) => setNewDonation({...newDonation, amount: Number(e.target.value)})}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={newDonation.date}
              onChange={(e) => setNewDonation({...newDonation, date: e.target.value})}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="purpose" className="text-right">
              Purpose
            </Label>
            <Select 
              value={newDonation.purpose}
              onValueChange={(value) => setNewDonation({...newDonation, purpose: value})}
            >
              <SelectTrigger className="col-span-3" id="purpose">
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General Offering">General Offering</SelectItem>
                <SelectItem value="Project Support">Project Support</SelectItem>
                <SelectItem value="Special Offering">Special Offering</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paymentMethod" className="text-right">
              Payment Method
            </Label>
            <Select 
              value={newDonation.paymentMethod}
              onValueChange={(value: "Bank Transfer" | "Cash" | "Online Payment") => 
                setNewDonation({...newDonation, paymentMethod: value})
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
              Status
            </Label>
            <Select 
              value={newDonation.status}
              onValueChange={(value: "completed" | "pending" | "failed") => 
                setNewDonation({...newDonation, status: value})
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
              onChange={(e) => setNewDonation({...newDonation, email: e.target.value})}
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
              onChange={(e) => setNewDonation({...newDonation, phone: e.target.value})}
              className="col-span-3"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddDonation}
            disabled={!newDonation.donorName || newDonation.amount <= 0}
          >
            Add Donation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DonationFormDialog;
