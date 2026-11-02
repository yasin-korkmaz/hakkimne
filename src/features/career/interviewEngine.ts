import type {
  InterviewRole,
  InterviewQuestion,
  InterviewEvaluation,
  StarEvaluation,
} from "./types";

/**
 * interviewEngine.ts — Metin Tabanlı Mülakat Simülatörü ve STAR Değerlendirme Motoru
 */

export const ROLE_LABELS: Record<InterviewRole, string> = {
  software_engineer: "Yazılım Mühendisi / Geliştirici",
  hr_specialist: "İnsan Kaynakları Uzmanı",
  sales_rep: "Satış & İş Geliştirme Temsilcisi",
  finance_specialist: "Finans & Muhasebe Uzmanı",
  marketing_specialist: "Pazarlama & İletişim Uzmanı",
  customer_success: "Müşteri Deneyimi & İlişkileri",
};

export const INTERVIEW_QUESTIONS: Record<InterviewRole, InterviewQuestion[]> = {
  software_engineer: [
    {
      id: "se_1",
      role: "software_engineer",
      category: "behavioral",
      questionText: "Daha önce canlı ortamda (production) karşılaştığınız kritik bir hatayı ve bu krizi nasıl yönettiğinizi anlatır mısınız?",
      contextHint: "Sistem kesintisi, veri tutarsızlığı veya performans çökmesi senaryosu üzerinden STAR yöntemiyle yanıt verin.",
      idealKeyElements: ["Kök neden tespiti", "İletişim/stakeholder bilgilendirme", "Hotfix/Rollback", "Post-mortem ve kalıcı önlem"],
    },
    {
      id: "se_2",
      role: "software_engineer",
      category: "technical",
      questionText: "Büyük ölçekli bir projede mimari bir karar alırken teknik borç (technical debt) ile teslim süresi (time-to-market) arasındaki dengeyi nasıl kurarsınız?",
      contextHint: "Somut bir refactoring veya mimari sadeleştirme örneği verin.",
      idealKeyElements: ["İş hedefleriyle hizalanma", "Modülerlik", "Test kapsamı", "Kademeli geçiş"],
    },
  ],

  hr_specialist: [
    {
      id: "hr_1",
      role: "hr_specialist",
      category: "situational",
      questionText: "Departman müdürü ile kıdemli bir çalışan arasındaki ciddi bir performans ve iletişim çatışmasını nasıl arabuluculuk yaparak çözersiniz?",
      contextHint: "Tarafsız dinleme, İş Kanunu güvenceleri ve yazılı geri bildirim sürecini vurgulayın.",
      idealKeyElements: ["Birebir görüşmeler", "Somut KPI/hedef belirleme", "Hukuki risk kontrolü", "Aksiyon planı"],
    },
  ],

  sales_rep: [
    {
      id: "sr_1",
      role: "sales_rep",
      category: "behavioral",
      questionText: "Kaybetmek üzere olduğunuz büyük bütçeli bir kurumsal müşteriyi nasıl ikna edip satışla sonuçlandırdığınız bir örneği paylaşır mısınız?",
      contextHint: "Müşteri itirazlarını karşılama ve değer önerisi sunma adımlarını sayısal verilerle açıklayın.",
      idealKeyElements: ["İhtiyaç analizi", "Fiyat itirazını aşma", "ROI sunumu", "Kapanış başarısı"],
    },
  ],

  finance_specialist: [
    {
      id: "fin_1",
      role: "finance_specialist",
      category: "technical",
      questionText: "Şirketin nakit akışında beklenmedik bir daralma olduğunda bütçe optimizasyonunu ve önceliklendirmeyi hangi kriterlerle yönetirsiniz?",
      contextHint: "Sabit ve değişken maliyetler, acil ödemeler ve finansal raporlama ekseninde yanıt verin.",
      idealKeyElements: ["Nakit akış projeksiyonu", "Maliyet tasarrufu", "Vade yönetimi", "Yönetim raporlaması"],
    },
  ],

  marketing_specialist: [
    {
      id: "mkt_1",
      role: "marketing_specialist",
      category: "situational",
      questionText: "Düşük bütçeyle lansmanını yapmanız gereken yeni bir ürün veya hizmet için en yüksek dönüşümü (ROAS) nasıl sağlarsınız?",
      contextHint: "Hedef kitle segmentasyonu, içerik stratejisi ve ölçülebilir büyüme metriklerini ekleyin.",
      idealKeyElements: ["Kanal optimizasyonu", "A/B testleri", "Dönüşüm hunisi", "Organik büyüme"],
    },
  ],

  customer_success: [
    {
      id: "cs_1",
      role: "customer_success",
      category: "behavioral",
      questionText: "Hizmetten son derece memnuniyetsiz olan ve sözleşmesini iptal etmek isteyen bir müşteriyi nasıl geri kazandınız?",
      contextHint: "Empati, proaktif çözüm üretme ve müşteri memnuniyetini (CSAT) artırma adımlarını anlatın.",
      idealKeyElements: ["Hızlı geri dönüş", "Kök sorunu çözme", "Kayıp (churn) engelleme", "Güven tazeleme"],
    },
  ],
};

