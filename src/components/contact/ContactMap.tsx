
import GoogleMap from "@/components/map/GoogleMap";

const ContactMap = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-display font-bold mb-6">Visit Us</h2>
        <p className="mb-8 max-w-2xl mx-auto text-gray-700">
          We're located on the Caritas University campus. Our fellowship hall is easy to find, 
          and we welcome visitors at all our services and events.
        </p>
        <div className="h-96 w-full rounded-lg overflow-hidden">
          <GoogleMap address="Caritas University, Enugu, Nigeria" height="380px" />
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
