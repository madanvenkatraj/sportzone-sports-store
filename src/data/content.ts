/**
 * All editable copy for the Nexora AI landing page lives here, typed.
 * Swap the placeholder content in these arrays without touching components.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: "bot" | "chart" | "workflow" | "zap";
}

export interface Service {
  title: string;
  description: string;
  bullets: string[];
}

export interface Step {
  number: string;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  featured: boolean;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Metric {
  value: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export const METRICS: Metric[] = [
  { value: "120+", label: "Projects delivered (sample)" },
  { value: "98%", label: "Customer satisfaction (sample)" },
  { value: "40%", label: "Avg. productivity gain (sample)" },
];

export const FEATURES: Feature[] = [
  {
    title: "AI-Powered Automation",
    description:
      "Eliminate repetitive work with intelligent agents that handle data entry, routing, and reporting around the clock.",
    icon: "bot",
  },
  {
    title: "Smart Data Analytics",
    description:
      "Turn raw business data into clear, actionable dashboards powered by machine-learning models tuned to your goals.",
    icon: "chart",
  },
  {
    title: "Workflow Optimization",
    description:
      "Map, measure, and refine every process so teams spend time on high-value work instead of handoffs and rework.",
    icon: "workflow",
  },
  {
    title: "Real-Time Insights",
    description:
      "Stream live signals from your tools and get instant alerts and recommendations the moment something changes.",
    icon: "zap",
  },
];

export const SERVICES: Service[] = [
  {
    title: "AI Application Development",
    description:
      "From conversational assistants to custom copilots, we design and ship production-grade AI applications integrated with your stack.",
    bullets: ["LLM app design & build", "API and model integration", "Security-first deployment"],
  },
  {
    title: "Business Process Automation",
    description:
      "We identify the workflows that drain hours from your teams and automate them end-to-end with measurable ROI.",
    bullets: ["Workflow audit & mapping", "Document & data automation", "Human-in-the-loop controls"],
  },
  {
    title: "Custom Software Solutions",
    description:
      "Tailored platforms and internal tools built around how your business actually works, not the other way round.",
    bullets: ["Cloud-native architecture", "Dashboards & reporting", "Ongoing support & iteration"],
  },
];

export const STEPS: Step[] = [
  {
    number: "01",
    title: "Discover",
    description: "We map your business needs, data landscape, and highest-impact automation opportunities.",
  },
  {
    number: "02",
    title: "Build",
    description: "We design and develop your customized AI solution, validating each milestone with your team.",
  },
  {
    number: "03",
    title: "Launch & Optimize",
    description: "We deploy, analyze real-world performance, and continuously optimize as your business grows.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Nexora automated our invoice processing in weeks. Our ops team now focuses on customers instead of spreadsheets.",
    name: "Sample — A. Morgan",
    role: "Head of Operations, demo client",
    initials: "AM",
  },
  {
    quote:
      "The analytics dashboards gave us a live view of revenue we had never had before. Decisions got dramatically faster.",
    name: "Sample — R. Patel",
    role: "CFO, demo client",
    initials: "RP",
  },
  {
    quote:
      "Their team felt like an extension of ours — from discovery workshops to launch, everything was structured and clear.",
    name: "Sample — L. Chen",
    role: "CTO, demo client",
    initials: "LC",
  },
];

export const PLANS: Plan[] = [
  {
    name: "Starter",
    price: "$499",
    period: "/month",
    description: "For small teams exploring AI automation.",
    features: [
      "1 automation workflow",
      "Standard analytics dashboard",
      "Email support",
      "Monthly optimization review",
    ],
    cta: "Start with Starter",
    featured: false,
  },
  {
    name: "Professional",
    price: "$1,499",
    period: "/month",
    description: "For growing businesses scaling AI across teams.",
    features: [
      "Up to 5 automation workflows",
      "Real-time insights & alerts",
      "Priority support",
      "Dedicated success manager",
      "Quarterly strategy sessions",
    ],
    cta: "Choose Professional",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For organizations with complex, secure environments.",
    features: [
      "Unlimited workflows",
      "Custom AI application builds",
      "SSO, audit logs & compliance",
      "24/7 dedicated support",
      "Onsite implementation available",
    ],
    cta: "Talk to Sales",
    featured: false,
  },
];

export const FAQS: Faq[] = [
  {
    question: "What services does Nexora AI offer?",
    answer:
      "We build AI applications, automate business processes, and deliver custom software — from discovery through deployment and ongoing optimization.",
  },
  {
    question: "How is pricing structured?",
    answer:
      "Plans are monthly subscriptions with placeholder prices shown above. Enterprise engagements are scoped individually based on your requirements.",
  },
  {
    question: "How long does implementation take?",
    answer:
      "Most automation projects launch in 4–8 weeks. Larger custom applications typically run 3–6 months depending on scope.",
  },
  {
    question: "Which tools can you integrate with?",
    answer:
      "We integrate with popular CRMs, ERPs, data warehouses, and communication platforms through APIs, webhooks, and pre-built connectors.",
  },
  {
    question: "What customer support is included?",
    answer:
      "Every plan includes support — email on Starter, priority response on Professional, and 24/7 dedicated coverage on Enterprise.",
  },
];

export interface ChatSuggestion {
  label: string;
  href: string;
  trigger: string;
}

export interface ChatResponse {
  keywords: string[];
  reply: string;
}

export const CHAT_WELCOME =
  "Hi there! \u{1F44B} How can I help you today?";

export const CHAT_SUGGESTIONS: ChatSuggestion[] = [
  { label: "Explore Services", href: "#services", trigger: "Explore Services" },
  { label: "View Pricing", href: "#pricing", trigger: "View Pricing" },
  { label: "How It Works", href: "#about", trigger: "How It Works" },
  { label: "Contact Support", href: "#contact", trigger: "Contact Support" },
];

export const CHAT_RESPONSES: ChatResponse[] = [
  {
    keywords: ["service", "explore services", "what do you do", "offer"],
    reply:
      "We offer three core services: AI Application Development, Business Process Automation, and Custom Software Solutions. Scroll to the Services section for the full breakdown — or ask me about any of them!",
  },
  {
    keywords: ["pricing", "price", "cost", "plan", "how much"],
    reply:
      "We have three plans: Starter ($499/mo), Professional ($1,499/mo, most popular), and custom Enterprise pricing. All prices are placeholders you can edit later. Want me to take you to the Pricing section?",
  },
  {
    keywords: ["how it works", "process", "steps", "discover"],
    reply:
      "It's a simple three-step journey: 1) Discover your business needs, 2) Build your customized AI solution, 3) Launch, analyze, and optimize. The How It Works section has the details.",
  },
  {
    keywords: ["support", "contact", "help", "talk", "email"],
    reply:
      "You can reach our team any time via the Start Your Project button below, or email hello@nexora.ai. Enterprise plans include 24/7 dedicated support.",
  },
  {
    keywords: ["integration", "integrate", "tools", "crm"],
    reply:
      "We integrate with popular CRMs, ERPs, data warehouses, and communication platforms through APIs, webhooks, and pre-built connectors.",
  },
  {
    keywords: ["automation", "automate", "workflow"],
    reply:
      "Our automation practice maps your workflows, automates the repetitive parts end-to-end, and keeps humans in the loop where judgment matters. Clients typically see meaningful time savings within weeks.",
  },
];

export const CHAT_FALLBACK =
  "Great question! A specialist can give you a detailed answer — try one of the suggestion chips below, or use the Start Your Project button and we'll follow up personally.";

export interface AssistantCapability {
  label: string;
  value: string;
}

export const ASSISTANT_CAPABILITIES: AssistantCapability[] = [
  { label: "Instant answers", value: "24/7" },
  { label: "Avg. response time", value: "< 1s" },
  { label: "Workflows automated", value: "50+" },
  { label: "Languages supported", value: "12" },
];

export const ASSISTANT_FEATURES: string[] = [
  "Natural-language Q&A about our services",
  "Guides you to the right section instantly",
  "Handoffs to a human specialist on request",
  "Learns your business context over time",
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];
