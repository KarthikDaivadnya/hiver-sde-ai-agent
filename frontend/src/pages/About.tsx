const TECHNOLOGIES = [
  "React",
  "TypeScript",
  "FastAPI",
  "Python",
  "SentenceTransformers",
  "FAISS",
  "scikit-learn",
  "Groq",
  "SQLite",
];

const ARCHITECTURE = [
  "Intent classification",
  "Historical retrieval",
  "Deterministic escalation",
  "Grounded generation",
  "Safety checking",
];

export function About() {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">About</h1>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <h2 className="text-sm font-semibold text-ink">What is this?</h2>
        <p className="mt-2 text-sm leading-relaxed text-subtle">
          A historically grounded AI customer-support agent built using the
          Customer Support on Twitter dataset. It classifies a customer's
          message, retrieves similar cases from past support conversations, and
          drafts a response grounded in that history — with an explicit policy
          deciding whether to auto-handle or escalate.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <h2 className="text-sm font-semibold text-ink">Selected brand</h2>
        <span className="mt-2 inline-flex items-center rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
          AmazonHelp
        </span>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <h2 className="text-sm font-semibold text-ink">Core technologies</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {TECHNOLOGIES.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-canvas px-3 py-1 text-xs font-medium text-ink"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <h2 className="text-sm font-semibold text-ink">Architecture</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink">
          {ARCHITECTURE.map((stage, i) => (
            <span key={stage} className="flex items-center gap-2">
              <span className="rounded-lg border border-border bg-canvas px-3 py-1.5">
                {stage}
              </span>
              {i < ARCHITECTURE.length - 1 && (
                <span className="text-faint">+</span>
              )}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-warning/30 bg-warning-soft p-5">
        <h2 className="text-sm font-semibold text-ink">Important limitation</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/90">
          The system does not access live Amazon customer accounts, orders,
          payments, shipping systems, or internal support tools. Historical
          evidence is used for grounding — it is not live account data.
        </p>
      </section>
    </div>
  );
}
