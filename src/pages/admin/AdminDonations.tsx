import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
  DollarSign, 
  Download, 
  Filter, 
  PieChart, 
  Search, 
  Trash2,
  ChevronDown,
  CheckCircle2,
  Calendar
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

interface Donation {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  purpose: string;
  status: "completed" | "pending" | "failed";
  paymentMethod: "Bank Transfer" | "Cash" | "Online Payment";
  email?: string;
  phone?: string;
}

const AdminDonations = () => {
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [totalAmount, setTotalAmount] = useState(0);
  
  const [newDonation, setNewDonation] = useState<Omit<Donation, "id">>({
    donorName: "",
    amount: 0,
    date: format(new Date(), "yyyy-MM-dd"),
    purpose: "General Offering",
    status: "completed",
    paymentMethod: "Cash"
  });
  
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    const storedDonations = localStorage.getItem("pfcu_donations");
    
    if (storedDonations) {
      setDonations(JSON.parse(storedDonations));
    } else {
      const mockDonations: Donation[] = [
        {
          id: "1",
          donorName: "James Okafor",
          amount: 50000,
          date: "2025-04-01",
          purpose: "General Offering",
          status: "completed",
          paymentMethod: "Bank Transfer",
          email: "james@example.com",
          phone: "+234 801 234 5678"
        },
        {
          id: "2",
          donorName: "Charity Eze",
          amount: 20000,
          date: "2025-04-05",
          purpose: "Project Support",
          status: "completed",
          paymentMethod: "Cash",
          phone: "+234 802 345 6789"
        },
        {
          id: "3",
          donorName: "David Adebayo",
          amount: 35000,
          date: "2025-04-08",
          purpose: "Special Offering",
          status: "completed",
          paymentMethod: "Online Payment",
          email: "david@example.com"
        },
        {
          id: "4",
          donorName: "Mary Johnson",
          amount: 15000,
          date: "2025-04-10",
          purpose: "General Offering",
          status: "completed",
          paymentMethod: "Cash"
        },
        {
          id: "5",
          donorName: "Emmanuel Nwosu",
          amount: 25000,
          date: "2025-04-12",
          purpose: "Project Support",
          status: "pending",
          paymentMethod: "Bank Transfer",
          email: "emmanuel@example.com",
          phone: "+234 803 456 7890"
        },
        {
          id: "6",
          donorName: "Grace Udoh",
          amount: 40000,
          date: "2025-04-13",
          purpose: "Special Offering",
          status: "completed",
          paymentMethod: "Bank Transfer",
          email: "grace@example.com",
          phone: "+234 804 567 8901"
        }
      ];
      
      setDonations(mockDonations);
      localStorage.setItem("pfcu_donations", JSON.stringify(mockDonations));
    }
  }, []);
  
  useEffect(() => {
    let filtered = [...donations];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        d => d.donorName.toLowerCase().includes(query) || 
             d.purpose.toLowerCase().includes(query) ||
             d.email?.toLowerCase().includes(query) ||
             d.phone?.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(d => d.status === statusFilter);
    }
    
    if (purposeFilter !== "all") {
      filtered = filtered.filter(d => d.purpose === purposeFilter);
    }
    
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd");
      filtered = filtered.filter(d => d.date === dateStr);
    }
    
    setFilteredDonations(filtered);
    
    const total = filtered.reduce((sum, donation) => {
      return donation.status === "completed" ? sum + donation.amount : sum;
    }, 0);
    
    setTotalAmount(total);
  }, [donations, searchQuery, statusFilter, purposeFilter, date]);
  
  const handleDeleteDonation = (id: string) => {
    const updatedDonations = donations.filter(d => d.id !== id);
    setDonations(updatedDonations);
    localStorage.setItem("pfcu_donations", JSON.stringify(updatedDonations));
    
    toast({
      title: "Donation deleted",
      description: "The donation has been deleted successfully.",
    });
  };
  
  const handleAddDonation = () => {
    const id = `${donations.length + 1}`;
    const newDonationWithId = { ...newDonation, id };
    
    const updatedDonations = [...donations, newDonationWithId];
    setDonations(updatedDonations);
    localStorage.setItem("pfcu_donations", JSON.stringify(updatedDonations));
    
    toast({
      title: "Donation added",
      description: "The new donation has been added successfully.",
    });
    
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
  
  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your donations data is being prepared for download.",
    });
    
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Donations data has been downloaded successfully.",
      });
    }, 1500);
  };
  
  const statusColors = {
    completed: "text-green-600",
    pending: "text-amber-600",
    failed: "text-red-600",
  };
  
  const uniquePurposes = Array.from(new Set(donations.map(d => d.purpose)));
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Donations Management</h1>
          <p className="text-gray-600">Track and manage all donations to the fellowship.</p>
        </div>
        
        <div className="flex gap-2">
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
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
          >
            <Download size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalAmount.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              {filteredDonations.length} donations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Completed Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {donations.filter(d => d.status === "completed").length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {((donations.filter(d => d.status === "completed").length / donations.length) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {donations.filter(d => d.status === "pending").length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Average Donation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{(donations.reduce((sum, d) => sum + d.amount, 0) / donations.length).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Per donation amount
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>Filter the donations based on different criteria.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search donor, purpose, etc."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={purposeFilter} onValueChange={setPurposeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Purposes</SelectItem>
                {uniquePurposes.map(purpose => (
                  <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <DatePicker date={date} setDate={setDate} placeholder="Filter by date" />
          </div>
        </CardContent>
      </Card>
      
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
                          onClick={() => handleDeleteDonation(donation.id)}
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
    </div>
  );
};

export default AdminDonations;
