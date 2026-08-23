import { ExternalLink } from "lucide-react";
import type { KnowledgeRecord, TerminalEntry } from "@/lib/terminal-types";

const HELP_ROWS = [
  ["whoami", "Who is Krishna?"], ["skills", "Technical capabilities"], ["projects", "Selected work"],
  ["experience", "Professional experience"], ["services", "What Krishna can build"], ["contact", "Get in touch"],
  ["interests", "Beyond programming"], ["home", "Return to welcome"], ["clear", "Clear terminal"],
] as const;

function SafeLink({ label, url }: { label: string; url: string }) {
  const external = url.startsWith("http");
  return <a className="terminal-link" href={url} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{label}<ExternalLink size={14} aria-hidden="true" /></a>;
}

function KnowledgeResponse({ record }: { record: KnowledgeRecord }) {
  return (
    <div className="record">
      <div className="record-heading"><span>✓</span><div><p>{record.title.toUpperCase()}</p><small>RECORD://{record.id.toUpperCase()}</small></div></div>
      <p className="summary">{record.summary}</p>
      {record.body && <div className="record-body">{record.body.split(/\n\n+/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>}
      {record.facts && <dl className="facts">{record.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}
      {record.groups && <div className="groups">{record.groups.map((group) => <section key={group.title}><h3>{group.title}</h3><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></section>)}</div>}
      {record.projects && <div className="projects">{record.projects.map((project, index) => <article key={project.name}><p className="project-index">[{String(index + 1).padStart(2, "0")}] {project.status ?? "RECORD"}</p><h3>{project.name}</h3><p>{project.description}</p><div className="tech-list">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>{project.links?.length ? <div className="record-links">{project.links.map((link) => <SafeLink key={link.url} {...link} />)}</div> : null}</article>)}</div>}
      {record.links?.length ? <div className="record-links">{record.links.map((link) => <SafeLink key={link.url} {...link} />)}</div> : null}
      {record.todo?.length ? <details className="todo"><summary>Missing data / TODO</summary><ul>{record.todo.map((item) => <li key={item}>{item}</li>)}</ul></details> : null}
    </div>
  );
}

export default function TerminalOutput({ entry }: { entry: TerminalEntry }) {
  if (entry.intent === "help") return <div className="record help"><div className="record-heading"><span>?</span><div><p>AVAILABLE COMMANDS</p><small>NATURAL LANGUAGE ALSO ACCEPTED</small></div></div><dl>{HELP_ROWS.map(([command, description]) => <div key={command}><dt>{command}</dt><dd>{description}</dd></div>)}</dl><p className="summary">Ask naturally—for example, “What technologies do you use?” or “How can I reach you?”</p></div>;
  if (entry.intent === "unknown") return <div className="record unknown"><div className="record-heading"><span>!</span><div><p>QUERY NOT RESOLVED</p><small>LOCAL INTENT ENGINE</small></div></div><p className="summary">{entry.message}</p></div>;
  if (entry.record) return <KnowledgeResponse record={entry.record} />;
  return null;
}
