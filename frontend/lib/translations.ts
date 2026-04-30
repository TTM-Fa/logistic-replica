export type Lang = "en" | "ar";

/**
 * Translation strings, keyed by a stable id. A value can be a plain string,
 * or a JSX-ish string that we interpret with `dangerouslySetInnerHTML` in the
 * few places we need inline markup (headline `<em>`, problem `<strong>`).
 */
export const translations: Record<Lang, Record<string, string>> = {
  en: {
    "nav.platform": "Platform",
    "nav.solutions": "Solutions",
    "nav.faq": "FAQ",
    "nav.customers": "Customers",
    "nav.pricing": "Pricing",
    "nav.resources": "Resources",
    "nav.company": "Company",
    "nav.contact": "Contact",
    "nav.join_waitlist": "Join Waitlist",
    "nav.request_demo": "Request Demo",

    "hero.headline_html": 'Freight intelligence for the corridors<br />that run the <em>region</em>',
    "hero.sub":
      "Shenatech turns fragmented logistics data into real-time operational decisions — giving freight operators across the GCC the visibility, accuracy, and speed they've never had",
    "hero.cta_demo": "Request a Demo",
    "hero.cta_platform": "See the Platform",
    "hero.pillar.visibility_tag": "Visibility",
    "hero.pillar.visibility_name": "Real-Time Shipment Tracking",
    "hero.pillar.prediction_tag": "Prediction",
    "hero.pillar.prediction_name": "Predictive ETA Engine",
    "hero.pillar.marketplace_tag": "Marketplace",
    "hero.pillar.marketplace_name": "Freight Marketplace",
    "hero.pillar.documentation_tag": "Documentation",
    "hero.pillar.documentation_name": "Digital ePOD",

    "problem.index": "001 · Context",
    "problem.heading_html": "The GCC<br />logistics gap.",
    "problem.p1":
      "Freight operators across the Gulf are managing more volume than ever — but with tools that weren't built for this region. Carrier updates arrive by WhatsApp. ETAs are educated guesses. Proof of delivery is still paper, filed in folders no one opens.",
    "problem.p2_html":
      "The result: <strong>operations that react instead of plan.</strong> Missed windows. Demurrage fees that shouldn't exist. Customers who've stopped believing the numbers you give them.",
    "problem.p3":
      "Shenatech was built to close that gap. Not with a generic TMS bolted onto a Western logistics market — but with a platform designed from the ground up for the ports, corridors, and partners that move the GCC.",

    "platform.index": "003 · The Platform",
    "platform.heading_html": "Four capabilities.<br />One operating layer.",
    "platform.sub":
      "Each product works independently. Together, they give your operation a single source of truth — from first mile to final signature.",

    "offering.01.tag": "Visibility",
    "offering.01.title": "Real-Time Shipment Visibility",
    "offering.01.body":
      "Know where every shipment is, the moment it moves. Shenatech aggregates signals from ports, carriers, and customs into a single live view — so your ops team stops chasing updates and starts managing exceptions.",
    "offering.02.tag": "Prediction",
    "offering.02.title": "Predictive ETA Engine",
    "offering.02.body":
      "ETAs that account for reality. Our prediction engine weighs carrier performance, port congestion, weather patterns, and historical delay data to give your customers arrival windows they can actually plan around.",
    "offering.03.tag": "Marketplace",
    "offering.03.title": "Freight Marketplace",
    "offering.03.body":
      "Quote, compare, and book across a vetted network of regional freight providers — without the back-and-forth. Digital RFQs, transparent pricing, and a single contract layer for every mode and corridor.",
    "offering.04.tag": "Documentation",
    "offering.04.title_html": "Digital Documentation & ePOD",
    "offering.04.body":
      "Eliminate paper from your last mile. Capture proof of delivery electronically, auto-generate customs-ready documents, and close the loop on every shipment with a complete, auditable digital trail.",
    "offering.explore": "Explore",

    "segments.index": "002 · Who It's For",
    "segments.heading_html": "Built for operators,<br />not IT teams.",
    "segments.sub":
      "Every role in the freight chain deals with a different version of the visibility problem. Shenatech solves it for all of them.",
    "segments.forwarders": "Freight Forwarders",
    "segments.forwarders_desc":
      "Manage more shipments with fewer surprises. Real-time status across every file, without the endless carrier calls.",
    "segments.shippers": "Shippers",
    "segments.shippers_desc":
      "Hold your carriers accountable with real data. Benchmark performance, catch delays early, protect your SLAs.",
    "segments.tpl": "3PLs",
    "segments.tpl_desc":
      "Offer clients the visibility they demand — without building the infrastructure yourself. White-label ready.",
    "segments.manufacturers": "Manufacturers",
    "segments.manufacturers_desc":
      "Sync inbound supply with production schedules. Predictive ETAs give procurement teams the lead time to act.",
    "segments.retailers": "Retailers",
    "segments.retailers_desc":
      "Protect shelf availability. Track inbound stock across every corridor and intervene before stockouts happen.",

    "partners.title": "Our Trusted Partners",
    "partners.sub":
      "Collaborating with freight operators, carriers, and technology providers across the GCC to move the region forward.",

    "waitlist.index": "004 · Join Waitlist",
    "waitlist.heading": "Be first when we open the platform.",
    "waitlist.sub":
      "We're rolling out access to freight operators across the GCC. Drop your email and we'll let you know the moment it's your turn.",
    "waitlist.email_placeholder": "you@company.com",
    "waitlist.cta": "Join waitlist →",
    "waitlist.success": "✓ You're on the list. We'll be in touch.",
    "waitlist.counter_text": "freight operators already waiting",

    "faq.index": "FAQ",
    "faq.heading_html": "Common questions.",
    "faq.sub":
      "If you don't see your question here, drop us a note — we're happy to dig into the specifics of your operation.",
    "faq.01.q": "How does Shenatech integrate with my existing TMS or ERP?",
    "faq.01.a":
      "Shenatech connects through standard APIs and EDI feeds. Most integrations take 1–2 weeks. We support direct connections to major TMS platforms and provide custom adapters for legacy systems — your IT team won't need to rebuild anything.",
    "faq.02.q": "Which carriers, ports, and corridors do you cover in the GCC?",
    "faq.02.a":
      "All major GCC ports — Jebel Ali, Khalifa, Hamad, King Abdulaziz, Sohar, and others — plus the inland corridors connecting them. Carrier coverage spans road, sea, and air across regional and international operators.",
    "faq.03.q": "How long does implementation take?",
    "faq.03.a":
      "Most teams are running on Shenatech in 4–6 weeks. Initial visibility comes online within days. Full integration with your TMS, customs, and partner systems typically completes within 6 weeks.",
    "faq.04.q": "What's the pricing model?",
    "faq.04.a":
      "Pricing scales with your operation — based on shipment volume rather than seats. Tiered plans starting at the operations-team level. Reach out for a tailored quote.",
    "faq.05.q": "Is my data secure and compliant?",
    "faq.05.a":
      "Yes. Data is encrypted in transit and at rest, hosted in regional data centres (KSA / UAE) for sovereignty compliance, and we follow ISO 27001 practices. We're happy to share security documentation under NDA.",
    "faq.06.q": "Can I trial Shenatech before committing?",
    "faq.06.a":
      "Yes. We typically run a 30-day pilot on one of your active corridors so you can see real value before any contract. Reach out to schedule a demo and discuss the pilot scope.",

    "contact.index": "Contact",
    "contact.heading_html": "Get in touch.",
    "contact.sub":
      "Reach out by email or phone — we'd love to hear about your operation and how Shenatech can fit in.",
    "contact.email_label": "Email",
    "contact.phone_label": "Phone",
    "contact.office_label": "Office",

    "cta.index": "005 · Get Started",
    "cta.headline": "Ready to run tighter operations?",
    "cta.sub":
      "Join freight operators across the GCC who've replaced guesswork with intelligence. Demos take 30 minutes.",

    "footer.tagline": "Supply chain intelligence for the freight operators who run the GCC.",
    "footer.location": "Doha, Qatar · Est. 2025",
    "footer.col.platform": "Platform",
    "footer.col.solutions": "Solutions",
    "footer.col.company": "Company",
    "footer.link.visibility": "Real-Time Visibility",
    "footer.link.eta": "Predictive ETAs",
    "footer.link.marketplace": "Freight Marketplace",
    "footer.link.epod_html": "ePOD & Documentation",
    "footer.link.about": "About",
    "footer.link.careers": "Careers",
    "footer.copy_html": "© 2026 Shenatech. All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",

    "brand.wordmark_html": 'SHENA<span class="logo-thin">TECH</span>',
    "partners.logo.rowwad_alt": "Rowwad Advisory",
    "partners.logo.syndicate_alt": "Syndicate Market",
    "partners.logo.omani_alt": "Omani & Partners",
  },
  ar: {
    "nav.platform": "المنصة",
    "nav.solutions": "الحلول",
    "nav.faq": "الأسئلة الشائعة",
    "nav.customers": "العملاء",
    "nav.pricing": "الأسعار",
    "nav.resources": "الموارد",
    "nav.company": "الشركة",
    "nav.contact": "اتصل بنا",
    "nav.join_waitlist": "انضم لقائمة الانتظار",
    "nav.request_demo": "اطلب عرضاً توضيحياً",

    "hero.headline_html": "ذكاء لوجستي لتدفقات التجارة في <em>المنطقة</em>",
    "hero.sub":
      "تُحوّل شحنتك البيانات اللوجستية المتفرّقة إلى قرارات تشغيلية فورية — لتمنح مشغّلي الشحن في الخليج رؤيةً ودقّةً وسرعةً لم يختبروها من قبل",
    "hero.cta_demo": "اطلب عرضاً توضيحياً",
    "hero.cta_platform": "استكشف المنصة",
    "hero.pillar.visibility_tag": "الرؤية",
    "hero.pillar.visibility_name": "تتبع الشحنات لحظياً",
    "hero.pillar.prediction_tag": "التنبؤ",
    "hero.pillar.prediction_name": "محرك التنبؤ بوقت الوصول",
    "hero.pillar.marketplace_tag": "السوق",
    "hero.pillar.marketplace_name": "سوق الشحن",
    "hero.pillar.documentation_tag": "التوثيق",
    "hero.pillar.documentation_name": "الإثبات الرقمي للتسليم",

    "problem.index": "001 · السياق",
    "problem.heading_html": "الفجوة اللوجستية<br />في الخليج.",
    "problem.p1":
      "يُدير مشغّلو الشحن في الخليج حجماً أكبر من أي وقت مضى — بأدوات لم تُبنَ لهذه المنطقة. تحديثات الناقلين تصل عبر واتساب. أوقات الوصول مجرّد تخمينات مدروسة. وإثبات التسليم لا يزال ورقياً، مُودَعاً في ملفات لا يفتحها أحد.",
    "problem.p2_html":
      "النتيجة: <strong>عمليات تتفاعل بدلاً من أن تخطّط.</strong> نوافذ مُفوَّتة. رسوم تأخير لا ينبغي أن تُدفع. وعملاء لم يعودوا يُصدّقون الأرقام التي تُعطيها لهم.",
    "problem.p3":
      "بُنيت شحنتك لسدّ هذه الفجوة. ليس بنظام TMS عام مُركَّب على سوق لوجستية غربية — بل بمنصّة مُصمَّمة من الصفر للموانئ والممرات والشركاء الذين يُحرّكون الخليج.",

    "platform.index": "003 · المنصة",
    "platform.heading_html": "أربع قدرات.<br />طبقة تشغيل واحدة.",
    "platform.sub":
      "كلّ منتج يعمل باستقلالية. ومعاً، تمنح عملياتك مصدراً واحداً للحقيقة — من الميل الأول إلى التوقيع الأخير.",

    "offering.01.tag": "الرؤية",
    "offering.01.title": "رؤية الشحنات في الوقت الفعلي",
    "offering.01.body":
      "اعرف مكان كل شحنة لحظة تحركها. تجمع شحنتك الإشارات من الموانئ والناقلين والجمارك في عرض حيّ واحد — فيتوقف فريق العمليات عن مطاردة التحديثات ويبدأ بإدارة الاستثناءات.",
    "offering.02.tag": "التنبؤ",
    "offering.02.title": "محرك التنبؤ بوقت الوصول",
    "offering.02.body":
      "أوقات وصول تراعي الواقع. يوازن محرك التنبؤ بين أداء الناقل وازدحام الموانئ وأنماط الطقس وبيانات التأخير التاريخية ليمنح عملاءك نوافذ وصول يمكنهم التخطيط عليها فعلاً.",
    "offering.03.tag": "السوق",
    "offering.03.title": "سوق الشحن",
    "offering.03.body":
      "اطلب عروضاً، قارن، واحجز عبر شبكة موثوقة من مزوّدي الشحن الإقليميين — دون مراسلات متكررة. طلبات عروض رقمية، وتسعير شفاف، وطبقة عقود موحّدة لكل وسيلة وممرّ.",
    "offering.04.tag": "التوثيق",
    "offering.04.title_html": "التوثيق الرقمي وإثبات التسليم",
    "offering.04.body":
      "تخلّص من الورق في الميل الأخير. التقط إثبات التسليم إلكترونياً، وولّد المستندات الجمركية تلقائياً، وأغلق الحلقة على كل شحنة بمسار رقمي كامل قابل للتدقيق.",
    "offering.explore": "اكتشف",

    "segments.index": "002 · لمن",
    "segments.heading_html": "مبنية للمشغّلين،<br />لا لفرق التقنية.",
    "segments.sub":
      "كل دور في سلسلة الشحن يواجه نسخة مختلفة من مشكلة الرؤية. شحنتك تحلّها لجميعهم.",
    "segments.forwarders": "وسطاء الشحن",
    "segments.forwarders_desc":
      "أدر شحنات أكثر بمفاجآت أقل. حالة فورية عبر كل ملف، دون مكالمات الناقلين التي لا تنتهي.",
    "segments.shippers": "الشاحنون",
    "segments.shippers_desc":
      "حاسب ناقليك ببيانات حقيقية. قارن الأداء، والتقط التأخيرات باكراً، واحمِ اتفاقيات الخدمة.",
    "segments.tpl": "مقدّمو الخدمات اللوجستية",
    "segments.tpl_desc":
      "قدّم لعملائك الرؤية التي يطلبونها — دون بناء البنية التحتية بنفسك. جاهزة للعلامات الخاصة.",
    "segments.manufacturers": "المصنّعون",
    "segments.manufacturers_desc":
      "زامِن الإمدادات الواردة مع جداول الإنتاج. أوقات الوصول التنبؤية تمنح فرق المشتريات الوقت للتصرف.",
    "segments.retailers": "التجزئة",
    "segments.retailers_desc":
      "احمِ توفّر الرفوف. تتبّع المخزون الوارد عبر كل ممرّ، وتدخّل قبل نفاد البضاعة.",

    "partners.title": "شركاؤنا الموثوقون",
    "partners.sub":
      "نتعاون مع مشغّلي الشحن والناقلين ومزوّدي التقنية في الخليج لتحريك المنطقة قُدُماً.",

    "waitlist.index": "004 · انضم لقائمة الانتظار",
    "waitlist.heading": "كن من الأوائل عند إطلاق المنصة.",
    "waitlist.sub":
      "نطلق الوصول تدريجياً لمشغّلي الشحن في الخليج. أدخل بريدك الإلكتروني ونخبرك حالما يأتي دورك.",
    "waitlist.email_placeholder": "you@company.com",
    "waitlist.cta": "انضم للقائمة ←",
    "waitlist.success": "✓ تمت إضافتك. سنتواصل معك قريباً.",
    "waitlist.counter_text": "مشغّل شحن في القائمة بالفعل",

    "faq.index": "الأسئلة الشائعة",
    "faq.heading_html": "أسئلة متكرّرة.",
    "faq.sub":
      "إن لم تجد سؤالك هنا، تواصل معنا — يسعدنا معرفة تفاصيل عملياتك.",
    "faq.01.q": "كيف تتكامل شحنتك مع نظام إدارة النقل (TMS) أو نظام تخطيط الموارد (ERP) لديّ؟",
    "faq.01.a":
      "تتصل شحنتك عبر واجهات برمجة قياسية (APIs) وتغذيات EDI. تستغرق معظم عمليات التكامل من أسبوع إلى أسبوعين. ندعم الاتصال المباشر مع منصات TMS الرئيسية، ونوفّر محوّلات مخصّصة للأنظمة القديمة — لن يحتاج فريق التقنية لديك إلى إعادة بناء أي شيء.",
    "faq.02.q": "ما الموانئ والناقلين والممرات التي تغطّونها في الخليج؟",
    "faq.02.a":
      "نغطّي جميع موانئ الخليج الرئيسية — جبل علي، خليفة، حمد، الملك عبدالعزيز، صحار وغيرها — بالإضافة إلى الممرات البرية التي تربطها. تشمل تغطية الناقلين النقل البري والبحري والجوي عبر مزوّدين إقليميين ودوليين.",
    "faq.03.q": "كم تستغرق عملية التطبيق؟",
    "faq.03.a":
      "تكون معظم الفرق جاهزة على شحنتك خلال 4–6 أسابيع. تظهر الرؤية الأولية خلال أيام. يكتمل التكامل الكامل مع TMS والجمارك وأنظمة الشركاء عادةً خلال 6 أسابيع.",
    "faq.04.q": "ما نموذج التسعير؟",
    "faq.04.a":
      "يتكيّف التسعير مع حجم عملياتك — مبنيٌّ على عدد الشحنات لا على عدد المستخدمين. توجد باقات متدرّجة تبدأ من مستوى فريق العمليات. تواصل معنا للحصول على عرض مخصّص.",
    "faq.05.q": "هل بياناتي آمنة ومتوافقة مع الأنظمة؟",
    "faq.05.a":
      "نعم. البيانات مشفّرة أثناء النقل وعند التخزين، ومستضافة في مراكز بيانات إقليمية (السعودية / الإمارات) لضمان السيادة، ونلتزم بمعايير ISO 27001. يسعدنا مشاركة وثائق الأمان بموجب اتفاقية عدم إفصاح.",
    "faq.06.q": "هل يمكنني تجربة شحنتك قبل الالتزام؟",
    "faq.06.a":
      "نعم. نُجري عادةً تجربة لمدة 30 يوماً على أحد ممراتك الفعلية لترى القيمة الحقيقية قبل أي عقد. تواصل معنا لجدولة عرض ومناقشة نطاق التجربة.",

    "contact.index": "تواصل معنا",
    "contact.heading_html": "تواصل معنا.",
    "contact.sub":
      "تواصل معنا عبر البريد الإلكتروني أو الهاتف — يسعدنا أن نسمع عن عملياتك وكيف يمكن لشحنتك أن تكون جزءاً منها.",
    "contact.email_label": "البريد الإلكتروني",
    "contact.phone_label": "الهاتف",
    "contact.office_label": "المكتب",

    "cta.index": "005 · ابدأ",
    "cta.headline": "مستعد لتشغيل عمليات أكثر إحكاماً؟",
    "cta.sub":
      "انضم إلى مشغّلي الشحن في الخليج الذين استبدلوا التخمين بالذكاء. العروض التوضيحية تستغرق 30 دقيقة.",

    "footer.tagline": "ذكاء سلاسل التوريد لمشغّلي الشحن الذين يُديرون الخليج.",
    "footer.location": "الدوحة، قطر · تأسست 2025",
    "footer.col.platform": "المنصة",
    "footer.col.solutions": "الحلول",
    "footer.col.company": "الشركة",
    "footer.link.visibility": "الرؤية الفورية",
    "footer.link.eta": "التنبؤ بأوقات الوصول",
    "footer.link.marketplace": "سوق الشحن",
    "footer.link.epod_html": "إثبات التسليم والتوثيق",
    "footer.link.about": "عنّا",
    "footer.link.careers": "الوظائف",
    "footer.copy_html": "© 2026 شحنتك. جميع الحقوق محفوظة.",
    "footer.privacy": "سياسة الخصوصية",
    "footer.terms": "شروط الخدمة",

    "brand.wordmark_html": "شحنتك",
    "partners.logo.rowwad_alt": "Rowwad Advisory",
    "partners.logo.syndicate_alt": "Syndicate Market",
    "partners.logo.omani_alt": "Omani & Partners",
  },
};
