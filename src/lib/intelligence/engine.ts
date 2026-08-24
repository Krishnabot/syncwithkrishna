import type { IntelligenceResponse, KnowledgeBase, KnowledgeIntent, KnowledgeProject } from "../terminal-types";
import { applyInference, buildKnowledgeGraph, findPaths, formatEvidencePath, getNeighbors, getProfessionalEvidencePaths, resolveGraphNode, slug, validateKnowledgeGraph } from "../graph/index.ts";
import { analyzeQuestion } from "./analyze.ts";
import { PROJECT_FACTS, TECHNOLOGIES } from "./knowledge.ts";
import type { QuestionAnalysis, SessionContext } from "./types";

export type IntelligenceResult = { analysis: QuestionAnalysis; response?: IntelligenceResponse; nextContext: SessionContext; suggestions?: KnowledgeIntent[] };
const GRAPH = applyInference(buildKnowledgeGraph());
const findProject = (knowledge: KnowledgeBase, name: string) => knowledge.projects.projects?.find((project) => project.name === name);
const projectLines = (projects: KnowledgeProject[]) => projects.flatMap((project, index) => [`[${String(index + 1).padStart(2, "0")}] ${project.name}`, project.description, `stack: ${project.technologies.join(" / ")}`]);
const entityNodeId = (entity: QuestionAnalysis["entities"][number]) => entity.kind === "technology" ? `technology:${entity.id}` : entity.kind === "project" ? `project:${slug(entity.id)}` : entity.kind === "company" ? `company:${slug(entity.id)}` : entity.kind === "domain" ? `domain:${slug(entity.id)}` : undefined;
const commandNodes = (analysis: QuestionAnalysis) => analysis.entities.map(entityNodeId).map((id) => id ? GRAPH.nodeById.get(id) : undefined).filter((node): node is NonNullable<typeof node> => Boolean(node));
const pathLines = (paths: ReturnType<typeof findPaths>) => paths.length ? paths.map(formatEvidencePath) : ["No documented relationship path found within the local traversal limit."];

