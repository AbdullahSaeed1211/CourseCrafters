'use server'
import { z } from 'zod'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import prisma from './lib/db'; // adjust the import path as necessary
import { CategoryTypes } from '@prisma/client';
export type State = {
    status: 'error' | 'success' | undefined;
    errors?: {
        [key: string]: string[];
    };
    message?: string | null;

}
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

    await prisma.course.create({
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

    const state: State = {
        status: 'success',
        message: 'Course has been successfully uploaded'
    };

    return state;
}