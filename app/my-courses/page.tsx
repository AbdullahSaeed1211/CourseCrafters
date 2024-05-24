import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "../lib/db";
import { CourseCard } from "../components/CourseCard";

async function getData(UserId: string) {
  const data = await prisma.course.findMany({
    where: { UserId: UserId },
    select: {
      name: true,
      images: true,
      smallDescription: true,
      price: true,
      id: true,
    },
  });
  return data;
}

export default async function page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    throw new Error("You are not logged in");
  }
  const data = await getData(user.id);

  return (
    <section className="max-7-xl px-4 md:px-8">
      <h1 className="text-2xl font-bold"></h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:grid-cols-2 mt-4">
        {data.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            images={item.images}
            name={item.name}
            price={item.price}
            smallDescription={item.smallDescription}
          />
        ))}
      </div>
    </section>
  );
}
