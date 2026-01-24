
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Search,
  Users,
  Heart,
  Globe,
  Zap,
  BookOpen,
  Filter
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { useUnitsData, UnitData } from "../components/units/useUnitsData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import JoinDialog from "../components/layout/JoinDialog";

// Category mapping helper
const getCategory = (deptName: string): string => {
  const categories: Record<string, string> = {
    "Christian Education Department": "Spiritual Growth",
    "PFCU Little Angel's Department": "Spiritual Growth",
    "Chaplaincy Department": "Service & Operations",
    "Beautification Department": "Service & Operations",
    "Intercessory Department": "Prayer & Outreach",
    "Outreach and Care Department": "Prayer & Outreach",
    "Worship Department": "Creative & Worship",
    "Media and Communications Department": "Creative & Worship",
    "Creative Arts and Performance Department": "Creative & Worship",
  };
  return categories[deptName] || "Others";
};

const Departments = () => {
  const { unitsData, loading } = useUnitsData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDept, setSelectedDept] = useState<UnitData | null>(null);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [joinDeptName, setJoinDeptName] = useState<string | null>(null);

  const categories = ["All", "Spiritual Growth", "Service & Operations", "Prayer & Outreach", "Creative & Worship"];

  const filteredDepts = useMemo(() => {
    return unitsData.filter(dept => {
      const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || getCategory(dept.name) === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [unitsData, searchQuery, selectedCategory]);

  const openJoinDialog = (deptName: string) => {
    setJoinDeptName(deptName);
    setJoinDialogOpen(true);
    setSelectedDept(null); // Close detail modal if open
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">

        {/* --- CINEMATIC HERO (Light) --- */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pfcu-primary/5 via-zinc-50/0 to-zinc-50/0 dark:from-pfcu-primary/10 dark:via-zinc-950/0 dark:to-zinc-950/0" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

            {/* Floating Doodles */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute top-1/4 left-10 md:left-20 text-pfcu-primary/20 hidden lg:block"
            >
              <Zap size={48} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute top-1/3 right-10 md:right-20 text-blue-500/20 hidden lg:block"
            >
              <Globe size={56} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="absolute bottom-1/4 left-1/4 text-purple-500/20 hidden lg:block"
            >
              <Users size={40} />
            </motion.div>
          </div>

          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
                <Users size={14} className="text-pfcu-primary fill-pfcu-primary" />
                <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">Our Ministries</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-heading font-bold text-zinc-900 dark:text-white tracking-tight mb-8">
                Serve with <br />
                <span className="text-pfcu-primary relative">
                  Purpose
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-pfcu-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                  </svg>
                </span>
              </h1>

              <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Discover your unique place in the body of Christ. Use your gifts to serve, lead, and make a lasting impact.
              </p>
            </motion.div>
          </div>
        </section>

        {/* --- FILTER & SEARCH --- */}
        <section className="top-20 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 py-4">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar mask-gradient">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`
                        whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
                        ${selectedCategory === cat
                      ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 dark:bg-white dark:text-zinc-900"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"}
                      `}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="Find a department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-full bg-zinc-100 border-transparent focus:bg-white focus:border-zinc-300 transition-all dark:bg-zinc-900 dark:border-zinc-800"
              />
            </div>
          </div>
        </section>

        {/* --- DEPARTMENTS GRID --- */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pfcu-primary"></div>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredDepts.map((dept, index) => (
                  <motion.div
                    layout
                    key={dept.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      onClick={() => setSelectedDept(dept)}
                      className="group cursor-pointer relative bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col overflow-hidden"
                    >
                      {/* Decorative BG Icon */}
                      <dept.icon
                        className="absolute -bottom-4 -right-4 w-32 h-32 text-zinc-50 dark:text-zinc-800/50 group-hover:text-pfcu-primary/5 group-hover:scale-110 transition-all duration-500 pointer-events-none"
                        strokeWidth={0.5}
                      />

                      <div className="relative z-10 flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white mb-6 group-hover:bg-pfcu-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                          <dept.icon size={24} strokeWidth={1.5} />
                        </div>

                        <h3 className="text-xl font-bold font-heading text-zinc-900 dark:text-white mb-2 pr-8 leading-tight">
                          {dept.name.replace(" Department", "")}
                        </h3>

                        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed mb-6">
                          {dept.description}
                        </p>

                        <div className="mt-auto flex items-center justify-between">
                          <span className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 group-hover:text-pfcu-primary transition-colors">
                            View Details <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                          </span>
                          <Badge variant="secondary" className="bg-zinc-100 text-zinc-500 text-[10px] group-hover:bg-white group-hover:shadow-sm">
                            {dept.leaders.length} Leaders
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filteredDepts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-zinc-400">No departments found matching your criteria.</p>
              <Button variant="link" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>Clear Filters</Button>
            </div>
          )}
        </section>

        {/* --- DETAIL MODAL --- */}
        <Dialog open={!!selectedDept} onOpenChange={(open) => !open && setSelectedDept(null)}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-3xl">
            {selectedDept && (
              <>
                {/* Header Image Pattern */}
                <div className="bg-zinc-900 dark:bg-zinc-900 h-32 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-pfcu-primary/10 mix-blend-overlay" />
                  <div className="absolute -bottom-10 -right-10 text-white/5">
                    <selectedDept.icon size={200} strokeWidth={0.5} />
                  </div>
                  <div className="relative z-10 p-6 w-full">
                    <Badge className="bg-white/20 hover:bg-white/20 text-white border-transparent mb-2 backdrop-blur-sm">
                      {getCategory(selectedDept.name)}
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
                      {selectedDept.name.replace(" Department", "")}
                    </h2>
                  </div>
                </div>

                <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto">
                  <div className="prose dark:prose-invert max-w-none mb-8">
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                      {selectedDept.description}
                    </p>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Activities */}
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                        <Zap size={14} /> Key Activities
                      </h3>
                      <ul className="space-y-3">
                        {selectedDept.activities.map((activity, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                            <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-pfcu-primary shrink-0" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Leadership */}
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                        <Users size={14} /> Leadership
                      </h3>
                      <div className="space-y-4">
                        {selectedDept.leaders.map((leader, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-zinc-100 dark:border-zinc-800">
                              <AvatarImage src={leader.image} />
                              <AvatarFallback className="bg-zinc-100 text-zinc-500 text-xs font-bold">
                                {leader.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-bold text-zinc-900 dark:text-white leading-none mb-1">
                                {leader.name}
                              </p>
                              <p className="text-xs text-pfcu-primary font-medium">
                                {leader.position}
                              </p>
                            </div>
                          </div>
                        ))}
                        {selectedDept.leaders.length === 0 && (
                          <p className="text-sm text-zinc-400 italic">Leadership info pending update</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <Button
                      size="lg"
                      onClick={() => openJoinDialog(selectedDept.name)}
                      className="w-full md:w-auto bg-pfcu-primary hover:bg-pfcu-primary/90 text-white rounded-xl shadow-lg shadow-pfcu-primary/20"
                    >
                      Join This Department <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <JoinDialog
          open={joinDialogOpen}
          onOpenChange={setJoinDialogOpen}
          departmentName={joinDeptName}
        />
      </div>
    </MainLayout>
  );
};

export default Departments;