function matchingProjects(analysis: QuestionAnalysis, context: SessionContext) {
  const technologies = analysis.entities.filter((entity) => entity.kind === "technology").map((entity) => entity.id);
  const domains = analysis.entities.filter((entity) => entity.kind === "domain").map((entity) => entity.id);
  const named = analysis.entities.filter((entity) => entity.kind === "project").map((entity) => entity.id);
  const evidenceProjects = context.lastEvidencePaths.flatMap((path) => path.nodes.filter((node) => node.type === "project").map((node) => node.label));
  const contextualProjects = context.resultProjects.length ? context.resultProjects : evidenceProjects;
  const base = analysis.referencesContext && contextualProjects.length ? PROJECT_FACTS.filter((project) => contextualProjects.includes(project.name)) : PROJECT_FACTS;
  return base.filter((project) => {
    const techMatch = !technologies.length || (analysis.operator === "or" ? technologies.some((id) => project.technologies.includes(id)) : technologies.every((id) => project.technologies.includes(id)));
    const categories = project.technologies.map((technology) => TECHNOLOGIES.find((item) => item.id === technology)?.category);
    const domainMatch = !domains.length || domains.every((id) => id === "database" ? categories.includes("data") : id === "full-stack" ? categories.includes("frontend") && categories.includes("backend") : project.domains.includes(id));
    const nameMatch = !named.length || named.includes(project.name);
    const excluded = analysis.excludedEntities.some((entity) => project.technologies.includes(entity.id) || project.domains.includes(entity.id));
    const professionalMatch = !analysis.modifiers.includes("professional") || project.professional;
    return techMatch && domainMatch && nameMatch && professionalMatch && !excluded;
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
  let evidencePaths = context.lastEvidencePaths;

  if (analysis.intent === "inspect" || analysis.intent === "related") {
    const targetText = analysis.normalized.replace(/^(inspect|related)\s+/, ""); const node = commandNodes(analysis)[0] ?? resolveGraphNode(GRAPH, targetText);
    if (!node) response = { kind: "unknown", heading: "[graph://entity-not-found]", lines: ["No matching entity exists in Krishna's local knowledge graph."] };
    else { const neighbors = getNeighbors(GRAPH, node.id); const grouped = [...new Set(neighbors.map((item) => item.type))].flatMap((type) => [`${type.toUpperCase()}`, ...neighbors.filter((item) => item.type === type).map((item) => `├── ${item.label}`)]); response = { kind: "answer", heading: `[${analysis.intent}://${slug(node.label)}]`, lines: analysis.intent === "inspect" ? [`TYPE: ${node.type}`, ...(node.metadata.category ? [`CATEGORY: ${node.metadata.category}`] : []), ...(node.metadata.level ? [`EVIDENCE LEVEL: ${node.metadata.level}`] : []), "RELATED", ...grouped] : grouped }; }
  }
  else if (analysis.intent === "trace" || /\b(how (?:is|are).+ connected|connected to (?:your|krishna))\b/.test(analysis.normalized)) {
    const nodes = commandNodes(analysis); const from = nodes.length > 1 ? nodes[0].id : "person:krishna"; const to = nodes.length > 1 ? nodes[1].id : nodes[0]?.id ?? context.activeEntity;
    const paths = to ? findPaths(GRAPH, from, to, 3, 4) : []; evidencePaths = paths;
    response = { kind: paths.length ? "evidence" : "unknown", heading: "[trace://relationships]", lines: pathLines(paths) };
  }
  else if (analysis.intent === "search") {
    const term = analysis.normalized.replace(/^search\s+/, ""); const direct = commandNodes(analysis); const matches = direct.length ? direct : GRAPH.nodes.filter((node) => node.label.toLowerCase() === term || node.aliases.some((alias) => alias.toLowerCase() === term)).slice(0, 12);
    const connected = matches.flatMap((node) => getNeighbors(GRAPH, node.id)).filter((node, index, all) => all.findIndex((item) => item.id === node.id) === index).slice(0, 12);
    response = matches.length ? { kind: "answer", heading: `[search://${slug(term)}]`, lines: ["MATCHES", ...matches.map((node) => `├── ${node.type}: ${node.label}`), "CONNECTED", ...connected.map((node) => `├── ${node.type}: ${node.label}`)] } : { kind: "unknown", heading: "[search://no-results]", lines: ["No matching graph entities were found."] };
  }
  else if (analysis.intent === "stats") {
    const validation = validateKnowledgeGraph(GRAPH); const typeLines = [...GRAPH.nodesByType.entries()].map(([type, nodes]) => `${type.padEnd(13)} ${nodes.length}`);
    response = { kind: "answer", heading: "[knowledge://index]", lines: [...typeLines, `relationships ${GRAPH.edges.length}`, `explicit      ${GRAPH.edges.filter((edge) => edge.origin === "explicit").length}`, `derived       ${GRAPH.edges.filter((edge) => edge.origin === "derived").length}`, `status        ${validation.valid ? validation.issues.length ? "healthy with warnings" : "healthy" : "invalid"}`] };
  }
  else if (analysis.intent === "timeline") {
    const dated = PROJECT_FACTS.filter((project) => project.startDate).sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""));
    response = { kind: "timeline", heading: "[krishna://timeline]", lines: dated.flatMap((project) => [`${project.startDate} ${project.ongoing ? "— present" : `— ${project.endDate}`}`, `├── ${project.name}${project.company ? ` / ${project.company}` : ""}`, `└── ${project.technologies.map((id) => TECHNOLOGIES.find((technology) => technology.id === id)?.label ?? id).join(" / ")}`]), projectNames: dated.map((project) => project.name) };
  }
  else if (analysis.intent === "graph") response = { kind: "graph", heading: "[graph://interactive]", lines: ["Select an entity to refocus the local relationship map."], graphFocusId: "person:krishna" };
  else if (analysis.questionType === "reason" || analysis.intent === "evidence" || /\bwhat evidence.+(?:for|of)\b/.test(analysis.normalized)) {
    if (analysis.entities.length) { const target = commandNodes(analysis)[0]; evidencePaths = target ? findPaths(GRAPH, "person:krishna", target.id, 3, 4) : []; }
    response = context.lastEvidencePaths.length ? { kind: "evidence", heading: "[evidence://trace]", lines: [context.lastClaim ?? "Previous claim", ...context.lastEvidencePaths.map(formatEvidencePath)] } : { kind: "unknown", heading: "[evidence://unavailable]", lines: ["The previous answer has no supporting evidence path in the local graph."] };
    if (evidencePaths.length && analysis.entities.length) response = { kind: "evidence", heading: "[evidence://trace]", lines: evidencePaths.map(formatEvidencePath) };
  }
  else if (/\b(current role|what do you do currently)\b/.test(analysis.normalized)) {
    const current = PROJECT_FACTS.find((project) => project.ongoing);
    response = current ? { kind: "answer", heading: "[temporal://current-role]", lines: [`Full-Stack Developer at ${current.company}.`, `Current documented work: ${current.name}.`, `Since ${current.startDate}.`] } : { kind: "unknown", heading: "[temporal://insufficient-data]", lines: ["No current role is documented."] };
  }
  else if (/\b(recent|recently|latest)\b/.test(analysis.normalized)) {
    const dated = PROJECT_FACTS.filter((project) => project.startDate).sort((a, b) => (b.startDate ?? "").localeCompare(a.startDate ?? "")).slice(0, 2);
    const wantsTechnologies = /technolog|stack/.test(analysis.normalized);
    response = { kind: "timeline", heading: "[temporal://recent-work]", lines: wantsTechnologies ? dated.flatMap((project) => [`${project.name} (${project.startDate}${project.ongoing ? " — present" : ""})`, `Technologies: ${project.technologies.map((id) => TECHNOLOGIES.find((technology) => technology.id === id)?.label ?? id).join(" / ")}`]) : dated.map((project) => `${project.startDate}${project.ongoing ? " — present" : ""} :: ${project.name}${project.company ? ` / ${project.company}` : ""}`), projectNames: dated.map((project) => project.name) };
    resultProjects = dated.map((project) => project.name);
  }
  else if (/\bwhat did you work on before\b/.test(analysis.normalized) && projectEntity) {
    const target = PROJECT_FACTS.find((project) => project.name === projectEntity.id); const earlier = PROJECT_FACTS.filter((project) => project.endDate && target?.startDate && project.endDate <= target.startDate).sort((a, b) => (b.endDate ?? "").localeCompare(a.endDate ?? ""))[0];
    response = earlier ? { kind: "timeline", heading: "[temporal://previous-work]", lines: [`Before ${target?.name}, the nearest documented earlier work is ${earlier.name}.`, `${earlier.startDate} — ${earlier.endDate}.`] } : { kind: "unknown", heading: "[temporal://insufficient-data]", lines: ["There is not enough dated information to identify earlier work."] };
  }
  else if (/\b(full stack|full-stack|fullstack)\b/.test(analysis.normalized) && /\b(are you|why|consider|say)\b/.test(analysis.normalized)) {
    const fullStackPaths = findPaths(GRAPH, "person:krishna", "domain:full-stack", 2, 8).filter((path) => path.edges.some((edge) => edge.relation === "demonstrates") && (!context.resultProjects.length || path.nodes.some((node) => context.resultProjects.includes(node.label)))).slice(0, 5);
    response = fullStackPaths.length ? { kind: "capability", heading: "[reasoning://full-stack]", lines: ["Yes — documented projects combine frontend and backend technologies.", `Supporting projects: ${fullStackPaths.map((path) => path.nodes.find((node) => node.type === "project")?.label).filter(Boolean).join("; ")}.`, "This is a derived claim based on explicit project technology relationships."] } : { kind: "unknown", heading: "[reasoning://insufficient-evidence]", lines: ["The graph does not contain enough evidence for that full-stack claim."] };
    evidencePaths = fullStackPaths;
  }

  else if (analysis.questionType === "comparison") response = compareResponse(analysis);
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

  const technologyEntities = analysis.entities.filter((entity) => entity.kind === "technology");
  if (technologyEntities.length && response?.kind === "capability") evidencePaths = technologyEntities.flatMap((entity) => getProfessionalEvidencePaths(GRAPH, `technology:${entity.id}`, 3));
  else if (response?.projectNames?.length) evidencePaths = response.projectNames.flatMap((name) => findPaths(GRAPH, "person:krishna", `project:${slug(name)}`, 1, 1));
  else if (response?.kind !== "evidence" && response?.kind !== "unknown" && response && evidencePaths === context.lastEvidencePaths) evidencePaths = [];
  const replacesProjectResults = analysis.intent === "projects" && (analysis.questionType === "filter" || analysis.questionType === "follow-up");
  const nextContext: SessionContext = { previousIntent: ["profile", "skills", "projects", "experience", "services", "contact", "interests"].includes(analysis.intent) ? analysis.intent as KnowledgeIntent : context.previousIntent, activeProject, activeEntity: technologyEntities[0] ? `technology:${technologyEntities[0].id}` : context.activeEntity, entities: analysis.entities.length ? analysis.entities : context.entities, resultProjects: replacesProjectResults ? resultProjects : resultProjects.length ? resultProjects : context.resultProjects, recentQueries: [...context.recentQueries, input].slice(-6), lastClaim: response?.kind === "evidence" ? context.lastClaim : response?.lines[0], lastEvidencePaths: evidencePaths, lastComparedEntities: analysis.questionType === "comparison" ? analysis.entities.map((entity) => entity.id) : context.lastComparedEntities };
  return { analysis, response, nextContext };
}
