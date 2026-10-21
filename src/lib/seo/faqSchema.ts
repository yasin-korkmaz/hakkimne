import { FAQ_ITEMS, type FaqItem } from "@/content/faq";

export interface FaqSchemaQuestion {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

export interface FaqPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: FaqSchemaQuestion[];
}

/**
 * generateFaqSchema — FAQ_ITEMS listesini Schema.org FAQPage JSON-LD yapısına dönüştürür.
 */
export function generateFaqSchema(items: FaqItem[] = FAQ_ITEMS): FaqPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
