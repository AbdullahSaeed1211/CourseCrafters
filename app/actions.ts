'use server'
import { z } from 'zod'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
export type State = {
    status: 'error' | 'success' | undefined;
    errors?: {
        [key: string]: string[];
    };
    message?: string | null;

}
const productSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
    category: z.string().min(1, { message: 'Category is required' }),
    price: z.number().min(1, { message: 'Price must be bigger than 1' }),
    smallDescription: z.string().min(10, { message: 'Please summarise your course more' }),
    description: z.string().min(10, { message: 'Please provide a detailed description of your course' }),
    images: z.array(z.string(), { message: 'images are required' }),
    textColor: z.string().min(1, { message: 'Please provide a text color' }),
    backgroundColor: z.string().min(1, { message: 'Please provide a background color' }),
    buttonColor: z.string().min(1, { message: 'Please provide a button color' }),
    productFile: z
        .string()
        .min(1, { message: "Pleaes upload a zip of your product" }),

})

export async function SellProduct(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
        throw new Error('You must be logged in to sell a course')

    }
    const ValidateFields = productSchema.safeParse({
        name: formData.get('name'),
        category: formData.get('category'),
        price: Number(formData.get('price')),
        smallDescription: formData.get('smallDescription'),
        description: formData.get('description'),
        images: JSON.parse(formData.get('images') as string),
        textColor: formData.get('textcolor'),
        backgroundColor: formData.get('backgroundcolor'),
        buttonColor: formData.get('buttoncolor'),
        productFile: formData.get('productFile'),
    });
    if (!ValidateFields.success) {
        const state: State = {
            status: 'error',
            errors: ValidateFields.error.flatten().fieldErrors,
            message: 'Oops something went wrong with your inputs'
        };
        return state;
    }
    const state: State = {
        status: 'success',
        message: 'Course has been successfully uploaded'
    };
    return state;
}