
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Users, DollarSign, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSermons } from "@/hooks/useSermons";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Donation } from "@/types/donations";
import { useLeadership } from "@/hooks/useLeadership";
import { motion } from "framer-motion";
import { calculateTotalCompletedDonations } from "@/services/donationService";
import StatsCard from "@/components/admin/dashboard/StatsCard";
import RecentItemsCard from "@/components/admin/dashboard/RecentItemsCard";

const AdminDashboard = () => {
  const { sermons, count: sermonCount } = useSermons();
  const { count: leadershipCount } = useLeadership();
  const [eventCount, setEventCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentSermons, setRecentSermons] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [totalDonations, setTotalDonations] = useState(0);

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

  // Fetch donation info - now directly from database
  useEffect(() => {
    const fetchDonationInfo = async () => {
      try {
        const total = await calculateTotalCompletedDonations();
        setTotalDonations(total);
      } catch (error) {
        console.error("Error fetching donation totals:", error);
        // Fallback to localstorage if database query fails
        const storedDonations = localStorage.getItem("pfcu_donations");
        if (storedDonations) {
          const donations = JSON.parse(storedDonations) as Donation[];
          const total = donations
            .filter(d => d.status === "completed")
            .reduce((sum, d) => sum + d.amount, 0);
          setTotalDonations(total);
        }
      }
    };
    
    fetchDonationInfo();
  }, []);

  // Fetch recent sermons
  useEffect(() => {
    const fetchRecentSermons = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('sermons')
          .select('title, preacher, sermon_date, created_at')
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
          .select('title, date, time')
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const stats = [
    {
      title: "Total Sermons",
      value: loading ? "..." : sermonCount.toString(),
      icon: <FileText className="h-8 w-8 text-white" />,
      description: "Sermons uploaded",
      link: "/admin/sermons",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Upcoming Events",
      value: loading ? "..." : eventCount.toString(),
      icon: <Calendar className="h-8 w-8 text-white" />,
      description: "Events scheduled",
      link: "/admin/events",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Leadership",
      value: loading ? "..." : leadershipCount.toString(),
      icon: <Users className="h-8 w-8 text-white" />,
      description: "Current leaders",
      link: "/admin/leadership",
      color: "from-pfcu-purple to-pfcu-dark"
    },
    {
      title: "Total Donations",
      value: formatCurrency(totalDonations),
      icon: <DollarSign className="h-8 w-8 text-white" />,
      description: "Recent donations",
      link: "/admin/donations",
      color: "from-amber-500 to-yellow-600"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <motion.h1 
          className="text-3xl font-bold font-display"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to PFCU Admin
        </motion.h1>
        <motion.p 
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Manage your fellowship content and settings from this dashboard.
        </motion.p>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={item}>
            <Link to={stat.link} className="block h-full">
              <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 border-none">
                <CardHeader className={`flex flex-row items-center justify-between pb-2 bg-gradient-to-r ${stat.color} text-white p-4`}>
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <p className="text-sm text-gray-500 mb-4">{stat.description}</p>
                  <Button variant="ghost" className="group p-0 h-auto text-pfcu-purple hover:text-pfcu-dark hover:bg-transparent">
                    <span>Manage {stat.title}</span>
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {/* Recent Sermons Card */}
        <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
              Recent Sermons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentSermons.length > 0 ? (
              recentSermons.map((sermon) => (
                <div key={sermon.title + sermon.created_at} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium text-gray-800">{sermon.title}</p>
                    <div className="flex items-center gap-1 text-gray-500">
                      <p className="text-sm">{sermon.preacher}</p>
                      <span className="text-xs">•</span>
                      <p className="text-sm">{new Date(sermon.sermon_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(sermon.created_at)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FileText className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                <p className="text-gray-500">No sermons available</p>
                <Link to="/admin/sermons">
                  <Button variant="link" className="mt-2">Add your first sermon</Button>
                </Link>
              </div>
            )}
            <Link to="/admin/sermons" className="block">
              <Button variant="outline" className="w-full mt-2 group">
                <span>View All Sermons</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Upcoming Events Card */}
        <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-green-500" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div key={event.title + event.date} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium text-gray-800">{event.title}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <p>{event.date}</p>
                      <span className="text-xs">•</span>
                      <p>{event.time}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Calendar className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                <p className="text-gray-500">No upcoming events</p>
                <Link to="/admin/events">
                  <Button variant="link" className="mt-2">Schedule your first event</Button>
                </Link>
              </div>
            )}
            <Link to="/admin/events" className="block">
              <Button variant="outline" className="w-full mt-2 group">
                <span>View All Events</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
