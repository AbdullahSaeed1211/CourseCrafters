'use client'
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from 'lucide-react';


export default function SubmitButton({title}:{title: string}) {
    const {pending} = useFormStatus();
return (
    <>
    {pending ? (
        <Button disabled><LoaderCircle  className="mr-2 h-4 w-4 animate-spin" /> Please Wait</Button>
    ): ( 
        <Button type="submit" className="">{title}</Button>
    )}
    </>
)
}