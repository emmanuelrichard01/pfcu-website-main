
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AlumniTestimonyProps {
  name: string;
  graduationYear: string;
  role: string;
  testimony: string;
  initial: string;
}

const AlumniTestimony = ({ name, graduationYear, role, testimony, initial }: AlumniTestimonyProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 border-2 border-pfcu-purple">
            <AvatarFallback className="bg-pfcu-light text-pfcu-purple">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-bold">{name}</h3>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">Class of {graduationYear}</Badge>
              <span className="text-sm text-gray-600">{role}</span>
            </div>
            <p className="text-gray-700 italic">"{testimony}"</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Alumni = () => {
  const alumniTestimonies = [
    {
      name: "Dr. Emmanuel Okonkwo",
      graduationYear: "2010",
      role: "Medical Doctor",
      testimony: "PFCU shaped my approach to medicine by teaching me to see patients not just as cases but as whole persons with spiritual needs as well as physical ones.",
      initial: "EO"
    },
    {
      name: "Ada Nwosu",
      graduationYear: "2012",
      role: "Corporate Lawyer",
      testimony: "The leadership skills I developed at PFCU have been invaluable in my legal career. I learned to stand firm in my convictions while respecting diverse perspectives.",
      initial: "AN"
    },
    {
      name: "Pastor Chinedu Eze",
      graduationYear: "2008",
      role: "Full-time Minister",
      testimony: "My calling to full-time ministry was confirmed during my time at PFCU. The mentorship I received there prepared me for my current role leading a growing church.",
      initial: "CE"
    },
    {
      name: "Ngozi Okafor",
      graduationYear: "2015",
      role: "Entrepreneur",
      testimony: "The principles of integrity and excellence I learned at PFCU guide my business decisions daily. My time there taught me that success comes from serving others well.",
      initial: "NO"
    },
    {
      name: "Victor Adeyemi",
      graduationYear: "2013",
      role: "Software Engineer",
      testimony: "Being part of the Technical Unit at PFCU sparked my interest in technology. Today, I lead a team developing solutions that are making a positive impact globally.",
      initial: "VA"
    },
    {
      name: "Blessing Uche",
      graduationYear: "2017",
      role: "Educational Consultant",
      testimony: "My experience teaching at Bible study sessions in PFCU discovered my passion for education. Now I help schools develop curriculum that nurtures both mind and spirit.",
      initial: "BU"
    }
  ];

  return (
    <MainLayout>
      <div className="bg-pfcu-light py-16 md:py-24">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-center mb-6">Alumni Network</h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-gray-700">
            Our alumni are making a difference in various sectors around the world.
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-display font-bold mb-6 text-center">Alumni Impact</h2>
            <p className="mb-4 text-gray-700 text-center max-w-3xl mx-auto">
              Our alumni carry the values and vision of PFCU into their various fields, making significant contributions to society and representing Christ in their workplaces.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {alumniTestimonies.map((alumni) => (
              <AlumniTestimony key={alumni.name} {...alumni} />
            ))}
          </div>
          
          <div className="bg-pfcu-purple/10 p-8 rounded-lg">
            <h2 className="text-2xl font-display font-bold mb-6 text-center">Join Our Alumni Network</h2>
            <p className="mb-6 text-center">
              Are you a former member of PFCU? Connect with fellow alumni, mentor current students, and stay informed about fellowship events.
            </p>
            <div className="flex justify-center">
              <a 
                href="mailto:alumni@pfcu.org" 
                className="bg-pfcu-purple hover:bg-pfcu-dark text-white px-6 py-3 rounded-md transition-colors inline-flex items-center"
              >
                Contact Alumni Coordinator
              </a>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Alumni;
