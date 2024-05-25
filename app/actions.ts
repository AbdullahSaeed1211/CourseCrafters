'use server'
import { z } from 'zod'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import prisma from './lib/db'; // adjust the import path as necessary
import { CategoryTypes } from '@prisma/client';
import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
export type State = {
    status: 'error' | 'success' | undefined;
    errors?: {
        [key: string]: string[];
    };
    message?: string | null;

}

// course schema
const courseSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
    category: z.string().min(1, { message: 'Category is required' }),
    price: z.number().min(1, { message: 'Price must be bigger than 1' }),
    smallDescription: z.string().min(10, { message: 'Please summarise your course more' }),
    description: z.string().min(10, { message: 'Please provide a detailed description of your course' }),
    images: z.array(z.string(), { message: 'images are required' }),
    textColor: z.string().min(1, { message: 'Please provide a text color' }),
    backgroundColor: z.string().min(1, { message: 'Please provide a background color' }),
    buttonColor: z.string().min(1, { message: 'Please provide a button color' }),
    courseFile: z
        .string()
        .min(1, { message: "Pleaes upload a zip of your course" }),

})

// User Settings schema   
const userSettingsSchema = z.object({
    firstName: z
        .string()
        .min(1, { message: 'Must contain atleast 3 characters' })
        .or(z.literal(''))
        .optional(),
    lastName: z
        .string().
        min(1, { message: 'Last Name is required' })
        .or(z.literal(''))
        .optional()
    ,

})

export async function SellCourse(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
        throw new Error('You must be logged in to sell a course')

    }
    const validateFields = courseSchema.safeParse({
        name: formData.get('name'),
        category: formData.get('category'),
        price: Number(formData.get('price')),
        smallDescription: formData.get('smallDescription'),
        description: formData.get('description'),
        images: JSON.parse(formData.get('images') as string),
        textColor: formData.get('textcolor'),
        backgroundColor: formData.get('backgroundcolor'),
        buttonColor: formData.get('buttoncolor'),
        courseFile: formData.get('courseFile'),
    });
    if (!validateFields.success) {
        const state: State = {
            status: 'error',
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Oops something went wrong with your inputs'
        };

        return state;
    }
    console.log('Prisma Client:', prisma);

    const data = await prisma.course.create({
        data: {
            name: validateFields.data.name,
            category: validateFields.data.category as CategoryTypes,
            price: validateFields.data.price,
            smallDescription: validateFields.data.smallDescription,
            description: JSON.parse(validateFields.data.description),
            courseFile: validateFields.data.courseFile,
            images: validateFields.data.images,
            textColor: validateFields.data.textColor,
            backgroundColor: validateFields.data.backgroundColor,
            buttonColor: validateFields.data.buttonColor,
            UserId: user.id,
        }
    });

    // const state: State = {
    //     status: 'success',
    //     message: 'Course has been successfully uploaded'
    // };

    // return state;
    return redirect(`/course/${user.id}`);
}


//settings form

export async function UpdateUserSettings(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        throw new Error('You must be logged in to update your settings');
    }
    const validateFields = userSettingsSchema.safeParse({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
    });
    if (!validateFields.success) {
        const state: State = {
            status: 'error',
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Oops something went wrong with your inputs'
        };
        return state;
    }
    const data = await prisma.user.update({
        where: { id: user.id },
        data: {
            firstName: validateFields.data.firstName,
            lastName: validateFields.data.lastName,
        }
    });
    const state: State = {
        status: 'success',
        message: 'Your settings have been successfully updated'
    };
    return state;
}

//stripe

export async function BuyCourse(formData: FormData) {
    const id = formData.get('id') as string;
    const data = await prisma.course.findUnique(
        //     {
        //         where: { id },
        //         select: {
        //             name: true,
        //             smallDescription: true,
        //             price: true,
        //             images: true,
        //         }
        //     }
        // );
        // const session = await stripe.checkout.sessions.create({
        //     mode: 'payment',
        //     line_items: [
        //         {
        //             price_data: {
        //                 currency: 'usd',
        //                 unit_amount: Math.round(data?.price as number * 100),
        //                 product_data: {
        //                     name: data?.name as string,
        //                     description: data?.smallDescription,
        //                     images: data?.images,
        //                 }

        //             },
        //             quantity: 1,
        //         },
        //     ],
        //     success_url: 'http://localhost:3000/payment/success',
        //     cancel_url: 'http://localhost:3000/payment/cancel',

        // });
        {
            where: {
                id: id,
            },
            select: {
                name: true,
                smallDescription: true,
                price: true,
                images: true,
                courseFile: true,
                User: {
                    select: {
                        connectedAccountId: true,
                    },
                },
            },
        });

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    unit_amount: Math.round((data?.price as number) * 100),
                    product_data: {
                        name: data?.name as string,
                        description: data?.smallDescription,
                        images: data?.images,
                    },
                },
                quantity: 1,
            },
        ],
        metadata: {
            link: data?.courseFile as string,
        },

        payment_intent_data: {
            application_fee_amount: Math.round((data?.price as number) * 100) * 0.1,
            transfer_data: {
                destination: data?.User?.connectedAccountId as string,
            },
        },
        success_url:
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000/payment/success"
                : "https://localhost:3000/payment/success",
        cancel_url:
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000/payment/cancel"
                : "https://localhost:3000/payment/cancel",
    });

    return redirect(session.url as string);
}

export async function CreateStripeAccoutnLink() {
    const { getUser } = getKindeServerSession();

    const user = await getUser();

    if (!user) {
        throw new Error();
    }

    const data = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
        select: {
            connectedAccountId: true,
        },
    });

    const accountLink = await stripe.accountLinks.create({
        account: data?.connectedAccountId as string,
        refresh_url:
            process.env.NODE_ENV === "development"
                ? `http://localhost:3000/billing`
                : `http://localhost:3000/billing`,

        return_url:
            process.env.NODE_ENV === "development"
                ? `http://localhost:3000/return/${data?.connectedAccountId}`
                : `https://localhost:3000/return/${data?.connectedAccountId}`,
        type: "account_onboarding",
    });

    return redirect(accountLink.url);
}

export async function GetStripeDashboardLink() {
    const { getUser } = getKindeServerSession();

    const user = await getUser();

    if (!user) {
        throw new Error();
    }

    const data = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
        select: {
            connectedAccountId: true,
        },
    });

    const loginLink = await stripe.accounts.createLoginLink(
        data?.connectedAccountId as string
    );

    return redirect(loginLink.url);
}