import { ReactNode } from "react";
import { Brush, Building, Cpu } from "lucide-react";
interface iAppProps {
  name: string;
  title: string;
  image: ReactNode;
  id: number;
}

export const categoryItems: iAppProps[] = [
  {
    id: 0,
    name: "creativearts",
    title: "Creative Arts",
    image: <Brush />,
  },
  {
    id: 1,
    name: "business",
    title: "Business",
    image: <Building />,
  },
  {
    id: 2,
    name: "tech",
    title: "Tech",
    image: <Cpu />,
  },
];

