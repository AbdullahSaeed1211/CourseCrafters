"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectCategory from "../components/SelectCategory";
import { TipTapEditor } from "../components/Editor";
import { UploadDropzone } from "@/app/lib/uploadthing";
import Theme from "../components/Theme";
import { useEffect, useState } from "react";
import { JSONContent } from "@tiptap/react";
import { useFormState } from "react-dom";
import { SellCourse, State } from "../actions";
import { toast } from "sonner";
import SubmitButton from "../components/SubmitButton";
import { redirect } from "next/navigation";

export default function Page() {
  const initialState: State = {
    status: undefined,
    message: "",
  };
  const [state, formAction] = useFormState(SellCourse, initialState);
  const [json, setJson] = useState<null | JSONContent>(null);
  const [images, setImages] = useState<null | string[]>(null);
  const [courseFile, SetCourseFile] = useState<null | string>(null);
  console.log(state?.errors);
  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      redirect("/");
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-14">
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Sell your Course with Ease </CardTitle>
            <CardDescription>
              Please describe your course here in detail
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-10">
            <div className="flex flex-col gap-y-2">
              <Label> Name</Label>
              <Input
                name="name"
                type="text"
                placeholder="Name of your Course"
                required
                minLength={3}
              />
              {state?.errors?.["name"]?.[0] && (
                <p className="text-destructive">
                  {state?.errors?.["name"]?.[0]}
                </p>
              )}
            </div>
            <div className="flex flex-col  gap-y-10 lg:gap-y-20">
              <Label> Category </Label>
              <SelectCategory />
              {state?.errors?.["category"]?.[0] && (
                <p className="text-destructive">
                  {state?.errors?.["category"]?.[0]}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <Theme />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Price</Label>
              <Input type="number" name="price" placeholder="19$ " required min={1} />
              {state?.errors?.["price"]?.[0] && (
                <p className="text-destructive">
                  {state?.errors?.["price"]?.[0]}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <Label> Small Summary </Label>
              <Textarea
                name="smallDescription"
                placeholder="Briefly summarize your course to captivate your audience."
                required
                minLength={10}
              />
              {state?.errors?.["smallDescription"]?.[0] && (
                <p className="text-destructive">
                  {state?.errors?.["smallDescription"]?.[0]}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <input
                type="hidden"
                name="description"
                value={JSON.stringify(json)
                }
              />
              <Label>Description</Label>
              <TipTapEditor json={json} setJson={setJson} />
              {state?.errors?.["description"]?.[0] && (
                <p className="text-destructive">
                  {state?.errors?.["description"]?.[0]}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <input
                type="hidden"
                name="images"
                value={JSON.stringify(images)}
              />
              <Label>Course Images</Label>
              <UploadDropzone
                className="ut-label:text-[#16A085] ut-button:bg-[#16A085]"
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setImages(res.map((item) => item.url));
                  toast.success("Your images have been uploaded!");
                }}
                onUploadError={(error: Error) => {
                  toast.error("Something went wrong with images, try again");
                }}
              />
              {state?.errors?.["images"]?.[0] && (
                <p className="text-destructive">
                  {state?.errors?.["images"]?.[0]}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-y-2">
              <input
                type="hidden"
                name="courseFile"
                value={courseFile ?? ""}
              />
              <Label>Course File</Label>
              <UploadDropzone
                className="ut-label:text-[#16A085] ut-button:bg-[#16A085]"
                onClientUploadComplete={(res) => {
                  SetCourseFile(res[0].url);
                  toast.success("Your Course file has been uploaded!");
                }}
                endpoint="courseFileUpload"
                onUploadError={(error: Error) => {
                  toast.error("Something went wrong with courseFile, try again");
                }}
              />
              {state?.errors?.["courseFile"]?.[0] && (
                <p className="text-destructive">
                  {state?.errors?.["courseFile"]?.[0]}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="mt-5">
            <SubmitButton title="Create Course" />
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
