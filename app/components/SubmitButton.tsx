"use client";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";

export function SubmitButton({ title }: { title: string }) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Please Wait
        </Button>
      ) : (
        <Button type="submit" className="">
          {title}
        </Button>
      )}
    </>
  );
}

export function BuyButton({ price }: { price: number }) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled size="lg">
          <LoaderCircle className="mt-10 w-full animate-spin" /> Please Wait
        </Button>
      ) : (
        <Button className="w-full mt-6" type="submit" size="lg">
          Buy for $ {price}
        </Button>
      )}
    </>
  );
}
