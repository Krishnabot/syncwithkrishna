import { buildKnowledgeGraph, validateKnowledgeGraph } from "../src/lib/graph/index.ts";
const report = validateKnowledgeGraph(buildKnowledgeGraph());
console.log("KNOWLEDGE VALIDATION\n");
console.log(`${report.valid ? "✓" : "✗"} ${report.nodeCount} nodes`);
console.log(`${report.valid ? "✓" : "✗"} ${report.edgeCount} relationships`);
console.log(`✓ ${report.provenanceCount} relationships with provenance`);
for (const issue of report.issues) console.log(`${issue.severity === "error" ? "ERROR" : "WARNING"}: ${issue.message}`);
console.log(report.valid ? "\nKnowledge graph healthy." : "\nKnowledge graph invalid.");
if (!report.valid) process.exitCode = 1;
