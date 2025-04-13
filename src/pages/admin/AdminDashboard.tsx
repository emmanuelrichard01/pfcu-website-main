
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, UserPlus, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Sermons",
      value: "24",
      icon: <FileText className="h-8 w-8 text-pfcu-purple" />,
      description: "Sermons uploaded",
      link: "/admin/sermons"
    },
    {
      title: "Upcoming Events",
      value: "5",
      icon: <Calendar className="h-8 w-8 text-pfcu-purple" />,
      description: "Events scheduled",
      link: "/admin/events"
    },
    {
      title: "Leadership",
      value: "6",
      icon: <Users className="h-8 w-8 text-pfcu-purple" />,
      description: "Current leaders",
      link: "/admin/leadership"
    },
    {
      title: "Total Donations",
      value: "₦185,000",
      icon: <DollarSign className="h-8 w-8 text-pfcu-purple" />,
      description: "Recent donations",
      link: "/admin/giving"
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-display">Dashboard</h1>
      <p className="text-gray-600">Welcome to the PFCU Administration Panel.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link to={stat.link} key={stat.title} className="block">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                <Button variant="link" className="mt-2 p-0 h-auto text-pfcu-purple">
                  Manage {stat.title}
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sermons</CardTitle>
            <CardDescription>The latest uploaded sermon content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {["The Power of Faith", "Walking in Love", "Divine Purpose", "Spiritual Growth"].map((sermon) => (
              <div key={sermon} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{sermon}</p>
                  <p className="text-sm text-gray-500">Uploaded 3 days ago</p>
                </div>
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
            ))}
            <Link to="/admin/sermons">
              <Button variant="outline" className="w-full mt-2">View All Sermons</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next scheduled fellowship events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Sunday Service", date: "April 14, 2025" },
              { name: "Bible Study", date: "April 16, 2025" },
              { name: "Prayer Meeting", date: "April 18, 2025" },
              { name: "Annual Retreat", date: "October 15, 2025" }
            ].map((event) => (
              <div key={event.name} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{event.name}</p>
                  <p className="text-sm text-gray-500">{event.date}</p>
                </div>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            ))}
            <Link to="/admin/events">
              <Button variant="outline" className="w-full mt-2">View All Events</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
