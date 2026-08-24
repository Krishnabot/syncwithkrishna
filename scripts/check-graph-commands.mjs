import assert from "node:assert/strict";
import { answerQuestion, EMPTY_CONTEXT } from "../src/lib/intelligence/index.ts";
import { PROJECT_FACTS } from "../src/lib/intelligence/knowledge.ts";

const blank = (id) => ({ id, title: id, label: id, summary: id, keywords: [], aliases: [], body: "" });
const knowledge = { profile: blank("profile"), skills: blank("skills"), experience: blank("experience"), services: blank("services"), contact: blank("contact"), interests: blank("interests"), projects: { ...blank("projects"), projects: PROJECT_FACTS.map((project) => ({ name: project.name, description: `${project.name} documented work.`, technologies: project.technologies })) } };
const run = (query, context = EMPTY_CONTEXT) => answerQuestion(query, knowledge, context);

assert.match(run("inspect react").response?.lines.join(" ") ?? "", /TYPE: technology.*CATEGORY: frontend/);
assert.match(run("inspect next js").response?.heading ?? "", /inspect:\/\/next-js/);
assert.match(run("related react").response?.lines.join(" ") ?? "", /Kairos Health Platform/);
assert.equal(run("trace react").response?.kind, "evidence");
assert.match(run("trace PopMenu react").response?.lines.join(" ") ?? "", /PopMenu.*React/);
assert.match(run("search react").response?.lines.join(" ") ?? "", /MATCHES.*React.*CONNECTED/);
assert.equal(run("search java").response?.kind, "unknown");
assert.match(run("stats").response?.lines.join(" ") ?? "", /relationships.*derived.*status.*healthy/);
assert.match(run("timeline").response?.lines.join(" ") ?? "", /2018-09.*2024-12.*present/);
assert.equal(run("graph").response?.kind, "graph");
assert.equal(run("graph").response?.graphFocusId, "person:krishna");
assert.equal(run("inspect entirely-unknown-entity").response?.kind, "unknown");
assert.equal(run("How is React connected to your professional experience?").response?.kind, "evidence");
assert.equal(run("What evidence do you have for React experience?").response?.kind, "evidence");
console.log("Graph command checks passed:", 14);
