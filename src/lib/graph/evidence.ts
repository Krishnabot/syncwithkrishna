import { findPaths } from "./query.ts";
import type { EvidencePath, KnowledgeGraph } from "./types.ts";

export function getProfessionalEvidencePaths(graph: KnowledgeGraph, entityId: string, limit = 4): EvidencePath[] {
  return findPaths(graph, "person:krishna", entityId, 2, 20).filter((path) => path.edges.length === 2 && path.nodes[1]?.type === "project" && path.nodes[1].metadata.professional && path.edges[1]?.relation === "uses").slice(0, limit);
}
export function formatEvidencePath(path: EvidencePath): string {
  return path.nodes.map((node, index) => index === 0 ? node.label : `--${path.edges[index - 1].relation}--> ${node.label}`).join(" ");
}
