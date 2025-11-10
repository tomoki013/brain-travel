"use client";

import { useFormState } from "react-dom";
import {
  submitContactForm,
  type FormState,
} from "@/app/(main)/(withFooter)/contact/actions";
import { Button } from "@/components/ui/Button";

const initialState: FormState = {
  message: "",
};

export default function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, initialState);

  if (state.message === "success") {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-emerald-400">送信しました</h2>
        <p className="mt-4 text-lg text-neutral-300">
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
          className="block text-sm font-medium leading-6 text-neutral-300"
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
            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-neutral-300"
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
            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium leading-6 text-neutral-300"
        >
          お問い合わせ内容
        </label>
        <div className="mt-2">
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      {state.message === "error" && (
        <p className="text-sm text-red-500">
          送信に失敗しました。もう一度お試しください。
        </p>
      )}

      <div>
        <Button type="submit" className="w-full">
          送信
        </Button>
      </div>
    </form>
  );
}
