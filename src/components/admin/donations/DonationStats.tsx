
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
          <p className="text-xs text-muted-foreground">
            From {donations.filter(d => d.status === "completed").length} donations
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(averageDonation)}</div>
          <p className="text-xs text-muted-foreground">
            Per completed donation
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {donations.filter(d => d.status === "pending").length}
          </div>
          <p className="text-xs text-muted-foreground">
            Awaiting confirmation
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Donation Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{purposeStats.length}</div>
          <p className="text-xs text-muted-foreground">
            Different donation purposes
          </p>
        </CardContent>
      </Card>
      
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Monthly Donation Trends</CardTitle>
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
                formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Total']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Donation by Purpose</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {purposeStats.map((stat, idx) => (
              <div key={stat.purpose} className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{stat.purpose}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{stat.count} donations</span>
                    <span>{formatCurrency(stat.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${(stat.amount / totalAmount) * 100}%`,
                        backgroundColor: colors[idx % colors.length]
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
