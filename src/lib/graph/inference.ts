import { indexGraph } from "./builder.ts";
import { getOutgoing } from "./query.ts";
import type { KnowledgeEdge, KnowledgeGraph } from "./types.ts";

export type InferenceRule = { id: string; description: string; evaluate(graph: KnowledgeGraph): KnowledgeEdge[] };
const derived = (from: string, relation: KnowledgeEdge["relation"], to: string, ruleId: string, supportingEdgeIds: string[]): KnowledgeEdge => ({ id: `${from}|${relation}|${to}`, from, relation, to, origin: "derived", ruleId, supportingEdgeIds, provenance: { sourceId: ruleId, sourceType: "structured-data", field: "derived" } });

export const INFERENCE_RULES: InferenceRule[] = [
  {
    id: "rule:professional-project-technology", description: "A technology used by a documented professional project has professional project evidence.",
    evaluate(graph) { const claims: KnowledgeEdge[] = []; for (const contribution of getOutgoing(graph, "person:krishna", "contributedTo")) { const project = graph.nodeById.get(contribution.to); if (!project?.metadata.professional) continue; for (const usage of getOutgoing(graph, project.id, "uses")) claims.push(derived("person:krishna", "professionalEvidence", usage.to, this.id, [contribution.id, usage.id])); } return claims; },
  },
  {
    id: "rule:project-full-stack", description: "A project using both frontend and backend technologies demonstrates full-stack capability.",
    evaluate(graph) { const claims: KnowledgeEdge[] = []; for (const project of graph.nodesByType.get("project") ?? []) { const usages = getOutgoing(graph, project.id, "uses"); const categories = usages.map((usage) => graph.nodeById.get(usage.to)?.metadata.category); const frontend = categories.includes("frontend"); const backend = categories.includes("backend"); if (frontend && backend) claims.push(derived(project.id, "demonstrates", "domain:full-stack", this.id, usages.filter((usage) => ["frontend", "backend"].includes(graph.nodeById.get(usage.to)?.metadata.category ?? "")).map((usage) => usage.id))); } return claims; },
  },
];

export function applyInference(graph: KnowledgeGraph): KnowledgeGraph {
  const existing = new Set(graph.edges.map((edge) => edge.id)); const derivedEdges: KnowledgeEdge[] = [];
  for (const rule of INFERENCE_RULES) for (const claim of rule.evaluate(graph)) if (!existing.has(claim.id)) { existing.add(claim.id); derivedEdges.push(claim); }
  return indexGraph(graph.nodes, [...graph.edges, ...derivedEdges]);
}
