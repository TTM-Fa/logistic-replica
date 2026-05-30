/**
 * Mock data for the Marketplace → Freight Perspectives page.
 *
 * A market-intelligence feed for Gulf freight. Article copy is stored
 * bilingually in the data (not in translations.ts) to keep the i18n file
 * lean. All demo data / original copy.
 */

export type Category = "rates" | "capacity" | "fuel" | "regulation" | "trade";

export type Article = {
  id: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  category: Category;
  author: string;
  authorAr: string;
  dateDaysAgo: number;
  readMin: number;
  featured?: boolean;
};

export const ARTICLES: Article[] = [
  {
    id: "fp1", featured: true, category: "rates",
    title: "GCC spot rates climb as pre-Ramadan demand peaks",
    titleAr: "ارتفاع الأسعار الفورية في الخليج مع ذروة الطلب قبل رمضان",
    excerpt: "Reefer and dry-van rates across the Gulf rose for a third straight week as shippers front-load deliveries ahead of the seasonal surge. Carriers with flexible capacity are commanding a premium on KSA–UAE lanes.",
    excerptAr: "ارتفعت أسعار المبرّدات والحمولات الجافة في الخليج للأسبوع الثالث على التوالي مع تقديم الشاحنين للتسليمات قبل موسم الذروة. والناقلون ذوو السعة المرنة يحقّقون علاوة على مسارات السعودية والإمارات.",
    author: "Shenatech Research", authorAr: "أبحاث شِنتك", dateDaysAgo: 1, readMin: 5,
  },
  {
    id: "fp2", category: "capacity",
    title: "Reefer capacity tightens across the Saudi–UAE corridor",
    titleAr: "تراجع سعة المبرّدات على ممرّ السعودية والإمارات",
    excerpt: "Cold-chain equipment is in short supply as food imports peak. Booking lead times have stretched to four days on key lanes.",
    excerptAr: "نقص في معدّات سلسلة التبريد مع ذروة واردات الأغذية، وامتدّت مهلة الحجز إلى أربعة أيام على المسارات الرئيسية.",
    author: "Shenatech Research", authorAr: "أبحاث شِنتك", dateDaysAgo: 2, readMin: 4,
  },
  {
    id: "fp3", category: "fuel",
    title: "Diesel eases 3% as global crude softens",
    titleAr: "انخفاض الديزل 3% مع تراجع النفط العالمي",
    excerpt: "Lower pump prices give carriers modest relief on operating costs this month, though margins remain thin on long-haul lanes.",
    excerptAr: "أسعار الوقود الأدنى تمنح الناقلين بعض الراحة في تكاليف التشغيل هذا الشهر، مع بقاء الهوامش ضيّقة على المسارات الطويلة.",
    author: "Market Desk", authorAr: "مكتب السوق", dateDaysAgo: 3, readMin: 3,
  },
  {
    id: "fp4", category: "regulation",
    title: "New Saudi customs rules speed cross-border clearance",
    titleAr: "قواعد جمركية سعودية جديدة تسرّع التخليص العابر",
    excerpt: "Digital pre-clearance cuts average border dwell times, opening faster turnarounds for GCC cross-border carriers.",
    excerptAr: "التخليص المسبق الرقمي يقلّص متوسّط أوقات الانتظار على الحدود، ويتيح دورات أسرع للناقلين العابرين في الخليج.",
    author: "Policy Watch", authorAr: "مرصد السياسات", dateDaysAgo: 4, readMin: 6,
  },
  {
    id: "fp5", category: "trade",
    title: "Jebel Ali volumes hit record on China trade surge",
    titleAr: "أحجام جبل علي تسجّل رقمًا قياسيًا مع طفرة التجارة الصينية",
    excerpt: "Container throughput climbed sharply, feeding inland trucking demand across the UAE and into Saudi Arabia.",
    excerptAr: "ارتفع المرور عبر الحاويات بقوّة، ممّا غذّى الطلب على النقل البرّي الداخلي في الإمارات وصولًا إلى السعودية.",
    author: "Trade Desk", authorAr: "مكتب التجارة", dateDaysAgo: 5, readMin: 5,
  },
  {
    id: "fp6", category: "rates",
    title: "Backhaul optimisation: cutting empty miles in the Gulf",
    titleAr: "تحسين حمولات العودة: تقليل الأميال الفارغة في الخليج",
    excerpt: "A practical look at how Gulf carriers are pairing return loads to lift utilisation and protect margins.",
    excerptAr: "نظرة عملية على كيفية مزاوجة الناقلين الخليجيين لحمولات العودة لرفع الاستغلال وحماية الهوامش.",
    author: "Shenatech Research", authorAr: "أبحاث شِنتك", dateDaysAgo: 6, readMin: 7,
  },
  {
    id: "fp7", category: "capacity",
    title: "Q2 capacity outlook: what carriers should expect",
    titleAr: "توقّعات السعة للربع الثاني: ما الذي يتوقّعه الناقلون",
    excerpt: "Our quarterly read on fleet availability, seasonal demand, and the lanes most likely to tighten.",
    excerptAr: "قراءتنا الفصلية لتوافر الأساطيل والطلب الموسمي والمسارات الأكثر عرضة للتراجع.",
    author: "Shenatech Research", authorAr: "أبحاث شِنتك", dateDaysAgo: 8, readMin: 8,
  },
];

export const CATEGORIES: Category[] = ["rates", "capacity", "fuel", "regulation", "trade"];

// Market pulse indicators shown above the feed.
export type Pulse = { labelKey: string; value: string; delta: string; dir: "up" | "down" };

export const PULSE: Pulse[] = [
  { labelKey: "marketplace.fp.pulse.spot", value: "112.4", delta: "+2.1%", dir: "up" },
  { labelKey: "marketplace.fp.pulse.capacity", value: "Tight", delta: "−4.0%", dir: "down" },
  { labelKey: "marketplace.fp.pulse.diesel", value: "SAR 2.33", delta: "−3.0%", dir: "down" },
  { labelKey: "marketplace.fp.pulse.demand", value: "High", delta: "+5.4%", dir: "up" },
];
