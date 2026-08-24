"use client";

import { useId, useMemo, useState } from "react";
import { applyInference, buildKnowledgeGraph, getIncoming, getOutgoing } from "@/lib/graph";

const GRAPH = applyInference(buildKnowledgeGraph());
const COLORS: Record<string, string> = { person: "#5eea98", project: "#c8e6d4", technology: "#72a889", company: "#d7b878", domain: "#76a6b2", service: "#b59ad2", interest: "#d09eae", role: "#9ac7a8" };

export default function GraphExplorer({ initialFocusId }: { initialFocusId: string }) {
  const [focusId, setFocusId] = useState(initialFocusId);
  const titleId = useId(); const descriptionId = useId();
  const focus = GRAPH.nodeById.get(focusId) ?? GRAPH.nodeById.get("person:krishna")!;
  const relationships = useMemo(() => [...getOutgoing(GRAPH, focus.id).map((edge) => ({ edge, node: GRAPH.nodeById.get(edge.to)!, direction: "out" as const })), ...getIncoming(GRAPH, focus.id).map((edge) => ({ edge, node: GRAPH.nodeById.get(edge.from)!, direction: "in" as const }))].filter((item, index, all) => item.node && all.findIndex((candidate) => candidate.node.id === item.node.id) === index).slice(0, 12), [focus.id]);
  const neighbors = relationships.map((relationship) => relationship.node);
  const positioned = neighbors.map((node, index) => { const angle = (Math.PI * 2 * index) / Math.max(neighbors.length, 1) - Math.PI / 2; return { node, x: 300 + Math.cos(angle) * 215, y: 220 + Math.sin(angle) * 155 }; });
  const choose = (id: string) => setFocusId(id);
  return <section className="graph-explorer" aria-label="Interactive knowledge graph">
    <div className="graph-toolbar"><button type="button" onClick={() => choose("person:krishna")}>[ refocus Krishna ]</button><span>{focus.type}://{focus.label}</span></div>
    <svg className="graph-map" viewBox="0 0 600 440" role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
      <title id={titleId}>Relationships around {focus.label}</title><desc id={descriptionId}>Select a node to inspect its direct relationships. The same entities and relationship names are available as buttons below.</desc>
      {positioned.map(({ node, x, y }) => <line key={`line-${node.id}`} x1="300" y1="220" x2={x} y2={y} />)}
      <g role="button" tabIndex={0} aria-label={`Selected ${focus.type} ${focus.label}`} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") choose(focus.id); }}><circle cx="300" cy="220" r="40" fill={COLORS[focus.type]} /><text x="300" y="224">{focus.label.slice(0, 18)}</text></g>
      {positioned.map(({ node, x, y }) => <g key={node.id} role="button" tabIndex={0} aria-label={`Refocus on ${node.type} ${node.label}`} onClick={() => choose(node.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") choose(node.id); }}><circle cx={x} cy={y} r="29" fill={COLORS[node.type]} /><text x={x} y={y + 4}>{node.label.slice(0, 14)}</text></g>)}
    </svg>
    <div className="graph-details"><p>RELATED://{focus.label.toUpperCase()}</p><div>{relationships.map(({ node, edge, direction }) => <button type="button" key={node.id} onClick={() => choose(node.id)}><span>{direction === "out" ? edge.relation : `← ${edge.relation}`}</span> {node.label}</button>)}</div></div>
  </section>;
}
