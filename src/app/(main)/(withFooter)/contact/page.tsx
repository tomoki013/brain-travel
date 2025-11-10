// import ContactForm from "@/components/features/contact/ContactForm";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            お問い合わせ
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Geo
            Linkerに関するご意見、ご感想、バグ報告など、お気軽にご連絡ください。
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="mailto:gaomuyouxi81@gmail.com"
              className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              <Mail className="h-5 w-5" aria-hidden="true" />
              メールで問い合わせる
            </Link>
          </div>
          {/* <ContactForm /> */}
        </div>
      </div>
    </div>
  );
}
