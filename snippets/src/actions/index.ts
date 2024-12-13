'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/db';

export async function editSnippet(id: number, code: string) {
    await db.snippet.update({
        where: { id },
        data: { code }
    });

    revalidatePath(`/snippets/${id}`);
    redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: number) {
    await db.snippet.delete({ where: { id } });

    revalidatePath('/');
    redirect('/');
}

export async function createSnippet(formState: {message: string}, formData: FormData) {
    
    try {
    // Check the user's inputs and make sure they're valid
    const title = formData.get('title');
    const code = formData.get('code');

    if (typeof title !== 'string' || title.length < 3) {
        return { message: 'Please provide a title that is at least 3 characters long.' };
    }

    if (typeof code !== 'string' || code.length < 10) {
        return { message: 'Please provide code that is at least 10 characters long.' };
    }

    // Create a new record in the database
    await db.snippet.create({
        data: {
            title,
            code,
        }
    });

} catch (err: unknown) {

    if (err instanceof Error) {
        // If an error occurred, return the error message
        return { message: err.message };
}   else {
    return {
        message: 'An unknown error occurred. Please try again.'
    }
}}

    revalidatePath('/');
    // Redirect the user back to the root route
    redirect('/');	

}