import type { Intent, IntentResolution, KnowledgeIntent } from "./terminal-types";

type IntentRule = { intent: KnowledgeIntent; phrases: readonly string[]; keywords: readonly string[] };
const COMMANDS: Readonly<Record<string, Intent>> = {
  help: "help", whoami: "profile", about: "profile", skills: "skills", projects: "projects",
  experience: "experience", services: "services", contact: "contact", interests: "interests",
  clear: "clear", home: "home",
};
const RULES: readonly IntentRule[] = [
  { intent: "profile", phrases: ["who are you", "who is krishna", "what is your name", "what's your name", "tell me about yourself", "tell me about krishna"], keywords: ["name", "identity", "profile", "yourself", "krishna"] },
  { intent: "skills", phrases: ["what technologies do you use", "what is your tech stack", "what's your tech stack", "do you know react", "are you a java developer", "backend technologies"], keywords: ["skill", "skills", "technology", "technologies", "stack", "react", "nextjs", "typescript", "tailwind", "java", "backend", "frontend", "programming", "framework"] },
  { intent: "projects", phrases: ["show me your work", "what have you built", "what projects have you worked on", "show me your projects"], keywords: ["project", "projects", "portfolio", "work", "built", "builds", "case study"] },
  { intent: "experience", phrases: ["where have you worked", "what is your experience", "tell me about your experience", "work history"], keywords: ["experience", "career", "employer", "worked", "employment", "professional", "history"] },
  { intent: "services", phrases: ["what do you do", "what services do you provide", "what can you build", "can you build a website for me", "how can you help"], keywords: ["service", "services", "hire", "help", "website", "game", "develop", "development", "client"] },
  { intent: "contact", phrases: ["what is your email", "what's your email", "how can i contact you", "how can i reach you", "how can i reach krishna", "get in touch"], keywords: ["contact", "email", "reach", "github", "social", "message", "connect"] },
  { intent: "interests", phrases: ["what do you love", "what are your hobbies", "what are your interests", "beyond programming"], keywords: ["interest", "interests", "hobby", "hobbies", "love", "passion", "book", "books", "literature", "philosophy", "writing", "poetry", "content"] },
];

export function normalizeInput(input: string): string {
  return input.normalize("NFKC").toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9+#.'\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function containsTerm(input: string, term: string): boolean {
  if (term.includes(" ")) return input.includes(term);
  const escaped = term.replace(/[.*+?^$()|[\]\\]/g, "\\$&");
  return new RegExp("(^|\\s)" + escaped + "(?=\\s|$|[.'-])", "i").test(input);
}

export function resolveIntent(rawInput: string): IntentResolution {
  const input = normalizeInput(rawInput);
  if (!input) return { intent: "unknown", confidence: 0, matchedTerms: [] };
  const command = COMMANDS[input];
  if (command) return { intent: command, confidence: 1, matchedTerms: [input] };
  const scored = RULES.map((rule) => {
    const phraseMatches = rule.phrases.filter((phrase) => input.includes(phrase));
    const keywordMatches = rule.keywords.filter((keyword) => containsTerm(input, keyword));
    return { intent: rule.intent, score: phraseMatches.length * 5 + keywordMatches.length * 1.4, matches: [...phraseMatches, ...keywordMatches] };
  }).sort((a, b) => b.score - a.score);
  const best = scored[0];
  const runnerUp = scored[1];
  if (!best || best.score < 1.4) return { intent: "unknown", confidence: 0, matchedTerms: [] };
  const margin = best.score - (runnerUp?.score ?? 0);
  const confidence = Math.min(0.98, 0.42 + best.score * 0.07 + margin * 0.035);
  return { intent: best.intent, confidence: Number(confidence.toFixed(2)), matchedTerms: best.matches };
}
export const SUPPORTED_COMMANDS = Object.freeze(Object.keys(COMMANDS));
