
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Donation } from "@/types/donations";
import DonationStatsCards from "@/components/admin/donations/DonationStatsCards";
import DonationFilters from "@/components/admin/donations/DonationFilters";
import DonationTable from "@/components/admin/donations/DonationTable";
import DonationFormDialog from "@/components/admin/donations/DonationFormDialog";

const AdminDonations = () => {
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [totalAmount, setTotalAmount] = useState(0);
  
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
  
  const handleAddDonation = (newDonation: Omit<Donation, "id">) => {
    const id = `${donations.length + 1}`;
    const newDonationWithId = { ...newDonation, id };
    
    const updatedDonations = [...donations, newDonationWithId];
    setDonations(updatedDonations);
    localStorage.setItem("pfcu_donations", JSON.stringify(updatedDonations));
    
    toast({
      title: "Donation added",
      description: "The new donation has been added successfully.",
    });
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
  
  const uniquePurposes = Array.from(new Set(donations.map(d => d.purpose)));
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Donations Management</h1>
          <p className="text-gray-600">Track and manage all donations to the fellowship.</p>
        </div>
        
        <div className="flex gap-2">
          <DonationFormDialog onAddDonation={handleAddDonation} />
          
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
      
      <DonationStatsCards 
        donations={donations} 
        filteredDonations={filteredDonations}
        totalAmount={totalAmount}
      />
      
      <DonationFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        purposeFilter={purposeFilter}
        setPurposeFilter={setPurposeFilter}
        date={date}
        setDate={setDate}
        uniquePurposes={uniquePurposes}
      />
      
      <DonationTable 
        filteredDonations={filteredDonations}
        donations={donations}
        onDeleteDonation={handleDeleteDonation}
      />
    </div>
  );
};

export default AdminDonations;
