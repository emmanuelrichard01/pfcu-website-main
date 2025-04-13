
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DonationFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  purposeFilter: string;
  setPurposeFilter: (purpose: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  uniquePurposes: string[];
}

const DonationFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  purposeFilter,
  setPurposeFilter,
  date,
  setDate,
  uniquePurposes
}: DonationFiltersProps) => {
  return (
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
  );
};

export default DonationFilters;
