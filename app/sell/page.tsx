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
import { Button } from "@/components/ui/button";
import Theme from "../components/Theme";
import { useEffect, useState } from "react";
import { JSONContent } from "@tiptap/react";
import { useFormState } from "react-dom";
import { SellProduct, State } from "../actions";
import { toast } from "sonner";

export default function Page() {
  const initialState: State = {
    status: undefined,
    message: "",
  };
  const [state, formAction] = useFormState(SellProduct, initialState);
  const [json, setJson] = useState<null | JSONContent>(null);
  const [images, setImages] = useState<null | string[]>(null);
  const [productFile, SetProductFile] = useState<null | string>(null);
  console.log(state?.errors);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    }else if(state.status === "error"){
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
              <Input type="number" name="price" placeholder="19$" />
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
                value={JSON.stringify(json)}
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
                }}
                onUploadError={(error: Error) => {
                  throw new Error(`${error}`);
                }}
              />
              {state?.errors?.["images"]?.[0] && (
                <p className="text-destructive">
                  {state?.errors?.["images"]?.[0]}
                </p>
              )}
            </div>
            {/* <div className="flex flex-col gap-y-2">
              <input type="hidden" name="productFile" value={productfile ?? ""} />
              <Label>Course File</Label>
              <UploadDropzone
                className="ut-label:text-[#16A085] ut-button:bg-[#16A085]"
                onClientUploadComplete={(res) => {
                  setProductFile(res[0].url);
                }}
                endpoint="productFileUpload"
                onUploadError={(error: Error) => {
                  throw new Error(`${error}`);
                }}
              />
              {state?.errors?.["productFile"]?.[0] && (
                <p className="text-destructive">
                  {state?.errors?.["productFile"]?.[0]}
                </p>
              )}
            </div> */}
            <div className="flex flex-col gap-y-2">
          <input type="hidden" name="productFile" value={productFile ?? ""} />
          <Label>Product File</Label>
          <UploadDropzone
          className="ut-label:text-[#16A085] ut-button:bg-[#16A085]"
            onClientUploadComplete={(res) => {
              SetProductFile(res[0].url);
              toast.success("Your Product file has been uplaoded!");
            }}
            endpoint="productFileUpload"
            onUploadError={(error: Error) => {
              toast.error("Something went wrong, try again");
            }}
          />
          {state?.errors?.["productFile"]?.[0] && (
            <p className="text-destructive">
              {state?.errors?.["productFile"]?.[0]}
            </p>
          )}
        </div>
          </CardContent>
          <CardFooter className="mt-5">
            <Button type="submit">Upload Course</Button>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
