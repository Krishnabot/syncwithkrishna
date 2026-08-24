import assert from "node:assert/strict";
import { buildKnowledgeGraph, findPath, findPaths, getIncoming, getOutgoing, getProjectsUsing, getTechnologiesForProject, indexGraph, validateKnowledgeGraph } from "../src/lib/graph/index.ts";

const graph = buildKnowledgeGraph(); const report = validateKnowledgeGraph(graph);
assert.equal(report.valid, true); assert.equal(new Set(graph.nodes.map((node) => node.id)).size, graph.nodes.length);
assert.equal(graph.edges.every((edge) => graph.nodeById.has(edge.from) && graph.nodeById.has(edge.to)), true);
assert.equal(graph.edges.every((edge) => edge.origin === "explicit" && edge.provenance.sourceId), true);
assert.ok(getOutgoing(graph, "person:krishna", "contributedTo").length >= 7);
assert.ok(getIncoming(graph, "technology:react", "uses").length >= 6);
assert.ok(getProjectsUsing(graph, "technology:react").some((node) => node.label === "Kairos Health Platform"));
assert.ok(getTechnologiesForProject(graph, "project:popmenu-hospitality-platform").some((node) => node.label === "Stripe"));
assert.ok(findPath(graph, "person:krishna", "technology:react", 2));
assert.equal(findPaths(graph, "person:krishna", "technology:react", 1).length, 1, "direct hasSkill path exists");
assert.ok(findPaths(graph, "person:krishna", "technology:react", 2).length > 1, "project evidence paths exist");
assert.equal(findPath(graph, "person:krishna", "interest:literature", 0), undefined, "path depth is bounded");
const malformed = indexGraph([{ id: "person:test", type: "person", label: "Test", aliases: [], metadata: {} }], [{ id: "bad", from: "person:test", to: "missing:x", relation: "uses", origin: "explicit", provenance: { sourceId: "fixture", sourceType: "structured-data" } }]);
assert.equal(validateKnowledgeGraph(malformed).valid, false);
console.log("Knowledge graph checks passed:", 13);
