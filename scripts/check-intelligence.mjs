import assert from "node:assert/strict";
import { answerQuestion, analyzeQuestion, EMPTY_CONTEXT } from "../src/lib/intelligence/index.ts";
import { PROJECT_FACTS } from "../src/lib/intelligence/knowledge.ts";

const blank = (id) => ({ id, title: id, label: id, summary: id, keywords: [], aliases: [], body: "" });
const knowledge = {
  profile: blank("profile"), skills: blank("skills"), experience: blank("experience"), services: blank("services"), contact: blank("contact"), interests: blank("interests"),
  projects: { ...blank("projects"), projects: PROJECT_FACTS.map((project) => ({ name: project.name, description: `${project.name} documented work.`, technologies: project.technologies })) },
};

const analysisCases = [
  ["skills", "skills", "command"], ["projects", "projects", "command"], ["experience", "experience", "command"], ["contact", "contact", "command"],
  ["What technologies do you use?", "skills", "capability"], ["What have you built?", "projects", "filter"], ["How can I contact you?", "contact", "contact"],
  ["Do you know React?", "skills", "capability"], ["Do you have backend experience?", "experience", "capability"],
  ["Have you worked professionally with Spring Boot?", "experience", "capability"], ["Show me React projects.", "projects", "filter"],
  ["Java vs React?", "skills", "comparison"], ["Are you more frontend or backend?", "skills", "comparison"],
  ["What do you enjoy outside programming?", "interests", "personal"], ["", "unknown", "unknown"], ["       ", "unknown", "unknown"],
];
for (const [query, intent, type] of analysisCases) { const result = analyzeQuestion(query, EMPTY_CONTEXT); assert.equal(result.intent, intent, query); assert.equal(result.questionType, type, query); }

assert.deepEqual(analyzeQuestion("Do you know ReactJS?", EMPTY_CONTEXT).entities.filter((entity) => entity.kind === "technology").map((entity) => entity.id), ["react"]);
assert.deepEqual(analyzeQuestion("Do you use Next JS?", EMPTY_CONTEXT).entities.filter((entity) => entity.kind === "technology").map((entity) => entity.id), ["next"]);
assert.deepEqual(analyzeQuestion("Do you know typescrpt?", EMPTY_CONTEXT).entities.filter((entity) => entity.kind === "technology").map((entity) => entity.id), ["typescript"]);
assert.equal(analyzeQuestion("Do you know breakfast?", EMPTY_CONTEXT).entities.length, 0, "unrelated words must not fuzzy-match");

const react = answerQuestion("Show me React projects", knowledge, EMPTY_CONTEXT);
assert.ok(react.response?.projectNames?.includes("Educational Games Platform"));
assert.ok(react.response?.projectNames?.includes("Kairos Health Platform"));
assert.equal(answerQuestion("What technologies do you use?", knowledge, EMPTY_CONTEXT).response, undefined, "broad skills question should use the full knowledge record");
const both = answerQuestion("Show projects using React and Ruby on Rails", knowledge, EMPTY_CONTEXT);
assert.deepEqual(both.response?.projectNames, ["Educational Games Platform", "Fluid Digital Engagement Platform", "PopMenu Hospitality Platform", "Juubix Web3 Ecosystem"]);
const impossible = answerQuestion("Show projects using React and Java", knowledge, EMPTY_CONTEXT);
assert.equal(impossible.response?.kind, "unknown");
assert.match(impossible.response?.lines.join(" ") ?? "", /Java/i);
const withoutReact = answerQuestion("Show projects without React", knowledge, EMPTY_CONTEXT);
assert.ok(!withoutReact.response?.projectNames?.includes("Kairos Health Platform"));
assert.ok(withoutReact.response?.projectNames?.includes("Golf Buddy & Japanese Goods Commerce"));
const cli = answerQuestion("projects --tech react --tech rails", knowledge, EMPTY_CONTEXT);
assert.deepEqual(cli.response?.projectNames, both.response?.projectNames);
const skillsCli = answerQuestion("skills --category backend", knowledge, EMPTY_CONTEXT);
assert.match(skillsCli.response?.lines.join(" ") ?? "", /Ruby on Rails/);
const experienceCli = answerQuestion("experience --tech rails", knowledge, EMPTY_CONTEXT);
assert.equal(experienceCli.response?.projectNames?.length, 5);

const first = answerQuestion("Show me React projects", knowledge, EMPTY_CONTEXT);
const followUp = answerQuestion("Which of those use TypeScript too?", knowledge, first.nextContext);
assert.deepEqual(followUp.response?.projectNames, ["Kairos Health Platform", "Sync With Krishna"]);
const project = answerQuestion("Tell me about PopMenu", knowledge, EMPTY_CONTEXT);
const pronoun = answerQuestion("What technologies did you use in it?", knowledge, project.nextContext);
assert.match(pronoun.response?.lines.join(" ") ?? "", /React.*Ruby on Rails/);

const unsupported = answerQuestion("Do you professionally use Rust?", knowledge, EMPTY_CONTEXT);
assert.equal(unsupported.response?.kind, "unknown");
const spring = answerQuestion("Have you worked professionally with Spring Boot?", knowledge, EMPTY_CONTEXT);
assert.equal(spring.response?.kind, "unknown");
const offTopic = answerQuestion("What is the capital of France?", knowledge, EMPTY_CONTEXT);
assert.equal(offTopic.response?.kind, "outside-domain");
const longInput = "x".repeat(500);
assert.equal(analyzeQuestion(longInput, EMPTY_CONTEXT).intent, "unknown");

console.log("Local intelligence checks passed:", analysisCases.length + 17);
