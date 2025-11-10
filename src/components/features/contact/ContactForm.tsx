"use client";

import { useFormState } from "react-dom";
import {
  submitContactForm,
  type FormState,
} from "@/app/(main)/(withFooter)/contact/actions";

const initialState: FormState = {
  message: "",
};

export default function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, initialState);

  if (state.message === "success") {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-emerald-400">送信しました</h2>
        <p className="mt-4 text-lg">
          お問い合わせいただきありがとうございます。
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          お名前
        </label>
        <div className="mt-2">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          メールアドレス
        </label>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          お問い合わせ内容
        </label>
        <div className="mt-2">
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      {state.message === "error" && (
        <p className="text-sm text-red-600">
          送信に失敗しました。もう一度お試しください。
        </p>
      )}

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          送信
        </button>
      </div>
    </form>
  );
}
