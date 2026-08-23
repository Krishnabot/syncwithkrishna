import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Code2, Gamepad2, Layers3, Smartphone, Sparkles, Workflow } from "lucide-react";

const services = [
  { icon: Code2, title: "Web development", text: "Fast, accessible websites and web apps built to turn ambitious ideas into dependable products." },
  { icon: Gamepad2, title: "Game development", text: "Playful, polished game experiences—from mechanics and prototypes to production-ready builds." },
  { icon: Layers3, title: "UI/UX engineering", text: "Thoughtful interfaces that connect strong visual systems with clean, maintainable frontend code." },
  { icon: Smartphone, title: "Responsive products", text: "Seamless experiences shaped for desktop, mobile, and every screen your customers use." },
  { icon: Workflow, title: "Product strategy", text: "Clear technical direction, practical roadmaps, and rapid validation before expensive engineering begins." },
  { icon: Sparkles, title: "Creative technology", text: "Interactive campaigns, experiments, and digital experiences designed to make your brand memorable." },
];

const projects = [
  { image: "/images/project-one.png", title: "Immersive product experience", tag: "Web development" },
  { image: "/images/project-two.png", title: "Interactive campaign platform", tag: "Creative development" },
  { image: "/images/project-three.png", title: "Playful digital world", tag: "Game development" },
];

export default function Home() {
  return (
    <main>
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="site-header shell">
        <Link className="brand" href="#home" aria-label="Sync with Krishna home"><Image src="/images/brand-mark.png" alt="" width={40} height={40} priority /><span>Sync with Krishna</span></Link>
        <nav aria-label="Primary navigation"><Link href="#home">Home</Link><Link href="#services">Services</Link><Link href="#work">Work</Link><Link href="#about">About</Link></nav>
        <Link className="outline-button" href="#contact">Let&apos;s talk</Link>
      </header>
      <section className="hero shell" id="home">
        <div className="hero-copy"><p className="eyebrow">Independent digital studio</p><h1>I build digital products people remember.</h1><p className="lede">Sync with Krishna helps teams turn ideas into sharp websites, thoughtful applications, and engaging games—designed with care and engineered to last.</p><Link className="primary-button" href="#services">Explore my services <ArrowUpRight size={22} /></Link></div>
        <div className="hero-art" aria-label="Creative developer portrait"><div className="hero-frame frame-back" /><div className="hero-frame frame-front" /><Image src="/images/hero-person.png" alt="Creative developer ready to collaborate" fill priority sizes="(max-width: 900px) 90vw, 48vw" /><span className="shape plus">+</span><span className="shape rings" /></div>
      </section>
      <section className="intro shell" id="about"><h2>A practical creative partner for your next big idea.</h2><p>I bring design awareness and engineering depth to the same table. That means fewer handoffs, faster decisions, and a product that feels as good as it works.</p></section>
      <section className="studio-visual shell"><Image src="/images/studio-team.png" alt="A creative team collaborating in a modern studio" fill sizes="(max-width: 900px) 92vw, 1200px" /><div className="play" aria-hidden="true">▶</div></section>
      <section className="services shell" id="services"><p className="eyebrow">Capabilities</p><h2>Everything you need to ship something excellent.</h2><div className="service-grid">{services.map(({ icon: Icon, title, text }) => <article className="service" key={title}><div className="service-icon"><Icon size={30} strokeWidth={1.7} /></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="work shell" id="work"><p className="eyebrow">Selected work</p><h2>Built to look distinct.<br />Made to perform.</h2><div className="project-grid">{projects.map((project, index) => <article className={`project project-${index + 1}`} key={project.title}><div className="project-image"><Image src={project.image} alt="" fill sizes="(max-width: 760px) 90vw, 31vw" /></div><p>{project.tag}</p><h3>{project.title}</h3></article>)}</div></section>
      <section className="contact" id="contact"><div className="shell contact-inner"><div><p className="eyebrow">Start a project</p><h2>Have something worth building?</h2><p>Tell me what you&apos;re working on, where you&apos;re stuck, and what a great outcome looks like.</p></div><a className="primary-button" href="mailto:hello@syncwithkrishna.com">hello@syncwithkrishna.com <ArrowUpRight size={22} /></a></div></section>
      <footer className="shell"><Link className="brand" href="#home"><Image src="/images/brand-mark.png" alt="" width={36} height={36} /><span>Sync with Krishna</span></Link><div><Link href="#services">Services</Link><Link href="#work">Work</Link><Link href="#contact">Contact</Link></div><p>© {new Date().getFullYear()} Sync with Krishna.</p></footer>
    </main>
  );
}