export function evaluateInterviewAnswer(answerText: string): InterviewEvaluation {
  const text = answerText.toLowerCase().trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // STAR Tespiti
  const hasSituation = /durum|zaman|şirket|proje|karşılaşt|müşteri|çalıştığım|başlangıç/.test(text);
  const hasTask = /görev|sorumluluk|hedef|istendi|problem|ihtiyaç|beklenti|amaç/.test(text);
  const hasAction = /yaptım|geliştirdim|organize|uyguladım|çözdüm|planladım|yönettim|adım|aksiyon/.test(text);
  const hasResult = /sonuç|başarı|arttı|azaldı|tasarruf|verim|teslim|kazandık|oranında|rapor|teşekkür/.test(text);

  let starMatches = 0;
  if (hasSituation) starMatches++;
  if (hasTask) starMatches++;
  if (hasAction) starMatches++;
  if (hasResult) starMatches++;
  const starScore = Math.round((starMatches / 4) * 100);

  // Açıklık ve Detay Skoru
  const clarityScore = Math.min(100, Math.max(20, Math.round(wordCount * 1.2)));

  // Örnek ve Sayısal Veri Kullanımı
  const hasMetrics = /\d+|%|yüzde|oran|tl|lira|kat|hafta|ay|saat/.test(text);
  const exampleScore = hasMetrics ? 90 : wordCount > 40 ? 65 : 40;

  // Genel Puan (Ağırlıklı)
  const overallScore = Math.round(starScore * 0.45 + clarityScore * 0.3 + exampleScore * 0.25);

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (hasSituation && hasTask) {
    strengths.push("Olayın bağlamını ve üzerinize düşen görevi net biçimde tarif etmişsiniz.");
  } else {
    improvements.push("Olayın arka planını (hangi proje, ne zaman, kimlerle) daha somut bir durumla başlatın.");
  }

  if (hasAction) {
    strengths.push("Kendi aldığınız bireysel inisiyatif ve eylemleri açıkça vurgulamışsınız.");
  } else {
    improvements.push("Genel ekip işinden ziyade doğrudan 'sizin' ne yaptığınızı (aksiyonlarınızı) belirtin.");
  }

  if (hasResult) {
    strengths.push("Cevabınızı ölçülebilir ve somut bir sonuçla tamamlamışsınız.");
  } else {
    improvements.push("Eylemlerinizin şirkete veya projeye somut katkısını (tasarruf, zaman kazanımı vb.) ekleyin.");
  }

  if (hasMetrics) {
    strengths.push("Yüzdeler, sayılar veya metrikler kullanarak anlatımınızı inandırıcı kılmışsınız.");
  } else {
    improvements.push("Cevabınıza sayısal veriler (örn: %20 verim artışı, 3 günlük teslim süresi vb.) ekleyin.");
  }

  const starEvaluation: StarEvaluation = {
    hasSituation,
    hasTask,
    hasAction,
    hasResult,
    starScore,
  };

  let generalFeedback = "İyi bir başlangıç. STAR metodolojisinin tüm aşamalarını dengeli uygulayarak cevabınızı daha da parlatabilirsiniz.";
  if (overallScore >= 80) {
    generalFeedback = "Mükemmel mülakat yanıtı! Durum, aksiyon ve ölçülebilir sonuç dengesi son derece profesyonel.";
  } else if (overallScore < 50) {
    generalFeedback = "Cevabınız biraz kısa veya genel kalmış. Somut bir örnek üzerinden detaylandırarak tekrar deneyebilirsiniz.";
  }

  return {
    overallScore,
    clarityScore,
    exampleScore,
    starEvaluation,
    strengths,
    improvements,
    generalFeedback,
  };
}
