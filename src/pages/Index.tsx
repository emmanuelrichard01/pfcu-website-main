
import MainLayout from "@/components/layout/MainLayout";
import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import UnitsSection from "@/components/home/UnitsSection";
import LeadershipSection from "@/components/home/LeadershipSection";
import EventsSection from "@/components/home/EventsSection";
import TestimonySection from "@/components/home/TestimonySection";
import ContactSection from "@/components/home/ContactSection";

const Index = () => {
  return (
    <MainLayout>
      <Hero />
      <AboutSection />
      <UnitsSection />
      <LeadershipSection />
      <EventsSection />
      <TestimonySection />
      <ContactSection />
    </MainLayout>
  );
};

export default Index;
