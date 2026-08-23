import type { KnowledgeIntent, KnowledgeRecord } from "@/lib/terminal-types";

export default function SuggestionChips({ intents, knowledge, onSelect }: { intents: KnowledgeIntent[]; knowledge: Record<KnowledgeIntent, KnowledgeRecord>; onSelect: (value: string) => void }) {
  return <div className="suggestions" aria-label="Suggested questions">{intents.map((intent) => <button type="button" key={intent} onClick={() => onSelect(intent)}>{knowledge[intent].label}</button>)}</div>;
}
