import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/app/lib/db";
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
            id: user.id,//from kinde
        }
    });
    // if user does not exist in db, create user
    if (!dbUser) {
        // const account = await stripe.accounts.create({
        //     email: user.email as string,
        //     country: 'IN',
        //     controller: {
        //         stripe_dashboard: {
        //             type: 'none',
        //         },
        //         fees: {
        //             payer: 'application',
        //         },
        //         losses: {
        //             payments: 'application',
        //         },
        //         requirement_collection: 'application',
        //     },
        //     capabilities: {
        //         transfers: {
        //             requested: true,
        //         },
        //     },
        //     tos_acceptance: {
        //         service_agreement: 'recipient',

        //     }
        // });
        dbUser = await prisma.user.create({
            data: {
                id: user.id,
                firstName: user.given_name ?? "",
                lastName: user.family_name ?? "",
                email: user.email ?? "",
                profileImage: user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
                // connectedAccountId: account.id

            }
        });
    }
    return NextResponse.redirect("http://localhost:3000");
}