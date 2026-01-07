export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <p>© {new Date().getFullYear()} Personal Blog. Built with Next.js and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}

