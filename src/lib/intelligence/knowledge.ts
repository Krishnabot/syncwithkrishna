export type TechnologyFact = { id: string; label: string; aliases: string[]; category: "frontend" | "backend" | "data" | "cloud" | "testing" | "tool"; level: "primary" | "professional" | "project" | "listed" | "beginner" };
export type ProjectFact = { name: string; aliases: string[]; company?: string; technologies: string[]; domains: string[]; capabilities: string[]; professional: boolean; startDate?: string; endDate?: string; ongoing?: boolean };
export type NamedFact = { id: string; label: string; aliases: string[]; relatedDomains?: string[] };

export const TECHNOLOGIES: TechnologyFact[] = [
  { id: "react", label: "React", aliases: ["react", "reactjs", "react.js"], category: "frontend", level: "primary" },
  { id: "redux", label: "Redux", aliases: ["redux"], category: "frontend", level: "primary" },
  { id: "javascript", label: "JavaScript", aliases: ["javascript", "js"], category: "frontend", level: "professional" },
  { id: "typescript", label: "TypeScript", aliases: ["typescript", "ts"], category: "frontend", level: "professional" },
  { id: "html", label: "HTML5", aliases: ["html", "html5"], category: "frontend", level: "listed" },
  { id: "css", label: "CSS3", aliases: ["css", "css3"], category: "frontend", level: "listed" },
  { id: "tailwind", label: "Tailwind CSS", aliases: ["tailwind", "tailwindcss", "tailwind css"], category: "frontend", level: "listed" },
  { id: "flutter", label: "Flutter", aliases: ["flutter"], category: "frontend", level: "professional" },
  { id: "rails", label: "Ruby on Rails", aliases: ["rails", "ruby on rails", "ror"], category: "backend", level: "primary" },
  { id: "node", label: "Node.js", aliases: ["node", "nodejs", "node.js"], category: "backend", level: "professional" },
  { id: "next", label: "Next.js", aliases: ["next", "nextjs", "next.js"], category: "frontend", level: "project" },
  { id: "postgresql", label: "PostgreSQL", aliases: ["postgres", "postgresql"], category: "data", level: "professional" },
  { id: "mysql", label: "MySQL", aliases: ["mysql"], category: "data", level: "professional" },
  { id: "sqlite", label: "SQLite", aliases: ["sqlite"], category: "data", level: "professional" },
  { id: "redis", label: "Redis", aliases: ["redis"], category: "data", level: "professional" },
  { id: "docker", label: "Docker", aliases: ["docker"], category: "cloud", level: "listed" },
  { id: "aws", label: "AWS", aliases: ["aws", "amazon web services"], category: "cloud", level: "listed" },
  { id: "kubernetes", label: "Kubernetes", aliases: ["kubernetes", "k8s"], category: "cloud", level: "beginner" },
  { id: "createjs", label: "CreateJS", aliases: ["createjs", "create js"], category: "frontend", level: "professional" },
  { id: "solidus", label: "Solidus", aliases: ["solidus", "solidus commerce"], category: "backend", level: "professional" },
  { id: "stripe", label: "Stripe", aliases: ["stripe", "stripe api"], category: "backend", level: "professional" },
  { id: "jest", label: "Jest", aliases: ["jest"], category: "testing", level: "listed" },
  { id: "rspec", label: "RSpec", aliases: ["rspec"], category: "testing", level: "listed" },
  { id: "git", label: "Git", aliases: ["git", "github"], category: "tool", level: "professional" },
];

