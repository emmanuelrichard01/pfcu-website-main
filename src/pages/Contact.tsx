
import MainLayout from "@/components/layout/MainLayout";
import ContactHeader from "@/components/contact/ContactHeader";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import ContactMap from "@/components/contact/ContactMap";

const Contact = () => {
  return (
    <MainLayout>
      <ContactHeader />

      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <ContactInfo />
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Send a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <ContactMap />
    </MainLayout>
  );
};

export default Contact;
