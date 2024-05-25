import { CourseCard } from "@/app/components/CourseCard";
import prisma from "@/app/lib/db";
import { type CategoryTypes } from "@prisma/client";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";


async function getData(category: string) {
  let input;
  switch (category) {
    case "creativearts": {
      input = "creativearts";
      break;
    }
    case "business": {
      input = "business";
      break;
    }
    case "tech": {
      input = "tech";
      break;
    }
    case "all": {
      input = undefined;
      break;
    }
    default: {
      return notFound();
    }
  }
  const data = prisma.course.findMany({
    where: {
      category: input as CategoryTypes,
    },
    select: {
      id: true,
      name: true,
      smallDescription: true,
      images: true,
      price: true,
    },
  });
  return data;
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  noStore();
  const data = await getData(params.category);
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-10 mt-4">
        {data.map((course) => (
          <CourseCard key={course.id} images={course.images} price={course.price} name={course.name} smallDescription={course.smallDescription} id={course.id} />
        ))}
      </div>
    </section>
  );
}
