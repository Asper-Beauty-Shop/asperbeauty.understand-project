import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ReactMarkdown from "react-markdown";
import changelogMd from "@/content/toolingChangelog.md?raw";

export default function Changelog() {
  return (
    <div className="min-h-screen bg-[hsl(var(--asper-stone))] overflow-auto">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <article className="prose prose-sm max-w-none">
          <div className="rounded-lg bg-[hsl(var(--polished-white))] border border-[hsl(var(--polished-gold))]/30 shadow-sm p-6 md:p-10 text-asper-ink">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="font-display text-2xl md:text-3xl text-burgundy mb-6">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="font-display text-xl md:text-2xl text-burgundy mt-8 mb-3">
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p className="text-asper-ink-muted leading-relaxed mb-2">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 space-y-1 text-asper-ink-muted mb-4">
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-burgundy hover:text-burgundy-dark underline"
                  >
                    {children}
                  </a>
                ),
                hr: () => <hr className="border-rose-clay/30 my-6" />,
              }}
            >
              {changelogMd}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
