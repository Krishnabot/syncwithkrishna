import type { KnowledgeRecord, TerminalEntry } from "@/lib/terminal-types";
import { CV_DOWNLOAD_URL, CV_VIEW_URL } from "@/lib/cv";

const HELP_ROWS = [
  ["whoami", "Who is Krishna?"], ["skills", "Technical capabilities"], ["projects", "Selected work"],
  ["experience", "Professional experience"], ["services", "What Krishna can build"], ["contact", "Get in touch"],
  ["interests", "Beyond programming"], ["home", "Return to welcome"], ["clear", "Clear terminal"],
  ["download", "Download Krishna's CV"],
] as const;

function SafeLink({ label, url }: { label: string; url: string }) {
  const external = url.startsWith("http");
  return <a className="terminal-link" href={url} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>-&gt; {label}: {url}</a>;
}

function KnowledgeResponse({ record }: { record: KnowledgeRecord }) {
  return (
    <div className="record">
      <p className="record-heading">[record://{record.id}] {record.title}</p>
      <p className="summary">{record.summary}</p>
      {record.body && <div className="record-body">{record.body.split(/\n\n+/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>}
      {record.facts && <dl className="facts">{record.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}
      {record.groups && <div className="groups">{record.groups.map((group) => <section key={group.title}><h3>-- {group.title} --</h3><ul>{group.items.map((item) => <li key={item}>* {item}</li>)}</ul></section>)}</div>}
      {record.projects && <div className="projects">{record.projects.map((project, index) => <article key={project.name}><p className="project-index">[{String(index + 1).padStart(2, "0")}] {project.name} :: {project.status ?? "record"}</p><p>{project.description}</p><p className="tech-line">stack: {project.technologies.join(" / ")}</p>{project.links?.map((link) => <SafeLink key={link.url} {...link} />)}</article>)}</div>}
      {record.links?.map((link) => <SafeLink key={link.url} {...link} />)}
      {record.todo?.length ? <details className="todo"><summary>[!] missing data / TODO</summary>{record.todo.map((item) => <p key={item}>- {item}</p>)}</details> : null}
      <p className="end-record">[end://{record.id}]</p>
    </div>
  );
}

export default function TerminalOutput({ entry }: { entry: TerminalEntry }) {
  if (entry.intent === "help") return <div className="record help"><p className="record-heading">[system://available-commands]</p><dl>{HELP_ROWS.map(([command, description]) => <div key={command}><dt>{command}</dt><dd>{description}</dd></div>)}</dl><p className="summary">You can also ask questions naturally.</p></div>;
  if (entry.intent === "download") return <div className="record"><p className="record-heading">[download://cv-requested]</p><p className="summary">CV download started in a new tab.</p><a className="terminal-link" href={CV_DOWNLOAD_URL} target="_blank" rel="noreferrer">-&gt; download CV</a><a className="terminal-link" href={CV_VIEW_URL} target="_blank" rel="noreferrer">-&gt; open CV preview</a></div>;
  if (entry.intent === "unknown") return <div className="record unknown"><p className="record-heading">[error://query-not-resolved]</p><p className="summary">{entry.message}</p></div>;
  if (entry.record) return <KnowledgeResponse record={entry.record} />;
  return null;
}
