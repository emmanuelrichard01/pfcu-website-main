
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
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const AdminDonations = () => {
  const { toast } = useToast();
  const { donations, loading, addDonation, deleteDonation, fetchDonations } = useDonations();
  
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
  
  // Check if get_user_email function exists
  useEffect(() => {
    const checkEmailFunction = async () => {
      try {
        // Try to execute a simple query against the database
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .limit(1);
        
        if (error) {
          console.error("Error checking database connection:", error);
        } else {
          console.log("Database connection successful");
        }
      } catch (error) {
        console.error("Error checking database connection:", error);
      }
    };
    
    checkEmailFunction();
  }, []);
  
  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your donations data is being prepared for download.",
    });
    
    // Create CSV data from filteredDonations
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Donor Name,Email,Phone,Amount,Purpose,Payment Method,Status,Date\n";
    
    filteredDonations.forEach(donation => {
      const row = [
        donation.donorName,
        donation.email || '',
        donation.phone || '',
        donation.amount,
        donation.purpose,
        donation.paymentMethod,
        donation.status,
        donation.date
      ].join(",");
      csvContent += row + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pfcu_donations_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export complete",
      description: "Donations data has been downloaded successfully.",
    });
  };
  
  const toggleDetails = () => setShowDetails(!showDetails);
  const uniquePurposes = Array.from(new Set(donations.map(d => d.purpose)));
  
  return (
    <div className="space-y-6">
      <DonationHeader 
        onAddClick={() => document.getElementById('add-donation-trigger')?.click()}
        onExportClick={handleExport}
      />
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
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
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {filteredDonations.length} {filteredDonations.length === 1 ? 'donation' : 'donations'} found
            </h3>
            <Button variant="outline" onClick={fetchDonations} className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 3V8M21 8H16M21 8L18 5.29168C16.4077 3.86657 14.3051 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.2832 21 19.8675 18.008 20.777 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Refresh
            </Button>
          </div>
          
          <DonationTable 
            filteredDonations={filteredDonations}
            donations={donations}
            onDeleteDonation={deleteDonation}
          />
          
          <DonationFormDialog onAddDonation={addDonation} />
        </>
      )}
    </div>
  );
};

export default AdminDonations;
