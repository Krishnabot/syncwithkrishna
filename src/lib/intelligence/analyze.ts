import { resolveIntent } from "../intent-engine.ts";
import type { Intent } from "../terminal-types";
import { DOMAIN_ALIASES, PROJECT_FACTS, TECHNOLOGIES } from "./knowledge.ts";
import type { Entity, QuestionAnalysis, SessionContext } from "./types";

const normalize = (input: string) => input.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9.\-\s]/g, " ").replace(/\s+/g, " ").trim();
const distance = (a: string, b: string) => {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) { let previous = row[0]; row[0] = i; for (let j = 1; j <= b.length; j += 1) { const old = row[j]; row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1)); previous = old; } }
  return row[b.length];
};
const includesTerm = (text: string, term: string) => new RegExp(`(?:^|\\s)${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:$|\\s)`).test(text);

function recognizeEntities(text: string): Entity[] {
  const entities: Entity[] = [];
  for (const tech of TECHNOLOGIES) {
    let matched = tech.aliases.find((alias) => includesTerm(text, normalize(alias))) ?? text.split(" ").find((token) => token.length >= 6 && tech.aliases.some((alias) => alias.length >= 6 && distance(token, normalize(alias)) <= 2));
    if (tech.id === "javascript" && matched === "js" && /\b(next|create) js\b/.test(text)) matched = undefined;
    if (matched) entities.push({ id: tech.id, label: tech.label, kind: "technology", matched });
  }
  for (const project of PROJECT_FACTS) {
    const matched = project.aliases.find((alias) => text.includes(normalize(alias)));
    if (matched) entities.push({ id: project.name, label: project.name, kind: "project", matched });
    if (project.company && text.includes(normalize(project.company))) entities.push({ id: project.company, label: project.company, kind: "company", matched: project.company });
  }
  for (const [domain, aliases] of Object.entries(DOMAIN_ALIASES)) {
    const matched = aliases.find((alias) => includesTerm(text, normalize(alias)));
    if (matched) entities.push({ id: domain, label: domain, kind: "domain", matched });
  }
  return entities.filter((entity, index, all) => all.findIndex((candidate) => candidate.id === entity.id && candidate.kind === entity.kind) === index);
}

const COMMANDS: Record<string, Intent> = { whoami: "profile", about: "profile", skills: "skills", projects: "projects", experience: "experience", services: "services", contact: "contact", interests: "interests", help: "help", clear: "clear", home: "home", download: "download" };

export function analyzeQuestion(input: string, context: SessionContext): QuestionAnalysis {
  const normalized = normalize(input);
  const baseCommand = normalized.split(" ")[0];
  const command = COMMANDS[baseCommand];
  const referencesContext = /\b(those|them|ones|it|that|these|also|too)\b/.test(normalized);
  let entities = recognizeEntities(normalized);
  const excludedEntities: Entity[] = [];
  for (const entity of entities) if (new RegExp(`(?:exclude|without|not)\\s+(?:\\w+\\s+){0,2}${entity.matched}`).test(normalized)) excludedEntities.push(entity);
  entities = entities.filter((entity) => !excludedEntities.includes(entity));
  const hasProjectLanguage = /\b(projects?|built|build|work|portfolio|which ones|show)\b/.test(normalized);
  const hasCapabilityLanguage = /\b(do you know|do you have|have you|can you|could you|experience with|used|use|worked(?: professionally)? with|familiar)\b/.test(normalized);
  const comparison = /\b(compare|versus|vs|more|stronger|better)\b/.test(normalized);
  let intent = command ?? resolveIntent(input).intent;
  if (!command && /\b(enjoy|hobbies|interests|outside programming|literature|philosophy|cinema|psychology)\b/.test(normalized)) intent = "interests";
  if (!command && entities.some((entity) => entity.kind === "project")) intent = "projects";
  if (!command && hasProjectLanguage) intent = "projects";
  if (!command && hasCapabilityLanguage && intent === "unknown") intent = "skills";
  if (!command && hasCapabilityLanguage && /\b(professional|professionally|experience|worked)\b/.test(normalized)) intent = "experience";
  if (!command && referencesContext && context.resultProjects.length && entities.some((entity) => entity.kind === "technology" || entity.kind === "domain")) intent = "projects";
  if (referencesContext && intent === "unknown") intent = context.previousIntent ?? "projects";
  const constraintText = normalized.match(/(?:using|use|with|know)\s+(.+)$/)?.[1]?.replace(/\b(projects?|professionally|professional|experience|too)\b/g, "").trim();
  const cliTerms = [...normalized.matchAll(/--tech\s+([a-z0-9.\-]+)/g)].map((match) => match[1]);
  const candidateTerms = [...cliTerms, ...(constraintText ? constraintText.split(/\s+(?:and|or)\s+/) : [])].map((term) => term.replace(/\?+$/, "").trim()).filter(Boolean);
  if (comparison) candidateTerms.push(...normalized.replace(/^(are you more experienced with|are you more|which have you used more professionally|which do you use more)/, "").split(/\s+(?:vs|versus|or)\s+/).map((term) => term.trim()));
  const unresolvedTerms = candidateTerms.filter((term) => !entities.some((entity) => entity.kind === "technology" && (term.includes(normalize(entity.matched)) || normalize(entity.matched).includes(term))));
  if (!unresolvedTerms.length && hasCapabilityLanguage && !entities.some((entity) => entity.kind === "technology" || entity.kind === "domain")) {
    const unsupported = normalized.match(/(?:professional(?:ly)?\s+)([a-z][a-z0-9. +#-]+?)\s+(?:experience|development)$/)?.[1] ?? normalized.match(/have\s+(?:you\s+)?(?:professional\s+)?([a-z][a-z0-9. +#-]+?)\s+experience$/)?.[1];
    if (unsupported) unresolvedTerms.push(unsupported.trim());
  }
  const questionType = command ? (normalized.includes("--") ? "filter" : "command") : comparison ? "comparison" : referencesContext ? "follow-up" : hasProjectLanguage ? "filter" : intent === "services" && /\b(build|startup|help)\b/.test(normalized) ? "recommendation" : hasCapabilityLanguage ? "capability" : intent === "contact" ? "contact" : intent === "interests" ? "personal" : intent !== "unknown" ? "lookup" : "unknown";
  const modifiers = ["professional", "backend", "frontend", "primary", "beginner"].filter((modifier) => normalized.includes(modifier));
  return { original: input, normalized, intent, questionType, confidence: command ? 1 : intent === "unknown" ? 0 : entities.length ? 0.9 : 0.72, entities, includedEntities: entities, excludedEntities, unresolvedTerms, modifiers, operator: /\sor\s|either/.test(normalized) ? "or" : "and", referencesContext };
}
