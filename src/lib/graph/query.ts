import type { EvidencePath, KnowledgeEdge, KnowledgeGraph, KnowledgeNode, KnowledgeRelation } from "./types.ts";

export const getNode = (graph: KnowledgeGraph, id: string) => graph.nodeById.get(id);
export const getOutgoing = (graph: KnowledgeGraph, id: string, relation?: KnowledgeRelation) => (graph.outgoingEdges.get(id) ?? []).filter((edge) => !relation || edge.relation === relation);
export const getIncoming = (graph: KnowledgeGraph, id: string, relation?: KnowledgeRelation) => (graph.incomingEdges.get(id) ?? []).filter((edge) => !relation || edge.relation === relation);
export const getNeighbors = (graph: KnowledgeGraph, id: string) => [...getOutgoing(graph, id).map((edge) => graph.nodeById.get(edge.to)), ...getIncoming(graph, id).map((edge) => graph.nodeById.get(edge.from))].filter((node): node is KnowledgeNode => Boolean(node));

export function resolveGraphNode(graph: KnowledgeGraph, query: string): KnowledgeNode | undefined {
  const normalized = query.toLowerCase().replace(/["']/g, "").trim();
  return graph.nodes.find((node) => node.id === normalized || node.label.toLowerCase() === normalized || node.aliases.some((alias) => alias.toLowerCase() === normalized));
}

export function findPaths(graph: KnowledgeGraph, from: string, to: string, maxDepth = 3, limit = 4): EvidencePath[] {
  if (!graph.nodeById.has(from) || !graph.nodeById.has(to) || maxDepth < 0) return [];
  const results: EvidencePath[] = []; const start = graph.nodeById.get(from)!;
  const queue: Array<{ node: KnowledgeNode; nodes: KnowledgeNode[]; edges: KnowledgeEdge[]; visited: Set<string> }> = [{ node: start, nodes: [start], edges: [], visited: new Set([from]) }];
  while (queue.length && results.length < limit) {
    const current = queue.shift()!; if (current.edges.length >= maxDepth) continue;
    const adjacent = [...getOutgoing(graph, current.node.id).map((edge) => ({ edge, id: edge.to })), ...getIncoming(graph, current.node.id).map((edge) => ({ edge, id: edge.from }))];
    for (const next of adjacent) { if (current.visited.has(next.id)) continue; const node = graph.nodeById.get(next.id); if (!node) continue; const path = { nodes: [...current.nodes, node], edges: [...current.edges, next.edge] }; if (next.id === to) results.push(path); else queue.push({ node, ...path, visited: new Set([...current.visited, next.id]) }); }
  }
  return results;
}
export const findPath = (graph: KnowledgeGraph, from: string, to: string, maxDepth = 3) => findPaths(graph, from, to, maxDepth, 1)[0];
export const getProjectsUsing = (graph: KnowledgeGraph, technologyId: string) => getIncoming(graph, technologyId, "uses").map((edge) => graph.nodeById.get(edge.from)).filter((node): node is KnowledgeNode => node?.type === "project");
export const getTechnologiesForProject = (graph: KnowledgeGraph, projectId: string) => getOutgoing(graph, projectId, "uses").map((edge) => graph.nodeById.get(edge.to)).filter((node): node is KnowledgeNode => node?.type === "technology");
