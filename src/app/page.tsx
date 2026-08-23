import MatrixBackground from "@/components/terminal/MatrixBackground";
import Terminal from "@/components/terminal/Terminal";
import { getKnowledgeBase } from "@/lib/knowledge";

export default function Home() {
  const knowledge = getKnowledgeBase();
  return (
    <main className="interface">
      <MatrixBackground />
      <div className="noise" aria-hidden="true" />
      <Terminal knowledge={knowledge} />
      <section className="seo-content">
        <h2>About Krishna</h2>
        {Object.values(knowledge).map((record) => <article key={record.id}><h3>{record.title}</h3><p>{record.summary}</p></article>)}
      </section>
    </main>
  );
}
