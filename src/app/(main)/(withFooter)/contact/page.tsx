import { ContactForm } from "@/components/features/contact/ContactForm";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            お問い合わせ
          </h1>
          <p className="mt-4 text-xl text-neutral-400">
            ご意見、ご感想、バグ報告などはこちらからお送りください。
          </p>
        </div>

        <div className="mt-16">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
