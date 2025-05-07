
import React, { useEffect, useState } from "react";
import { FileText, Calendar, Users, DollarSign, ArrowRight, Clock } from "lucide-react";
import { useSermons } from "@/hooks/useSermons";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency, formatDate } from "@/lib/utils";
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

  // Fetch donation info directly from database
  useEffect(() => {
    const fetchDonationInfo = async () => {
      try {
        const total = await calculateTotalCompletedDonations();
        setTotalDonations(total);
      } catch (error) {
        console.error("Error fetching donation totals:", error);
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
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
              link={stat.link}
              color={stat.color}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <RecentItemsCard
          title="Recent Sermons"
          titleIcon={<FileText className="mr-2 h-5 w-5 text-blue-500" />}
          headerColor="from-indigo-50 to-blue-50"
          linkUrl="/admin/sermons"
          linkText="View All Sermons"
          isLoading={loading}
          emptyState={{
            icon: <FileText className="mx-auto h-10 w-10 text-gray-300 mb-2" />,
            message: "No sermons available",
            linkUrl: "/admin/sermons",
            linkText: "Add your first sermon"
          }}
          renderItems={() => recentSermons.length > 0 ? (
            <>
              {recentSermons.map((sermon) => (
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
              ))}
            </>
          ) : null}
        />

        <RecentItemsCard
          title="Upcoming Events"
          titleIcon={<Calendar className="mr-2 h-5 w-5 text-green-500" />}
          headerColor="from-green-50 to-emerald-50"
          linkUrl="/admin/events"
          linkText="View All Events"
          isLoading={loading}
          emptyState={{
            icon: <Calendar className="mx-auto h-10 w-10 text-gray-300 mb-2" />,
            message: "No upcoming events",
            linkUrl: "/admin/events",
            linkText: "Schedule your first event"
          }}
          renderItems={() => recentEvents.length > 0 ? (
            <>
              {recentEvents.map((event) => (
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
              ))}
            </>
          ) : null}
        />
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
