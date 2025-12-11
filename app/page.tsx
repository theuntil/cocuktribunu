import HeroSection from "../components/home/Hero";
import ProjectGoals from "../components/home/ProjectGoals";
import Acti from "../components/home/ActivitiesSection";
import Reasons from "../components/home/ReasonsSection";
import Gallery from "../components/home/Gallery";

export default function HomePage() {
  return (
    <div
      className="
       min-h-screen
bg-white
dark:bg-black
transition-colors duration-300

      "
    >
      <HeroSection />
      <ProjectGoals />
      <Gallery />
      <Acti />
       <Reasons />
    </div>
  );
}
