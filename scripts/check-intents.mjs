import assert from "node:assert/strict";
import { resolveIntent } from "../src/lib/intent-engine.ts";

const cases = [
  ["whoami", "profile"], ["Who are you?", "profile"], ["What's your name?", "profile"], ["Tell me about Krishna", "profile"],
  ["skills", "skills"], ["What technologies do you use?", "skills"], ["Do you know React?", "skills"], ["What backend technologies do you use?", "skills"],
  ["projects", "projects"], ["Show me your work", "projects"], ["What have you built?", "projects"],
  ["services", "services"], ["Can you build a website for me?", "services"],
  ["experience", "experience"], ["Where have you worked?", "experience"],
  ["Who do you work for?", "experience"], ["Tell me about Sampo", "experience"],
  ["contact", "contact"], ["What's your email?", "contact"], ["How can I reach you?", "contact"],
  ["What is your phone number?", "contact"],
  ["interests", "interests"], ["What do you love?", "interests"], ["What are your hobbies?", "interests"],
  ["Do you like cinema?", "interests"], ["Can we talk about psychology?", "interests"],
  ["help", "help"], ["download", "download"], ["clear", "clear"], ["Explain quantum chromodynamics", "unknown"],
];

for (const [query, expected] of cases) assert.equal(resolveIntent(query).intent, expected, query);
console.log("Intent checks passed:", cases.length);
