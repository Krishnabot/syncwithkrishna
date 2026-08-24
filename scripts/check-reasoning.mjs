import assert from "node:assert/strict";
import { answerQuestion, EMPTY_CONTEXT } from "../src/lib/intelligence/index.ts";
import { PROJECT_FACTS } from "../src/lib/intelligence/knowledge.ts";
import { applyInference, buildKnowledgeGraph, indexGraph, INFERENCE_RULES } from "../src/lib/graph/index.ts";

const blank = (id) => ({ id, title: id, label: id, summary: id, keywords: [], aliases: [], body: "" });
const knowledge = { profile: blank("profile"), skills: blank("skills"), experience: blank("experience"), services: blank("services"), contact: blank("contact"), interests: blank("interests"), projects: { ...blank("projects"), projects: PROJECT_FACTS.map((project) => ({ name: project.name, description: `${project.name} documented work.`, technologies: project.technologies })) } };

const explicit = buildKnowledgeGraph(); const reasoned = applyInference(explicit);
assert.ok(reasoned.edges.some((edge) => edge.origin === "derived" && edge.ruleId === "rule:professional-project-technology" && edge.to === "technology:react"));
assert.ok(reasoned.edges.some((edge) => edge.origin === "derived" && edge.ruleId === "rule:project-full-stack" && edge.to === "domain:full-stack"));
assert.ok(reasoned.edges.filter((edge) => edge.origin === "derived").every((edge) => edge.supportingEdgeIds?.length && edge.ruleId));
assert.equal(reasoned.edges.some((edge) => edge.to.includes("interest") && edge.relation === "professionalEvidence"), false, "interests never imply expertise");
const frontendOnly = indexGraph([
  { id: "person:krishna", type: "person", label: "Krishna", aliases: [], metadata: {} }, { id: "project:only-ui", type: "project", label: "Only UI", aliases: [], metadata: { professional: true } },
  { id: "technology:react", type: "technology", label: "React", aliases: [], metadata: { category: "frontend" } }, { id: "domain:full-stack", type: "domain", label: "full-stack", aliases: [], metadata: {} },
], [{ id: "c", from: "person:krishna", to: "project:only-ui", relation: "contributedTo", origin: "explicit", provenance: { sourceId: "fixture", sourceType: "structured-data" } }, { id: "u", from: "project:only-ui", to: "technology:react", relation: "uses", origin: "explicit", provenance: { sourceId: "fixture", sourceType: "structured-data" } }]);
assert.equal(INFERENCE_RULES.find((rule) => rule.id === "rule:project-full-stack").evaluate(frontendOnly).length, 0, "frontend alone is insufficient for full-stack");

const capability = answerQuestion("Do you have professional React experience?", knowledge, EMPTY_CONTEXT);
assert.equal(capability.response?.kind, "capability"); assert.ok(capability.nextContext.lastEvidencePaths.length > 0);
const why = answerQuestion("why?", knowledge, capability.nextContext);
assert.equal(why.response?.kind, "evidence"); assert.match(why.response?.lines.join(" ") ?? "", /Krishna.*React/);
const unsupported = answerQuestion("Do you professionally use Rust?", knowledge, EMPTY_CONTEXT);
const unsupportedWhy = answerQuestion("How do you know?", knowledge, unsupported.nextContext);
assert.equal(unsupportedWhy.response?.kind, "unknown");
const supporting = answerQuestion("Show me the projects that support that", knowledge, capability.nextContext);
assert.ok(supporting.response?.projectNames?.length); assert.ok(supporting.response?.projectNames?.every((name) => PROJECT_FACTS.find((project) => project.name === name)?.technologies.includes("react")));
const professional = answerQuestion("Which of those were professional?", knowledge, supporting.nextContext);
assert.ok(professional.response?.projectNames?.every((name) => PROJECT_FACTS.find((project) => project.name === name)?.professional));
assert.equal(answerQuestion("why?", knowledge, professional.nextContext).response?.kind, "evidence");
assert.match(answerQuestion("What is your current role?", knowledge, EMPTY_CONTEXT).response?.lines.join(" ") ?? "", /Sampo Development/);
assert.match(answerQuestion("What technologies appear in your recent work?", knowledge, EMPTY_CONTEXT).response?.lines.join(" ") ?? "", /Solidus/);
const fullStack = answerQuestion("Why do you say you're full-stack?", knowledge, EMPTY_CONTEXT);
assert.equal(fullStack.response?.kind, "capability"); assert.ok(fullStack.nextContext.lastEvidencePaths.some((path) => path.edges.some((edge) => edge.origin === "derived")));
console.log("Reasoning checks passed:", 16);
