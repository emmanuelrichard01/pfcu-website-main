
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="section-title">About Our Fellowship</h2>
            <p className="mb-6 text-gray-700">
              The Pentecostal Fellowship of Caritas University (PFCU) has been a cornerstone of spiritual growth and community on campus since 2005. Our fellowship is built on the principles of faith, love, and service.
            </p>
            <p className="mb-6 text-gray-700">
              We are a vibrant community of believers committed to the spiritual development of students through various units and activities. With 16 different ministry units, there's a place for everyone to serve and grow.
            </p>
            <Button asChild className="bg-pfcu-purple hover:bg-pfcu-dark text-white">
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
          <div className="order-1 md:order-2 bg-gray-100 h-72 md:h-96 rounded-lg shadow-md">
            {/* Placeholder for an image */}
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500">Fellowship Image</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
