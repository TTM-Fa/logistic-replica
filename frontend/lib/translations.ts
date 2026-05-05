export type Lang = "en" | "ar";

/**
 * Translation strings, keyed by a stable id. A value can be a plain string,
 * or a JSX-ish string that we interpret with `dangerouslySetInnerHTML` in the
 * few places we need inline markup (headline `<em>`, problem `<strong>`).
 */
export const translations: Record<Lang, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.services.visibility": "Visibility",
    "nav.services.marketplace": "Marketplace",
    "nav.services.benchmark": "Benchmark Rate",
    "nav.about": "About us",
    "nav.signin": "Sign in",
    "nav.platform": "Platform",
    "nav.solutions": "Solutions",
    "nav.faq": "FAQ",
    "nav.customers": "Customers",
    "nav.pricing": "Pricing",
    "nav.resources": "Resources",
    "nav.company": "Company",
    "nav.contact": "Contact us",
    "nav.join_waitlist": "Join Waitlist",
    "nav.request_demo": "Request a Demo",

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
    "problem.lead":
      "Across the Gulf, freight is still glued together with WhatsApp threads, paper PODs, and educated-guess ETAs. The volume has grown. The tools haven't.",
    "problem.card1.title": "Updates by chat",
    "problem.card1.desc": "Carrier updates land in WhatsApp threads. Untraceable, lost mid-conversation.",
    "problem.card2.title": "Proof on paper",
    "problem.card2.desc": "PODs still printed and signed. Filed in folders no one opens.",
    "problem.card3.title": "Guesswork ETAs",
    "problem.card3.desc": "Predictions based on experience. Customers stopped believing the numbers.",
    "problem.chat.q": "Where is truck 1008?",
    "problem.chat.q2": "?",
    "problem.chat.a": "Sorry, I will check now",
    "problem.cost.eyebrow": "THE COST",
    "problem.cost.tile1.label": "TIME",
    "problem.cost.tile1.body":
      "Hours each week vanish into WhatsApp triage instead of running operations.",
    "problem.cost.tile2.label": "TRUST",
    "problem.cost.tile2.body":
      "Customers stopped believing your ETAs months before they told you.",
    "problem.cost.tile3.label": "MONEY",
    "problem.cost.tile3.body":
      "Demurrage fees show up on a Monday invoice — never on a dashboard.",
    "problem.closing": "Shenatech was built to close that gap.",

    "platform.index": "003 · The Platform",
    "platform.heading_html": "Our capabilities",
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
    "segments.heading_html": "Built for <em>operators</em>,<br />not IT teams.",
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

    "faq.hero.eyebrow": "005 · FAQ",
    "faq.hero.heading_html": "Common <em>questions</em>",
    "faq.hero.sub": "Quick answers about onboarding, the platform, pricing, and security. Can't find what you need? Talk to us.",
    "faq.hero.status": "LIVE HELP AVAILABLE",

    "faq.cat.start.label": "Getting Started",
    "faq.cat.platform.label": "The Platform",
    "faq.cat.pricing.label": "Pricing",
    "faq.cat.security.label": "Security & Compliance",
    "faq.cat.questions_label": "QUESTIONS",

    "faq.07.q": "What support is available during onboarding?",
    "faq.07.a":
      "Every customer gets a dedicated onboarding manager for the first 60 days. We help configure integrations, train your operations team, and tune the platform to match your specific corridors and SLAs.",
    "faq.08.q": "Do you support real-time tracking via API?",
    "faq.08.a":
      "Yes — Shenatech provides REST and webhook APIs for shipment tracking, document retrieval, and rate queries. Your engineering team can pull live status updates into any internal dashboard or notify customers automatically.",
    "faq.09.q": "Is there a contract or month-to-month option?",
    "faq.09.a":
      "Both. Most customers start with a 12-month commitment that comes with discounted rates. Month-to-month is available for smaller volumes or evaluation periods, billed via monthly subscription.",
    "faq.10.q": "Where is my data hosted?",
    "faq.10.a":
      "Your data is hosted on regional cloud infrastructure within the GCC, with primary nodes in Qatar and Saudi Arabia. We comply with local data residency requirements and offer dedicated environments for enterprise customers.",

    "faq.cta.heading": "Still have questions?",
    "faq.cta.tile1.heading": "Talk to our team",
    "faq.cta.tile1.desc": "Sales and support, in one inbox.",
    "faq.cta.tile1.cta": "Contact us",
    "faq.cta.tile2.heading": "See it live",
    "faq.cta.tile2.desc": "Book a 30-min demo with our team.",
    "faq.cta.tile2.cta": "Schedule",

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

    "contact.hero.eyebrow": "004 · Contact us",
    "contact.hero.heading_html": "Let's talk <em>logistics</em>",
    "contact.hero.sub": "We respond within 24 hours on business days.",

    /* ─── About page ─── */
    "about.hero.eyebrow": "006 · About us",
    "about.hero.heading_html": "Built by <em>operators</em>, for operators.",
    "about.hero.sub":
      "Shenatech is the supply-chain platform we wished existed when we ran freight ourselves — built in Qatar, designed for the GCC.",
    "about.hero.status": "BASED IN QATAR",

    "about.mission.eyebrow": "Our mission",
    "about.mission.heading_html": "Make GCC logistics <em>visible</em>, predictable, and fair.",
    "about.mission.body":
      "Freight in this region runs on phone calls, spreadsheets, and trust. That worked at small scale — it doesn't anymore. We're building a single platform where ops teams see every shipment in real time, predict ETAs with confidence, and source carriers on transparent terms. Less chasing, more moving.",

    "about.values.eyebrow": "What we believe",
    "about.values.heading": "Three principles, no compromise.",
    "about.values.visibility.title": "Visibility wins",
    "about.values.visibility.desc":
      "If you can't see the shipment, you can't manage it. Truth in real time beats guesswork every day.",
    "about.values.trust.title": "Trust by default",
    "about.values.trust.desc":
      "Data stays in the region. Pricing is transparent. We earn renewals — we don't lock you in.",
    "about.values.speed.title": "Speed of execution",
    "about.values.speed.desc":
      "Pilots in days, integrations in weeks. We ship working software fast and iterate with our customers.",

    "about.stats.eyebrow": "By the numbers",
    "about.stats.heading": "A small team, moving fast.",
    "about.stats.stat1.value": "25+",
    "about.stats.stat1.label": "Years combined logistics & software experience",
    "about.stats.stat2.value": "6",
    "about.stats.stat2.label": "GCC ports & corridors covered at launch",
    "about.stats.stat3.value": "94%",
    "about.stats.stat3.label": "ETA accuracy on pilot shipments",
    "about.stats.stat4.value": "4–6 wk",
    "about.stats.stat4.label": "Typical implementation time",

    "about.team.eyebrow": "The team",
    "about.team.heading": "Engineers, operators, and a couple of stubborn freight people.",
    "about.team.body":
      "Shenatech was founded in Doha by a team with backgrounds across freight forwarding, supply-chain software, and machine learning. We've moved containers, written TMS code, and built prediction models — and we've been frustrated by the same gaps for years. So we're closing them.",

    "about.cta.heading": "Want to know more?",
    "about.cta.tile1.heading": "Talk to our team",
    "about.cta.tile1.desc": "We'd love to hear about your operation.",
    "about.cta.tile1.cta": "Contact us",
    "about.cta.tile2.heading": "See it live",
    "about.cta.tile2.desc": "Book a 30-min walkthrough.",
    "about.cta.tile2.cta": "Schedule",

    "contact.channels.heading": "Reach the right team",
    "contact.channels.sales.label": "Sales",
    "contact.channels.sales.desc": "Demos, pricing, and partnerships.",
    "contact.channels.support.label": "Support",
    "contact.channels.support.desc": "General inquiries and help for existing customers.",
    "contact.channels.phone.label": "Phone",
    "contact.channels.whatsapp": "Chat on WhatsApp",

    "contact.hours.label": "Office hours",
    "contact.hours.value": "Sunday – Thursday  ·  10:00 – 18:00 GMT+3",
    "contact.hours.closed": "Closed Friday & Saturday",
    "contact.hours.response": "Response time under 24 hours on business days",

    "contact.form.heading": "Send us a message",
    "contact.form.name": "Full name",
    "contact.form.email": "Email",
    "contact.form.company": "Company (optional)",
    "contact.form.topic": "I'm interested in",
    "contact.form.topic.demo": "Booking a demo",
    "contact.form.topic.sales": "Sales / pricing",
    "contact.form.topic.support": "Support",
    "contact.form.topic.other": "Something else",
    "contact.form.message": "Message",
    "contact.form.submit": "Send message",
    "contact.form.placeholder.message": "Tell us a bit about your operation, what you're looking for, or any question you have…",

    "contact.faq.heading": "Looking for a quick answer?",
    "contact.faq.cta": "Browse our FAQ",
    "contact.demo.heading": "Book a 30-min demo",
    "contact.demo.desc": "See the platform live with our team.",
    "contact.demo.cta": "Schedule",

    "contact.index": "Contact",
    "contact.heading_html": "Get in touch.",
    "contact.sub":
      "Reach out by email or phone — we'd love to hear about your operation and how Shenatech can fit in.",
    "contact.email_label": "Email",
    "contact.phone_label": "Phone",
    "contact.office_label": "Office",

    "cta.index": "005 · Live Demo",
    "cta.headline": "See Shenatech in action.",
    "cta.sub":
      "A 30-minute walkthrough of the platform — visibility, marketplace, and benchmark rates — live with the team that built it.",
    "cta.bullet.duration": "30-minute walkthrough",
    "cta.bullet.tailored": "Tailored to your operation",
    "cta.bullet.live_qa": "Live Q&A with our team",

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
    "nav.home": "الرئيسية",
    "nav.services": "الخدمات",
    "nav.services.visibility": "الرؤية",
    "nav.services.marketplace": "السوق",
    "nav.services.benchmark": "أسعار مرجعية",
    "nav.about": "من نحن",
    "nav.signin": "تسجيل الدخول",
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

    "problem.lead":
      "في أنحاء الخليج، لا تزال عمليات الشحن مرتبطة بمحادثات واتساب، وأوراق إثبات تسليم، وتقديرات وصول تخمينية. الحجم يكبر. الأدوات لم تواكب.",
    "problem.card1.title": "تحديثات عبر الدردشة",
    "problem.card1.desc": "تصل تحديثات الناقل عبر محادثات واتساب. غير قابلة للتتبع، تضيع وسط النقاش.",
    "problem.card2.title": "إثبات ورقي",
    "problem.card2.desc": "إثباتات التسليم لا تزال تُطبع وتُوقّع. تُحفظ في ملفات لا يفتحها أحد.",
    "problem.card3.title": "تقديرات تخمينية",
    "problem.card3.desc": "تنبؤات مبنية على الخبرة. العملاء توقّفوا عن تصديق الأرقام.",
    "problem.chat.q": "أين الشاحنة 1008؟",
    "problem.chat.q2": "؟",
    "problem.chat.a": "آسف، سأتحقّق الآن",
    "problem.cost.eyebrow": "التكلفة",
    "problem.cost.tile1.label": "الوقت",
    "problem.cost.tile1.body":
      "ساعات تضيع كل أسبوع في فرز محادثات واتساب بدلاً من إدارة العمليات.",
    "problem.cost.tile2.label": "الثقة",
    "problem.cost.tile2.body":
      "العملاء توقّفوا عن تصديق مواعيد الوصول قبل أن يخبروك بشهور.",
    "problem.cost.tile3.label": "المال",
    "problem.cost.tile3.body":
      "رسوم التأخير تظهر يوم الاثنين على الفاتورة — لا على لوحة التحكم.",
    "problem.closing": "صُمّمت شحنتك لسدّ هذه الفجوة.",
    "problem.index": "001 · السياق",
    "problem.heading_html": "الفجوة اللوجستية<br />في الخليج.",
    "problem.p1":
      "يُدير مشغّلو الشحن في الخليج حجماً أكبر من أي وقت مضى — بأدوات لم تُبنَ لهذه المنطقة. تحديثات الناقلين تصل عبر واتساب. أوقات الوصول مجرّد تخمينات مدروسة. وإثبات التسليم لا يزال ورقياً، مُودَعاً في ملفات لا يفتحها أحد.",
    "problem.p2_html":
      "النتيجة: <strong>عمليات تتفاعل بدلاً من أن تخطّط.</strong> نوافذ مُفوَّتة. رسوم تأخير لا ينبغي أن تُدفع. وعملاء لم يعودوا يُصدّقون الأرقام التي تُعطيها لهم.",
    "problem.p3":
      "بُنيت شحنتك لسدّ هذه الفجوة. ليس بنظام TMS عام مُركَّب على سوق لوجستية غربية — بل بمنصّة مُصمَّمة من الصفر للموانئ والممرات والشركاء الذين يُحرّكون الخليج.",

    "platform.index": "003 · المنصة",
    "platform.heading_html": "قدراتنا",
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
    "segments.heading_html": "مبنية <em>للمشغّلين</em>،<br />لا لفرق التقنية.",
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

    "faq.hero.eyebrow": "005 · الأسئلة الشائعة",
    "faq.hero.heading_html": "أسئلة <em>متكرّرة</em>",
    "faq.hero.sub": "إجابات سريعة حول التأهيل، المنصّة، الأسعار، والأمان. لم تجد ما تبحث عنه؟ تواصل معنا.",
    "faq.hero.status": "الدعم المباشر متاح",

    "faq.cat.start.label": "البدء",
    "faq.cat.platform.label": "المنصّة",
    "faq.cat.pricing.label": "الأسعار",
    "faq.cat.security.label": "الأمان والامتثال",
    "faq.cat.questions_label": "أسئلة",

    "faq.07.q": "ما الدعم المتاح خلال مرحلة التأهيل؟",
    "faq.07.a":
      "يحصل كل عميل على مدير تأهيل مخصّص خلال أول 60 يوماً. نساعد في تهيئة التكاملات، وتدريب فريق العمليات، وضبط المنصّة لتناسب ممرّاتك واتفاقيات الخدمة الخاصة بك.",
    "faq.08.q": "هل تدعمون التتبّع الفوري عبر واجهات API؟",
    "faq.08.a":
      "نعم — توفّر شحنتك واجهات REST وWebhook لتتبّع الشحنات، واسترجاع المستندات، والاستعلام عن الأسعار. يمكن لفريقك الهندسي سحب التحديثات الفورية إلى أي لوحة داخلية أو إشعار العملاء آلياً.",
    "faq.09.q": "هل هناك عقد أم اشتراك شهري؟",
    "faq.09.a":
      "كلاهما متاح. يبدأ معظم العملاء بالتزام لمدّة 12 شهراً مع أسعار مخفّضة. الاشتراك الشهري متاح للأحجام الأصغر أو فترات التقييم، ويُحاسب على أساس شهري.",
    "faq.10.q": "أين تُستضاف بياناتي؟",
    "faq.10.a":
      "تُستضاف بياناتك على بنية تحتية سحابية إقليمية داخل دول الخليج، مع عُقد أساسية في قطر والمملكة العربية السعودية. نلتزم بمتطلّبات الإقامة المحلية للبيانات ونقدّم بيئات مخصّصة للعملاء من فئة المؤسسات.",

    "faq.cta.heading": "هل لديك أسئلة أخرى؟",
    "faq.cta.tile1.heading": "تحدّث مع فريقنا",
    "faq.cta.tile1.desc": "المبيعات والدعم، في صندوق وارد واحد.",
    "faq.cta.tile1.cta": "تواصل معنا",
    "faq.cta.tile2.heading": "شاهدها مباشرة",
    "faq.cta.tile2.desc": "احجز عرضاً توضيحياً لمدة 30 دقيقة مع فريقنا.",
    "faq.cta.tile2.cta": "احجز",

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

    "contact.hero.eyebrow": "004 · تواصل معنا",
    "contact.hero.heading_html": "لنتحدث في <em>اللوجستيات</em>",
    "contact.hero.sub": "نردّ خلال 24 ساعة في أيام العمل.",

    /* ─── About page ─── */
    "about.hero.eyebrow": "006 · من نحن",
    "about.hero.heading_html": "بُنيت على يد <em>المختصين</em>، لخدمة المختصين.",
    "about.hero.sub":
      "شِنتك هي منصّة سلاسل الإمداد التي تمنّينا وجودها حين كنّا نُشغّل الشحن بأنفسنا — صُنعت في قطر، وصُمّمت لخدمة منطقة الخليج.",
    "about.hero.status": "مقرّنا قطر",

    "about.mission.eyebrow": "مهمّتنا",
    "about.mission.heading_html": "جعل اللوجستيات في الخليج <em>واضحة</em> وقابلة للتنبؤ ومنصفة.",
    "about.mission.body":
      "تعتمد عمليات الشحن في المنطقة على المكالمات الهاتفية والجداول والثقة الشخصية. نجح ذلك في النطاقات الصغيرة — لكنه لم يعد كافيًا. نبني منصّة موحّدة تتيح لفِرَق العمليات رؤية كل شحنة لحظيًا، والتنبؤ بمواعيد الوصول بدقة، والوصول إلى الناقلين بشروط شفافة. مطاردة أقل، إنجاز أكثر.",

    "about.values.eyebrow": "ما نؤمن به",
    "about.values.heading": "ثلاثة مبادئ، بلا مساومة.",
    "about.values.visibility.title": "الرؤية تربح",
    "about.values.visibility.desc":
      "إن لم ترَ الشحنة فلن تستطيع إدارتها. الحقيقة الفورية تتفوّق على التخمين كل يوم.",
    "about.values.trust.title": "الثقة افتراضيًا",
    "about.values.trust.desc":
      "البيانات تبقى داخل المنطقة. الأسعار شفافة. نكسب التجديد بالأداء، لا بالقيود.",
    "about.values.speed.title": "سرعة التنفيذ",
    "about.values.speed.desc":
      "تجارب ميدانية في أيام، وتكامل في أسابيع. نُطلق برمجيات شغّالة بسرعة ونطوّرها مع عملائنا.",

    "about.stats.eyebrow": "بالأرقام",
    "about.stats.heading": "فريق صغير، يتحرّك بسرعة.",
    "about.stats.stat1.value": "+25",
    "about.stats.stat1.label": "سنة من الخبرة المجتمعة في اللوجستيات والبرمجيات",
    "about.stats.stat2.value": "6",
    "about.stats.stat2.label": "موانئ ومحاور خليجية مغطّاة عند الإطلاق",
    "about.stats.stat3.value": "%94",
    "about.stats.stat3.label": "دقّة التنبؤ بمواعيد الوصول في الشحنات التجريبية",
    "about.stats.stat4.value": "4–6 أسابيع",
    "about.stats.stat4.label": "مدّة التنفيذ المعتادة",

    "about.team.eyebrow": "الفريق",
    "about.team.heading": "مهندسون ومشغّلون وأهل شحن عنيدون.",
    "about.team.body":
      "تأسّست شِنتك في الدوحة على يد فريق ذي خلفيات متنوّعة في الشحن والوسائط البرمجية لسلاسل الإمداد وتعلم الآلة. حرّكنا الحاويات، وكتبنا أنظمة TMS، وبنينا نماذج تنبّؤ — وعانينا من الفجوات نفسها لسنوات. لذلك بدأنا بإغلاقها.",

    "about.cta.heading": "هل تودّ معرفة المزيد؟",
    "about.cta.tile1.heading": "تواصل مع فريقنا",
    "about.cta.tile1.desc": "يسعدنا التعرّف على عملك.",
    "about.cta.tile1.cta": "تواصل معنا",
    "about.cta.tile2.heading": "شاهدها مباشرة",
    "about.cta.tile2.desc": "احجز جولة 30 دقيقة.",
    "about.cta.tile2.cta": "احجز",

    "contact.channels.heading": "اختر الجهة المناسبة",
    "contact.channels.sales.label": "المبيعات",
    "contact.channels.sales.desc": "العروض التوضيحية والأسعار والشراكات.",
    "contact.channels.support.label": "الدعم",
    "contact.channels.support.desc": "الاستفسارات العامة ودعم العملاء الحاليين.",
    "contact.channels.phone.label": "الهاتف",
    "contact.channels.whatsapp": "تواصل عبر واتساب",

    "contact.hours.label": "ساعات العمل",
    "contact.hours.value": "الأحد – الخميس  ·  10:00 – 18:00 بتوقيت قطر (GMT+3)",
    "contact.hours.closed": "مغلق الجمعة والسبت",
    "contact.hours.response": "زمن الاستجابة أقل من 24 ساعة في أيام العمل",

    "contact.form.heading": "أرسل لنا رسالة",
    "contact.form.name": "الاسم الكامل",
    "contact.form.email": "البريد الإلكتروني",
    "contact.form.company": "الشركة (اختياري)",
    "contact.form.topic": "أرغب في",
    "contact.form.topic.demo": "حجز عرض توضيحي",
    "contact.form.topic.sales": "المبيعات / الأسعار",
    "contact.form.topic.support": "الدعم",
    "contact.form.topic.other": "شيء آخر",
    "contact.form.message": "الرسالة",
    "contact.form.submit": "إرسال الرسالة",
    "contact.form.placeholder.message": "أخبرنا قليلاً عن عملياتك، ما تبحث عنه، أو أي سؤال لديك…",

    "contact.faq.heading": "تبحث عن إجابة سريعة؟",
    "contact.faq.cta": "تصفّح الأسئلة الشائعة",
    "contact.demo.heading": "احجز عرضاً في 30 دقيقة",
    "contact.demo.desc": "شاهد المنصة مباشرة مع فريقنا.",
    "contact.demo.cta": "احجز",

    "contact.index": "تواصل معنا",
    "contact.heading_html": "تواصل معنا.",
    "contact.sub":
      "تواصل معنا عبر البريد الإلكتروني أو الهاتف — يسعدنا أن نسمع عن عملياتك وكيف يمكن لشحنتك أن تكون جزءاً منها.",
    "contact.email_label": "البريد الإلكتروني",
    "contact.phone_label": "الهاتف",
    "contact.office_label": "المكتب",

    "cta.index": "005 · عرض مباشر",
    "cta.headline": "شاهد شحنتك أثناء العمل.",
    "cta.sub":
      "جولة مدّتها 30 دقيقة في المنصة — الرؤية، السوق، وأسعار المرجع — مباشرةً مع الفريق الذي بناها.",
    "cta.bullet.duration": "جولة من 30 دقيقة",
    "cta.bullet.tailored": "مُصمّمة لعملياتك",
    "cta.bullet.live_qa": "أسئلة وأجوبة مباشرة مع فريقنا",

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
