import Link from "next/link";
import prisma from "../lib/db";
import { ArrowBigLeft, ArrowRight } from "lucide-react";
import { CourseCard } from "./CourseCard";
async function getData() {
  const data = await prisma.course.findMany({
    select: {
      price: true,
      smallDescription: true,
      images: true,
      category: true,
      id: true,
      name: true,
    },
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}

export async function NewestCourses() {
  const data = await getData();
  return (
    <section className="mt-12">
      <div className="md:flex md:items-center md:justify-between">
        <h2 className="text-2xl font-extrabold tracking-tighter">
          Newest Courses
        </h2>
        <Link
          href="#"
          className="text-sm hidden font-medium text-primary hover:text-primary/90 md:block">
          All Courses
          <span className="">&rarr;</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 mt-4 gap-10">
        {data.map((course) => (
           <CourseCard key={course.id} images={course.images} name={course.name} smallDescription={course.smallDescription} price={course.price} id={course.id} />
        ))}
      </div>
    </section>
  );
}
