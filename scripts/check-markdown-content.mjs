import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";

const contentRoot = path.resolve(process.cwd(), "content", "posts");
const categories = new Map([
  ["journals", "journal"],
  ["essays", "essay"],
  ["poems", "poem"],
]);
const requiredFields = ["title", "date", "category", "tags", "excerpt"];
const errors = [];
const slugs = new Set();
let checked = 0;

for (const [folder, category] of categories) {
  const directory = path.join(contentRoot, folder);
  if (!fs.existsSync(directory)) {
    errors.push(`${path.relative(process.cwd(), directory)}: directory is missing`);
    continue;
  }

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;

    checked += 1;
    const file = path.join(directory, entry.name);
    const relativeFile = path.relative(process.cwd(), file);
    const slug = entry.name.replace(/\.md$/, "");
    const source = fs.readFileSync(file, "utf8");
    const { data, content } = matter(source);

    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === "") {
        errors.push(`${relativeFile}: missing required frontmatter field "${field}"`);
      }
    }

    if (data.category !== category) {
      errors.push(`${relativeFile}: category must be "${category}" for the ${folder} folder`);
    }
    if (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== "string")) {
      errors.push(`${relativeFile}: tags must be an array of strings`);
    }
    if (Number.isNaN(Date.parse(String(data.date)))) {
      errors.push(`${relativeFile}: date must be a valid date`);
    }
    if (typeof data.title !== "string" || !data.title.trim()) {
      errors.push(`${relativeFile}: title must be a non-empty string`);
    }
    if (typeof data.excerpt !== "string" || !data.excerpt.trim()) {
      errors.push(`${relativeFile}: excerpt must be a non-empty string`);
    }
    if (!content.trim()) {
      errors.push(`${relativeFile}: Markdown body is empty`);
    }
    if (slugs.has(slug)) {
      errors.push(`${relativeFile}: duplicate slug "${slug}"`);
    }
    slugs.add(slug);
  }
}

if (checked === 0) errors.push("No Markdown posts were found in content/posts");

if (errors.length > 0) {
  console.error(`Markdown content validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${checked} Markdown posts across ${categories.size} categories.`);
