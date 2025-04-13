
import { format } from "date-fns";
import { 
  CheckCircle2, 
  ChevronDown,
  Trash2 
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Donation } from "@/types/donations";

interface DonationTableProps {
  filteredDonations: Donation[];
  donations: Donation[];
  onDeleteDonation: (id: string) => void;
}

const DonationTable = ({ filteredDonations, donations, onDeleteDonation }: DonationTableProps) => {
  const statusColors = {
    completed: "text-green-600",
    pending: "text-amber-600",
    failed: "text-red-600",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donations</CardTitle>
        <CardDescription>
          Showing {filteredDonations.length} of {donations.length} total donations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">Donor</TableHead>
                <TableHead className="font-medium">Amount</TableHead>
                <TableHead className="font-medium">Date</TableHead>
                <TableHead className="font-medium">Purpose</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Payment Method</TableHead>
                <TableHead className="font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No donations match your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">
                      {donation.donorName}
                      {donation.email && (
                        <div className="text-xs text-gray-500">{donation.email}</div>
                      )}
                    </TableCell>
                    <TableCell>₦{donation.amount.toLocaleString()}</TableCell>
                    <TableCell>{format(new Date(donation.date), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{donation.purpose}</TableCell>
                    <TableCell>
                      <span className={`flex items-center ${statusColors[donation.status]}`}>
                        {donation.status === "completed" && <CheckCircle2 className="mr-1 h-4 w-4" />}
                        {donation.status === "pending" && <ChevronDown className="mr-1 h-4 w-4" />}
                        {donation.status === "failed" && <Trash2 className="mr-1 h-4 w-4" />}
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{donation.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteDonation(donation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationTable;
