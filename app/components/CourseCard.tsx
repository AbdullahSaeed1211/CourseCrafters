import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
interface iAppProps {
  images: string[];
  name: string;
  price: number;
  smallDescription: string;
  id: string;
}

export function CourseCard({
  images,
  name,
  price,
  smallDescription,
  id,
}: iAppProps) {
  return (
    <div className="rounded-lg ">
      <Carousel className="w-full mx-auto">
        <CarouselContent>
          {images.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[230px] ">
                <Image
                  src={item}
                  alt="course image"
                  fill
                  className="object-fit w-full h-full rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-16" />
        <CarouselNext className="mr-16" />
      </Carousel>
      <div className="flex justify-between items-center mt-2">
        <h1 className="font-semibold text-xl">{name}</h1>
        <h3 className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/10">
          ${price}
        </h3>
      </div>
      <p className="text-gray-600 text-sm line-clamp-2 mt-2">
        {smallDescription}
      </p>
      <Button asChild className="mt-5 w-full">
        <Link href={`/course/${id}`}>Learn More !</Link>
      </Button>
    </div>
  );
}
