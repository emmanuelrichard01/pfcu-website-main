
import MainLayout from "@/components/layout/MainLayout";
import { Timeline } from "@/components/about/Timeline";

const History = () => {
  const timelineEvents = [
    {
      year: "2005",
      title: "Fellowship Founding",
      description: "PFCU was established by a small group of dedicated students seeking to create a spiritual community on campus."
    },
    {
      year: "2007",
      title: "First Campus Revival",
      description: "The fellowship organized its first major campus revival, attracting hundreds of students."
    },
    {
      year: "2010",
      title: "Ministry Units Formed",
      description: "Various ministry units were established to cater to different aspects of campus spiritual life."
    },
    {
      year: "2013",
      title: "Fellowship Hall Construction",
      description: "The university allocated a dedicated space for the fellowship's activities."
    },
    {
      year: "2016",
      title: "PFCU Conference Launch",
      description: "The first annual PFCU conference was held, bringing together students from various institutions."
    },
    {
      year: "2019",
      title: "Community Outreach Expansion",
      description: "PFCU expanded its outreach programs to surrounding communities, providing spiritual and material support."
    },
    {
      year: "2022",
      title: "Digital Ministry Launch",
      description: "The fellowship embraced technology, launching online services and resources for members."
    },
    {
      year: "2025",
      title: "20th Anniversary Celebration",
      description: "PFCU celebrates 20 years of impact on campus with special events and alumni reunions."
    }
  ];

  return (
    <MainLayout>
      <div className="bg-pfcu-light py-16 md:py-24">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-center mb-6">Our History</h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-gray-700">
            Tracing the journey of PFCU from its humble beginnings to its current impact.
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-16">
            <h2 className="text-3xl font-display font-bold mb-6 text-center">The PFCU Story</h2>
            <p className="mb-4 text-gray-700">
              The Pentecostal Fellowship of Caritas University (PFCU) began in 2005 with just seven students who shared a vision for a vibrant spiritual community on campus. Meeting initially in dormitory rooms for prayer and Bible study, these pioneers laid the foundation for what would become one of the most influential student organizations at the university.
            </p>
            <p className="mb-4 text-gray-700">
              As the fellowship grew, it faced numerous challenges, including limited meeting spaces and occasional opposition. However, the dedication of its members and the clear impact of their ministry soon earned recognition from university administrators, who eventually allocated a dedicated space for fellowship activities.
            </p>
            <p className="text-gray-700">
              Over the years, PFCU has evolved from a small prayer group to a comprehensive spiritual force on campus, with 16 different ministry units serving various aspects of student life. Today, the fellowship continues to grow, maintaining its founding principles while adapting to meet the spiritual needs of a new generation of students.
            </p>
          </div>

          <Timeline events={timelineEvents} />
        </div>
      </section>
    </MainLayout>
  );
};

export default History;
