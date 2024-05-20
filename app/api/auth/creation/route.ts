import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
export async function GET() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    // check if user exists
    if (!user || user === null || !user.id) {
        throw new Error("Something went wrong...");
    }
    // check if user exists in db
    let dbUser = await prisma.user.findUnique({
        where: {
            id: user.id ,//from kinde
        }
    });
    // if user does not exist in db, create user
    if (!dbUser) {
        dbUser = await prisma.user.create({
            data: {
                id: user.id,
                firstName: user.given_name ?? "",
                lastName: user.family_name ?? "",
                email: user.email ?? "",
                profileImage: user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
            }
        });
    }
    return NextResponse.redirect("http://localhost:3000");
}