import type { IntelligenceResponse, KnowledgeBase, KnowledgeIntent, KnowledgeProject } from "../terminal-types";
import { analyzeQuestion } from "./analyze.ts";
import { PROJECT_FACTS, TECHNOLOGIES } from "./knowledge.ts";
import type { QuestionAnalysis, SessionContext } from "./types";

export type IntelligenceResult = { analysis: QuestionAnalysis; response?: IntelligenceResponse; nextContext: SessionContext; suggestions?: KnowledgeIntent[] };
const findProject = (knowledge: KnowledgeBase, name: string) => knowledge.projects.projects?.find((project) => project.name === name);
const projectLines = (projects: KnowledgeProject[]) => projects.flatMap((project, index) => [`[${String(index + 1).padStart(2, "0")}] ${project.name}`, project.description, `stack: ${project.technologies.join(" / ")}`]);

function matchingProjects(analysis: QuestionAnalysis, context: SessionContext) {
  const technologies = analysis.entities.filter((entity) => entity.kind === "technology").map((entity) => entity.id);
  const domains = analysis.entities.filter((entity) => entity.kind === "domain").map((entity) => entity.id);
  const named = analysis.entities.filter((entity) => entity.kind === "project").map((entity) => entity.id);
  const base = analysis.referencesContext && context.resultProjects.length ? PROJECT_FACTS.filter((project) => context.resultProjects.includes(project.name)) : PROJECT_FACTS;
  return base.filter((project) => {
    const techMatch = !technologies.length || (analysis.operator === "or" ? technologies.some((id) => project.technologies.includes(id)) : technologies.every((id) => project.technologies.includes(id)));
    const domainMatch = !domains.length || domains.every((id) => id === "database" ? project.technologies.some((technology) => TECHNOLOGIES.find((item) => item.id === technology)?.category === "data") : project.domains.includes(id));
    const nameMatch = !named.length || named.includes(project.name);
    const excluded = analysis.excludedEntities.some((entity) => project.technologies.includes(entity.id) || project.domains.includes(entity.id));
    return techMatch && domainMatch && nameMatch && !excluded;
  });
}

function capabilityResponse(analysis: QuestionAnalysis): IntelligenceResponse {
  const techs = analysis.entities.filter((entity) => entity.kind === "technology");
  const domains = analysis.entities.filter((entity) => entity.kind === "domain");
  if (analysis.unresolvedTerms.length) return { kind: "unknown", heading: "[error://insufficient-evidence]", lines: ["THERE IS AS YET INSUFFICIENT DATA FOR A MEANINGFUL ANSWER", `The local knowledge base does not document ${analysis.unresolvedTerms.join(", ")} as professional or project experience.`] };
  if (!techs.length && domains.length) {
    const lines = domains.flatMap((domain) => { const projects = PROJECT_FACTS.filter((project) => project.professional && (domain.id === "database" ? project.technologies.some((technology) => TECHNOLOGIES.find((item) => item.id === technology)?.category === "data") : project.domains.includes(domain.id))); return [`${domain.label}: documented professional experience.`, `Evidence: ${projects.map((project) => project.name).join("; ")}.`]; });
    return { kind: "capability", heading: "[evidence://domain-capability]", lines };
  }
  if (!techs.length) return { kind: "unknown", heading: "[error://insufficient-evidence]", lines: ["THERE IS AS YET INSUFFICIENT DATA FOR A MEANINGFUL ANSWER", "The local knowledge base does not document that capability."] };
  const lines = techs.flatMap((entity) => {
    const tech = TECHNOLOGIES.find((item) => item.id === entity.id)!;
    const projects = PROJECT_FACTS.filter((project) => project.technologies.includes(tech.id));
    const evidence = projects.filter((project) => project.professional);
    const level = tech.level === "primary" ? "a primary strength" : tech.level === "beginner" ? "listed at beginner level" : evidence.length ? "documented professional experience" : "documented project experience";
    return [`${tech.label}: ${level}.`, ...(projects.length ? [`Evidence: ${projects.map((project) => project.name).join("; ")}.`] : ["No project-specific evidence is recorded."])];
  });
  return { kind: "capability", heading: "[evidence://capability]", lines };
}

function compareResponse(analysis: QuestionAnalysis): IntelligenceResponse {
  const techs = analysis.entities.filter((entity) => entity.kind === "technology");
  const domains = analysis.entities.filter((entity) => entity.kind === "domain");
  if (domains.length >= 2) {
    const counts = domains.map((domain) => ({ domain, projects: PROJECT_FACTS.filter((project) => project.professional && project.domains.includes(domain.id)) }));
    const lines = counts.map(({ domain, projects }) => `${domain.label}: ${projects.length} documented professional projects — ${projects.map((project) => project.name).join("; ")}.`);
    lines.push(counts[0].projects.length === counts[1].projects.length ? "The documented project evidence is balanced across these areas." : `${counts.sort((a, b) => b.projects.length - a.projects.length)[0].domain.label} appears more often in the documented project history; this is evidence frequency, not a proficiency score.`);
    return { kind: "comparison", heading: "[compare://documented-domains]", lines };
  }
  if (analysis.unresolvedTerms.length) {
    const lines = techs.flatMap((entity) => { const projects = PROJECT_FACTS.filter((project) => project.technologies.includes(entity.id)); return [`${entity.label}: ${projects.length} documented projects — ${projects.map((project) => project.name).join("; ")}.`]; });
    lines.push(`${analysis.unresolvedTerms.join(", ")}: insufficient documented evidence for a grounded comparison.`);
    return { kind: "comparison", heading: "[compare://partial-evidence]", lines };
  }
  if (techs.length < 2) return capabilityResponse(analysis);
  const lines = techs.map((entity) => { const projects = PROJECT_FACTS.filter((project) => project.technologies.includes(entity.id)); return `${entity.label}: ${projects.length} documented project${projects.length === 1 ? "" : "s"} — ${projects.map((project) => project.name).join("; ") || "none"}.`; });
  lines.push("This comparison uses documented project evidence, not invented proficiency scores.");
  return { kind: "comparison", heading: "[compare://documented-evidence]", lines };
}

