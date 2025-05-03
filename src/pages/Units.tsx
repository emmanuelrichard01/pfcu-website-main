
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import UnitCard from "@/components/units/UnitCard";
import { useUnitsData } from "@/components/units/useUnitsData";

const Units = () => {
  const { unitsData } = useUnitsData();
  
  useEffect(() => {
    // Ensure page loads from the top
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      {/* Hero section with parallax effect */}
      <section className="relative bg-pfcu-purple overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-pfcu-dark/90 to-pfcu-purple/90"></div>
        </div>
        <div className="container mx-auto relative z-10 py-20 md:py-28 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Ministry Units
            </h1>
            <p className="text-xl text-center max-w-3xl mx-auto text-white/90">
              16 specialized units working together to fulfill the vision of PFCU.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="Worship" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 bg-pfcu-light p-1 rounded-lg">
              {unitsData.map((category) => (
                <TabsTrigger 
                  key={category.category} 
                  value={category.category}
                  className="data-[state=active]:bg-pfcu-purple data-[state=active]:text-white"
                >
                  {category.category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {unitsData.map((category) => (
              <TabsContent key={category.category} value={category.category} className="space-y-8">
                {category.units.map((unit) => (
                  <UnitCard key={unit.name} {...unit} />
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-pfcu-purple to-pfcu-dark text-white">
        <div className="container mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-display font-bold mb-6">Join a Ministry Unit</h2>
            <p className="max-w-2xl mx-auto mb-8">
              Each ministry unit offers unique opportunities to serve and grow. Find where your gifts and passions align with our fellowship needs.
            </p>
            <a 
              href="#" 
              className="bg-white text-pfcu-purple hover:bg-pfcu-gold hover:text-pfcu-dark px-6 py-3 rounded-md transition-colors inline-flex items-center font-medium"
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
