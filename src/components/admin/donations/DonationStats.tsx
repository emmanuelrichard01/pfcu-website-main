
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Donation } from "@/types/donations";

interface DonationStatsProps {
  donations: Donation[];
}

export const DonationStats = ({ donations }: DonationStatsProps) => {
  const [chartData, setChartData] = useState<{ name: string; total: number }[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [averageDonation, setAverageDonation] = useState(0);
  const [purposeStats, setPurposeStats] = useState<{ purpose: string; amount: number; count: number }[]>([]);

  useEffect(() => {
    if (!donations.length) return;

    // Calculate total amount
    const completedDonations = donations.filter(d => d.status === "completed");
    const total = completedDonations.reduce((sum, d) => sum + d.amount, 0);
    setTotalAmount(total);

    // Calculate average donation
    setAverageDonation(completedDonations.length ? total / completedDonations.length : 0);

    // Group by month for chart
    const monthlyData = completedDonations.reduce((acc, donation) => {
      const date = new Date(donation.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear] += donation.amount;
      return acc;
    }, {} as Record<string, number>);

    setChartData(Object.entries(monthlyData).map(([name, total]) => ({ name, total })));

    // Group by purpose
    const purposeData = completedDonations.reduce((acc, donation) => {
      if (!acc[donation.purpose]) {
        acc[donation.purpose] = { amount: 0, count: 0 };
      }
      acc[donation.purpose].amount += donation.amount;
      acc[donation.purpose].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    setPurposeStats(
      Object.entries(purposeData).map(([purpose, stats]) => ({
        purpose,
        amount: stats.amount,
        count: stats.count
      }))
    );
  }, [donations]);

  // Colors for chart bars
  const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6 animate-in fade-in-50 slide-in-from-top-2 duration-500">
      <Card className="col-span-full lg:col-span-2 border-zinc-200 dark:border-zinc-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₦${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderColor: '#e4e4e7',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Total']}
                cursor={{ fill: 'transparent' }}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]} className="fill-zinc-900 dark:fill-zinc-100" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-1 border-zinc-200 dark:border-zinc-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">By Purpose</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {purposeStats.map((stat, idx) => (
              <div key={stat.purpose} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-400 dark:bg-zinc-600'}`}></div>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{stat.purpose}</span>
                  </div>
                  <span className="text-zinc-500 text-xs">{stat.count} donations</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Progress</span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100 font-medium">{formatCurrency(stat.amount)}</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${idx === 0 ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-400 dark:bg-zinc-600'}`}
                      style={{
                        width: `${(stat.amount / totalAmount) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationStats;
