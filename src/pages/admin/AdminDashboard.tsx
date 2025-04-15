
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, UserPlus, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSermons } from "@/hooks/useSermons";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { count: sermonCount } = useSermons();
  const [eventCount, setEventCount] = useState(0);
  const [leadershipCount, setLeadershipCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [recentSermons, setRecentSermons] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  // Fetch events count
  useEffect(() => {
    const fetchEventCount = async () => {
      try {
        const { count, error } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        
        if (count !== null) {
          setEventCount(count);
        }
      } catch (error) {
        console.error("Error fetching event count:", error);
      }
    };

    fetchEventCount();
  }, []);

  // Fetch recent sermons
  useEffect(() => {
    const fetchRecentSermons = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('sermons')
          .select('title, created_at')
          .order('created_at', { ascending: false })
          .limit(4);
        
        if (error) throw error;
        
        setRecentSermons(data || []);
      } catch (error) {
        console.error("Error fetching recent sermons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSermons();
  }, []);

  // Fetch upcoming events
  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('title, date')
          .order('date', { ascending: true })
          .limit(4);
        
        if (error) throw error;
        
        setRecentEvents(data || []);
      } catch (error) {
        console.error("Error fetching recent events:", error);
      }
    };

    fetchRecentEvents();
  }, []);

  const stats = [
    {
      title: "Total Sermons",
      value: loading ? "..." : sermonCount.toString(),
      icon: <FileText className="h-8 w-8 text-pfcu-purple" />,
      description: "Sermons uploaded",
      link: "/admin/sermons"
    },
    {
      title: "Upcoming Events",
      value: loading ? "..." : eventCount.toString(),
      icon: <Calendar className="h-8 w-8 text-pfcu-purple" />,
      description: "Events scheduled",
      link: "/admin/events"
    },
    {
      title: "Leadership",
      value: leadershipCount.toString(),
      icon: <Users className="h-8 w-8 text-pfcu-purple" />,
      description: "Current leaders",
      link: "/admin/leadership"
    },
    {
      title: "Total Donations",
      value: "₦185,000",
      icon: <DollarSign className="h-8 w-8 text-pfcu-purple" />,
      description: "Recent donations",
      link: "/admin/donations"
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

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
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentSermons.length > 0 ? (
              recentSermons.map((sermon) => (
                <div key={sermon.title} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{sermon.title}</p>
                    <p className="text-sm text-gray-500">Uploaded {formatDate(sermon.created_at)}</p>
                  </div>
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No sermons available</p>
            )}
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
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div key={event.title} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No upcoming events</p>
            )}
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
