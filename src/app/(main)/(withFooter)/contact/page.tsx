import ContactForm from "@/components/features/contact/ContactForm";

export default function ContactPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-12">
            お問い合わせ
          </h1>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
