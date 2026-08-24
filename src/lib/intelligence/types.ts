import type { Intent, KnowledgeIntent } from "../terminal-types";
import type { EvidencePath } from "../graph/types";

export type QuestionType = "command" | "lookup" | "capability" | "filter" | "comparison" | "recommendation" | "reason" | "contact" | "personal" | "follow-up" | "unknown";
export type EntityKind = "technology" | "project" | "company" | "domain" | "category";
export type Entity = { id: string; label: string; kind: EntityKind; matched: string };
export type QuestionAnalysis = { original: string; normalized: string; intent: Intent; questionType: QuestionType; confidence: number; entities: Entity[]; includedEntities: Entity[]; excludedEntities: Entity[]; unresolvedTerms: string[]; modifiers: string[]; operator: "and" | "or"; referencesContext: boolean };
export type SessionContext = { previousIntent?: KnowledgeIntent; activeProject?: string; activeEntity?: string; entities: Entity[]; resultProjects: string[]; recentQueries: string[]; lastClaim?: string; lastEvidencePaths: EvidencePath[]; lastComparedEntities: string[] };
export const EMPTY_CONTEXT: SessionContext = { entities: [], resultProjects: [], recentQueries: [], lastEvidencePaths: [], lastComparedEntities: [] };
