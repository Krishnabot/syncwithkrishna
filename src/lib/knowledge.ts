import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { KNOWLEDGE_INTENTS, type KnowledgeBase, type KnowledgeIntent, type KnowledgeRecord } from "./terminal-types";

const CONTENT_DIRECTORY = path.join(process.cwd(), "src", "content");
function stringArray(value: unknown): string[] { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []; }
function loadRecord(id: KnowledgeIntent): KnowledgeRecord {
  const source = fs.readFileSync(path.join(CONTENT_DIRECTORY, id + ".md"), "utf8");
  const { data, content } = matter(source);
  if (data.id !== id || typeof data.title !== "string" || typeof data.summary !== "string") throw new Error("Invalid knowledge record: " + id + ".md");
  return {
    id, title: data.title, label: typeof data.label === "string" ? data.label : data.title,
    summary: data.summary, keywords: stringArray(data.keywords), aliases: stringArray(data.aliases),
    body: content.trim(), facts: Array.isArray(data.facts) ? data.facts : undefined,
    groups: Array.isArray(data.groups) ? data.groups : undefined,
    projects: Array.isArray(data.projects) ? data.projects : undefined,
    links: Array.isArray(data.links) ? data.links : undefined, todo: stringArray(data.todo),
  };
}
export function getKnowledgeBase(): KnowledgeBase {
  return Object.fromEntries(KNOWLEDGE_INTENTS.map((id) => [id, loadRecord(id)])) as KnowledgeBase;
}
