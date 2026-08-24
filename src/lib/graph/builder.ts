import { DOMAIN_ALIASES, INTEREST_FACTS, PROJECT_FACTS, SERVICE_FACTS, TECHNOLOGIES } from "../intelligence/knowledge.ts";
import type { KnowledgeEdge, KnowledgeGraph, KnowledgeNode, KnowledgeNodeType, KnowledgeRelation, Provenance } from "./types.ts";

export const slug = (value: string) => value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const provenance = (sourceId: string, field?: string): Provenance => ({ sourceId, sourceType: "structured-data", field });
const edge = (from: string, relation: KnowledgeRelation, to: string, sourceId: string, field?: string): KnowledgeEdge => ({ id: `${from}|${relation}|${to}`, from, relation, to, origin: "explicit", provenance: provenance(sourceId, field) });

export function indexGraph(nodes: KnowledgeNode[], edges: KnowledgeEdge[]): KnowledgeGraph {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const nodesByType = new Map<KnowledgeNodeType, KnowledgeNode[]>();
  const outgoingEdges = new Map<string, KnowledgeEdge[]>(); const incomingEdges = new Map<string, KnowledgeEdge[]>(); const edgesByRelation = new Map<KnowledgeRelation, KnowledgeEdge[]>();
  for (const node of nodes) nodesByType.set(node.type, [...(nodesByType.get(node.type) ?? []), node]);
  for (const item of edges) { outgoingEdges.set(item.from, [...(outgoingEdges.get(item.from) ?? []), item]); incomingEdges.set(item.to, [...(incomingEdges.get(item.to) ?? []), item]); edgesByRelation.set(item.relation, [...(edgesByRelation.get(item.relation) ?? []), item]); }
  return { nodes, edges, nodeById, nodesByType, outgoingEdges, incomingEdges, edgesByRelation };
}

export function buildKnowledgeGraph(): KnowledgeGraph {
  const person: KnowledgeNode = { id: "person:krishna", type: "person", label: "Krishna Prasad Acharya", aliases: ["krishna", "krishna acharya"], metadata: {} };
  const role: KnowledgeNode = { id: "role:full-stack-developer", type: "role", label: "Full-Stack Developer", aliases: ["full stack developer", "engineer"], metadata: {} };
  const technologyNodes: KnowledgeNode[] = TECHNOLOGIES.map((item) => ({ id: `technology:${item.id}`, type: "technology", label: item.label, aliases: item.aliases, metadata: { category: item.category, level: item.level } }));
  const domainIds = new Set([...Object.keys(DOMAIN_ALIASES), ...TECHNOLOGIES.map((technology) => technology.category), ...PROJECT_FACTS.flatMap((project) => project.domains)]);
  const domainNodes: KnowledgeNode[] = [...domainIds].map((id) => ({ id: `domain:${slug(id)}`, type: "domain", label: id, aliases: DOMAIN_ALIASES[id] ?? [id], metadata: {} }));
  const projectNodes: KnowledgeNode[] = PROJECT_FACTS.map((item) => ({ id: `project:${slug(item.name)}`, type: "project", label: item.name, aliases: item.aliases, metadata: { professional: item.professional, startDate: item.startDate, endDate: item.endDate, ongoing: item.ongoing } }));
  const companies = [...new Set(PROJECT_FACTS.flatMap((project) => project.company ? [project.company] : []))];
  const companyNodes: KnowledgeNode[] = companies.map((label) => ({ id: `company:${slug(label)}`, type: "company", label, aliases: [label], metadata: {} }));
  const serviceNodes: KnowledgeNode[] = SERVICE_FACTS.map((item) => ({ id: `service:${item.id}`, type: "service", label: item.label, aliases: item.aliases, metadata: {} }));
  const interestNodes: KnowledgeNode[] = INTEREST_FACTS.map((item) => ({ id: `interest:${item.id}`, type: "interest", label: item.label, aliases: item.aliases, metadata: {} }));
  const nodes = [person, role, ...technologyNodes, ...domainNodes, ...projectNodes, ...companyNodes, ...serviceNodes, ...interestNodes];
  const edges: KnowledgeEdge[] = [edge(person.id, "workedAs", role.id, "profile.md", "role")];
  for (const technology of TECHNOLOGIES) { edges.push(edge(person.id, "hasSkill", `technology:${technology.id}`, "skills.md", "groups")); edges.push(edge(`technology:${technology.id}`, "belongsTo", `domain:${slug(technology.category)}`, "knowledge.ts", "category")); }
  for (const project of PROJECT_FACTS) {
    const projectId = `project:${slug(project.name)}`; edges.push(edge(person.id, "contributedTo", projectId, "projects.md", "projects"));
    for (const technology of project.technologies) edges.push(edge(projectId, "uses", `technology:${technology}`, "projects.md", `projects.${project.name}.technologies`));
    for (const domain of project.domains) edges.push(edge(projectId, "belongsTo", `domain:${slug(domain)}`, "knowledge.ts", `projects.${project.name}.domains`));
    if (project.company) { const companyId = `company:${slug(project.company)}`; edges.push(edge(projectId, "associatedWith", companyId, "experience.md", project.name)); edges.push(edge(person.id, "workedAt", companyId, "experience.md", project.company)); }
  }
  for (const service of SERVICE_FACTS) { const serviceId = `service:${service.id}`; edges.push(edge(person.id, "provides", serviceId, "services.md", service.label)); for (const domain of service.relatedDomains ?? []) edges.push(edge(serviceId, "supports", `domain:${slug(domain)}`, "services.md", service.label)); }
  for (const interest of INTEREST_FACTS) edges.push(edge(person.id, "interestedIn", `interest:${interest.id}`, "interests.md", interest.label));
  return indexGraph(nodes, edges);
}
