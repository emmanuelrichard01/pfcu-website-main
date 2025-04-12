
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface TestimonyCardProps {
  text: string;
  name: string;
  role: string;
}

const TestimonyCard = ({ text, name, role }: TestimonyCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 relative">
        <Quote className="absolute top-6 left-6 w-12 h-12 text-pfcu-gold opacity-10" />
        <div className="pt-8 pb-4">
          <p className="text-gray-700 italic mb-6 relative z-10">"{text}"</p>
          <div>
            <p className="font-medium text-pfcu-purple">{name}</p>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TestimonySection = () => {
  const testimonies = [
    {
      text: "PFCU has been my spiritual home away from home. Through the fellowship, I've grown in my faith and formed lifelong friendships.",
      name: "Sarah Johnson",
      role: "4th Year Student",
    },
    {
      text: "Being part of the Choir Unit has helped me discover and develop my musical gifts while serving God. I'm grateful for the leadership opportunities.",
      name: "Michael Okafor",
      role: "3rd Year Student",
    },
    {
      text: "The fellowship provided me with the spiritual foundation I needed during my university years. Now as an alumnus, I still cherish those moments.",
      name: "Grace Adebayo",
      role: "PFCU Alumni",
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">Testimonies</h2>
          <p className="section-subtitle">Hear from our members</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonies.map((testimony, index) => (
            <TestimonyCard key={index} {...testimony} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonySection;
