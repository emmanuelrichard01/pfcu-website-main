
import GoogleMap from "@/components/map/GoogleMap";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const ContactMap = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-3">
            <div className="bg-pfcu-light p-2 rounded-full">
              <MapPin className="h-5 w-5 text-pfcu-purple" />
            </div>
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Visit Us</h2>
          <p className="mb-6 max-w-xl mx-auto text-gray-600">
            We're located on the Caritas University campus in Amorji-Nike, Enugu. 
            Our fellowship hall is easy to find, and we welcome visitors at all our services and events.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="rounded-xl overflow-hidden shadow-xl">
            <GoogleMap 
              address="Caritas University, Amorji-Nike, Enugu, Nigeria" 
              height="450px" 
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactMap;
