
import React, { useEffect, useState } from "react";
import { FileText, Calendar, Users, DollarSign, ArrowUpRight, TrendingUp } from "lucide-react";
import { useSermons } from "@/hooks/useSermons";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useLeadership } from "@/hooks/useLeadership";
import { motion } from "framer-motion";
import { calculateTotalCompletedDonations } from "@/services/donationService";
import { Link } from "react-router-dom";

// Type definitions for dashboard data
interface RecentSermon {
  title: string;
  preacher: string;
  sermon_date: string;
  created_at: string;
}

interface RecentEvent {
  title: string;
  date: string;
  time: string;
}

const AdminDashboard = () => {
  const { sermons, count: sermonCount } = useSermons();
  const { count: leadershipCount } = useLeadership();
  const [eventCount, setEventCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentSermons, setRecentSermons] = useState<RecentSermon[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [totalDonations, setTotalDonations] = useState(0);

  // Fetch events count
  useEffect(() => {
    const fetchEventCount = async () => {
      try {
        const { count, error } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true });

        if (error) throw error;
        if (count !== null) setEventCount(count);
      } catch (error) {
        console.error("Error fetching event count:", error);
      }
    };
    fetchEventCount();
  }, []);

  // Fetch donation info
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

  // Fetch recent data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sermonsRes, eventsRes] = await Promise.all([
          supabase.from('sermons').select('title, preacher, sermon_date, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('events').select('title, date, time').order('date', { ascending: true }).limit(5)
        ]);

        if (sermonsRes.data) setRecentSermons(sermonsRes.data);
        if (eventsRes.data) setRecentEvents(eventsRes.data);
      } catch (error) {
        console.error("Error fetching recent data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const stats = [
    {
      title: "Content Library",
      value: sermonCount.toString(),
      label: "Total Sermons",
      icon: <FileText size={20} />,
      link: "/admin/sermons",
      trend: "+2 this week" // Placeholder logic
    },
    {
      title: "Upcoming",
      value: eventCount.toString(),
      label: "Scheduled Events",
      icon: <Calendar size={20} />,
      link: "/admin/events",
      trend: "Next event in 3 days"
    },
    {
      title: "Team",
      value: leadershipCount.toString(),
      label: "Active Leaders",
      icon: <Users size={20} />,
      link: "/admin/leadership",
      trend: "Stable"
    },
    {
      title: "Funds",
      value: formatCurrency(totalDonations),
      label: "Total Donations",
      icon: <DollarSign size={20} />,
      link: "/admin/donations",
      trend: "+12% vs last month"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-heading font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Overview</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Link
            key={idx}
            to={stat.link}
            className="group flex flex-col p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 rounded-xl hover:shadow-md transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg group-hover:bg-pfcu-primary/10 group-hover:text-pfcu-primary transition-colors">
                {stat.icon}
              </div>
              <ArrowUpRight size={18} className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-1">
                {loading ? "..." : stat.value}
              </div>
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</div>
              <div className="mt-3 text-xs text-zinc-400 flex items-center gap-1">
                <TrendingUp size={12} />
                {stat.trend}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

        {/* Recent Sermons */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Recent Uploads</h3>
            <Link to="/admin/sermons" className="text-sm font-medium text-pfcu-primary hover:underline">View All</Link>
          </div>
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-sm text-zinc-500">Loading data...</div>
            ) : recentSermons.length > 0 ? (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {recentSermons.map((sermon, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{sermon.title}</p>
                      <p className="text-xs text-zinc-500">{sermon.preacher}</p>
                    </div>
                    <div className="text-xs text-zinc-400 font-mono">
                      {new Date(sermon.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500 text-sm">No sermons found.</div>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Upcoming Events</h3>
            <Link to="/admin/events" className="text-sm font-medium text-pfcu-primary hover:underline">View Calendar</Link>
          </div>
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-sm text-zinc-500">Loading data...</div>
            ) : recentEvents.length > 0 ? (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {recentEvents.map((event, i) => (
                  <div key={i} className="p-4 flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-400">
                      <span>{new Date(event.date).getDate()}</span>
                      <span className="text-[9px] uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{event.title}</p>
                      <p className="text-xs text-zinc-500">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500 text-sm">No upcoming events.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
