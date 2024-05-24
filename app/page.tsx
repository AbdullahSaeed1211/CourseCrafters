import { CourseRow } from "./components/CourseRow";
import { NewestCourses } from "./components/NewestCourses";

export default function Home() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
      <div className="max-w-3xl mx-auto text-2xl sm:text-5xl lg:text-6xl font-semibold text-center">
        <h1 className="text-primary">Showcase and Sell Your Courses Easily</h1>
        <p className="lg:text-lg text-muted-foreground mx-auto mt-5 w-[90%] font-normal text-base">
          Create stunning sales pages with customizable themes and integrated
          pre-order or purchase links. No tech skills required.
        </p>
      </div>
      {/* <NewestCourses />
       */}
      <CourseRow category="newest" />
      <CourseRow category="tech" />
      <CourseRow category="business" />
      <CourseRow category="creativearts" />
    </section>
  );
}
