
import { useEffect, useState } from "react";
import { DollarSign, CheckCircle2, Clock, TrendingUp } from "lucide-react";
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

  const completedDonations = donations.filter(d => d.status === "completed");
  const pendingDonations = donations.filter(d => d.status === "pending");
  const avgDonation = donations.length
    ? donations.reduce((sum, d) => sum + d.amount, 0) / donations.length
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Donations */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all duration-200 group">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Revenue</p>
            {isLoading ? (
              <div className="h-8 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse mt-2" />
            ) : (
              <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-1">
                ₦{dynamicTotal !== null ? dynamicTotal.toLocaleString() : totalAmount.toLocaleString()}
              </h3>
            )}
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span className="font-medium">+12.5%</span> from last month
            </p>
          </div>
          <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-emerald-600 transition-colors">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Completed Donations */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all duration-200 group">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Completed</p>
            <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-1">
              {completedDonations.length}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              {((completedDonations.length / (donations.length || 1)) * 100).toFixed(1)}% success rate
            </p>
          </div>
          <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-amber-600 transition-colors">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Pending Donations */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all duration-200 group">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Pending</p>
            <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-1">
              {pendingDonations.length}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Actions required
            </p>
          </div>
          <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-blue-600 transition-colors">
            <Clock className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Average Donation */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all duration-200 group">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Avg. Donation</p>
            <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-1">
              ₦{avgDonation.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Per transaction
            </p>
          </div>
          <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-purple-600 transition-colors">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationStatsCards;

