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

    /* ─── Dashboard (members-only area) ─── */
    "dashboard.signout": "Sign out",
    "dashboard.back": "Back to dashboard",
    "dashboard.open_cta": "Open",
    "dashboard.coming_soon": "COMING SOON",

    "dashboard.welcome.eyebrow": "YOUR WORKSPACE",
    "dashboard.welcome.heading": "Welcome back,",
    "dashboard.welcome.sub": "Pick a model to get started. Each one is a self-contained workspace tailored to a specific job.",
    "dashboard.welcome.status": "ALL SYSTEMS OPERATIONAL",

    "dashboard.models.heading": "Your models",
    "dashboard.models.sub": "Three tools, one workspace. Click any card to open its dashboard.",

    "dashboard.visibility.eyebrow": "01 · MODEL",
    "dashboard.visibility.title": "Visibility",
    "dashboard.visibility.desc": "Track every shipment in real time across ports, carriers, and customs — one live view of your entire network.",
    "dashboard.visibility.stat": "Live tracking",

    "dashboard.marketplace.eyebrow": "02 · MODEL",
    "dashboard.marketplace.title": "Marketplace",
    "dashboard.marketplace.desc": "Compare bids from regional carriers, negotiate on transparent terms, and book the right offer in minutes.",
    "dashboard.marketplace.stat": "Carrier offers",

    "dashboard.benchmark.eyebrow": "03 · MODEL",
    "dashboard.benchmark.title": "Rate Benchmark",
    "dashboard.benchmark.desc": "See how your freight rates compare to the regional market — by lane, mode, and time period.",
    "dashboard.benchmark.stat": "Market intelligence",

    "dashboard.hint": "Tip: each model has its own dashboard. You can switch between them at any time using this hub.",

    /* ─── Dashboard hub (Transporeon-style layout) ─── */
    "dashboard.topbar.menu": "Menu",
    "dashboard.topbar.home_tab": "Home",
    "dashboard.user.name": "Operator",
    "dashboard.user.company": "Shenatech (Member)",

    "dashboard.sidebar.favourites": "Favourites",
    "dashboard.sidebar.home": "Home",
    "dashboard.sidebar.apps": "Applications and utilities",

    "dashboardnews.heading": "Stay informed with Shenatech",
    "dashboard.news.platform.badge": "PLATFORM PREVIEW",
    "dashboard.news.platform.title": "The GCC freight network — built for operators",
    "dashboard.news.waitlist.badge": "JOIN WAITLIST",
    "dashboard.news.waitlist.title": "Be first when we open the platform.",

    "dashboard.status.help.title": "Help",
    "dashboard.status.help.desc":
      "Use the help area to get familiar with the platform and benefit from the knowledge we provide there.",
    "dashboard.status.release.title": "Release notes",
    "dashboard.status.release.desc": "Read what has changed in our application.",
    "dashboard.status.offers.title": "Offers",
    "dashboard.status.offers.value": "0",
    "dashboard.status.offers.desc": "Shipments waiting for your offer",
    "dashboard.status.unconfirmed.title": "Unconfirmed",
    "dashboard.status.unconfirmed.value": "0",
    "dashboard.status.unconfirmed.desc": "Shipments waiting for your confirmation",
    "dashboard.status.system.title": "System status",
    "dashboard.status.system.desc": "All systems are running",

    "dashboard.footer.privacy_settings": "Privacy settings",
    "dashboard.footer.privacy_notice": "Privacy notice",
    "dashboard.footer.legal_notice": "Legal notice",
    "dashboard.footer.shenatech_informs": "Shenatech informs",

    /* ─── Dashboard hub (clean v3 design) ─── */
    "dashboard.welcome.again": "Welcome back!",
    "dashboard.greeting.morning": "Good morning",
    "dashboard.greeting.afternoon": "Good afternoon",
    "dashboard.greeting.evening": "Good evening",
    "dashboard.explore": "Explore",
    "dashboard.models.heading": "Choose a model",
    "dashboard.models.sub": "Three connected products for Gulf logistics. Open one to get started.",

    "dashboard.news.heading": "Latest news",
    "dashboard.news1.title": "New customs lane reduced Jebel Ali → Doha crossing time by 30%",
    "dashboard.news1.time": "3 hours ago",
    "dashboard.news2.title": "Shenatech launches in Saudi Arabia next month",
    "dashboard.news2.time": "Yesterday",
    "dashboard.news3.title": "GCC freight market grew 12% in Q1 — see full report",
    "dashboard.news3.time": "3 days ago",

    "dashboard.notifications.heading": "Notifications",
    "dashboard.notif1.text": "Your shipment SHN-2847 is now at customs",
    "dashboard.notif1.time": "5 min ago",
    "dashboard.notif2.text": "New offer received for the Doha → Riyadh lane",
    "dashboard.notif2.time": "1 hour ago",
    "dashboard.notif3.text": "Weekly benchmark report is ready to view",
    "dashboard.notif3.time": "Today, 09:00",

    /* ─── Rate Benchmark dashboard ─── */
    "benchmark.eyebrow": "RATE BENCHMARK",
    "benchmark.heading": "Market rates across the GCC",
    "benchmark.sub": "Compare your freight rates against the regional market — by lane, mode, and time period.",
    "benchmark.filter.region": "Region",
    "benchmark.filter.mode": "Mode",
    "benchmark.filter.period": "Period",
    "benchmark.vs_last_week": "vs last week",
    "benchmark.change_lane": "Change lane",

    "benchmark.trend.eyebrow": "PRIMARY LANE · 12 WEEKS",
    "benchmark.trend.sub": "Spot, contract, and diesel index trend over the last 12 weeks.",

    "benchmark.movers.eyebrow": "THIS WEEK",
    "benchmark.movers.heading": "Top movers",
    "benchmark.movers.gainers": "Biggest gainers (price up)",
    "benchmark.movers.losers": "Biggest losers (price down)",

    "benchmark.compare.eyebrow": "LANE COMPARISON",
    "benchmark.compare.heading": "How your rates compare",
    "benchmark.compare.sub": "Bar = market median. Marker = your rate.",
    "benchmark.compare.add": "Add lane",
    "benchmark.compare.you": "You",

    /* ─── Rate Benchmark dashboard shell (Phase 1) ─── */
    "benchmark.brand.pill": "DASHBOARD",
    "benchmark.brand.workspace_hint": "WORKSPACE",

    "benchmark.nav.market": "Market",
    "benchmark.nav.rates": "Rates",
    "benchmark.nav.capacity": "Capacity",
    "benchmark.nav.costs": "Costs",
    "benchmark.nav.rate_on_demand": "Rate on Demand",
    "benchmark.nav.news": "News",
    "benchmark.nav.reports": "My Reports",

    "benchmark.sub.market.overview": "Overview",
    "benchmark.sub.rates.overview": "Overview",
    "benchmark.sub.rates.forecast": "Forecast",
    "benchmark.sub.rates.spot_vs_contract": "Spot vs Contract",
    "benchmark.sub.costs.market": "Market",
    "benchmark.sub.costs.lane": "Lane",
    "benchmark.sub.rate_on_demand.spot": "Spot",
    "benchmark.sub.rate_on_demand.contract": "Contract",

    "benchmark.util.notifications": "Notifications",
    "benchmark.util.help": "Help",
    "benchmark.util.theme_light": "Light mode",
    "benchmark.util.theme_dark": "Dark mode",
    "benchmark.user.role": "Operator",

    "benchmark.placeholder.label": "COMING SOON",
    "benchmark.placeholder.title": "We're building this section",
    "benchmark.placeholder.sub": "This page is part of the upcoming build phases. The navigation is wired and the layout is in place — content will land here in the next pass.",

    "benchmark.landing.eyebrow": "RATE BENCHMARK",
    "benchmark.landing.title": "Welcome to your rate workspace",
    "benchmark.landing.sub": "Pick a category from the left to get started. Market trends, rate forecasts, capacity, costs, and quick rate lookups all live in here.",

    /* ─── Visibility dashboard shell (Phase 1) ─── */
    /* Sidebar primary nav (8 sections) */
    "visibility.nav.dashboards": "Dashboards",
    "visibility.nav.transports": "Transports",
    "visibility.nav.fleet": "Fleet",
    "visibility.nav.vehicles": "Vehicle Management",
    "visibility.nav.network": "Data Network",
    "visibility.nav.analytics": "Analytics",
    "visibility.nav.notifications": "Notifications",
    "visibility.nav.shared": "Shared Views",

    /* Sub-tabs for the two sections that have them */
    "visibility.sub.vehicles.dedicated": "My Vehicles",
    "visibility.sub.vehicles.partners": "Partner Vehicles",
    "visibility.sub.vehicles.integrations": "Integrations",
    "visibility.sub.network.customers": "Customers",
    "visibility.sub.network.carriers": "Carrier Network",
    "visibility.sub.network.performance": "Road Performance",

    /* Shared placeholder used by every Phase 1 stub page */
    "visibility.placeholder.title": "We're building this section",
    "visibility.placeholder.sub": "This page is part of the upcoming build phases. The navigation is wired and the layout is in place — live tracking content will land here in the next pass.",

    /* ─── Visibility → Dashboards page (widget board) ─── */
    "visibility.db.title": "Dashboards",
    "visibility.db.sub": "Your live operational snapshot — pin the metrics that matter and watch them update in real time.",
    "visibility.db.new_widget": "New widget",
    "visibility.db.menu": "Options",
    "visibility.db.select.aria": "Choose a dashboard",
    "visibility.db.visibility": "Visible to only you",
    "visibility.db.updated": "Updated just now",

    /* Board presets in the selector */
    "visibility.db.board.ops": "Operations overview",
    "visibility.db.board.delivery": "Delivery performance",
    "visibility.db.board.fleet": "Fleet status",

    /* Welcome banner */
    "visibility.db.banner.title": "Welcome to your dashboard",
    "visibility.db.banner.text": "Pin the shipment, fleet, and delivery metrics you care about. Add widgets, rearrange them, and build the view that fits your operation.",
    "visibility.db.banner.dismiss": "Dismiss",

    /* Add-widget tile */
    "visibility.db.add.title": "Add a widget",
    "visibility.db.add.text": "Track a new metric on this board",
    "visibility.db.card.view": "View shipments",

    /* Widget titles */
    "visibility.db.w.pickup.title": "Shipments planned for pickup today",
    "visibility.db.w.delivery.title": "Shipments out for delivery today",
    "visibility.db.w.delayed.title": "Delayed deliveries arriving today",
    "visibility.db.w.untracked.title": "Untracked shipments",
    "visibility.db.w.completed.title": "Completed this week",
    "visibility.db.w.vehicles.title": "Active vehicles on the road",

    /* Status chips (reused across widgets) */
    "visibility.db.tag.tracking": "Tracking",
    "visibility.db.tag.on_time": "On time",
    "visibility.db.tag.delayed": "Delayed",
    "visibility.db.tag.towards_pickup": "Towards pickup",
    "visibility.db.tag.towards_delivery": "Towards delivery",
    "visibility.db.tag.awaiting_gps": "Awaiting GPS",
    "visibility.db.tag.action_needed": "Action needed",
    "visibility.db.tag.delivered": "Delivered",
    "visibility.db.tag.this_week": "This week",
    "visibility.db.tag.live_gps": "Live GPS",
    "visibility.db.tag.moving": "Moving",

    /* ─── Visibility → Transports page ─── */
    "visibility.tr.title": "Transports",
    "visibility.tr.sub": "Track every shipment across the GCC in real time — filter by status, follow live positions on the map, and act on delays before they escalate.",
    "visibility.tr.search": "Search shipments, routes, carriers…",
    "visibility.tr.tabs_aria": "Filter transports by status",

    /* Status tabs */
    "visibility.tr.tab.all": "All",
    "visibility.tr.tab.tracking": "Tracking",
    "visibility.tr.tab.on_time": "On time",
    "visibility.tr.tab.delayed": "Delayed",
    "visibility.tr.tab.unknown": "Unknown",
    "visibility.tr.tab.upcoming": "Upcoming",
    "visibility.tr.tab.untracked": "Untracked",
    "visibility.tr.tab.completed": "Completed",
    "visibility.tr.tab.cancelled": "Cancelled",

    /* Toolbar */
    "visibility.tr.saved_filters": "Saved filters",
    "visibility.tr.filter": "Filter",
    "visibility.tr.export": "Export",
    "visibility.tr.count_label": "transports",
    "visibility.tr.sort": "Sort by",
    "visibility.tr.sort.eta": "Next stop ETA",
    "visibility.tr.sort.ref": "Reference",
    "visibility.tr.sort.status": "Status",

    /* Status chip labels (on each shipment row) */
    "visibility.tr.status.on_time": "On time",
    "visibility.tr.status.delayed": "Delayed",
    "visibility.tr.status.unknown": "Unknown",
    "visibility.tr.status.upcoming": "Upcoming",
    "visibility.tr.status.untracked": "Untracked",
    "visibility.tr.status.completed": "Completed",
    "visibility.tr.status.cancelled": "Cancelled",

    /* Row detail bits */
    "visibility.tr.eta": "ETA",
    "visibility.tr.delivered": "Delivered",
    "visibility.tr.not_started": "Not started",
    "visibility.tr.no_signal": "No signal",
    "visibility.tr.min_ago": "min ago",
    "visibility.tr.unit_h": "h",
    "visibility.tr.unit_m": "m",
    "visibility.tr.empty": "No transports match this filter.",

    /* Map */
    "visibility.tr.map.live_badge": "LIVE",
    "visibility.tr.map.select_hint": "Select a shipment to follow it on the map",

    /* ─── Visibility → Fleet monitor page ─── */
    "visibility.fl.title": "Fleet monitor",
    "visibility.fl.sub": "See where every vehicle is and what it's scheduled to do — a live timeline of trips across your fleet, or their positions on the map.",
    "visibility.fl.allocate": "Allocate",
    "visibility.fl.available": "available",
    "visibility.fl.view": "View",
    "visibility.fl.timeline": "Timeline",
    "visibility.fl.map": "Map",
    "visibility.fl.today": "Today",
    "visibility.fl.col.vehicle": "Vehicle",
    "visibility.fl.empty": "No vehicles match these filters.",

    /* Filters */
    "visibility.fl.filter.group": "Vehicle group",
    "visibility.fl.filter.status": "Status",
    "visibility.fl.group.all": "All vehicles",
    "visibility.fl.group.dedicated": "Dedicated vehicles",
    "visibility.fl.group.partner": "Partner vehicles",

    /* Vehicle statuses */
    "visibility.fl.status.all": "All statuses",
    "visibility.fl.status.driving": "Driving",
    "visibility.fl.status.idle": "Idle",
    "visibility.fl.status.loading": "Loading",
    "visibility.fl.status.maintenance": "Maintenance",

    /* Body types */
    "visibility.fl.type.reefer": "Reefer",
    "visibility.fl.type.curtain": "Curtain",
    "visibility.fl.type.flatbed": "Flatbed",
    "visibility.fl.type.tanker": "Tanker",
    "visibility.fl.type.box": "Box",

    /* Trip / status labels */
    "visibility.fl.status.in_transit": "In transit",
    "visibility.fl.status.delayed": "Delayed",
    "visibility.fl.list": "List",

    /* Status summary strip */
    "visibility.fl.sum.driving": "On the road",
    "visibility.fl.sum.delayed": "Delayed",
    "visibility.fl.sum.loading": "Loading",
    "visibility.fl.sum.idle": "Idle",
    "visibility.fl.sum.maintenance": "Maintenance",

    /* Roster rows */
    "visibility.fl.r.next": "Next",
    "visibility.fl.r.no_upcoming": "No upcoming trips",
    "visibility.fl.r.departs_in": "Departs in",
    "visibility.fl.r.eta": "ETA",
    "visibility.fl.r.available": "Available for allocation",
    "visibility.fl.r.loading_at": "Loading at",
    "visibility.fl.r.in_maintenance": "In maintenance",

    /* ─── Visibility → Vehicle Management ─── */
    "visibility.vm.search": "Search vehicles…",
    "visibility.vm.add_vehicle": "Add vehicle",
    "visibility.vm.invite": "Invite carriers",
    "visibility.vm.add_integration": "Add integration",
    "visibility.vm.ago": "ago",
    "visibility.vm.not_connected": "Not connected",
    "visibility.vm.empty": "No vehicles to show.",

    /* Connection statuses */
    "visibility.vm.status.connected": "Connected",
    "visibility.vm.status.no_signal": "No signal",
    "visibility.vm.status.pending": "Pending",

    /* Connection summary */
    "visibility.vm.sum.connected": "Connected",
    "visibility.vm.sum.no_signal": "No signal",
    "visibility.vm.sum.pending": "Pending setup",

    /* Table columns */
    "visibility.vm.col.vehicle": "Vehicle",
    "visibility.vm.col.type": "Type",
    "visibility.vm.col.carrier": "Carrier",
    "visibility.vm.col.telematics": "Telematics",
    "visibility.vm.col.status": "Status",
    "visibility.vm.col.last_seen": "Last seen",

    /* My Vehicles */
    "visibility.vm.my.title": "My Vehicles",
    "visibility.vm.my.sub": "Your dedicated vehicles and the health of their GPS connection.",

    /* Partner Vehicles */
    "visibility.vm.partner.title": "Partner Vehicles",
    "visibility.vm.partner.sub": "Vehicles your partner carriers have dedicated to you for round-the-clock visibility.",
    "visibility.vm.partner.note": "Partner vehicles appear here once the carrier accepts your invitation and starts sharing their GPS feed.",

    /* Integrations */
    "visibility.vm.int.title": "Integrations",
    "visibility.vm.int.sub": "Connect your telematics and GPS providers to bring vehicles into Shenatech Visibility.",
    "visibility.vm.int.connected": "Connected",
    "visibility.vm.int.available": "Available",
    "visibility.vm.int.manage": "Manage",
    "visibility.vm.int.connect": "Connect",
    "visibility.vm.int.vehicles": "vehicles",
    "visibility.vm.int.category.telematics": "Telematics",
    "visibility.vm.int.category.eld": "ELD",

    /* ─── Visibility → Data Network ─── */
    "visibility.nw.search_carrier": "Search companies…",
    "visibility.nw.invite": "Invite carriers",
    "visibility.nw.download": "Download",
    "visibility.nw.count_company": "companies",
    "visibility.nw.actions": "Actions",
    "visibility.nw.empty": "No companies match these filters.",

    /* Filters */
    "visibility.nw.filter.onboarding": "Onboarding status",
    "visibility.nw.filter.consent": "Consent status",
    "visibility.nw.onboarding.all": "All onboarding",
    "visibility.nw.consent.all": "All consent",

    /* Onboarding statuses */
    "visibility.nw.ob.accepted": "Accepted",
    "visibility.nw.ob.invited": "Invited",
    "visibility.nw.ob.pending": "Pending",
    "visibility.nw.ob.declined": "Declined",

    /* Consent statuses */
    "visibility.nw.cs.granted": "Granted",
    "visibility.nw.cs.pending": "Pending",
    "visibility.nw.cs.declined": "Declined",

    /* Onboarding summary */
    "visibility.nw.sum.accepted": "Accepted",
    "visibility.nw.sum.invited": "Invited",
    "visibility.nw.sum.pending": "Pending",
    "visibility.nw.sum.declined": "Declined",

    /* Table columns */
    "visibility.nw.col.company": "Company",
    "visibility.nw.col.reference": "Reference",
    "visibility.nw.col.relation": "Relation ID",
    "visibility.nw.col.vehicles": "Vehicles",
    "visibility.nw.col.onboarding": "Onboarding",
    "visibility.nw.col.consent": "Consent",
    "visibility.nw.col.customer": "Customer",
    "visibility.nw.col.shared_views": "Shared views",
    "visibility.nw.col.access": "Tracking access",
    "visibility.nw.col.status": "Status",

    /* Carrier Network page */
    "visibility.nw.carriers.title": "Carrier Network",
    "visibility.nw.carriers.sub": "Carriers you exchange visibility data with — track onboarding and GPS-sharing consent across your network.",

    /* Customers page */
    "visibility.nw.cust.title": "Customers",
    "visibility.nw.cust.sub": "Companies you share live shipment visibility with.",
    "visibility.nw.cust.add": "Add customer",
    "visibility.nw.cust.active": "Active",
    "visibility.nw.cust.pending": "Pending",
    "visibility.nw.access.full": "Full",
    "visibility.nw.access.limited": "Limited",

    /* Road Performance page */
    "visibility.nw.perf.title": "Road Performance",
    "visibility.nw.perf.sub": "How much of your road network is delivering live GPS tracking.",
    "visibility.nw.perf.rate": "Tracking rate",
    "visibility.nw.perf.tracked": "Tracked",
    "visibility.nw.perf.untracked": "Untracked",
    "visibility.nw.perf.transports": "transports",
    "visibility.nw.perf.by_country": "Tracking rate by country",
    "visibility.nw.perf.of": "of",

    /* ─── Visibility → Analytics (Tracking Performance) ─── */
    "visibility.an.title": "Tracking Performance",
    "visibility.an.sub": "How reliably your transports are allocated, tracked, and arriving with accurate ETAs.",
    "visibility.an.export": "Export",
    "visibility.an.period": "Period",
    "visibility.an.period.30": "Last 30 days",
    "visibility.an.period.90": "Last 90 days",
    "visibility.an.scope": "Scope",
    "visibility.an.scope.customers": "Customers",
    "visibility.an.scope.carriers": "Carrier Network",
    "visibility.an.transports": "transports",
    "visibility.an.wk": "Wk",

    /* KPI cards */
    "visibility.an.kpi.tracked": "Tracked",
    "visibility.an.kpi.untracked": "Untracked",
    "visibility.an.kpi.allocated": "Allocated",
    "visibility.an.kpi.stops_eta": "All stops ETA",

    /* Timeline */
    "visibility.an.timeline": "Performance timeline",
    "visibility.an.timeline_sub": "Weekly tracking metrics across the last 12 weeks. Tap a legend item to toggle it.",

    /* Chart metrics */
    "visibility.an.m.allocated": "Allocated",
    "visibility.an.m.tracked": "Tracked",
    "visibility.an.m.stops_visited": "All stops visited",
    "visibility.an.m.stops_eta": "All stops ETA",

    /* Carrier table */
    "visibility.an.by_carrier": "Performance by carrier",
    "visibility.an.col.carrier": "Carrier",
    "visibility.an.col.transports": "Transports",

    /* ─── Visibility → Notifications (Notification rules) ─── */
    "visibility.no.title": "Notification rules",
    "visibility.no.sub": "Get alerted the moment something needs your attention — set rules for delays, ETA changes, lost GPS, and more.",
    "visibility.no.add": "Add rule",
    "visibility.no.last": "Last triggered",
    "visibility.no.never": "Never",
    "visibility.no.times": "times",
    "visibility.no.on": "On",
    "visibility.no.off": "Off",
    "visibility.no.unit_d": "d",

    /* Summary */
    "visibility.no.sum.active": "Active rules",
    "visibility.no.sum.paused": "Paused",
    "visibility.no.sum.week": "Alerts this week",

    /* Scopes */
    "visibility.no.scope.all": "All transports",
    "visibility.no.scope.customer": "Customer shipments",
    "visibility.no.scope.reefer": "Reefer shipments",
    "visibility.no.scope.cross": "GCC cross-border",

    /* Channels */
    "visibility.no.ch.email": "Email",
    "visibility.no.ch.sms": "SMS",
    "visibility.no.ch.push": "In-app",

    /* Event rules */
    "visibility.no.ev.delay.name": "Delay over 60 minutes",
    "visibility.no.ev.delay.desc": "When a shipment runs more than 60 minutes behind its ETA",
    "visibility.no.ev.eta.name": "ETA moved by 30+ minutes",
    "visibility.no.ev.eta.desc": "When a shipment's ETA shifts by 30 minutes or more",
    "visibility.no.ev.untracked.name": "GPS signal lost",
    "visibility.no.ev.untracked.desc": "When a tracked vehicle stops reporting for 20 minutes",
    "visibility.no.ev.temp.name": "Reefer temperature breach",
    "visibility.no.ev.temp.desc": "When a reefer's temperature leaves its set range",
    "visibility.no.ev.arrival.name": "Arrival at stop",
    "visibility.no.ev.arrival.desc": "When a vehicle arrives at a planned stop",
    "visibility.no.ev.departed.name": "Departed from origin",
    "visibility.no.ev.departed.desc": "When a shipment departs its pickup location",

    /* ─── Visibility → Shared Views ─── */
    "visibility.sv.title": "Shared views",
    "visibility.sv.sub": "Give your customers a live link to track their shipments — no login required.",
    "visibility.sv.add": "Add shared view",
    "visibility.sv.shared_with": "Shared with",
    "visibility.sv.copy": "Copy link",
    "visibility.sv.copied": "Copied!",
    "visibility.sv.shipments": "shipments",
    "visibility.sv.views": "opens",
    "visibility.sv.last_viewed": "Last opened",
    "visibility.sv.never": "Never",

    /* Summary */
    "visibility.sv.sum.active": "Active views",
    "visibility.sv.sum.opens": "Total opens",
    "visibility.sv.sum.shipments": "Shipments shared",

    /* Statuses */
    "visibility.sv.status.active": "Active",
    "visibility.sv.status.paused": "Paused",
    "visibility.sv.status.expired": "Expired",

    /* ═══ Marketplace dashboard shell ═══ */
    "marketplace.nav.home": "Home",
    "marketplace.nav.spot": "Spot",
    "marketplace.nav.lanes": "Lane Requests",
    "marketplace.nav.rfq": "RFQ",
    "marketplace.nav.analysis": "Analysis",
    "marketplace.nav.perspectives": "Freight Perspectives",
    "marketplace.nav.profile": "Profile",
    "marketplace.nav.users": "User Management",
    "marketplace.nav.settings": "Settings",
    "marketplace.placeholder.title": "We're building this section",
    "marketplace.placeholder.sub": "This page is part of the upcoming build phases. The navigation is wired and the layout is in place — marketplace content will land here in the next pass.",

    /* ─── Marketplace → Home ─── */
    "marketplace.home.eyebrow": "FREIGHT MARKETPLACE",
    "marketplace.home.welcome": "Welcome back",
    "marketplace.home.sub": "Find freight, post lanes, and win long-term tenders — all in one Gulf-wide marketplace.",

    "marketplace.home.stat.loads": "Open spot loads",
    "marketplace.home.stat.lanes": "Lane opportunities",
    "marketplace.home.stat.rfqs": "Active RFQs",
    "marketplace.home.stat.bids": "Your open bids",

    "marketplace.home.spot.eyebrow": "SPOT PROCUREMENT",
    "marketplace.home.spot.title": "Spot",
    "marketplace.home.spot.desc": "Access and bid on thousands of daily spot loads, or launch your own spot events to reach carriers that fit your lanes.",
    "marketplace.home.spot.badge": "open loads",
    "marketplace.home.spot.cta": "Go to Spot",

    "marketplace.home.lanes.eyebrow": "CAPACITY REQUESTS",
    "marketplace.home.lanes.title": "Lane Requests",
    "marketplace.home.lanes.desc": "Browse open lane opportunities and submit offers for recurring freight that matches your fleet.",
    "marketplace.home.lanes.badge": "open opportunities",
    "marketplace.home.lanes.cta": "Go to Lane Requests",

    "marketplace.home.rfq.eyebrow": "CONTRACTUAL PROCUREMENT",
    "marketplace.home.rfq.title": "RFQ",
    "marketplace.home.rfq.desc": "Secure long-term, high-volume work by joining strategic tender events from shippers seeking reliable partners.",
    "marketplace.home.rfq.badge": "live tenders",
    "marketplace.home.rfq.cta": "Go to RFQ",

    "marketplace.home.verify.title": "Account verification",
    "marketplace.home.verify.complete": "Complete verification",
    "marketplace.home.verify.company": "Company details",
    "marketplace.home.verify.insurance": "Insurance documents",
    "marketplace.home.verify.licence": "Operating licence",
    "marketplace.home.verify.bank": "Bank details",

    "marketplace.home.activity.title": "Recent activity",
    "marketplace.home.act1.text": "New lane request: Jeddah → Riyadh",
    "marketplace.home.act1.time": "20 min ago",
    "marketplace.home.act2.text": "Your bid was accepted on SPOT-3920",
    "marketplace.home.act2.time": "1 h ago",
    "marketplace.home.act3.text": "RFQ “GCC Reefer Network 2026” closes in 2 days",
    "marketplace.home.act3.time": "3 h ago",
    "marketplace.home.act4.text": "8 new spot loads on your favourite lanes",
    "marketplace.home.act4.time": "Today",

    /* ─── Marketplace → Spot (load board) ─── */
    "marketplace.spot.title": "Spot shipment finder",
    "marketplace.spot.sub": "Browse and bid on live spot loads across the GCC. Filter by equipment, sort by deadline, and place an offer before the clock runs out.",
    "marketplace.spot.refresh": "Refresh",
    "marketplace.spot.create": "Create spot event",
    "marketplace.spot.search": "Search loads, lanes, shippers…",
    "marketplace.spot.equipment": "Equipment",
    "marketplace.spot.equip.all": "All equipment",
    "marketplace.spot.sort": "Sort by",
    "marketplace.spot.sort.deadline": "Closing soonest",
    "marketplace.spot.sort.rate": "Highest rate",
    "marketplace.spot.sort.distance": "Shortest distance",
    "marketplace.spot.loads": "loads",
    "marketplace.spot.empty": "No loads match these filters.",
    "marketplace.spot.new": "New",

    /* Columns */
    "marketplace.spot.col.route": "Route",
    "marketplace.spot.col.equipment": "Equipment",
    "marketplace.spot.col.distance": "Distance",
    "marketplace.spot.col.shipper": "Shipper",
    "marketplace.spot.col.rate": "Target rate",
    "marketplace.spot.col.deadline": "Offer closes in",

    /* Cells */
    "marketplace.spot.pallets": "pallets",
    "marketplace.spot.tonnes": "t",
    "marketplace.spot.km": "km",
    "marketplace.spot.bid": "Place bid",
    "marketplace.spot.day.today": "Today",
    "marketplace.spot.day.tomorrow": "Tomorrow",
    "marketplace.spot.day.in2": "In 2 days",
    "marketplace.spot.day.in3": "In 3 days",

    /* Stats */
    "marketplace.spot.sum.open": "Open loads",
    "marketplace.spot.sum.fresh": "New today",
    "marketplace.spot.sum.closing": "Closing soon",

    /* ─── Marketplace → Lane Requests (Opportunities) ─── */
    "marketplace.lanes.title": "Opportunities",
    "marketplace.lanes.sub": "Browse open lane requests and submit offers for recurring freight that matches your fleet.",
    "marketplace.lanes.create": "Create lane request",
    "marketplace.lanes.download": "Download",
    "marketplace.lanes.search": "Search lanes, shippers…",
    "marketplace.lanes.favorites": "My favourites",
    "marketplace.lanes.sort": "Sort by",
    "marketplace.lanes.sort.deadline": "Closing soonest",
    "marketplace.lanes.sort.shipments": "Most shipments",
    "marketplace.lanes.sort.newest": "Newest",
    "marketplace.lanes.count": "opportunities",
    "marketplace.lanes.empty": "No opportunities match these filters.",
    "marketplace.lanes.new": "New",
    "marketplace.lanes.favorite": "Favourite",
    "marketplace.lanes.details": "Details",

    "marketplace.lanes.mode.road": "Road",
    "marketplace.lanes.scope.price": "Price only",
    "marketplace.lanes.scope.price_capacity": "Price & Capacity",
    "marketplace.lanes.direct": "Direct",
    "marketplace.lanes.stops": "stops",
    "marketplace.lanes.shipments": "shipments",
    "marketplace.lanes.months": "months",
    "marketplace.lanes.in": "in",
    "marketplace.lanes.deadline": "Offer deadline",

    /* Metric labels */
    "marketplace.lanes.f.lane": "Lane",
    "marketplace.lanes.f.shipments": "Volume",
    "marketplace.lanes.f.contract": "Contract",
    "marketplace.lanes.f.posted": "Posted",

    /* Stats */
    "marketplace.lanes.sum.open": "Open opportunities",
    "marketplace.lanes.sum.new": "New",
    "marketplace.lanes.sum.closing": "Closing soon",

    /* ─── Marketplace → RFQ (tenders) ─── */
    "marketplace.rfq.title": "RFQ",
    "marketplace.rfq.sub": "Participate in strategic tender events from shippers seeking long-term, high-volume partners.",
    "marketplace.rfq.create": "Create RFQ",
    "marketplace.rfq.tabs_aria": "Filter tenders by status",
    "marketplace.rfq.empty": "No tenders match this filter.",
    "marketplace.rfq.round": "Round",
    "marketplace.rfq.of": "of",
    "marketplace.rfq.deadline": "Submission deadline",
    "marketplace.rfq.details": "Details",
    "marketplace.rfq.participate": "Participate",
    "marketplace.rfq.per_year": "shipments/yr",
    "marketplace.rfq.closed_eval": "Submissions closed · in evaluation",
    "marketplace.rfq.closed_awarded": "Tender awarded",

    /* Status tabs + chips */
    "marketplace.rfq.tab.all": "All",
    "marketplace.rfq.tab.open": "Open",
    "marketplace.rfq.tab.closing": "Closing soon",
    "marketplace.rfq.tab.evaluation": "In evaluation",
    "marketplace.rfq.tab.awarded": "Awarded",
    "marketplace.rfq.status.open": "Open",
    "marketplace.rfq.status.closing": "Closing soon",
    "marketplace.rfq.status.evaluation": "In evaluation",
    "marketplace.rfq.status.awarded": "Awarded",

    /* Metric labels */
    "marketplace.rfq.f.lanes": "Lanes",
    "marketplace.rfq.f.volume": "Annual volume",
    "marketplace.rfq.f.term": "Term",
    "marketplace.rfq.f.regions": "Regions",

    /* Stats */
    "marketplace.rfq.sum.open": "Open tenders",
    "marketplace.rfq.sum.closing": "Closing soon",
    "marketplace.rfq.sum.awarded": "Awarded",

    /* ─── Marketplace → Analysis ─── */
    "marketplace.an.title": "Analysis",
    "marketplace.an.sub": "Build rate benchmarks, lane-cost models, and savings studies across your freight.",
    "marketplace.an.create": "Create analysis",
    "marketplace.an.lanes": "lanes",
    "marketplace.an.updated": "Updated",
    "marketplace.an.open": "Open",
    "marketplace.an.export": "Export",

    "marketplace.an.type.rate_benchmark": "Rate benchmark",
    "marketplace.an.type.lane_cost": "Lane cost",
    "marketplace.an.type.spend": "Spend analysis",
    "marketplace.an.type.savings": "Savings",

    "marketplace.an.status.ready": "Ready",
    "marketplace.an.status.running": "Running",
    "marketplace.an.status.draft": "Draft",

    "marketplace.an.r.vs_market": "vs market rate",
    "marketplace.an.r.per_km": "avg cost / km",
    "marketplace.an.r.spend": "annual freight spend",
    "marketplace.an.r.potential": "potential savings",

    "marketplace.an.sum.total": "Analyses",
    "marketplace.an.sum.lanes": "Lanes analysed",
    "marketplace.an.sum.savings": "Potential savings",

    /* ─── Marketplace → Freight Perspectives ─── */
    "marketplace.fp.title": "Freight Perspectives",
    "marketplace.fp.sub": "Market intelligence for Gulf freight — rates, capacity, fuel, and trade, in one feed.",
    "marketplace.fp.filter_aria": "Filter insights by topic",
    "marketplace.fp.featured": "Featured",
    "marketplace.fp.read": "Read",
    "marketplace.fp.read_min": "min read",

    "marketplace.fp.cat.all": "All",
    "marketplace.fp.cat.rates": "Rates",
    "marketplace.fp.cat.capacity": "Capacity",
    "marketplace.fp.cat.fuel": "Fuel",
    "marketplace.fp.cat.regulation": "Regulation",
    "marketplace.fp.cat.trade": "Trade",

    "marketplace.fp.pulse.spot": "GCC spot index",
    "marketplace.fp.pulse.capacity": "Capacity",
    "marketplace.fp.pulse.diesel": "Diesel",
    "marketplace.fp.pulse.demand": "Demand",

    /* ─── Marketplace → Profile ─── */
    "marketplace.pf.verified": "Verified",
    "marketplace.pf.type.carrier": "Carrier",
    "marketplace.pf.member_since": "Member since",
    "marketplace.pf.edit": "Edit profile",
    "marketplace.pf.vehicles": "vehicles",

    "marketplace.pf.stat.shipments": "Completed shipments",
    "marketplace.pf.stat.ontime": "On-time rate",
    "marketplace.pf.stat.rating": "Rating",
    "marketplace.pf.stat.lanes": "Active lanes",

    "marketplace.pf.details.title": "Company details",
    "marketplace.pf.d.legal": "Legal name",
    "marketplace.pf.d.reg": "Commercial registration",
    "marketplace.pf.d.hq": "Headquarters",
    "marketplace.pf.d.fleet": "Fleet size",
    "marketplace.pf.d.founded": "Founded",

    "marketplace.pf.operating.title": "Operating profile",
    "marketplace.pf.regions": "Regions served",
    "marketplace.pf.equipment": "Equipment types",

    "marketplace.pf.verify.title": "Verification",
    "marketplace.pf.verify.complete": "Complete verification",
    "marketplace.pf.verify.note": "A few documents are still missing. Complete verification to unlock bidding on tenders.",
    "marketplace.pf.verify.done": "Your account is fully verified.",

    "marketplace.pf.docs.title": "Documents",
    "marketplace.pf.docs.expires": "Expires",
    "marketplace.pf.docs.valid": "Valid",
    "marketplace.pf.docs.expiring": "Expiring",
    "marketplace.pf.docs.missing": "Missing",
    "marketplace.pf.docs.not_uploaded": "Not uploaded",
    "marketplace.pf.docs.upload": "Upload",
    "marketplace.pf.doc.cr": "Commercial registration",
    "marketplace.pf.doc.licence": "Operating licence",
    "marketplace.pf.doc.insurance": "Insurance certificate",
    "marketplace.pf.doc.vat": "VAT certificate",
    "marketplace.pf.doc.bank": "Bank verification",

    /* ─── Marketplace → User Management ─── */
    "marketplace.um.title": "User Management",
    "marketplace.um.sub": "Manage who can access your marketplace workspace and what they can do.",
    "marketplace.um.invite": "Invite user",
    "marketplace.um.search": "Search users…",
    "marketplace.um.role_filter": "Role",
    "marketplace.um.all_roles": "All roles",
    "marketplace.um.count": "users",
    "marketplace.um.empty": "No users match these filters.",
    "marketplace.um.actions": "Actions",
    "marketplace.um.invited_sent": "Invitation sent",

    "marketplace.um.col.user": "User",
    "marketplace.um.col.role": "Role",
    "marketplace.um.col.status": "Status",
    "marketplace.um.col.last": "Last active",

    "marketplace.um.role.admin": "Admin",
    "marketplace.um.role.manager": "Manager",
    "marketplace.um.role.operator": "Operator",
    "marketplace.um.role.viewer": "Viewer",

    "marketplace.um.status.active": "Active",
    "marketplace.um.status.invited": "Invited",
    "marketplace.um.status.inactive": "Inactive",

    "marketplace.um.sum.total": "Users",
    "marketplace.um.sum.active": "Active",
    "marketplace.um.sum.pending": "Pending invites",

    /* ─── Marketplace → Settings ─── */
    "marketplace.set.title": "Settings",
    "marketplace.set.sub": "Manage your notifications, preferences, defaults, and account security.",

    "marketplace.set.notif.title": "Notifications",
    "marketplace.set.notif.sub": "Choose how and how often you hear about marketplace activity.",
    "marketplace.set.notif.frequency": "Frequency",
    "marketplace.set.notif.email": "Email",
    "marketplace.set.notif.push": "In-app",
    "marketplace.set.notif.ev.lane": "New lane requests",
    "marketplace.set.notif.ev.rfq": "RFQ updates",
    "marketplace.set.notif.ev.spot": "Spot load matches",
    "marketplace.set.notif.ev.bid": "Bid status changes",
    "marketplace.set.notif.ev.digest": "Weekly market digest",

    "marketplace.set.freq.instant": "Instant",
    "marketplace.set.freq.hourly": "Hourly",
    "marketplace.set.freq.daily": "Daily",
    "marketplace.set.freq.weekly": "Weekly",
    "marketplace.set.freq.off": "Off",

    "marketplace.set.pref.title": "Preferences",
    "marketplace.set.pref.timezone": "Time zone",
    "marketplace.set.pref.currency": "Currency",
    "marketplace.set.pref.units": "Distance units",
    "marketplace.set.pref.dateformat": "Date format",
    "marketplace.set.units.km": "Kilometres",
    "marketplace.set.units.mi": "Miles",

    "marketplace.set.def.title": "Marketplace defaults",
    "marketplace.set.def.equipment": "Default equipment",
    "marketplace.set.def.region": "Home region",
    "marketplace.set.def.any": "Any equipment",
    "marketplace.set.region.ksa": "Saudi Arabia",
    "marketplace.set.region.uae": "United Arab Emirates",
    "marketplace.set.region.qa": "Qatar",
    "marketplace.set.region.gcc": "All GCC",

    "marketplace.set.sec.title": "Security",
    "marketplace.set.sec.twofa": "Two-factor authentication",
    "marketplace.set.sec.twofa_desc": "Require a verification code at sign-in.",
    "marketplace.set.sec.password": "Password",
    "marketplace.set.sec.password_desc": "Last changed 3 months ago.",
    "marketplace.set.sec.change": "Change",
    "marketplace.set.sec.sessions": "Active sessions",
    "marketplace.set.sec.sessions_desc": "2 devices signed in.",
    "marketplace.set.sec.manage": "Manage",

    /* ─── Rates → Overview page ─── */
    "rates.overview.title": "Rate Overview",
    "rates.overview.sub": "Track how spot, contract, and diesel rates move on your lanes — and how your own rate compares to the market.",

    "rates.action.help": "Help",
    "rates.action.fullscreen": "Fullscreen",
    "rates.action.export": "Export",
    "rates.action.pin": "Add to dashboard",

    "rates.chart.eyebrow": "RATE TREND",
    "rates.table.eyebrow": "DATA",
    "rates.table.heading": "Weekly values",
    "rates.table.sub": "The same numbers the chart plots, in table form. Scroll horizontally to see older weeks.",

    "rates.filter.from": "From",
    "rates.filter.to": "To",
    "rates.filter.swap": "Swap from and to",
    "rates.filter.period": "Period",
    "rates.filter.frequency": "Frequency",
    "rates.filter.metrics": "Metrics",
    "rates.filter.period.12w": "12 weeks",
    "rates.filter.period.6m": "6 months",
    "rates.filter.period.1y": "1 year",
    "rates.filter.period.2y": "2 years",

    "rates.frequency.daily": "Daily",
    "rates.frequency.weekly": "Weekly",
    "rates.frequency.monthly": "Monthly",

    "rates.metric.spot": "Spot price",
    "rates.metric.contract": "Contract price",
    "rates.metric.diesel": "Diesel index",
    "rates.metric.yours": "Your rate",

    /* ─── Rates → Forecast ─── */
    "forecast.title": "Spot Rate Forecast",
    "forecast.sub": "Predicted next-week spot prices on your lanes, with a confidence range that widens further out.",
    "forecast.filter.horizon": "Forecast horizon",
    "forecast.horizon.4w": "4 weeks",
    "forecast.horizon.12w": "12 weeks",
    "forecast.horizon.26w": "26 weeks",
    "forecast.horizon.52w": "52 weeks",

    "forecast.kpi.next": "Next week",
    "forecast.kpi.next.hint": "Predicted spot price",
    "forecast.kpi.change": "Change vs current",
    "forecast.kpi.change.hint": "Now:",
    "forecast.kpi.confidence": "Confidence range",
    "forecast.kpi.confidence.hint": "Avg uncertainty over horizon",
    "forecast.kpi.horizon": "Horizon",
    "forecast.kpi.horizon.hint": "Weeks predicted",

    "forecast.chart.eyebrow": "FORECAST · SPOT PRICE",
    "forecast.chart.sub": "Solid line = history. Dashed line = predicted. Shaded area = confidence range.",

    "forecast.legend.history": "History",
    "forecast.legend.predicted": "Predicted",
    "forecast.legend.range": "Confidence range",

    "forecast.accuracy.eyebrow": "MODEL ACCURACY",
    "forecast.accuracy.heading": "How well the model is predicting",
    "forecast.accuracy.sub": "Backtested against actual spot prices on this lane.",
    "forecast.accuracy.last4": "Hit rate, last 4 weeks",
    "forecast.accuracy.last12": "Hit rate, last 12 weeks",
    "forecast.accuracy.trained": "Shipments trained on",
    "forecast.accuracy.mape": "Mean absolute % error",

    /* ─── Rates → Spot vs Contract ─── */
    "svc.title": "Spot vs Contract",
    "svc.sub": "See how the volatile spot price moves relative to your steady contract rate — and when to lock in.",
    "svc.mode.label": "View",
    "svc.mode.absolute": "Absolute",
    "svc.mode.percentage": "Percentage",
    "svc.spread.label": "Spread (Spot − Contract)",

    "svc.kpi.current": "Current spread",
    "svc.kpi.current.above": "Spot is above contract",
    "svc.kpi.current.below": "Spot is below contract",
    "svc.kpi.average": "Period average",
    "svc.kpi.average.hint": "Mean spread over period",
    "svc.kpi.swing": "Biggest swing",
    "svc.kpi.swing.hint": "From low to high over period",
    "svc.kpi.advisory": "Advisory",
    "svc.kpi.advisory.hint": "Based on current spread",
    "svc.advisory.lock": "Lock in contract",
    "svc.advisory.spot": "Buy spot",
    "svc.advisory.neutral": "Neutral",

    "svc.chart.eyebrow.abs": "ABSOLUTE · QAR PER TRIP",
    "svc.chart.eyebrow.pct": "SPREAD · % OF CONTRACT",
    "svc.chart.sub.abs": "Two lines: spot price and contract price plotted side by side.",
    "svc.chart.sub.pct": "Single line: how far spot sits above (+) or below (−) contract. Zero line = parity.",

    "svc.explain.eyebrow": "REFERENCE",
    "svc.explain.heading": "What these prices mean",
    "svc.explain.spot.title": "Spot price",
    "svc.explain.spot.body": "What it costs to move a shipment on this lane today — set by current supply and demand. Moves fast.",
    "svc.explain.contract.title": "Contract price",
    "svc.explain.contract.body": "A rate locked in for a fixed term (usually 6–12 months). Steadier — buys you predictability.",
    "svc.explain.spread.title": "Why the spread matters",
    "svc.explain.spread.body": "When spot trades above contract for weeks, locked-in shippers win. When spot dips well below, it can be time to renegotiate.",

    /* ─── Rate on Demand ─── */
    "rod.spot.title": "Spot Rate Lookup",
    "rod.spot.sub": "Get a current spot rate for any GCC lane and equipment combination — updated daily.",
    "rod.contract.title": "Contract Rate Lookup",
    "rod.contract.sub": "Estimate a fair contract rate to lock in for the next 6 to 12 months on any GCC lane.",

    "rod.action.save": "Save lookup",
    "rod.action.refresh": "Refresh",
    "rod.action.lock": "Lock in rate",

    "rod.form.eyebrow": "QUERY",
    "rod.form.heading": "What do you need a rate for?",
    "rod.form.sub": "Pick a lane, equipment, and trip type. The result updates as you change inputs.",
    "rod.form.equipment": "Equipment",
    "rod.form.trip": "Trip",

    "rod.equipment.40ft": "40ft Standard",
    "rod.equipment.reefer": "40ft Reefer",
    "rod.equipment.20ft": "20ft Standard",
    "rod.equipment.hc": "40ft High Cube",
    "rod.equipment.flatbed": "Flatbed",

    "rod.trip.oneway": "One-way",
    "rod.trip.round": "Round trip",

    "rod.term.6m": "6 months",
    "rod.term.12m": "12 months",

    "rod.result.label.spot": "Estimated spot rate",
    "rod.result.label.contract": "Estimated contract rate",
    "rod.result.unit.oneway": " / trip",
    "rod.result.unit.round": " / round trip",
    "rod.result.range": "Range",
    "rod.result.change_8w": "vs 8 weeks ago",
    "rod.result.spark_label": "Last 8 weeks",
    "rod.result.lane": "Lane",
    "rod.result.distance": "Distance",
    "rod.result.transit": "Transit time",
    "rod.result.day": "day",
    "rod.result.days": "days",
    "rod.result.carriers": "Available",
    "rod.result.carriers_unit": "carriers",
    "rod.result.view_lane": "View full lane analysis",

    "rod.spot.volatility.heading": "Volatility this month",
    "rod.spot.volatility.body": "around the median — spot can change daily. Refresh for the latest market quote.",

    "rod.contract.term.heading": "Lock-in term",
    "rod.contract.savings.label": "Est. savings vs current spot",
    "rod.contract.savings.note": "if locked in today",

    /* ─── Capacity page ─── */
    "capacity.title": "Capacity",
    "capacity.sub": "Track how truck supply, load rejection, and rate dynamics interact across GCC corridors.",
    "capacity.help": "Help",
    "capacity.actions": "Page actions",
    "capacity.filters": "Filters",
    "capacity.action.fullscreen": "Fullscreen",
    "capacity.action.export": "Export",

    "capacity.filter.from": "From",
    "capacity.filter.to": "To",
    "capacity.filter.swap": "Swap from and to",
    "capacity.filter.period": "Period",
    "capacity.filter.frequency": "Frequency",
    "capacity.filter.metrics": "Metrics",
    "capacity.filter.selected": "selected",
    "capacity.filter.choose_up_to_3": "Choose up to 3 metrics:",
    "capacity.filter.category.contract": "CONTRACT",
    "capacity.filter.category.spot": "SPOT",
    "capacity.filter.cancel": "Cancel",
    "capacity.filter.save": "Save",

    "capacity.filter.period.12w": "Last 12 weeks",
    "capacity.filter.period.6m": "Last 6 months",
    "capacity.filter.period.1y": "Last 1 year",
    "capacity.filter.period.2y": "Last 2 years",

    "capacity.frequency.daily": "Daily",
    "capacity.frequency.weekly": "Weekly",
    "capacity.frequency.monthly": "Monthly",

    "capacity.metric.capacity_index": "Capacity Index",
    "capacity.metric.spot_offers_index": "Spot Offers Index",
    "capacity.metric.load_rejection_rate": "Contracted Load Rejection Rate",
    "capacity.metric.diesel_price": "Diesel Price",
    "capacity.metric.contract_price_qar_km": "Contract Price QAR/km",
    "capacity.metric.contract_price_index": "Contract Price Index",
    "capacity.metric.spot_price_qar_km": "Spot Price QAR/km",
    "capacity.metric.spot_price_index": "Spot Price Index",

    "capacity.chart.aria": "Capacity trend chart",
    "capacity.chart.hint": "Hover over chart to see values",
    "capacity.chart.empty": "Select at least one metric to see the chart.",

    "capacity.table.metric": "Metric",
    "capacity.table.empty": "Select at least one metric to see the data table.",
    "capacity.table.caption": "Each cell shows the weekly value (top) and the week-over-week change (bottom). Scroll horizontally to see older weeks.",

    /* ─── News page ─── */
    "news.title": "News",
    "news.sub": "GCC freight perspectives — original Shenatech editorial on ports, costs, carriers, policy, and the tech reshaping the industry.",
    "news.subscribe": "Subscribe",
    "news.search.placeholder": "Search articles…",
    "news.read_minutes": "min read",
    "news.read_article": "Read article",
    "news.featured_badge": "FEATURED",
    "news.load_more": "Load more articles",
    "news.filters.aria": "Article categories",
    "news.grid.aria": "Article grid",
    "news.empty.title": "No articles match",
    "news.empty.sub": "Try a different category or clear your search to see everything.",
    "news.empty.reset": "Clear filters",

    "news.cat.all": "All",
    "news.cat.ports": "Ports & Customs",
    "news.cat.diesel": "Diesel & Costs",
    "news.cat.carriers": "Carriers",
    "news.cat.industry": "Industry",
    "news.cat.policy": "GCC Policy",
    "news.cat.tech": "Technology",

    "news.author.insights_team": "Shenatech Insights",
    "news.author.market_team": "GCC Market Desk",
    "news.author.ops_desk": "Operations Desk",
    "news.author.tech_desk": "Technology Desk",

    "news.article.hamad_customs.title": "How the new Hamad Port customs lane cut Doha → Riyadh transit by 30%",
    "news.article.hamad_customs.excerpt": "A behind-the-scenes look at the operational changes that reduced average border-crossing time from 14 hours to under 9 — and what other GCC corridors can learn from it.",

    "news.article.diesel_q3.title": "Diesel price outlook for Q3 2026 across the GCC",
    "news.article.diesel_q3.excerpt": "Refinery maintenance schedules in KSA and softer global demand point to a steadier wholesale market. Here's what carriers should plan around for the next three months.",

    "news.article.etihad_rail.title": "Etihad Rail freight is live — what it means for road carriers",
    "news.article.etihad_rail.excerpt": "The UAE's first cross-emirate freight line is now moving containers between Khalifa Port and Fujairah. Early data shows where rail wins and where trucks still rule.",

    "news.article.neom.title": "Saudi Vision 2030: how NEOM is reshaping freight flows in the kingdom",
    "news.article.neom.excerpt": "Mega-project demand is pulling capacity north-west. We map the new corridors and identify the lanes seeing the biggest rate pressure right now.",

    "news.article.eid_capacity.title": "Capacity tightens during Eid Al-Adha — and how to plan for it",
    "news.article.eid_capacity.excerpt": "Historical data from 2023–2025 shows a predictable squeeze in the two weeks before Eid. Our model for forecasting it, and what shippers can do about it.",

    "news.article.cold_chain.title": "Cold chain logistics in Gulf summer: managing reefer demand spikes",
    "news.article.cold_chain.excerpt": "Summer temperatures push reefer rates 35–50% above winter levels. We break down the drivers, the lanes most affected, and the contracts that protect against the swing.",

    "news.article.king_abdullah.title": "King Abdullah Port expansion: impact on container rates from Q4 onward",
    "news.article.king_abdullah.excerpt": "New container terminal capacity comes online in October. Our analysis of expected effects on Red Sea routings, transshipment patterns, and rate competition.",

    "news.article.ai_routing.title": "How AI route optimization is changing dispatch in the GCC",
    "news.article.ai_routing.excerpt": "Three early adopters share how machine-learned dispatch cut empty miles by 18% — and the data they had to clean before any of it actually worked.",

    "news.article.oman_uae.title": "The Oman–UAE corridor agreement: what changes at the border in 2026",
    "news.article.oman_uae.excerpt": "Simplified customs procedures take effect mid-year. Here are the documentation changes operators need to prepare for, and the lanes that benefit most.",

    "news.article.carrier_consolidation.title": "GCC carrier consolidation: bigger fleets, fewer counterparties, what now?",
    "news.article.carrier_consolidation.excerpt": "Three major mergers in the last 18 months have reshaped capacity. We look at how this affects pricing power, contract leverage, and risk for GCC shippers.",

    /* ─── My Reports page ─── */
    "reports.title": "My Reports",
    "reports.sub": "Your saved views from across the dashboard — pinned for a one-click return. Star the ones you check most.",
    "reports.new": "New report",
    "reports.opens": "opens",
    "reports.shared": "SHARED",
    "reports.shared_by": "Shared by",

    "reports.tabs.aria": "Report tabs",
    "reports.grid.aria": "Saved reports",
    "reports.tabs.all": "All",
    "reports.tabs.favorites": "Favorites",
    "reports.tabs.recent": "Recent",
    "reports.tabs.shared": "Shared",

    "reports.source.rates_overview": "Rates · Overview",
    "reports.source.rates_forecast": "Rates · Forecast",
    "reports.source.rates_spot_vs_contract": "Rates · Spot vs Contract",
    "reports.source.capacity": "Capacity",
    "reports.source.rod_spot": "Rate on Demand · Spot",
    "reports.source.rod_contract": "Rate on Demand · Contract",
    "reports.source.news": "News",
    "reports.source.costs": "Costs · Overview",

    "reports.r1.name": "Doha → Riyadh weekly check",
    "reports.r1.desc": "Spot + Contract + Diesel price · last 26 weeks · weekly",
    "reports.r2.name": "Diesel watch — GCC",
    "reports.r2.desc": "Diesel price index across Qatar, KSA, UAE · monthly trend",
    "reports.r3.name": "Q3 cost benchmark",
    "reports.r3.desc": "Cost component breakdown — fuel, labor, equipment, tolls",
    "reports.r3.shared_by": "Taha",
    "reports.r4.name": "My competitor lanes",
    "reports.r4.desc": "Top 3 corridors I watch · spot price only · auto-refresh",
    "reports.r5.name": "Hot capacity alert",
    "reports.r5.desc": "Tightest lanes this week · capacity index · weekly snapshot",
    "reports.r6.name": "Saudi Vision 2030 watch",
    "reports.r6.desc": "Policy news related to NEOM corridors and customs reform",
    "reports.r6.count_label": "unread articles",

    "reports.empty.all.title": "No reports yet",
    "reports.empty.all.sub": "Pin views from any page using the \"Add to dashboard\" button to save them here.",
    "reports.empty.favorites.title": "No favorites yet",
    "reports.empty.favorites.sub": "Star a report to keep it pinned to the top of your workspace.",
    "reports.empty.recent.title": "Nothing opened recently",
    "reports.empty.recent.sub": "Reports you've opened in the last 7 days will show up here.",
    "reports.empty.shared.title": "Nothing shared with you",
    "reports.empty.shared.sub": "Reports your teammates share will appear here.",

    /* ─── Market → Overview ─── */
    "market.title": "Market Overview",
    "market.sub": "Five high-level indices showing how GCC freight capacity, pricing, and carrier costs are moving over time.",
    "market.help": "Help",
    "market.filters": "Filters",
    "market.action.fullscreen": "Fullscreen",
    "market.action.export": "Export",
    "market.action.add_to_dashboard": "Add to dashboard",

    "market.filter.country": "Country",
    "market.filter.period": "Period",
    "market.filter.frequency": "Frequency",
    "market.filter.period.1y": "Last 1 year",
    "market.filter.period.2y": "Last 2 years",
    "market.filter.period.all": "All available",
    "market.frequency.monthly": "Monthly",
    "market.frequency.weekly": "Weekly",

    "market.metric.capacity_index": "Capacity Index",
    "market.metric.spot_price_index": "Spot price index",
    "market.metric.contract_price_index": "Contract price index",
    "market.metric.total_price_index": "Total price index",
    "market.metric.cost_index": "Cost index",

    "market.kpi.mom": "M/M",
    "market.kpi.yoy": "YoY",

    "market.chart.aria": "Market overview chart",
    "market.chart.hint": "Hover over chart to see values · click legend to toggle metrics",

    "market.table.metric": "Metric",
    "market.table.empty": "Toggle at least one metric in the chart legend to see the table.",
    "market.table.caption": "Each cell shows the monthly value (top) and the month-over-month change (bottom). Scroll horizontally to see older months.",

    /* ─── Costs (Market + Lane) ─── */
    "costs.market.title": "Market Costs",
    "costs.market.sub": "Total cost of ownership for carriers — services, toll, vehicle, fuel, and driver costs stacked over time, with a 4-quarter forecast.",
    "costs.lane.title": "Lane Costs",
    "costs.lane.sub": "Same TCO breakdown as Market Costs, but narrowed to a specific origin → destination lane.",
    "costs.help": "Help",
    "costs.action.fullscreen": "Fullscreen",
    "costs.action.export": "Export",

    "costs.filter.period": "Period",
    "costs.filter.country": "Country",
    "costs.filter.from": "From",
    "costs.filter.to": "To",
    "costs.filter.swap": "Swap from and to",
    "costs.filter.period.1y": "Last 1 year",
    "costs.filter.period.2y": "Last 2 years",
    "costs.filter.period.5y": "Last 5 years",

    "costs.view.label": "Chart view mode",
    "costs.view.indexation": "Indexation",
    "costs.view.percentage": "Percentage",

    "costs.metric.services": "Services & others",
    "costs.metric.toll": "Toll",
    "costs.metric.vehicle": "Vehicle",
    "costs.metric.fuel": "Fuel & AdBlue",
    "costs.metric.driver": "Driver costs",

    "costs.chart.aria": "Cost components stacked area chart",
    "costs.chart.hint": "Hover over chart to see values · click legend to toggle layers",

    "costs.table.metric": "Metric",
    "costs.table.cost_index": "Cost index",
    "costs.table.forecast": "Forecast",
    "costs.table.caption_index": "Each cell shows the quarterly index value (top) and Q/Q change (bottom). Last 4 columns are forecast.",
    "costs.table.caption_pct": "Each cell shows the component's share of total cost (top) and Q/Q change in share (bottom). Last 4 columns are forecast.",

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

    /* ─── لوحة التحكم (للأعضاء فقط) ─── */
    "dashboard.signout": "تسجيل الخروج",
    "dashboard.back": "العودة إلى لوحة التحكم",
    "dashboard.open_cta": "فتح",
    "dashboard.coming_soon": "قريبًا",

    "dashboard.welcome.eyebrow": "مساحة عملك",
    "dashboard.welcome.heading": "مرحبًا بعودتك،",
    "dashboard.welcome.sub": "اختر أداة للبدء. كل أداة هي مساحة عمل مستقلة مصمّمة لمهمّة محدّدة.",
    "dashboard.welcome.status": "جميع الأنظمة تعمل",

    "dashboard.models.heading": "أدواتك",
    "dashboard.models.sub": "ثلاث أدوات، مساحة عمل واحدة. اضغط على أي بطاقة لفتح لوحتها.",

    "dashboard.visibility.eyebrow": "01 · أداة",
    "dashboard.visibility.title": "الرؤية",
    "dashboard.visibility.desc": "تتبَّع كل شحنة لحظيًا عبر الموانئ والناقلين والجمارك — رؤية حيّة موحَّدة لشبكتك بالكامل.",
    "dashboard.visibility.stat": "تتبّع مباشر",

    "dashboard.marketplace.eyebrow": "02 · أداة",
    "dashboard.marketplace.title": "السوق",
    "dashboard.marketplace.desc": "قارن عروض الناقلين الإقليميين، فاوض بشروط شفّافة، واحجز العرض المناسب في دقائق.",
    "dashboard.marketplace.stat": "عروض الناقلين",

    "dashboard.benchmark.eyebrow": "03 · أداة",
    "dashboard.benchmark.title": "مقارنة الأسعار",
    "dashboard.benchmark.desc": "اطّلع على مقارنة أسعار شحناتك مع السوق الإقليمي — حسب المسار والوسيلة والفترة الزمنية.",
    "dashboard.benchmark.stat": "ذكاء السوق",

    "dashboard.hint": "تلميح: كل أداة لها لوحتها الخاصّة. تستطيع التنقّل بينها في أي وقت من هذه الصفحة.",

    /* ─── لوحة التحكم — التصميم متعدّد الأعمدة ─── */
    "dashboard.topbar.menu": "القائمة",
    "dashboard.topbar.home_tab": "الرئيسية",
    "dashboard.user.name": "المشغّل",
    "dashboard.user.company": "شِنتك (عضو)",

    "dashboard.sidebar.favourites": "المفضّلة",
    "dashboard.sidebar.home": "الرئيسية",
    "dashboard.sidebar.apps": "التطبيقات والأدوات",

    "dashboardnews.heading": "تابع آخر أخبار شِنتك",
    "dashboard.news.platform.badge": "معاينة المنصّة",
    "dashboard.news.platform.title": "شبكة الشحن في الخليج — مبنيّة للمختصين",
    "dashboard.news.waitlist.badge": "انضم لقائمة الانتظار",
    "dashboard.news.waitlist.title": "كن من الأوائل عند إطلاق المنصّة.",

    "dashboard.status.help.title": "المساعدة",
    "dashboard.status.help.desc":
      "استخدم قسم المساعدة لتتعرّف على المنصّة وتستفيد من المعرفة المتوفّرة هناك.",
    "dashboard.status.release.title": "ملاحظات الإصدار",
    "dashboard.status.release.desc": "اطّلع على آخر التغييرات في تطبيقنا.",
    "dashboard.status.offers.title": "العروض",
    "dashboard.status.offers.value": "0",
    "dashboard.status.offers.desc": "شحنات بانتظار عرضك",
    "dashboard.status.unconfirmed.title": "غير مؤكَّدة",
    "dashboard.status.unconfirmed.value": "0",
    "dashboard.status.unconfirmed.desc": "شحنات بانتظار تأكيدك",
    "dashboard.status.system.title": "حالة النظام",
    "dashboard.status.system.desc": "جميع الأنظمة تعمل",

    "dashboard.footer.privacy_settings": "إعدادات الخصوصية",
    "dashboard.footer.privacy_notice": "إشعار الخصوصية",
    "dashboard.footer.legal_notice": "الإشعار القانوني",
    "dashboard.footer.shenatech_informs": "شِنتك تُعلمك",

    /* ─── لوحة التحكم — التصميم النظيف ─── */
    "dashboard.welcome.again": "مرحبًا بعودتك!",
    "dashboard.greeting.morning": "صباح الخير",
    "dashboard.greeting.afternoon": "مساء الخير",
    "dashboard.greeting.evening": "مساء الخير",
    "dashboard.explore": "اكتشف",
    "dashboard.models.heading": "اختر نموذجًا",
    "dashboard.models.sub": "ثلاثة منتجات مترابطة للخدمات اللوجستية في الخليج. افتح أحدها للبدء.",

    "dashboard.news.heading": "آخر الأخبار",
    "dashboard.news1.title": "ممرّ جمركي جديد يقلّل وقت العبور من جبل علي إلى الدوحة بنسبة 30%",
    "dashboard.news1.time": "قبل 3 ساعات",
    "dashboard.news2.title": "شِنتك تنطلق في المملكة العربية السعودية الشهر القادم",
    "dashboard.news2.time": "أمس",
    "dashboard.news3.title": "سوق الشحن الخليجي ينمو 12% في الربع الأول — اقرأ التقرير",
    "dashboard.news3.time": "قبل 3 أيام",

    "dashboard.notifications.heading": "الإشعارات",
    "dashboard.notif1.text": "شحنتك SHN-2847 وصلت إلى الجمارك",
    "dashboard.notif1.time": "قبل 5 دقائق",
    "dashboard.notif2.text": "وصل عرض جديد لمسار الدوحة ← الرياض",
    "dashboard.notif2.time": "قبل ساعة",
    "dashboard.notif3.text": "تقرير المقارنة الأسبوعي جاهز للعرض",
    "dashboard.notif3.time": "اليوم، 09:00",

    /* ─── لوحة مقارنة الأسعار ─── */
    "benchmark.eyebrow": "مقارنة الأسعار",
    "benchmark.heading": "أسعار السوق في منطقة الخليج",
    "benchmark.sub": "قارن أسعار شحناتك مع السوق الإقليمي — حسب المسار والوسيلة والفترة الزمنية.",
    "benchmark.filter.region": "المنطقة",
    "benchmark.filter.mode": "الوسيلة",
    "benchmark.filter.period": "الفترة",
    "benchmark.vs_last_week": "مقارنةً بالأسبوع الماضي",
    "benchmark.change_lane": "تغيير المسار",

    "benchmark.trend.eyebrow": "المسار الرئيسي · 12 أسبوعًا",
    "benchmark.trend.sub": "اتجاه السعر الفوري والتعاقدي ومؤشّر الديزل خلال آخر 12 أسبوعًا.",

    "benchmark.movers.eyebrow": "هذا الأسبوع",
    "benchmark.movers.heading": "أبرز التحرّكات",
    "benchmark.movers.gainers": "الأكثر ارتفاعًا (السعر صاعد)",
    "benchmark.movers.losers": "الأكثر انخفاضًا (السعر هابط)",

    "benchmark.compare.eyebrow": "مقارنة المسارات",
    "benchmark.compare.heading": "كيف تُقارن أسعارك",
    "benchmark.compare.sub": "الشريط = متوسّط السوق. العلامة = سعرك.",
    "benchmark.compare.add": "أضف مسارًا",
    "benchmark.compare.you": "أنت",

    /* ─── واجهة لوحة مقارنة الأسعار (المرحلة 1) ─── */
    "benchmark.brand.pill": "لوحة التحكم",
    "benchmark.brand.workspace_hint": "مساحة العمل",

    "benchmark.nav.market": "السوق",
    "benchmark.nav.rates": "الأسعار",
    "benchmark.nav.capacity": "السعة",
    "benchmark.nav.costs": "التكاليف",
    "benchmark.nav.rate_on_demand": "سعر فوري",
    "benchmark.nav.news": "الأخبار",
    "benchmark.nav.reports": "تقاريري",

    "benchmark.sub.market.overview": "نظرة عامة",
    "benchmark.sub.rates.overview": "نظرة عامة",
    "benchmark.sub.rates.forecast": "التوقّعات",
    "benchmark.sub.rates.spot_vs_contract": "فوري مقابل تعاقدي",
    "benchmark.sub.costs.market": "حسب السوق",
    "benchmark.sub.costs.lane": "حسب المسار",
    "benchmark.sub.rate_on_demand.spot": "فوري",
    "benchmark.sub.rate_on_demand.contract": "تعاقدي",

    "benchmark.util.notifications": "الإشعارات",
    "benchmark.util.help": "المساعدة",
    "benchmark.util.theme_light": "الوضع الفاتح",
    "benchmark.util.theme_dark": "الوضع الداكن",
    "benchmark.user.role": "مشغّل",

    "benchmark.placeholder.label": "قريبًا",
    "benchmark.placeholder.title": "نعمل على بناء هذا القسم",
    "benchmark.placeholder.sub": "هذه الصفحة جزء من المراحل القادمة. التنقّل جاهز والتخطيط في مكانه — والمحتوى سيظهر هنا في المرحلة التالية.",

    "benchmark.landing.eyebrow": "مقارنة الأسعار",
    "benchmark.landing.title": "أهلًا بك في مساحة عمل الأسعار",
    "benchmark.landing.sub": "اختر فئة من القائمة على اليمين للبدء. اتجاهات السوق وتوقّعات الأسعار والسعة والتكاليف ومرجع الأسعار السريع كلها هنا.",

    /* ─── واجهة لوحة التتبّع (المرحلة الأولى) ─── */
    /* القائمة الجانبية الرئيسية (٨ أقسام) */
    "visibility.nav.dashboards": "اللوحات",
    "visibility.nav.transports": "الشحنات",
    "visibility.nav.fleet": "الأسطول",
    "visibility.nav.vehicles": "إدارة المركبات",
    "visibility.nav.network": "شبكة البيانات",
    "visibility.nav.analytics": "التحليلات",
    "visibility.nav.notifications": "الإشعارات",
    "visibility.nav.shared": "العروض المشتركة",

    /* التبويبات الفرعية للقسمين اللذين يحتويانها */
    "visibility.sub.vehicles.dedicated": "مركباتي",
    "visibility.sub.vehicles.partners": "مركبات الشركاء",
    "visibility.sub.vehicles.integrations": "التكاملات",
    "visibility.sub.network.customers": "العملاء",
    "visibility.sub.network.carriers": "شبكة الناقلين",
    "visibility.sub.network.performance": "أداء الطرق",

    /* العنصر النائب المشترك لصفحات المرحلة الأولى */
    "visibility.placeholder.title": "نعمل على بناء هذا القسم",
    "visibility.placeholder.sub": "هذه الصفحة جزء من المراحل القادمة. التنقّل جاهز والتخطيط في مكانه — ومحتوى التتبّع المباشر سيظهر هنا في المرحلة التالية.",

    /* ─── التتبّع → صفحة اللوحات ─── */
    "visibility.db.title": "اللوحات",
    "visibility.db.sub": "لمحة مباشرة عن عملياتك — ثبّت المؤشّرات المهمّة وتابع تحديثها لحظيًا.",
    "visibility.db.new_widget": "عنصر جديد",
    "visibility.db.menu": "خيارات",
    "visibility.db.select.aria": "اختر لوحة",
    "visibility.db.visibility": "مرئية لك فقط",
    "visibility.db.updated": "تم التحديث الآن",

    /* قوالب اللوحات في القائمة */
    "visibility.db.board.ops": "نظرة عامة على العمليات",
    "visibility.db.board.delivery": "أداء التسليم",
    "visibility.db.board.fleet": "حالة الأسطول",

    /* لافتة الترحيب */
    "visibility.db.banner.title": "أهلًا بك في لوحتك",
    "visibility.db.banner.text": "ثبّت مؤشّرات الشحنات والأسطول والتسليم التي تهمّك. أضِف عناصر وأعِد ترتيبها وابنِ العرض الذي يناسب عملياتك.",
    "visibility.db.banner.dismiss": "إغلاق",

    /* عنصر الإضافة */
    "visibility.db.add.title": "أضِف عنصرًا",
    "visibility.db.add.text": "تتبّع مؤشّرًا جديدًا على هذه اللوحة",
    "visibility.db.card.view": "عرض الشحنات",

    /* عناوين العناصر */
    "visibility.db.w.pickup.title": "شحنات مُجدوَلة للاستلام اليوم",
    "visibility.db.w.delivery.title": "شحنات خارجة للتسليم اليوم",
    "visibility.db.w.delayed.title": "تسليمات متأخّرة تصل اليوم",
    "visibility.db.w.untracked.title": "شحنات غير متتبَّعة",
    "visibility.db.w.completed.title": "مكتملة هذا الأسبوع",
    "visibility.db.w.vehicles.title": "مركبات نشطة على الطريق",

    /* وسوم الحالة (مشتركة بين العناصر) */
    "visibility.db.tag.tracking": "قيد التتبّع",
    "visibility.db.tag.on_time": "في الموعد",
    "visibility.db.tag.delayed": "متأخّرة",
    "visibility.db.tag.towards_pickup": "نحو الاستلام",
    "visibility.db.tag.towards_delivery": "نحو التسليم",
    "visibility.db.tag.awaiting_gps": "بانتظار GPS",
    "visibility.db.tag.action_needed": "تتطلّب إجراءً",
    "visibility.db.tag.delivered": "تم التسليم",
    "visibility.db.tag.this_week": "هذا الأسبوع",
    "visibility.db.tag.live_gps": "GPS مباشر",
    "visibility.db.tag.moving": "متحرّكة",

    /* ─── التتبّع → صفحة الشحنات ─── */
    "visibility.tr.title": "الشحنات",
    "visibility.tr.sub": "تابع كل شحنة في دول الخليج لحظيًا — صفِّ حسب الحالة، وتابع المواقع المباشرة على الخريطة، وتعامل مع التأخيرات قبل تفاقمها.",
    "visibility.tr.search": "ابحث في الشحنات أو المسارات أو الناقلين…",
    "visibility.tr.tabs_aria": "تصفية الشحنات حسب الحالة",

    /* تبويبات الحالة */
    "visibility.tr.tab.all": "الكل",
    "visibility.tr.tab.tracking": "قيد التتبّع",
    "visibility.tr.tab.on_time": "في الموعد",
    "visibility.tr.tab.delayed": "متأخّرة",
    "visibility.tr.tab.unknown": "غير معروفة",
    "visibility.tr.tab.upcoming": "قادمة",
    "visibility.tr.tab.untracked": "غير متتبَّعة",
    "visibility.tr.tab.completed": "مكتملة",
    "visibility.tr.tab.cancelled": "ملغاة",

    /* شريط الأدوات */
    "visibility.tr.saved_filters": "عوامل تصفية محفوظة",
    "visibility.tr.filter": "تصفية",
    "visibility.tr.export": "تصدير",
    "visibility.tr.count_label": "شحنة",
    "visibility.tr.sort": "ترتيب حسب",
    "visibility.tr.sort.eta": "الوصول للمحطة التالية",
    "visibility.tr.sort.ref": "المرجع",
    "visibility.tr.sort.status": "الحالة",

    /* وسوم حالة الشحنة (على كل صف) */
    "visibility.tr.status.on_time": "في الموعد",
    "visibility.tr.status.delayed": "متأخّرة",
    "visibility.tr.status.unknown": "غير معروفة",
    "visibility.tr.status.upcoming": "قادمة",
    "visibility.tr.status.untracked": "غير متتبَّعة",
    "visibility.tr.status.completed": "مكتملة",
    "visibility.tr.status.cancelled": "ملغاة",

    /* تفاصيل الصف */
    "visibility.tr.eta": "الوصول",
    "visibility.tr.delivered": "تم التسليم",
    "visibility.tr.not_started": "لم تبدأ",
    "visibility.tr.no_signal": "لا إشارة",
    "visibility.tr.min_ago": "دقيقة مضت",
    "visibility.tr.unit_h": "س",
    "visibility.tr.unit_m": "د",
    "visibility.tr.empty": "لا توجد شحنات مطابقة لهذه التصفية.",

    /* الخريطة */
    "visibility.tr.map.live_badge": "مباشر",
    "visibility.tr.map.select_hint": "اختر شحنة لتتبّعها على الخريطة",

    /* ─── التتبّع → صفحة مراقبة الأسطول ─── */
    "visibility.fl.title": "مراقبة الأسطول",
    "visibility.fl.sub": "اعرف مكان كل مركبة وما هو مجدول لها — خط زمني مباشر للرحلات عبر أسطولك، أو مواقعها على الخريطة.",
    "visibility.fl.allocate": "تخصيص",
    "visibility.fl.available": "متاحة",
    "visibility.fl.view": "العرض",
    "visibility.fl.timeline": "الخط الزمني",
    "visibility.fl.map": "الخريطة",
    "visibility.fl.today": "اليوم",
    "visibility.fl.col.vehicle": "المركبة",
    "visibility.fl.empty": "لا توجد مركبات مطابقة لعوامل التصفية.",

    /* عوامل التصفية */
    "visibility.fl.filter.group": "مجموعة المركبات",
    "visibility.fl.filter.status": "الحالة",
    "visibility.fl.group.all": "كل المركبات",
    "visibility.fl.group.dedicated": "مركبات مخصّصة",
    "visibility.fl.group.partner": "مركبات الشركاء",

    /* حالات المركبة */
    "visibility.fl.status.all": "كل الحالات",
    "visibility.fl.status.driving": "تسير",
    "visibility.fl.status.idle": "متوقّفة",
    "visibility.fl.status.loading": "تُحمَّل",
    "visibility.fl.status.maintenance": "صيانة",

    /* أنواع الصناديق */
    "visibility.fl.type.reefer": "مبرّدة",
    "visibility.fl.type.curtain": "ستائرية",
    "visibility.fl.type.flatbed": "مسطّحة",
    "visibility.fl.type.tanker": "صهريج",
    "visibility.fl.type.box": "صندوقية",

    /* وسوم الرحلة / الحالة */
    "visibility.fl.status.in_transit": "قيد النقل",
    "visibility.fl.status.delayed": "متأخّرة",
    "visibility.fl.list": "قائمة",

    /* شريط ملخّص الحالة */
    "visibility.fl.sum.driving": "على الطريق",
    "visibility.fl.sum.delayed": "متأخّرة",
    "visibility.fl.sum.loading": "تُحمَّل",
    "visibility.fl.sum.idle": "متوقّفة",
    "visibility.fl.sum.maintenance": "صيانة",

    /* صفوف القائمة */
    "visibility.fl.r.next": "التالي",
    "visibility.fl.r.no_upcoming": "لا رحلات قادمة",
    "visibility.fl.r.departs_in": "ينطلق خلال",
    "visibility.fl.r.eta": "الوصول",
    "visibility.fl.r.available": "متاحة للتخصيص",
    "visibility.fl.r.loading_at": "تُحمَّل في",
    "visibility.fl.r.in_maintenance": "في الصيانة",

    /* ─── التتبّع → إدارة المركبات ─── */
    "visibility.vm.search": "ابحث في المركبات…",
    "visibility.vm.add_vehicle": "إضافة مركبة",
    "visibility.vm.invite": "دعوة الناقلين",
    "visibility.vm.add_integration": "إضافة تكامل",
    "visibility.vm.ago": "مضت",
    "visibility.vm.not_connected": "غير متّصلة",
    "visibility.vm.empty": "لا مركبات لعرضها.",

    /* حالات الاتصال */
    "visibility.vm.status.connected": "متّصلة",
    "visibility.vm.status.no_signal": "لا إشارة",
    "visibility.vm.status.pending": "قيد الانتظار",

    /* ملخّص الاتصال */
    "visibility.vm.sum.connected": "متّصلة",
    "visibility.vm.sum.no_signal": "لا إشارة",
    "visibility.vm.sum.pending": "بانتظار الإعداد",

    /* أعمدة الجدول */
    "visibility.vm.col.vehicle": "المركبة",
    "visibility.vm.col.type": "النوع",
    "visibility.vm.col.carrier": "الناقل",
    "visibility.vm.col.telematics": "نظام التتبّع",
    "visibility.vm.col.status": "الحالة",
    "visibility.vm.col.last_seen": "آخر ظهور",

    /* مركباتي */
    "visibility.vm.my.title": "مركباتي",
    "visibility.vm.my.sub": "مركباتك المخصّصة وحالة اتصال نظام تتبّعها.",

    /* مركبات الشركاء */
    "visibility.vm.partner.title": "مركبات الشركاء",
    "visibility.vm.partner.sub": "مركبات خصّصها لك الناقلون الشركاء لرؤية مباشرة على مدار الساعة.",
    "visibility.vm.partner.note": "تظهر مركبات الشركاء هنا بمجرّد قبول الناقل لدعوتك وبدء مشاركة بيانات GPS.",

    /* التكاملات */
    "visibility.vm.int.title": "التكاملات",
    "visibility.vm.int.sub": "اربط مزوّدي أنظمة التتبّع وGPS لإدخال المركبات إلى تتبّع شِنتك.",
    "visibility.vm.int.connected": "متّصلة",
    "visibility.vm.int.available": "متاحة",
    "visibility.vm.int.manage": "إدارة",
    "visibility.vm.int.connect": "ربط",
    "visibility.vm.int.vehicles": "مركبة",
    "visibility.vm.int.category.telematics": "تتبّع",
    "visibility.vm.int.category.eld": "ELD",

    /* ─── التتبّع → شبكة البيانات ─── */
    "visibility.nw.search_carrier": "ابحث عن شركة…",
    "visibility.nw.invite": "دعوة الناقلين",
    "visibility.nw.download": "تنزيل",
    "visibility.nw.count_company": "شركة",
    "visibility.nw.actions": "إجراءات",
    "visibility.nw.empty": "لا توجد شركات مطابقة لعوامل التصفية.",

    /* عوامل التصفية */
    "visibility.nw.filter.onboarding": "حالة الانضمام",
    "visibility.nw.filter.consent": "حالة الموافقة",
    "visibility.nw.onboarding.all": "كل حالات الانضمام",
    "visibility.nw.consent.all": "كل حالات الموافقة",

    /* حالات الانضمام */
    "visibility.nw.ob.accepted": "مقبولة",
    "visibility.nw.ob.invited": "مدعوّة",
    "visibility.nw.ob.pending": "قيد الانتظار",
    "visibility.nw.ob.declined": "مرفوضة",

    /* حالات الموافقة */
    "visibility.nw.cs.granted": "ممنوحة",
    "visibility.nw.cs.pending": "قيد الانتظار",
    "visibility.nw.cs.declined": "مرفوضة",

    /* ملخّص الانضمام */
    "visibility.nw.sum.accepted": "مقبولة",
    "visibility.nw.sum.invited": "مدعوّة",
    "visibility.nw.sum.pending": "قيد الانتظار",
    "visibility.nw.sum.declined": "مرفوضة",

    /* أعمدة الجدول */
    "visibility.nw.col.company": "الشركة",
    "visibility.nw.col.reference": "المرجع",
    "visibility.nw.col.relation": "معرّف العلاقة",
    "visibility.nw.col.vehicles": "المركبات",
    "visibility.nw.col.onboarding": "الانضمام",
    "visibility.nw.col.consent": "الموافقة",
    "visibility.nw.col.customer": "العميل",
    "visibility.nw.col.shared_views": "العروض المشتركة",
    "visibility.nw.col.access": "صلاحية التتبّع",
    "visibility.nw.col.status": "الحالة",

    /* صفحة شبكة الناقلين */
    "visibility.nw.carriers.title": "شبكة الناقلين",
    "visibility.nw.carriers.sub": "الناقلون الذين تتبادل معهم بيانات التتبّع — تابع الانضمام وموافقة مشاركة GPS عبر شبكتك.",

    /* صفحة العملاء */
    "visibility.nw.cust.title": "العملاء",
    "visibility.nw.cust.sub": "الشركات التي تشاركها رؤية مباشرة لشحناتك.",
    "visibility.nw.cust.add": "إضافة عميل",
    "visibility.nw.cust.active": "نشط",
    "visibility.nw.cust.pending": "قيد الانتظار",
    "visibility.nw.access.full": "كاملة",
    "visibility.nw.access.limited": "محدودة",

    /* صفحة أداء الطرق */
    "visibility.nw.perf.title": "أداء الطرق",
    "visibility.nw.perf.sub": "ما مقدار شبكة طرقك التي توفّر تتبّع GPS مباشرًا.",
    "visibility.nw.perf.rate": "نسبة التتبّع",
    "visibility.nw.perf.tracked": "متتبَّعة",
    "visibility.nw.perf.untracked": "غير متتبَّعة",
    "visibility.nw.perf.transports": "شحنة",
    "visibility.nw.perf.by_country": "نسبة التتبّع حسب الدولة",
    "visibility.nw.perf.of": "من",

    /* ─── التتبّع → التحليلات (أداء التتبّع) ─── */
    "visibility.an.title": "أداء التتبّع",
    "visibility.an.sub": "مدى موثوقية تخصيص شحناتك وتتبّعها ووصولها بمواعيد وصول دقيقة.",
    "visibility.an.export": "تصدير",
    "visibility.an.period": "الفترة",
    "visibility.an.period.30": "آخر 30 يومًا",
    "visibility.an.period.90": "آخر 90 يومًا",
    "visibility.an.scope": "النطاق",
    "visibility.an.scope.customers": "العملاء",
    "visibility.an.scope.carriers": "شبكة الناقلين",
    "visibility.an.transports": "شحنة",
    "visibility.an.wk": "أسبوع",

    /* بطاقات المؤشّرات */
    "visibility.an.kpi.tracked": "متتبَّعة",
    "visibility.an.kpi.untracked": "غير متتبَّعة",
    "visibility.an.kpi.allocated": "مخصّصة",
    "visibility.an.kpi.stops_eta": "وصول كل المحطات",

    /* الخط الزمني */
    "visibility.an.timeline": "الخط الزمني للأداء",
    "visibility.an.timeline_sub": "مؤشّرات التتبّع الأسبوعية عبر آخر 12 أسبوعًا. اضغط عنصرًا في المفتاح لإظهاره أو إخفائه.",

    /* مقاييس الرسم */
    "visibility.an.m.allocated": "مخصّصة",
    "visibility.an.m.tracked": "متتبَّعة",
    "visibility.an.m.stops_visited": "زيارة كل المحطات",
    "visibility.an.m.stops_eta": "وصول كل المحطات",

    /* جدول الناقلين */
    "visibility.an.by_carrier": "الأداء حسب الناقل",
    "visibility.an.col.carrier": "الناقل",
    "visibility.an.col.transports": "الشحنات",

    /* ─── التتبّع → الإشعارات (قواعد الإشعارات) ─── */
    "visibility.no.title": "قواعد الإشعارات",
    "visibility.no.sub": "احصل على تنبيه فور حدوث ما يستدعي انتباهك — اضبط قواعد للتأخير وتغيّر مواعيد الوصول وفقدان GPS وغيرها.",
    "visibility.no.add": "إضافة قاعدة",
    "visibility.no.last": "آخر تشغيل",
    "visibility.no.never": "أبدًا",
    "visibility.no.times": "مرّة",
    "visibility.no.on": "مُفعّلة",
    "visibility.no.off": "متوقّفة",
    "visibility.no.unit_d": "ي",

    /* الملخّص */
    "visibility.no.sum.active": "قواعد نشطة",
    "visibility.no.sum.paused": "متوقّفة",
    "visibility.no.sum.week": "تنبيهات هذا الأسبوع",

    /* النطاقات */
    "visibility.no.scope.all": "كل الشحنات",
    "visibility.no.scope.customer": "شحنات العملاء",
    "visibility.no.scope.reefer": "الشحنات المبرّدة",
    "visibility.no.scope.cross": "عبور حدود الخليج",

    /* القنوات */
    "visibility.no.ch.email": "بريد إلكتروني",
    "visibility.no.ch.sms": "رسالة نصية",
    "visibility.no.ch.push": "داخل التطبيق",

    /* قواعد الأحداث */
    "visibility.no.ev.delay.name": "تأخير يتجاوز 60 دقيقة",
    "visibility.no.ev.delay.desc": "عندما تتأخّر شحنة أكثر من 60 دقيقة عن موعد وصولها",
    "visibility.no.ev.eta.name": "تغيّر موعد الوصول 30 دقيقة أو أكثر",
    "visibility.no.ev.eta.desc": "عندما يتغيّر موعد وصول شحنة بمقدار 30 دقيقة أو أكثر",
    "visibility.no.ev.untracked.name": "فقدان إشارة GPS",
    "visibility.no.ev.untracked.desc": "عندما تتوقّف مركبة متتبَّعة عن الإرسال لمدة 20 دقيقة",
    "visibility.no.ev.temp.name": "تجاوز حرارة المبرّدة",
    "visibility.no.ev.temp.desc": "عندما تخرج حرارة المبرّدة عن النطاق المحدّد",
    "visibility.no.ev.arrival.name": "الوصول إلى محطة",
    "visibility.no.ev.arrival.desc": "عندما تصل مركبة إلى محطة مجدولة",
    "visibility.no.ev.departed.name": "المغادرة من المنشأ",
    "visibility.no.ev.departed.desc": "عندما تغادر شحنة موقع استلامها",

    /* ─── التتبّع → العروض المشتركة ─── */
    "visibility.sv.title": "العروض المشتركة",
    "visibility.sv.sub": "امنح عملاءك رابطًا مباشرًا لتتبّع شحناتهم — دون الحاجة لتسجيل الدخول.",
    "visibility.sv.add": "إضافة عرض مشترك",
    "visibility.sv.shared_with": "مشارَك مع",
    "visibility.sv.copy": "نسخ الرابط",
    "visibility.sv.copied": "تم النسخ!",
    "visibility.sv.shipments": "شحنة",
    "visibility.sv.views": "فتحة",
    "visibility.sv.last_viewed": "آخر فتح",
    "visibility.sv.never": "أبدًا",

    /* الملخّص */
    "visibility.sv.sum.active": "عروض نشطة",
    "visibility.sv.sum.opens": "إجمالي الفتحات",
    "visibility.sv.sum.shipments": "شحنات مشارَكة",

    /* الحالات */
    "visibility.sv.status.active": "نشط",
    "visibility.sv.status.paused": "متوقّف",
    "visibility.sv.status.expired": "منتهٍ",

    /* ═══ واجهة لوحة السوق ═══ */
    "marketplace.nav.home": "الرئيسية",
    "marketplace.nav.spot": "الفوري",
    "marketplace.nav.lanes": "طلبات المسارات",
    "marketplace.nav.rfq": "طلبات العروض",
    "marketplace.nav.analysis": "التحليل",
    "marketplace.nav.perspectives": "رؤى الشحن",
    "marketplace.nav.profile": "الملف التعريفي",
    "marketplace.nav.users": "إدارة المستخدمين",
    "marketplace.nav.settings": "الإعدادات",
    "marketplace.placeholder.title": "نعمل على بناء هذا القسم",
    "marketplace.placeholder.sub": "هذه الصفحة جزء من المراحل القادمة. التنقّل جاهز والتخطيط في مكانه — ومحتوى السوق سيظهر هنا في المرحلة التالية.",

    /* ─── السوق → الرئيسية ─── */
    "marketplace.home.eyebrow": "سوق الشحن",
    "marketplace.home.welcome": "أهلًا بعودتك",
    "marketplace.home.sub": "اعثر على الشحنات، وانشر المسارات، واربح المناقصات طويلة الأمد — كل ذلك في سوق واحد يغطّي الخليج.",

    "marketplace.home.stat.loads": "شحنات فورية متاحة",
    "marketplace.home.stat.lanes": "فرص المسارات",
    "marketplace.home.stat.rfqs": "طلبات عروض نشطة",
    "marketplace.home.stat.bids": "عروضك المفتوحة",

    "marketplace.home.spot.eyebrow": "التوريد الفوري",
    "marketplace.home.spot.title": "الفوري",
    "marketplace.home.spot.desc": "اطّلع وقدّم عروضًا على آلاف الشحنات الفورية اليومية، أو أطلق فعالياتك الفورية للوصول إلى ناقلين يناسبون مساراتك.",
    "marketplace.home.spot.badge": "شحنة متاحة",
    "marketplace.home.spot.cta": "إلى الفوري",

    "marketplace.home.lanes.eyebrow": "طلبات السعة",
    "marketplace.home.lanes.title": "طلبات المسارات",
    "marketplace.home.lanes.desc": "تصفّح فرص المسارات المفتوحة وقدّم عروضًا على الشحنات المتكرّرة التي تناسب أسطولك.",
    "marketplace.home.lanes.badge": "فرصة مفتوحة",
    "marketplace.home.lanes.cta": "إلى طلبات المسارات",

    "marketplace.home.rfq.eyebrow": "التوريد التعاقدي",
    "marketplace.home.rfq.title": "طلبات العروض",
    "marketplace.home.rfq.desc": "احصل على أعمال طويلة الأمد وكبيرة الحجم بالمشاركة في مناقصات استراتيجية من شاحنين يبحثون عن شركاء موثوقين.",
    "marketplace.home.rfq.badge": "مناقصة قائمة",
    "marketplace.home.rfq.cta": "إلى طلبات العروض",

    "marketplace.home.verify.title": "توثيق الحساب",
    "marketplace.home.verify.complete": "إكمال التوثيق",
    "marketplace.home.verify.company": "بيانات الشركة",
    "marketplace.home.verify.insurance": "وثائق التأمين",
    "marketplace.home.verify.licence": "رخصة التشغيل",
    "marketplace.home.verify.bank": "البيانات البنكية",

    "marketplace.home.activity.title": "النشاط الأخير",
    "marketplace.home.act1.text": "طلب مسار جديد: جدة ← الرياض",
    "marketplace.home.act1.time": "قبل 20 دقيقة",
    "marketplace.home.act2.text": "تم قبول عرضك على SPOT-3920",
    "marketplace.home.act2.time": "قبل ساعة",
    "marketplace.home.act3.text": "مناقصة «شبكة مبرّدات الخليج 2026» تُغلق خلال يومين",
    "marketplace.home.act3.time": "قبل 3 ساعات",
    "marketplace.home.act4.text": "8 شحنات فورية جديدة على مساراتك المفضّلة",
    "marketplace.home.act4.time": "اليوم",

    /* ─── السوق → الفوري (لوحة الشحنات) ─── */
    "marketplace.spot.title": "باحث الشحنات الفورية",
    "marketplace.spot.sub": "تصفّح وقدّم عروضًا على الشحنات الفورية المباشرة عبر الخليج. صفِّ حسب المعدّة، ورتّب حسب الموعد، وقدّم عرضك قبل انتهاء الوقت.",
    "marketplace.spot.refresh": "تحديث",
    "marketplace.spot.create": "إنشاء فعالية فورية",
    "marketplace.spot.search": "ابحث في الشحنات أو المسارات أو الشاحنين…",
    "marketplace.spot.equipment": "المعدّة",
    "marketplace.spot.equip.all": "كل المعدّات",
    "marketplace.spot.sort": "ترتيب حسب",
    "marketplace.spot.sort.deadline": "الأقرب إغلاقًا",
    "marketplace.spot.sort.rate": "الأعلى سعرًا",
    "marketplace.spot.sort.distance": "الأقصر مسافة",
    "marketplace.spot.loads": "شحنة",
    "marketplace.spot.empty": "لا توجد شحنات مطابقة لعوامل التصفية.",
    "marketplace.spot.new": "جديد",

    /* الأعمدة */
    "marketplace.spot.col.route": "المسار",
    "marketplace.spot.col.equipment": "المعدّة",
    "marketplace.spot.col.distance": "المسافة",
    "marketplace.spot.col.shipper": "الشاحن",
    "marketplace.spot.col.rate": "السعر المستهدف",
    "marketplace.spot.col.deadline": "يُغلق العرض خلال",

    /* الخلايا */
    "marketplace.spot.pallets": "منصّة",
    "marketplace.spot.tonnes": "طن",
    "marketplace.spot.km": "كم",
    "marketplace.spot.bid": "تقديم عرض",
    "marketplace.spot.day.today": "اليوم",
    "marketplace.spot.day.tomorrow": "غدًا",
    "marketplace.spot.day.in2": "بعد يومين",
    "marketplace.spot.day.in3": "بعد 3 أيام",

    /* الإحصاءات */
    "marketplace.spot.sum.open": "شحنات متاحة",
    "marketplace.spot.sum.fresh": "جديدة اليوم",
    "marketplace.spot.sum.closing": "تُغلق قريبًا",

    /* ─── السوق → طلبات المسارات (الفرص) ─── */
    "marketplace.lanes.title": "الفرص",
    "marketplace.lanes.sub": "تصفّح طلبات المسارات المفتوحة وقدّم عروضًا على الشحنات المتكرّرة التي تناسب أسطولك.",
    "marketplace.lanes.create": "إنشاء طلب مسار",
    "marketplace.lanes.download": "تنزيل",
    "marketplace.lanes.search": "ابحث في المسارات أو الشاحنين…",
    "marketplace.lanes.favorites": "مفضّلتي",
    "marketplace.lanes.sort": "ترتيب حسب",
    "marketplace.lanes.sort.deadline": "الأقرب إغلاقًا",
    "marketplace.lanes.sort.shipments": "الأكثر شحنات",
    "marketplace.lanes.sort.newest": "الأحدث",
    "marketplace.lanes.count": "فرصة",
    "marketplace.lanes.empty": "لا توجد فرص مطابقة لعوامل التصفية.",
    "marketplace.lanes.new": "جديد",
    "marketplace.lanes.favorite": "مفضّلة",
    "marketplace.lanes.details": "التفاصيل",

    "marketplace.lanes.mode.road": "برّي",
    "marketplace.lanes.scope.price": "السعر فقط",
    "marketplace.lanes.scope.price_capacity": "السعر والسعة",
    "marketplace.lanes.direct": "مباشر",
    "marketplace.lanes.stops": "محطات",
    "marketplace.lanes.shipments": "شحنة",
    "marketplace.lanes.months": "أشهر",
    "marketplace.lanes.in": "خلال",
    "marketplace.lanes.deadline": "موعد العرض",

    /* تسميات المقاييس */
    "marketplace.lanes.f.lane": "المسار",
    "marketplace.lanes.f.shipments": "الحجم",
    "marketplace.lanes.f.contract": "العقد",
    "marketplace.lanes.f.posted": "نُشر",

    /* الإحصاءات */
    "marketplace.lanes.sum.open": "فرص مفتوحة",
    "marketplace.lanes.sum.new": "جديدة",
    "marketplace.lanes.sum.closing": "تُغلق قريبًا",

    /* ─── السوق → طلبات العروض (المناقصات) ─── */
    "marketplace.rfq.title": "طلبات العروض",
    "marketplace.rfq.sub": "شارك في مناقصات استراتيجية من شاحنين يبحثون عن شركاء طويلي الأمد وكبيري الحجم.",
    "marketplace.rfq.create": "إنشاء طلب عرض",
    "marketplace.rfq.tabs_aria": "تصفية المناقصات حسب الحالة",
    "marketplace.rfq.empty": "لا توجد مناقصات مطابقة لهذه التصفية.",
    "marketplace.rfq.round": "الجولة",
    "marketplace.rfq.of": "من",
    "marketplace.rfq.deadline": "موعد التقديم",
    "marketplace.rfq.details": "التفاصيل",
    "marketplace.rfq.participate": "المشاركة",
    "marketplace.rfq.per_year": "شحنة/سنة",
    "marketplace.rfq.closed_eval": "أُغلق التقديم · قيد التقييم",
    "marketplace.rfq.closed_awarded": "تم ترسية المناقصة",

    /* تبويبات الحالة + الوسوم */
    "marketplace.rfq.tab.all": "الكل",
    "marketplace.rfq.tab.open": "مفتوحة",
    "marketplace.rfq.tab.closing": "تُغلق قريبًا",
    "marketplace.rfq.tab.evaluation": "قيد التقييم",
    "marketplace.rfq.tab.awarded": "مُرسّاة",
    "marketplace.rfq.status.open": "مفتوحة",
    "marketplace.rfq.status.closing": "تُغلق قريبًا",
    "marketplace.rfq.status.evaluation": "قيد التقييم",
    "marketplace.rfq.status.awarded": "مُرسّاة",

    /* تسميات المقاييس */
    "marketplace.rfq.f.lanes": "المسارات",
    "marketplace.rfq.f.volume": "الحجم السنوي",
    "marketplace.rfq.f.term": "المدّة",
    "marketplace.rfq.f.regions": "المناطق",

    /* الإحصاءات */
    "marketplace.rfq.sum.open": "مناقصات مفتوحة",
    "marketplace.rfq.sum.closing": "تُغلق قريبًا",
    "marketplace.rfq.sum.awarded": "مُرسّاة",

    /* ─── السوق → التحليل ─── */
    "marketplace.an.title": "التحليل",
    "marketplace.an.sub": "أنشئ مقارنات للأسعار ونماذج لتكلفة المسارات ودراسات للتوفير عبر شحناتك.",
    "marketplace.an.create": "إنشاء تحليل",
    "marketplace.an.lanes": "مسار",
    "marketplace.an.updated": "حُدّث",
    "marketplace.an.open": "فتح",
    "marketplace.an.export": "تصدير",

    "marketplace.an.type.rate_benchmark": "مقارنة الأسعار",
    "marketplace.an.type.lane_cost": "تكلفة المسار",
    "marketplace.an.type.spend": "تحليل الإنفاق",
    "marketplace.an.type.savings": "التوفير",

    "marketplace.an.status.ready": "جاهز",
    "marketplace.an.status.running": "قيد التشغيل",
    "marketplace.an.status.draft": "مسودّة",

    "marketplace.an.r.vs_market": "مقابل سعر السوق",
    "marketplace.an.r.per_km": "متوسّط التكلفة / كم",
    "marketplace.an.r.spend": "إنفاق الشحن السنوي",
    "marketplace.an.r.potential": "توفير محتمل",

    "marketplace.an.sum.total": "تحليلات",
    "marketplace.an.sum.lanes": "مسارات محلّلة",
    "marketplace.an.sum.savings": "توفير محتمل",

    /* ─── السوق → رؤى الشحن ─── */
    "marketplace.fp.title": "رؤى الشحن",
    "marketplace.fp.sub": "معلومات سوق الشحن في الخليج — الأسعار والسعة والوقود والتجارة، في موجز واحد.",
    "marketplace.fp.filter_aria": "تصفية الرؤى حسب الموضوع",
    "marketplace.fp.featured": "مميّز",
    "marketplace.fp.read": "قراءة",
    "marketplace.fp.read_min": "دقيقة قراءة",

    "marketplace.fp.cat.all": "الكل",
    "marketplace.fp.cat.rates": "الأسعار",
    "marketplace.fp.cat.capacity": "السعة",
    "marketplace.fp.cat.fuel": "الوقود",
    "marketplace.fp.cat.regulation": "التشريعات",
    "marketplace.fp.cat.trade": "التجارة",

    "marketplace.fp.pulse.spot": "مؤشّر الخليج الفوري",
    "marketplace.fp.pulse.capacity": "السعة",
    "marketplace.fp.pulse.diesel": "الديزل",
    "marketplace.fp.pulse.demand": "الطلب",

    /* ─── السوق → الملف التعريفي ─── */
    "marketplace.pf.verified": "موثّق",
    "marketplace.pf.type.carrier": "ناقل",
    "marketplace.pf.member_since": "عضو منذ",
    "marketplace.pf.edit": "تعديل الملف",
    "marketplace.pf.vehicles": "مركبة",

    "marketplace.pf.stat.shipments": "شحنات مكتملة",
    "marketplace.pf.stat.ontime": "نسبة الالتزام بالموعد",
    "marketplace.pf.stat.rating": "التقييم",
    "marketplace.pf.stat.lanes": "مسارات نشطة",

    "marketplace.pf.details.title": "بيانات الشركة",
    "marketplace.pf.d.legal": "الاسم القانوني",
    "marketplace.pf.d.reg": "السجل التجاري",
    "marketplace.pf.d.hq": "المقرّ الرئيسي",
    "marketplace.pf.d.fleet": "حجم الأسطول",
    "marketplace.pf.d.founded": "سنة التأسيس",

    "marketplace.pf.operating.title": "الملف التشغيلي",
    "marketplace.pf.regions": "المناطق المخدومة",
    "marketplace.pf.equipment": "أنواع المعدّات",

    "marketplace.pf.verify.title": "التوثيق",
    "marketplace.pf.verify.complete": "إكمال التوثيق",
    "marketplace.pf.verify.note": "لا تزال بعض الوثائق ناقصة. أكمل التوثيق لإتاحة تقديم العروض على المناقصات.",
    "marketplace.pf.verify.done": "حسابك موثّق بالكامل.",

    "marketplace.pf.docs.title": "الوثائق",
    "marketplace.pf.docs.expires": "تنتهي",
    "marketplace.pf.docs.valid": "سارية",
    "marketplace.pf.docs.expiring": "تنتهي قريبًا",
    "marketplace.pf.docs.missing": "ناقصة",
    "marketplace.pf.docs.not_uploaded": "لم تُرفع",
    "marketplace.pf.docs.upload": "رفع",
    "marketplace.pf.doc.cr": "السجل التجاري",
    "marketplace.pf.doc.licence": "رخصة التشغيل",
    "marketplace.pf.doc.insurance": "شهادة التأمين",
    "marketplace.pf.doc.vat": "شهادة ضريبة القيمة المضافة",
    "marketplace.pf.doc.bank": "التحقّق البنكي",

    /* ─── السوق → إدارة المستخدمين ─── */
    "marketplace.um.title": "إدارة المستخدمين",
    "marketplace.um.sub": "تحكّم بمن يمكنه الوصول إلى مساحة عمل السوق وما يمكنه فعله.",
    "marketplace.um.invite": "دعوة مستخدم",
    "marketplace.um.search": "ابحث في المستخدمين…",
    "marketplace.um.role_filter": "الدور",
    "marketplace.um.all_roles": "كل الأدوار",
    "marketplace.um.count": "مستخدم",
    "marketplace.um.empty": "لا مستخدمين مطابقين لعوامل التصفية.",
    "marketplace.um.actions": "إجراءات",
    "marketplace.um.invited_sent": "أُرسلت الدعوة",

    "marketplace.um.col.user": "المستخدم",
    "marketplace.um.col.role": "الدور",
    "marketplace.um.col.status": "الحالة",
    "marketplace.um.col.last": "آخر نشاط",

    "marketplace.um.role.admin": "مدير النظام",
    "marketplace.um.role.manager": "مدير",
    "marketplace.um.role.operator": "مشغّل",
    "marketplace.um.role.viewer": "مُطّلع",

    "marketplace.um.status.active": "نشط",
    "marketplace.um.status.invited": "مدعوّ",
    "marketplace.um.status.inactive": "غير نشط",

    "marketplace.um.sum.total": "المستخدمون",
    "marketplace.um.sum.active": "نشطون",
    "marketplace.um.sum.pending": "دعوات معلّقة",

    /* ─── السوق → الإعدادات ─── */
    "marketplace.set.title": "الإعدادات",
    "marketplace.set.sub": "تحكّم بإشعاراتك وتفضيلاتك والإعدادات الافتراضية وأمان حسابك.",

    "marketplace.set.notif.title": "الإشعارات",
    "marketplace.set.notif.sub": "اختر كيف ومتى تصلك أخبار نشاط السوق.",
    "marketplace.set.notif.frequency": "التكرار",
    "marketplace.set.notif.email": "بريد",
    "marketplace.set.notif.push": "التطبيق",
    "marketplace.set.notif.ev.lane": "طلبات مسارات جديدة",
    "marketplace.set.notif.ev.rfq": "تحديثات طلبات العروض",
    "marketplace.set.notif.ev.spot": "تطابق الشحنات الفورية",
    "marketplace.set.notif.ev.bid": "تغيّر حالة العروض",
    "marketplace.set.notif.ev.digest": "ملخّص السوق الأسبوعي",

    "marketplace.set.freq.instant": "فوري",
    "marketplace.set.freq.hourly": "كل ساعة",
    "marketplace.set.freq.daily": "يومي",
    "marketplace.set.freq.weekly": "أسبوعي",
    "marketplace.set.freq.off": "إيقاف",

    "marketplace.set.pref.title": "التفضيلات",
    "marketplace.set.pref.timezone": "المنطقة الزمنية",
    "marketplace.set.pref.currency": "العملة",
    "marketplace.set.pref.units": "وحدة المسافة",
    "marketplace.set.pref.dateformat": "تنسيق التاريخ",
    "marketplace.set.units.km": "كيلومترات",
    "marketplace.set.units.mi": "أميال",

    "marketplace.set.def.title": "الإعدادات الافتراضية للسوق",
    "marketplace.set.def.equipment": "المعدّة الافتراضية",
    "marketplace.set.def.region": "المنطقة الرئيسية",
    "marketplace.set.def.any": "أيّ معدّة",
    "marketplace.set.region.ksa": "السعودية",
    "marketplace.set.region.uae": "الإمارات",
    "marketplace.set.region.qa": "قطر",
    "marketplace.set.region.gcc": "كل دول الخليج",

    "marketplace.set.sec.title": "الأمان",
    "marketplace.set.sec.twofa": "المصادقة الثنائية",
    "marketplace.set.sec.twofa_desc": "طلب رمز تحقّق عند تسجيل الدخول.",
    "marketplace.set.sec.password": "كلمة المرور",
    "marketplace.set.sec.password_desc": "آخر تغيير قبل 3 أشهر.",
    "marketplace.set.sec.change": "تغيير",
    "marketplace.set.sec.sessions": "الجلسات النشطة",
    "marketplace.set.sec.sessions_desc": "جهازان مسجّلان للدخول.",
    "marketplace.set.sec.manage": "إدارة",

    /* ─── الأسعار → نظرة عامة ─── */
    "rates.overview.title": "نظرة عامة على الأسعار",
    "rates.overview.sub": "تابع تحرّك أسعار السوق الفورية والتعاقدية ومؤشّر الديزل على مساراتك — وقارن سعرك مع السوق.",

    "rates.action.help": "مساعدة",
    "rates.action.fullscreen": "شاشة كاملة",
    "rates.action.export": "تصدير",
    "rates.action.pin": "إضافة إلى لوحة التحكم",

    "rates.chart.eyebrow": "اتجاه الأسعار",
    "rates.table.eyebrow": "البيانات",
    "rates.table.heading": "القيم الأسبوعية",
    "rates.table.sub": "نفس الأرقام الموجودة في الرسم البياني، بصيغة جدولية. اسحب أفقيًا لرؤية الأسابيع الأقدم.",

    "rates.filter.from": "من",
    "rates.filter.to": "إلى",
    "rates.filter.swap": "تبديل من وإلى",
    "rates.filter.period": "الفترة",
    "rates.filter.frequency": "التكرار",
    "rates.filter.metrics": "المقاييس",
    "rates.filter.period.12w": "12 أسبوعًا",
    "rates.filter.period.6m": "6 أشهر",
    "rates.filter.period.1y": "سنة",
    "rates.filter.period.2y": "سنتان",

    "rates.frequency.daily": "يومي",
    "rates.frequency.weekly": "أسبوعي",
    "rates.frequency.monthly": "شهري",

    "rates.metric.spot": "سعر فوري",
    "rates.metric.contract": "سعر تعاقدي",
    "rates.metric.diesel": "مؤشّر الديزل",
    "rates.metric.yours": "سعرك",

    /* ─── الأسعار → التوقّعات ─── */
    "forecast.title": "توقّع الأسعار الفورية",
    "forecast.sub": "توقّعات الأسعار الفورية للأسبوع القادم على مساراتك، مع نطاق ثقة يتّسع كلّما ابتعدنا أكثر في الزمن.",
    "forecast.filter.horizon": "أفق التوقّع",
    "forecast.horizon.4w": "4 أسابيع",
    "forecast.horizon.12w": "12 أسبوعًا",
    "forecast.horizon.26w": "26 أسبوعًا",
    "forecast.horizon.52w": "52 أسبوعًا",

    "forecast.kpi.next": "الأسبوع القادم",
    "forecast.kpi.next.hint": "السعر الفوري المتوقّع",
    "forecast.kpi.change": "التغيّر عن الآن",
    "forecast.kpi.change.hint": "الآن:",
    "forecast.kpi.confidence": "نطاق الثقة",
    "forecast.kpi.confidence.hint": "متوسّط عدم اليقين عبر الأفق",
    "forecast.kpi.horizon": "الأفق",
    "forecast.kpi.horizon.hint": "عدد الأسابيع المتوقّعة",

    "forecast.chart.eyebrow": "توقّع · السعر الفوري",
    "forecast.chart.sub": "الخط الصلب = التاريخ. الخط المتقطّع = المتوقّع. المنطقة المظلّلة = نطاق الثقة.",

    "forecast.legend.history": "التاريخ",
    "forecast.legend.predicted": "المتوقّع",
    "forecast.legend.range": "نطاق الثقة",

    "forecast.accuracy.eyebrow": "دقّة النموذج",
    "forecast.accuracy.heading": "مدى دقّة توقّعات النموذج",
    "forecast.accuracy.sub": "تمّ اختباره مقابل الأسعار الفعليّة على هذا المسار.",
    "forecast.accuracy.last4": "معدّل الإصابة، آخر 4 أسابيع",
    "forecast.accuracy.last12": "معدّل الإصابة، آخر 12 أسبوعًا",
    "forecast.accuracy.trained": "شحنات تدريب",
    "forecast.accuracy.mape": "متوسّط الخطأ النسبي",

    /* ─── الأسعار → فوري مقابل تعاقدي ─── */
    "svc.title": "فوري مقابل تعاقدي",
    "svc.sub": "تابع كيف يتحرّك السعر الفوري المتقلّب مقابل سعرك التعاقدي الثابت — ومتى تثبّت السعر.",
    "svc.mode.label": "العرض",
    "svc.mode.absolute": "مطلق",
    "svc.mode.percentage": "نسبة مئوية",
    "svc.spread.label": "الفارق (الفوري − التعاقدي)",

    "svc.kpi.current": "الفارق الحالي",
    "svc.kpi.current.above": "الفوري أعلى من التعاقدي",
    "svc.kpi.current.below": "الفوري أقلّ من التعاقدي",
    "svc.kpi.average": "متوسّط الفترة",
    "svc.kpi.average.hint": "متوسّط الفارق خلال الفترة",
    "svc.kpi.swing": "أكبر تذبذب",
    "svc.kpi.swing.hint": "من الأدنى إلى الأعلى خلال الفترة",
    "svc.kpi.advisory": "توصية",
    "svc.kpi.advisory.hint": "بناءً على الفارق الحالي",
    "svc.advisory.lock": "ثبّت العقد",
    "svc.advisory.spot": "اشترِ فوري",
    "svc.advisory.neutral": "محايد",

    "svc.chart.eyebrow.abs": "مطلق · ريال قطري لكل رحلة",
    "svc.chart.eyebrow.pct": "الفارق · % من التعاقدي",
    "svc.chart.sub.abs": "خطّان: السعر الفوري والتعاقدي مرسومان جنبًا إلى جنب.",
    "svc.chart.sub.pct": "خطّ واحد: مدى ارتفاع الفوري فوق (+) أو انخفاضه تحت (−) التعاقدي. خط الصفر = التعادل.",

    "svc.explain.eyebrow": "مرجع",
    "svc.explain.heading": "ماذا تعني هذه الأسعار",
    "svc.explain.spot.title": "السعر الفوري",
    "svc.explain.spot.body": "تكلفة نقل شحنة على هذا المسار اليوم — يتحدّد بالعرض والطلب الحاليَّين. يتغيّر بسرعة.",
    "svc.explain.contract.title": "السعر التعاقدي",
    "svc.explain.contract.body": "سعر مثبّت لفترة محدّدة (عادةً 6–12 شهرًا). أكثر استقرارًا — يمنحك القدرة على التخطيط.",
    "svc.explain.spread.title": "لماذا الفارق مهمّ",
    "svc.explain.spread.body": "حين يبقى السعر الفوري فوق التعاقدي أسابيع، يفوز أصحاب العقود. وحين يهبط الفوري كثيرًا، قد يكون الوقت مناسبًا لإعادة التفاوض.",

    /* ─── السعر الفوري عند الطلب ─── */
    "rod.spot.title": "البحث عن سعر فوري",
    "rod.spot.sub": "احصل على سعر فوري حالي لأي مسار خليجي ونوع شحن — يُحدَّث يوميًا.",
    "rod.contract.title": "البحث عن سعر تعاقدي",
    "rod.contract.sub": "احسب سعرًا تعاقديًا مناسبًا لتثبيته من 6 إلى 12 شهرًا على أي مسار خليجي.",

    "rod.action.save": "حفظ البحث",
    "rod.action.refresh": "تحديث",
    "rod.action.lock": "تثبيت السعر",

    "rod.form.eyebrow": "الاستعلام",
    "rod.form.heading": "ما السعر الذي تحتاجه؟",
    "rod.form.sub": "اختر المسار ونوع الشحن ونوع الرحلة. تتحدّث النتيجة فور تغيير أي خيار.",
    "rod.form.equipment": "نوع الشحن",
    "rod.form.trip": "الرحلة",

    "rod.equipment.40ft": "40 قدمًا قياسي",
    "rod.equipment.reefer": "40 قدمًا مبرّد",
    "rod.equipment.20ft": "20 قدمًا قياسي",
    "rod.equipment.hc": "40 قدمًا عالي",
    "rod.equipment.flatbed": "مسطّحة",

    "rod.trip.oneway": "ذهاب فقط",
    "rod.trip.round": "ذهاب وعودة",

    "rod.term.6m": "6 أشهر",
    "rod.term.12m": "12 شهرًا",

    "rod.result.label.spot": "السعر الفوري المقدَّر",
    "rod.result.label.contract": "السعر التعاقدي المقدَّر",
    "rod.result.unit.oneway": " / رحلة",
    "rod.result.unit.round": " / ذهاب وعودة",
    "rod.result.range": "النطاق",
    "rod.result.change_8w": "مقارنةً بـ 8 أسابيع",
    "rod.result.spark_label": "آخر 8 أسابيع",
    "rod.result.lane": "المسار",
    "rod.result.distance": "المسافة",
    "rod.result.transit": "مدّة العبور",
    "rod.result.day": "يوم",
    "rod.result.days": "أيام",
    "rod.result.carriers": "متاح",
    "rod.result.carriers_unit": "ناقلين",
    "rod.result.view_lane": "عرض تحليل المسار الكامل",

    "rod.spot.volatility.heading": "التذبذب هذا الشهر",
    "rod.spot.volatility.body": "حول الوسيط — قد يتغيّر السعر الفوري يوميًا. اضغط للتحديث لأحدث عرض في السوق.",

    "rod.contract.term.heading": "مدّة التثبيت",
    "rod.contract.savings.label": "تقدير التوفير مقابل الفوري الحالي",
    "rod.contract.savings.note": "في حال التثبيت اليوم",

    /* ─── صفحة السعة ─── */
    "capacity.title": "السعة",
    "capacity.sub": "تتبّع تفاعل عرض الشاحنات ومعدّل رفض الشحنات وحركة الأسعار عبر مسارات الخليج.",
    "capacity.help": "مساعدة",
    "capacity.actions": "إجراءات الصفحة",
    "capacity.filters": "المرشّحات",
    "capacity.action.fullscreen": "ملء الشاشة",
    "capacity.action.export": "تصدير",

    "capacity.filter.from": "من",
    "capacity.filter.to": "إلى",
    "capacity.filter.swap": "تبديل من وإلى",
    "capacity.filter.period": "الفترة",
    "capacity.filter.frequency": "التكرار",
    "capacity.filter.metrics": "المقاييس",
    "capacity.filter.selected": "مُحدَّد",
    "capacity.filter.choose_up_to_3": "اختر حتى 3 مقاييس:",
    "capacity.filter.category.contract": "تعاقدي",
    "capacity.filter.category.spot": "فوري",
    "capacity.filter.cancel": "إلغاء",
    "capacity.filter.save": "حفظ",

    "capacity.filter.period.12w": "آخر 12 أسبوعًا",
    "capacity.filter.period.6m": "آخر 6 أشهر",
    "capacity.filter.period.1y": "آخر سنة",
    "capacity.filter.period.2y": "آخر سنتين",

    "capacity.frequency.daily": "يومي",
    "capacity.frequency.weekly": "أسبوعي",
    "capacity.frequency.monthly": "شهري",

    "capacity.metric.capacity_index": "مؤشّر السعة",
    "capacity.metric.spot_offers_index": "مؤشّر العروض الفورية",
    "capacity.metric.load_rejection_rate": "معدّل رفض الشحنات التعاقدية",
    "capacity.metric.diesel_price": "سعر الديزل",
    "capacity.metric.contract_price_qar_km": "السعر التعاقدي ر.ق/كم",
    "capacity.metric.contract_price_index": "مؤشّر السعر التعاقدي",
    "capacity.metric.spot_price_qar_km": "السعر الفوري ر.ق/كم",
    "capacity.metric.spot_price_index": "مؤشّر السعر الفوري",

    "capacity.chart.aria": "مخطّط اتجاه السعة",
    "capacity.chart.hint": "مرّر فوق المخطّط لرؤية القيم",
    "capacity.chart.empty": "اختر مقياسًا واحدًا على الأقل لعرض المخطّط.",

    "capacity.table.metric": "المقياس",
    "capacity.table.empty": "اختر مقياسًا واحدًا على الأقل لعرض جدول البيانات.",
    "capacity.table.caption": "كل خلية تعرض القيمة الأسبوعية (أعلى) والتغيّر مقارنةً بالأسبوع السابق (أسفل). اسحب أفقيًا لرؤية الأسابيع الأقدم.",

    /* ─── صفحة الأخبار ─── */
    "news.title": "الأخبار",
    "news.sub": "تحليلات شِنتك المتخصّصة لقطاع الشحن في الخليج — مقالات أصلية عن الموانئ والتكاليف والناقلين والسياسات والتقنيات.",
    "news.subscribe": "اشترك",
    "news.search.placeholder": "ابحث في المقالات…",
    "news.read_minutes": "د قراءة",
    "news.read_article": "اقرأ المقال",
    "news.featured_badge": "مميّز",
    "news.load_more": "تحميل مزيد من المقالات",
    "news.filters.aria": "تصنيفات المقالات",
    "news.grid.aria": "شبكة المقالات",
    "news.empty.title": "لا توجد مقالات مطابقة",
    "news.empty.sub": "جرّب تصنيفًا آخر أو امسح كلمة البحث لعرض الكل.",
    "news.empty.reset": "مسح المرشّحات",

    "news.cat.all": "الكل",
    "news.cat.ports": "الموانئ والجمارك",
    "news.cat.diesel": "الديزل والتكاليف",
    "news.cat.carriers": "الناقلون",
    "news.cat.industry": "القطاع",
    "news.cat.policy": "السياسات الخليجية",
    "news.cat.tech": "التكنولوجيا",

    "news.author.insights_team": "فريق شِنتك للتحليلات",
    "news.author.market_team": "مكتب السوق الخليجي",
    "news.author.ops_desk": "مكتب العمليات",
    "news.author.tech_desk": "مكتب التكنولوجيا",

    "news.article.hamad_customs.title": "كيف خفّض الممرّ الجمركي الجديد في ميناء حمد زمن العبور من الدوحة إلى الرياض بنسبة 30%",
    "news.article.hamad_customs.excerpt": "نظرة من خلف الكواليس على التغييرات التشغيلية التي قلّصت متوسّط زمن عبور الحدود من 14 ساعة إلى أقل من 9 — وما يمكن لمسارات الخليج الأخرى تعلّمه منها.",

    "news.article.diesel_q3.title": "توقّعات أسعار الديزل للربع الثالث من 2026 في دول الخليج",
    "news.article.diesel_q3.excerpt": "جداول صيانة المصافي السعودية وتراجع الطلب العالمي يشيران إلى استقرار أكبر في السوق. هذا ما يجب على الناقلين الاستعداد له خلال الأشهر الثلاثة القادمة.",

    "news.article.etihad_rail.title": "الشحن عبر قطار الاتحاد بدأ فعليًا — ماذا يعني ذلك لناقلي البرّ؟",
    "news.article.etihad_rail.excerpt": "بدأت أول سكّة شحن إماراتية تنقل الحاويات بين ميناء خليفة والفجيرة. تكشف البيانات الأولى أين يتفوّق القطار وأين تبقى الشاحنات الخيار الأمثل.",

    "news.article.neom.title": "رؤية السعودية 2030: كيف يُعيد نيوم تشكيل تدفّقات الشحن في المملكة",
    "news.article.neom.excerpt": "يسحب الطلب من المشاريع الكبرى السعة نحو الشمال الغربي. نرسم المسارات الجديدة ونحدّد المسارات الأكثر ضغطًا سعريًا الآن.",

    "news.article.eid_capacity.title": "تضييق السعة خلال عيد الأضحى — وكيفية التخطيط له",
    "news.article.eid_capacity.excerpt": "البيانات التاريخية من 2023 إلى 2025 تُظهر ضغطًا متوقّعًا في الأسبوعين قبل العيد. نموذجنا للتنبؤ به وما يمكن للشاحنين فعله.",

    "news.article.cold_chain.title": "لوجستيات سلسلة التبريد في صيف الخليج: إدارة قفزات الطلب على الشاحنات المبرّدة",
    "news.article.cold_chain.excerpt": "ترفع درجات حرارة الصيف أسعار الشاحنات المبرّدة بنسبة 35–50٪ فوق مستويات الشتاء. نُحلّل العوامل، والمسارات الأكثر تأثّرًا، والعقود التي تحمي من هذا التذبذب.",

    "news.article.king_abdullah.title": "توسعة ميناء الملك عبدالله: التأثير على أسعار الحاويات من الربع الرابع فصاعدًا",
    "news.article.king_abdullah.excerpt": "تدخل طاقة استيعابية جديدة للحاويات حيّز التشغيل في أكتوبر. تحليلنا للأثر المتوقّع على مسارات البحر الأحمر، وأنماط الترانزيت، والمنافسة السعرية.",

    "news.article.ai_routing.title": "كيف يُغيّر الذكاء الاصطناعي تحديد مسارات الشحن وتوزيعها في الخليج",
    "news.article.ai_routing.excerpt": "يشارك ثلاثة من أوائل المستخدمين كيف خفّض التوزيع المُدرَّب آليًا الأميال الفارغة بنسبة 18٪ — والبيانات التي كان عليهم تنظيفها قبل أن يعمل النظام فعلًا.",

    "news.article.oman_uae.title": "اتفاقية الممر العماني الإماراتي: ما الذي يتغيّر على الحدود في 2026",
    "news.article.oman_uae.excerpt": "تدخل إجراءات جمركية مبسّطة حيّز التنفيذ منتصف العام. إليك تغييرات الوثائق التي يحتاج المشغّلون للاستعداد لها، والمسارات الأكثر استفادة.",

    "news.article.carrier_consolidation.title": "اندماج الناقلين في الخليج: أساطيل أكبر، وأطراف أقل — ما العمل؟",
    "news.article.carrier_consolidation.excerpt": "أعادت ثلاث صفقات اندماج كبرى خلال 18 شهرًا تشكيل السعة. نتناول كيف يؤثّر ذلك على قوّة التسعير، ونفوذ التعاقد، والمخاطر بالنسبة للشاحنين الخليجيين.",

    /* ─── صفحة تقاريري ─── */
    "reports.title": "تقاريري",
    "reports.sub": "العروض التي حفظتها من أنحاء لوحة التحكم — مثبّتة للعودة إليها بضغطة واحدة. ضع نجمة على ما تتابعه باستمرار.",
    "reports.new": "تقرير جديد",
    "reports.opens": "فتحة",
    "reports.shared": "مُشارَك",
    "reports.shared_by": "شاركه",

    "reports.tabs.aria": "تبويبات التقارير",
    "reports.grid.aria": "التقارير المحفوظة",
    "reports.tabs.all": "الكل",
    "reports.tabs.favorites": "المفضّلة",
    "reports.tabs.recent": "الأحدث",
    "reports.tabs.shared": "مُشارَكة",

    "reports.source.rates_overview": "الأسعار · نظرة عامة",
    "reports.source.rates_forecast": "الأسعار · التوقّعات",
    "reports.source.rates_spot_vs_contract": "الأسعار · فوري مقابل تعاقدي",
    "reports.source.capacity": "السعة",
    "reports.source.rod_spot": "سعر فوري عند الطلب",
    "reports.source.rod_contract": "سعر تعاقدي عند الطلب",
    "reports.source.news": "الأخبار",
    "reports.source.costs": "التكاليف · نظرة عامة",

    "reports.r1.name": "متابعة الدوحة ← الرياض الأسبوعية",
    "reports.r1.desc": "السعر الفوري والتعاقدي والديزل · آخر 26 أسبوعًا · أسبوعيًا",
    "reports.r2.name": "مراقبة الديزل — الخليج",
    "reports.r2.desc": "مؤشّر سعر الديزل في قطر والسعودية والإمارات · شهريًا",
    "reports.r3.name": "مقارنة التكاليف للربع الثالث",
    "reports.r3.desc": "تفصيل مكوّنات التكلفة — الوقود والعمالة والمعدات والرسوم",
    "reports.r3.shared_by": "طه",
    "reports.r4.name": "مسارات منافسيّ",
    "reports.r4.desc": "أهم 3 مسارات أتابعها · السعر الفوري فقط · تحديث آلي",
    "reports.r5.name": "تنبيه السعة الساخنة",
    "reports.r5.desc": "أكثر المسارات ضيقًا هذا الأسبوع · مؤشّر السعة · لقطة أسبوعية",
    "reports.r6.name": "متابعة رؤية السعودية 2030",
    "reports.r6.desc": "أخبار السياسات المتعلّقة بمسارات نيوم وإصلاحات الجمارك",
    "reports.r6.count_label": "مقالات غير مقروءة",

    "reports.empty.all.title": "لا توجد تقارير بعد",
    "reports.empty.all.sub": "ثبّت العروض من أي صفحة بالضغط على \"إضافة إلى لوحة التحكم\" لحفظها هنا.",
    "reports.empty.favorites.title": "لا توجد مفضّلات بعد",
    "reports.empty.favorites.sub": "ضع نجمة على تقرير لتثبيته في أعلى مساحة العمل.",
    "reports.empty.recent.title": "لم تفتح شيئًا مؤخّرًا",
    "reports.empty.recent.sub": "ستظهر هنا التقارير التي فتحتها خلال آخر 7 أيام.",
    "reports.empty.shared.title": "لم يُشارك معك شيء",
    "reports.empty.shared.sub": "ستظهر هنا التقارير التي يشاركها زملاؤك معك.",

    /* ─── السوق → نظرة عامة ─── */
    "market.title": "نظرة عامة على السوق",
    "market.sub": "خمسة مؤشّرات عالية المستوى تُظهر كيف تتحرّك السعة والأسعار وتكاليف الناقلين في سوق الشحن الخليجي عبر الزمن.",
    "market.help": "مساعدة",
    "market.filters": "المرشّحات",
    "market.action.fullscreen": "ملء الشاشة",
    "market.action.export": "تصدير",
    "market.action.add_to_dashboard": "إضافة إلى لوحة التحكم",

    "market.filter.country": "الدولة",
    "market.filter.period": "الفترة",
    "market.filter.frequency": "التكرار",
    "market.filter.period.1y": "آخر سنة",
    "market.filter.period.2y": "آخر سنتين",
    "market.filter.period.all": "كل البيانات المتاحة",
    "market.frequency.monthly": "شهري",
    "market.frequency.weekly": "أسبوعي",

    "market.metric.capacity_index": "مؤشّر السعة",
    "market.metric.spot_price_index": "مؤشّر السعر الفوري",
    "market.metric.contract_price_index": "مؤشّر السعر التعاقدي",
    "market.metric.total_price_index": "مؤشّر السعر الإجمالي",
    "market.metric.cost_index": "مؤشّر التكلفة",

    "market.kpi.mom": "شهر/شهر",
    "market.kpi.yoy": "سنويًا",

    "market.chart.aria": "مخطّط نظرة السوق",
    "market.chart.hint": "مرّر فوق المخطّط لرؤية القيم · انقر على المفتاح لإظهار أو إخفاء المقاييس",

    "market.table.metric": "المقياس",
    "market.table.empty": "فعّل مقياسًا واحدًا على الأقل في مفتاح الرسم البياني لعرض الجدول.",
    "market.table.caption": "كل خلية تعرض القيمة الشهرية (أعلى) والتغيّر مقارنةً بالشهر السابق (أسفل). اسحب أفقيًا لرؤية الأشهر الأقدم.",

    /* ─── التكاليف (السوق + المسار) ─── */
    "costs.market.title": "تكاليف السوق",
    "costs.market.sub": "إجمالي تكلفة التشغيل للناقلين — خدمات وضرائب طرق ومركبات ووقود ورواتب سائقين، مكدّسة عبر الزمن مع توقّع لأربعة أرباع قادمة.",
    "costs.lane.title": "تكاليف المسار",
    "costs.lane.sub": "نفس تفصيل إجمالي تكلفة التشغيل، لكن مقتصرًا على مسار محدّد من نقطة إلى أخرى.",
    "costs.help": "مساعدة",
    "costs.action.fullscreen": "ملء الشاشة",
    "costs.action.export": "تصدير",

    "costs.filter.period": "الفترة",
    "costs.filter.country": "الدولة",
    "costs.filter.from": "من",
    "costs.filter.to": "إلى",
    "costs.filter.swap": "تبديل من وإلى",
    "costs.filter.period.1y": "آخر سنة",
    "costs.filter.period.2y": "آخر سنتين",
    "costs.filter.period.5y": "آخر 5 سنوات",

    "costs.view.label": "نمط عرض المخطّط",
    "costs.view.indexation": "مؤشّر",
    "costs.view.percentage": "نسبة مئوية",

    "costs.metric.services": "الخدمات وغيرها",
    "costs.metric.toll": "ضرائب الطرق",
    "costs.metric.vehicle": "المركبة",
    "costs.metric.fuel": "الوقود",
    "costs.metric.driver": "تكاليف السائق",

    "costs.chart.aria": "مخطّط مساحات مكدّسة لمكوّنات التكلفة",
    "costs.chart.hint": "مرّر فوق المخطّط لرؤية القيم · انقر على المفتاح لإظهار أو إخفاء الطبقات",

    "costs.table.metric": "المقياس",
    "costs.table.cost_index": "مؤشّر التكلفة",
    "costs.table.forecast": "متوقَّع",
    "costs.table.caption_index": "كل خلية تعرض القيمة الربعية (أعلى) والتغيّر مقارنةً بالربع السابق (أسفل). الأعمدة الأربعة الأخيرة هي توقّعات.",
    "costs.table.caption_pct": "كل خلية تعرض حصّة المكوّن من إجمالي التكلفة (أعلى) وتغيّر الحصّة مقارنةً بالربع السابق (أسفل). الأعمدة الأربعة الأخيرة هي توقّعات.",

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
