export default function Quote({ children, author }: { children: React.ReactNode; author?: string }) {
  return (
    <blockquote className="quote">
      {children}
      {author && <footer className="quote-author">— {author}</footer>}
    </blockquote>
  );
}

