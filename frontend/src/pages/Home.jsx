import Hero from "../components/Hero";
import PopularExams from "../components/PopularExams";
import WhyChoose from "../components/WhyChoose";
import FeaturedCourses from "../components/FeaturedCourses";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <main>
        <Hero />

        <PopularExams />

        <WhyChoose />

        <FeaturedCourses />
      </main>

      <Footer />
    </>
  );
}

export default Home;