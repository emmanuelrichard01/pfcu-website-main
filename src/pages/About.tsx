
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Users, School } from "lucide-react";

const About = () => {
  const sections = [
    {
      title: "Our History",
      description: "Learn about the rich history and foundation of the Pentecostal Fellowship of Caritas University.",
      icon: <BookOpen className="h-10 w-10 text-pfcu-purple" />,
      link: "/history"
    },
    {
      title: "Leadership",
      description: "Meet our dedicated leaders who guide the fellowship with vision and purpose.",
      icon: <Users className="h-10 w-10 text-pfcu-purple" />,
      link: "/leadership"
    },
    {
      title: "Alumni",
      description: "Connect with our alumni network and see how they're making an impact beyond campus.",
      icon: <School className="h-10 w-10 text-pfcu-purple" />,
      link: "/alumni"
    }
  ];

  return (
    <MainLayout>
      <div className="bg-pfcu-light py-16 md:py-24">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-center mb-6">About PFCU</h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-gray-700 mb-12">
            The Pentecostal Fellowship of Caritas University is dedicated to fostering spiritual growth, community service, and leadership development.
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {sections.map((section) => (
              <Card key={section.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="mb-6">{section.icon}</div>
                  <h2 className="text-2xl font-bold font-display mb-4">{section.title}</h2>
                  <p className="mb-6 text-gray-700">{section.description}</p>
                  <Button asChild className="bg-pfcu-purple hover:bg-pfcu-dark text-white">
                    <Link to={section.link}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-display font-bold mb-6">Our Mission & Vision</h2>
              <p className="mb-4 text-gray-700">
                Our mission is to create a vibrant spiritual community that nurtures personal faith, academic excellence, and leadership skills among students at Caritas University.
              </p>
              <p className="mb-4 text-gray-700">
                We envision a fellowship where every member is empowered to grow spiritually, excel academically, and develop leadership skills that will impact the university and beyond.
              </p>
              <p className="text-gray-700">
                Through our various units and activities, we provide opportunities for service, worship, and community engagement, helping members discover and utilize their gifts for God's glory.
              </p>
            </div>
            <div className="order-1 md:order-2 bg-gray-100 h-72 md:h-80 rounded-lg shadow-md">
              {/* Placeholder for an image */}
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-500">Mission Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
