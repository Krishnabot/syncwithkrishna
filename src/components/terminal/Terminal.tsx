"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CV_DOWNLOAD_URL } from "@/lib/cv";
import { answerQuestion, EMPTY_CONTEXT, type SessionContext } from "@/lib/intelligence";
import type { KnowledgeBase, KnowledgeIntent, TerminalEntry } from "@/lib/terminal-types";
import BootSequence from "./BootSequence";
import SuggestionChips from "./SuggestionChips";
import TerminalInput from "./TerminalInput";
import TerminalOutput from "./TerminalOutput";

const DEFAULT_SUGGESTIONS: KnowledgeIntent[] = ["profile", "skills", "projects", "services", "contact", "interests"];
const CONTEXTUAL: Record<KnowledgeIntent, KnowledgeIntent[]> = {
  profile: ["skills", "projects", "experience"],
  skills: ["projects", "services"],
  projects: ["skills", "contact"],
  experience: ["skills", "projects", "contact"],
  services: ["projects", "contact"],
  contact: ["projects", "interests"],
  interests: ["profile", "projects"],
};

export default function Terminal({ knowledge }: { knowledge: KnowledgeBase }) {
  const [booted, setBooted] = useState(false);
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [commands, setCommands] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const context = useRef<SessionContext>(EMPTY_CONTEXT);
  const completeBoot = useCallback(() => setBooted(true), []);

  useEffect(() => {
    if (entries.length) endRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "end" });
  }, [entries]);

  const execute = useCallback((query: string) => {
    const cleaned = query.trim();
    if (!cleaned) return;
    if (cleaned.length > 200) {
      const entry: TerminalEntry = { id: nextId.current++, query: cleaned.slice(0, 200) + "…", intent: "unknown", confidence: 0, suggestions: DEFAULT_SUGGESTIONS, message: "That query is too long for this interface. Please keep it under 200 characters and try again." };
      setEntries((current) => [...current, entry]);
      setAnnouncement("Query too long.");
      return;
    }
    setCommands((current) => [...current, cleaned]);
    const result = answerQuestion(cleaned, knowledge, context.current);
    if (result.analysis.intent === "clear" || result.analysis.intent === "home") {
      setEntries([]);
      context.current = EMPTY_CONTEXT;
      setAnnouncement(result.analysis.intent === "clear" ? "Terminal history cleared." : "Returned to terminal home.");
      return;
    }
    if (result.analysis.intent === "download") {
      const link = document.createElement("a");
      link.href = CV_DOWNLOAD_URL;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.click();
    }
    context.current = result.nextContext;
    const knowledgeIntent = result.analysis.intent as KnowledgeIntent;
    const hasRecord = Object.prototype.hasOwnProperty.call(knowledge, knowledgeIntent);
    const entry: TerminalEntry = {
      id: nextId.current++, query: cleaned, intent: result.analysis.intent, confidence: result.analysis.confidence,
      record: hasRecord && !result.response ? knowledge[knowledgeIntent] : undefined,
      suggestions: hasRecord ? CONTEXTUAL[knowledgeIntent] : DEFAULT_SUGGESTIONS,
      message: result.analysis.intent === "unknown" ? "THERE IS AS YET INSUFFICIENT DATA FOR A MEANINGFUL ANSWER" : undefined,
      intelligence: result.response,
    };
    setEntries((current) => [...current, entry]);
    setAnnouncement(result.analysis.intent === "unknown" ? "Question not understood. Suggestions are available." : "Response loaded: " + result.analysis.intent);
  }, [knowledge]);

  if (!booted) return <BootSequence onComplete={completeBoot} />;

  return (
    <section className="terminal-shell" aria-label="Krishna interactive terminal">
      <header className="terminal-header"><div><span className="terminal-mark">K</span><strong>SYNC://KRISHNA</strong></div><p><span aria-hidden="true" /> ONLINE</p></header>
      <div className="terminal-session">
        <div className="terminal-scroll">
          <div className="welcome">
            <p className="system-line">SYNC://SESSION ESTABLISHED <span>v1.0.0-local</span></p>
            <h1>Don&apos;t browse my portfolio. <em>Ask it.</em></h1>
            <p>Hello. I&apos;m Krishna&apos;s interactive digital interface.</p>
            <p>Type a question, or run <code>help</code> to list available commands.</p>
            {!entries.length && <SuggestionChips intents={DEFAULT_SUGGESTIONS} knowledge={knowledge} onSelect={execute} />}
          </div>
          <div className="history" aria-live="polite">
            {entries.map((entry) => <article className="history-entry" key={entry.id}><p className="query"><span>visitor@krishna:~$</span> {entry.query}</p><TerminalOutput entry={entry} /><SuggestionChips intents={entry.suggestions} knowledge={knowledge} onSelect={execute} /></article>)}
          </div>
          <div ref={endRef} />
        </div>
        <TerminalInput onSubmit={execute} commandHistory={commands} />
      </div>
      <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
    </section>
  );
}
