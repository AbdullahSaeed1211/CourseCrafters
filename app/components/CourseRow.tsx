import Link from "next/link";
import { CourseCard, LoadingCourseCard } from "./CourseCard";
import prisma from "../lib/db";
import { notFound } from "next/navigation";
import { link } from "fs";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface iAppProps {
  category: "newest" | "creativearts" | "business" | "tech";
}

async function getData({ category }: iAppProps) {
  switch (category) {
    case "newest": {
      const data = await prisma.course.findMany({
        select: {
          id: true,
          name: true,
          smallDescription: true,
          images: true,
          price: true,
        },
        take: 3,
        orderBy: {
          createdAt: "desc",
        },
      });
      return { data: data, title: "Newest Courses", link: "/courses/all" };
    }
    case "creativearts": {
      const data = await prisma.course.findMany({
        where: {
          category: "creativearts",
        },
        select: {
          id: true,
          name: true,
          smallDescription: true,
          images: true,
          price: true,
        },
        take: 3,
      });
      return {
        data: data,
        title: "Creative Arts",
        link: "/courses/creativearts",
      };
    }
    case "business": {
      const data = await prisma.course.findMany({
        where: {
          category: "business",
        },
        select: {
          id: true,
          name: true,
          smallDescription: true,
          images: true,
          price: true,
        },
        take: 3,
      });
      return { data: data, title: "Business", link: "/courses/business" };
    }
    case "tech": {
      const data = await prisma.course.findMany({
        where: {
          category: "tech",
        },
        select: {
          id: true,
          name: true,
          smallDescription: true,
          images: true,
          price: true,
        },
        take: 3,
      });
      return { data: data, title: "Tech", link: "/courses/tech" };
    }
    default: {
      return notFound();
    }
  }
}

export function CourseRow({ category }: iAppProps) {
  return (
    <section className="mt-12">
      <Suspense fallback={<LoadingState/>}>
        <LoadRows category={category} />
      </Suspense>
    </section>
  );
}

async function LoadRows({ category }: iAppProps) {
  const data = await getData({ category: category });

  return (
    <>
      <div className="md:flex md:items-center md:justify-between">
        <h2 className="text-2xl font-extrabold tracking-tighter">
          {data.title}
        </h2>
        <Link
          href={data.link}
          className="text-sm hidden font-medium text-primary hover:text-primary/90 md:block">
          All Courses
          <span className="">&rarr;</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 mt-4 gap-10">
        {data.data.map((course) => (
          <CourseCard
            key={course.id}
            images={course.images}
            name={course.name}
            smallDescription={course.smallDescription}
            price={course.price}
            id={course.id}
          />
        ))}
      </div>
    </>
  );
}

function LoadingState(){
  return (
    <div>
      <Skeleton className="h-8 w-56"/>
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-10 lg:grid-cols-3">
      <LoadingCourseCard/>
      <LoadingCourseCard/>
      <LoadingCourseCard/>
      </div>
    </div>
  );
}