export function answerQuestion(input: string, knowledge: KnowledgeBase, context: SessionContext): IntelligenceResult {
  const analysis = analyzeQuestion(input, context);
  let response: IntelligenceResponse | undefined;
  let resultProjects: string[] = [];
  let activeProject = context.activeProject;
  const projectEntity = analysis.entities.find((entity) => entity.kind === "project");
  if (projectEntity) activeProject = projectEntity.id;

  if (analysis.questionType === "comparison") response = compareResponse(analysis);
  else if ((analysis.questionType === "capability" || analysis.questionType === "recommendation") && (analysis.entities.some((entity) => entity.kind === "technology" || entity.kind === "domain") || analysis.unresolvedTerms.length)) response = capabilityResponse(analysis);
  else if (analysis.intent === "skills" && analysis.questionType === "filter") {
    const categories = analysis.entities.filter((entity) => entity.kind === "domain").map((entity) => entity.id);
    const techs = TECHNOLOGIES.filter((technology) => !categories.length || categories.includes(technology.category));
    response = { kind: "answer", heading: `[query://skills${categories.length ? `/${categories.join("+")}` : ""}]`, lines: techs.map((technology) => `${technology.label} — ${technology.level}.`) };
  }
  else if (analysis.intent === "experience" && analysis.questionType === "filter") {
    const facts = matchingProjects(analysis, context).filter((project) => project.professional);
    response = facts.length ? { kind: "projects", heading: `[query://professional-experience] ${facts.length} result${facts.length === 1 ? "" : "s"}`, lines: facts.flatMap((project) => [`${project.name}${project.company ? ` — ${project.company}` : ""}`, `Evidence: ${project.capabilities.join(" / ")}.`]), projectNames: facts.map((project) => project.name) } : { kind: "unknown", heading: "[query://no-professional-evidence]", lines: ["No matching professional experience is documented."] };
    resultProjects = facts.map((project) => project.name);
  }
  else if (analysis.intent === "projects" && (analysis.entities.length || analysis.questionType === "filter" || analysis.referencesContext)) {
    if (analysis.unresolvedTerms.length) response = { kind: "unknown", heading: "[error://insufficient-evidence]", lines: ["THERE IS AS YET INSUFFICIENT DATA FOR A MEANINGFUL ANSWER", `No documented project evidence was found for ${analysis.unresolvedTerms.join(", ")}.`] };
    else {
      const facts = matchingProjects(analysis, context);
      const projects = facts.map((fact) => findProject(knowledge, fact.name)).filter((project): project is KnowledgeProject => Boolean(project));
      resultProjects = projects.map((project) => project.name);
      response = projects.length ? { kind: "projects", heading: `[query://projects] ${projects.length} result${projects.length === 1 ? "" : "s"}`, lines: projectLines(projects), projectNames: resultProjects } : { kind: "unknown", heading: "[query://no-matching-projects]", lines: ["No documented projects match every requested condition.", "Try fewer filters or use OR instead of AND."] };
    }
  } else if (activeProject && analysis.referencesContext && /technolog|stack|built with|use/.test(analysis.normalized)) {
    const fact = PROJECT_FACTS.find((project) => project.name === activeProject);
    response = fact ? { kind: "answer", heading: `[project://${activeProject.toLowerCase().replace(/\s+/g, "-")}]`, lines: [`Technologies: ${fact.technologies.map((id) => TECHNOLOGIES.find((tech) => tech.id === id)?.label ?? id).join(" / ")}.`] } : undefined;
  } else if (analysis.intent === "unknown") {
    const outside = /\b(capital|weather|recipe|quantum|president|football|movie time)\b/.test(analysis.normalized);
    response = { kind: outside ? "outside-domain" : "unknown", heading: outside ? "[local://outside-knowledge-domain]" : "[error://query-not-resolved]", lines: outside ? ["This local interface only answers questions supported by Krishna's portfolio knowledge base.", "Ask about skills, projects, experience, services, interests, or contact information."] : ["THERE IS AS YET INSUFFICIENT DATA FOR A MEANINGFUL ANSWER"] };
  }

  const replacesProjectResults = analysis.intent === "projects" && (analysis.questionType === "filter" || analysis.questionType === "follow-up");
  const nextContext: SessionContext = { previousIntent: ["profile", "skills", "projects", "experience", "services", "contact", "interests"].includes(analysis.intent) ? analysis.intent as KnowledgeIntent : context.previousIntent, activeProject, entities: analysis.entities.length ? analysis.entities : context.entities, resultProjects: replacesProjectResults ? resultProjects : resultProjects.length ? resultProjects : context.resultProjects, recentQueries: [...context.recentQueries, input].slice(-6) };
  return { analysis, response, nextContext };
}
