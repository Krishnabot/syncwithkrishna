export type KnowledgeNodeType = "person" | "technology" | "project" | "company" | "role" | "service" | "domain" | "interest";
export type KnowledgeRelation = "hasSkill" | "contributedTo" | "workedAt" | "workedAs" | "uses" | "belongsTo" | "associatedWith" | "provides" | "interestedIn" | "supports" | "demonstrates" | "professionalEvidence";
export type ClaimOrigin = "explicit" | "derived";
export type Provenance = { sourceId: string; sourceType: "content" | "structured-data"; field?: string };
export type NodeMetadata = { category?: string; level?: string; professional?: boolean; startDate?: string; endDate?: string; ongoing?: boolean };
export type KnowledgeNode = { id: string; type: KnowledgeNodeType; label: string; aliases: string[]; metadata: NodeMetadata };
export type KnowledgeEdge = { id: string; from: string; to: string; relation: KnowledgeRelation; origin: ClaimOrigin; provenance: Provenance; ruleId?: string; supportingEdgeIds?: string[] };
export type KnowledgeGraph = {
  nodes: KnowledgeNode[]; edges: KnowledgeEdge[]; nodeById: Map<string, KnowledgeNode>; nodesByType: Map<KnowledgeNodeType, KnowledgeNode[]>;
  outgoingEdges: Map<string, KnowledgeEdge[]>; incomingEdges: Map<string, KnowledgeEdge[]>; edgesByRelation: Map<KnowledgeRelation, KnowledgeEdge[]>;
};
export type EvidencePath = { nodes: KnowledgeNode[]; edges: KnowledgeEdge[] };
export type ValidationIssue = { severity: "error" | "warning"; code: string; message: string };
export type ValidationReport = { valid: boolean; nodeCount: number; edgeCount: number; provenanceCount: number; issues: ValidationIssue[] };
