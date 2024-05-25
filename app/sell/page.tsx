
import { Card } from "@/components/ui/card";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import SellForm from "../components/form/SellForm";


export default async function Page() {
  const {getUser} = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    throw new Error("You are not logged in");
  }
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-14">
      <Card>
       <SellForm />
      </Card>
    </section>
  );
}
