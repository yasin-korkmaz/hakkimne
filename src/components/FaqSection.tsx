import React from "react";
import { FAQ_ITEMS } from "@/content/faq";

export default function FaqSection() {
  return (
    <section aria-labelledby="faq-heading" className="w-full bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Sıkça Sorulan Sorular
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Kıdem ve ihbar tazminatına dair yasal kurallar, tavan uygulaması ve hak kazanma koşulları.
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.id}
            className="group py-4 first:pt-0 last:pb-0 cursor-pointer"
          >
            <summary className="flex items-center justify-between font-semibold text-gray-900 text-sm sm:text-base hover:text-blue-600 transition-colors list-none">
              <span>{item.question}</span>
              <span className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-gray-400 group-hover:text-blue-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </summary>
            <div className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed pl-1 pr-4">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
