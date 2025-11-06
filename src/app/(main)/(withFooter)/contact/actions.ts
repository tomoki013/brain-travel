'use server';

export type FormState = {
  message: string;
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // In a real application, you would handle the form submission here,
    // e.g., send an email, save to a database, etc.
    console.log('Contact Form Submission:');
    console.log(`  Name: ${name}`);
    console.log(`  Email: ${email}`);
    console.log(`  Message: ${message}`);

    return { message: 'success' };
  } catch (e) {
    console.error(e);
    return { message: 'error' };
  }
}
