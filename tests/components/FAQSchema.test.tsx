import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import FAQSchema from "@/components/FAQSchema";

describe("FAQSchema — Schema.org FAQPage JSON-LD Testleri", () => {
  it("verilen soru ve cevapları Schema.org FAQPage formatında script olarak render etmeli", () => {
    const mockItems = [
      {
        q: "Kıdem tazminatı nasıl hesaplanır?",
        a: "Her tam yıl için 30 günlük brüt giydirilmiş ücret üzerinden hesaplanır.",
      },
      {
        q: "İhbar süresi ne kadardır?",
        a: "Hizmet süresine göre 2 ile 8 hafta arasında değişir.",
      },
    ];

    const { container } = render(<FAQSchema items={mockItems} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script).toBeInTheDocument();
    expect(script?.textContent).toBeDefined();

    const parsed = JSON.parse(script!.textContent!);
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(parsed["@type"]).toBe("FAQPage");
    expect(parsed.mainEntity).toHaveLength(2);

    expect(parsed.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "Kıdem tazminatı nasıl hesaplanır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Her tam yıl için 30 günlük brüt giydirilmiş ücret üzerinden hesaplanır.",
      },
    });

    expect(parsed.mainEntity[1]).toEqual({
      "@type": "Question",
      name: "İhbar süresi ne kadardır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hizmet süresine göre 2 ile 8 hafta arasında değişir.",
      },
    });
  });

  it("boş liste iletildiğinde hiçbir script etiketi render etmemeli", () => {
    const { container } = render(<FAQSchema items={[]} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeNull();
  });
});
