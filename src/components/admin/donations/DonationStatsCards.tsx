import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Donation } from "@/types/donations";
import { calculateTotalCompletedDonations } from "@/services/donationService";

interface DonationStatsCardsProps {
  donations: Donation[];
  filteredDonations: Donation[];
  totalAmount: number;
}

const DonationStatsCards = ({ donations, filteredDonations, totalAmount }: DonationStatsCardsProps) => {
  const [dynamicTotal, setDynamicTotal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTotalDonations = async () => {
      setIsLoading(true);
      try {
        const sum = await calculateTotalCompletedDonations();
        setDynamicTotal(sum);
      } catch (error) {
        console.error("Error calculating donation totals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTotalDonations();
  }, []);
  
  // Calculate payment method stats
  const bankTransfers = donations.filter(d => d.paymentMethod === "Bank Transfer").length;
  const onlinePayments = donations.filter(d => d.paymentMethod === "Online Payment").length;
  const cashDonations = donations.filter(d => d.paymentMethod === "Cash").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Donations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center h-14">
              <div className="w-5 h-5 border-2 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">
                ₦{dynamicTotal !== null ? dynamicTotal.toLocaleString() : totalAmount.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {filteredDonations.length} donations
              </p>
            </>
          )}
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
            ₦{(donations.length ? donations.reduce((sum, d) => sum + d.amount, 0) / donations.length : 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Per donation amount
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationStatsCards;