export const PROJECT_FACTS: ProjectFact[] = [
  { name: "Golf Buddy & Japanese Goods Commerce", aliases: ["golf buddy", "japanese goods", "sampo"], company: "Sampo Development", technologies: ["solidus", "rails", "flutter", "sqlite"], domains: ["social", "e-commerce", "mobile"], capabilities: ["registration", "search", "event scheduling", "checkout"], professional: true, startDate: "2024-12", ongoing: true },
  { name: "Educational Games Platform", aliases: ["educational games", "unity", "uni-ty"], company: "UNI-TY INC.", technologies: ["react", "node", "rails", "createjs", "docker", "git"], domains: ["education", "gaming", "frontend", "backend"], capabilities: ["games", "apis", "analytics", "performance"], professional: true, startDate: "2024-02", endDate: "2024-12" },
  { name: "Fluid Digital Engagement Platform", aliases: ["fluid", "daanfe"], company: "Daanfe Software Labs", technologies: ["react", "redux", "javascript", "rails", "postgresql", "redis"], domains: ["marketing", "frontend", "backend", "analytics"], capabilities: ["feedback", "analytics", "third-party integrations"], professional: true, startDate: "2023-01", endDate: "2024-01" },
  { name: "PopMenu Hospitality Platform", aliases: ["popmenu", "pop menu"], technologies: ["react", "rails", "postgresql", "aws", "stripe"], domains: ["hospitality", "e-commerce", "frontend", "backend"], capabilities: ["reservations", "payments", "menus", "scalability"], professional: true, startDate: "2022-06", endDate: "2022-12" },
  { name: "Juubix Web3 Ecosystem", aliases: ["juubix"], technologies: ["rails", "react", "postgresql"], domains: ["web3", "fintech", "marketplace", "frontend", "backend"], capabilities: ["onboarding", "rbac", "dashboards", "apis"], professional: true, startDate: "2020-09", endDate: "2022-11" },
  { name: "Kairos Health Platform", aliases: ["kairos", "kairos health"], technologies: ["javascript", "typescript", "node", "react", "mysql"], domains: ["healthcare", "frontend", "backend"], capabilities: ["insurance", "appointments", "third-party integrations"], professional: true, startDate: "2018-09", endDate: "2021-01" },
  { name: "Sync With Krishna", aliases: ["sync with krishna", "this website", "this site", "terminal"], technologies: ["next", "react", "typescript", "tailwind"], domains: ["personal", "frontend"], capabilities: ["terminal", "content", "intent resolution"], professional: false },
];

export const SERVICE_FACTS: NamedFact[] = [
  { id: "full-stack-development", label: "Full-Stack Product Development", aliases: ["full stack development", "web application"], relatedDomains: ["frontend", "backend"] },
  { id: "mobile-interactive", label: "Mobile & Interactive Products", aliases: ["mobile development", "interactive products"], relatedDomains: ["mobile", "gaming"] },
  { id: "commerce-integrations", label: "Commerce & Integrations", aliases: ["commerce", "integrations", "payments"], relatedDomains: ["e-commerce", "backend"] },
  { id: "product-quality", label: "Product Quality", aliases: ["performance", "testing", "quality"], relatedDomains: ["frontend", "backend"] },
];

export const INTEREST_FACTS: NamedFact[] = [
  { id: "literature", label: "Literature", aliases: ["literature", "books", "reading"] }, { id: "philosophy", label: "Philosophy", aliases: ["philosophy"] },
  { id: "cinema", label: "Cinema", aliases: ["cinema", "films", "movies"] }, { id: "psychology", label: "Psychology", aliases: ["psychology"] },
  { id: "writing", label: "Writing & Poetry", aliases: ["writing", "poetry", "poems"] }, { id: "content-creation", label: "Content Creation", aliases: ["content creation", "tiktok"] },
];

export const DOMAIN_ALIASES: Record<string, string[]> = {
  frontend: ["frontend", "front end", "ui", "user interface"], backend: ["backend", "back end", "server", "api", "apis"], "full-stack": ["full stack", "full-stack", "fullstack", "web development"], database: ["database", "databases", "sql"], social: ["social", "social application"], "e-commerce": ["ecommerce", "e-commerce", "commerce", "shopping"], healthcare: ["healthcare", "health", "medical"], gaming: ["game", "games", "gaming"], fintech: ["fintech", "finance"], web3: ["web3", "blockchain"], hospitality: ["hospitality", "restaurant", "hotel"], education: ["education", "educational", "learning"], mobile: ["mobile", "app"],
};
