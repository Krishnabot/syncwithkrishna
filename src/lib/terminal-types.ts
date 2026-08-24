export const KNOWLEDGE_INTENTS = [
  "profile",
  "skills",
  "projects",
  "experience",
  "services",
  "contact",
  "interests",
] as const;

export type KnowledgeIntent = (typeof KNOWLEDGE_INTENTS)[number];
export type Intent = KnowledgeIntent | "help" | "download" | "clear" | "home" | "unknown";
export type KnowledgeLink = { label: string; url: string };
export type KnowledgeGroup = { title: string; items: string[] };
export type KnowledgeProject = { name: string; description: string; technologies: string[]; status?: string; links?: KnowledgeLink[] };
export type IntelligenceResponse = {
  kind: "answer" | "projects" | "comparison" | "capability" | "unknown" | "outside-domain";
  heading: string;
  lines: string[];
  projectNames?: string[];
};
export type KnowledgeRecord = {
  id: KnowledgeIntent;
  title: string;
  label: string;
  summary: string;
  keywords: string[];
  aliases: string[];
  body: string;
  facts?: Array<{ label: string; value: string }>;
  groups?: KnowledgeGroup[];
  projects?: KnowledgeProject[];
  links?: KnowledgeLink[];
  todo?: string[];
};
export type KnowledgeBase = Record<KnowledgeIntent, KnowledgeRecord>;
export type IntentResolution = { intent: Intent; confidence: number; matchedTerms: string[] };
export type TerminalEntry = { id: number; query: string; intent: Intent; record?: KnowledgeRecord; confidence: number; suggestions: KnowledgeIntent[]; message?: string; intelligence?: IntelligenceResponse };
