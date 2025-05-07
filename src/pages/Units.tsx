
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import UnitCard from "@/components/units/UnitCard";
import { useUnitsData } from "@/components/units/useUnitsData";
import { useIsMobile } from "@/hooks/use-mobile";

const Units = () => {
  const { unitsData } = useUnitsData();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Ensure page loads from the top
    window.scrollTo(0, 0);
  }, []);

  // Animation variants
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

  return (
    <MainLayout>
      {/* Hero section with dynamic background */}
      <section className="relative overflow-hidden">
        {/* Background with darker gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pfcu-dark via-[#7d1935] to-[#4a0d1f] z-0">
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {[...Array(10)].map((_, i) => (
                <motion.path
                  key={i}
                  d={`M${i * 10},0 Q${i * 10 + 5},50 ${i * 10},100`}
                  stroke="white"
                  strokeWidth="0.5"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ duration: 2, delay: i * 0.2 }}
                />
              ))}
            </svg>
          </div>
        </div>
        
        <div className="container mx-auto relative z-10 py-24 md:py-32 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Ministry Units
            </h1>
            <p className="text-xl text-center text-white/90 max-w-2xl mx-auto">
              16 specialized units working together with diverse gifts and talents to fulfill the vision of PFCU.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="Worship" className="w-full">
            <div className="flex justify-center mb-8 overflow-x-auto pb-2">
              <TabsList className={`h-auto p-1 bg-white border rounded-full shadow-sm ${isMobile ? 'flex flex-nowrap' : ''}`}>
                {unitsData.map((category, index) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className={isMobile ? 'shrink-0' : ''}
                  >
                    <TabsTrigger 
                      value={category.category}
                      className="px-6 py-2.5 rounded-full data-[state=active]:bg-pfcu-purple 
                        data-[state=active]:text-white data-[state=active]:shadow-md transition-all whitespace-nowrap"
                    >
                      {category.category}
                    </TabsTrigger>
                  </motion.div>
                ))}
              </TabsList>
            </div>
            
            <div className="mt-12">
              {unitsData.map((category) => (
                <TabsContent 
                  key={category.category} 
                  value={category.category}
                  className="mt-0"
                >
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-8"
                  >
                    {category.units.slice(0, 16).map((unit, idx) => (
                      <motion.div key={unit.name} variants={item}>
                        <UnitCard {...unit} />
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </section>

      <section className="py-16 bg-pfcu-purple text-white">
        <div className="container mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 bg-white text-pfcu-purple rounded-full text-sm font-medium mb-4">Discover Your Gifts</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Join a Ministry Unit</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Each ministry unit offers unique opportunities to serve and grow. Find where your gifts and passions align with our fellowship needs and make a difference in our community.
            </p>
            <a 
              href="#" 
              className="inline-flex items-center justify-center bg-white text-pfcu-purple hover:bg-pfcu-gold hover:text-pfcu-dark 
                px-8 py-3 rounded-full transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Discover Your Ministry Fit
            </a>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Units;
