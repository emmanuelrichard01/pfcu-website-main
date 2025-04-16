
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Donation } from "@/types/donations";
import DonationHeader from "@/components/admin/donations/DonationHeader";
import DonationStatsToggle from "@/components/admin/donations/DonationStatsToggle";
import DonationStatsCards from "@/components/admin/donations/DonationStatsCards";
import DonationFilters from "@/components/admin/donations/DonationFilters";
import DonationTable from "@/components/admin/donations/DonationTable";
import DonationFormDialog from "@/components/admin/donations/DonationFormDialog";
import DonationStats from "@/components/admin/donations/DonationStats";
import { useDonations } from "@/hooks/useDonations";

const AdminDonations = () => {
  const { toast } = useToast();
  const { donations, addDonation, deleteDonation } = useDonations();
  
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  
  // Filter donations based on search query and filters
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
  
  const toggleDetails = () => setShowDetails(!showDetails);
  const uniquePurposes = Array.from(new Set(donations.map(d => d.purpose)));
  
  return (
    <div className="space-y-6">
      <DonationHeader 
        onAddClick={() => document.getElementById('add-donation-trigger')?.click()}
        onExportClick={handleExport}
      />
      
      <DonationStatsToggle 
        showDetails={showDetails} 
        toggleDetails={toggleDetails} 
      />
      
      {showDetails && <DonationStats donations={donations} />}
      
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
        onDeleteDonation={deleteDonation}
      />
      
      <DonationFormDialog onAddDonation={addDonation} />
    </div>
  );
};

export default AdminDonations;
