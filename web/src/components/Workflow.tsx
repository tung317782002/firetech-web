import { Section, SectionHead, Tick } from "@/components/shared"
import { copy } from "@/content/copy"

export function Tools() {
  return (
    <div className="border-b border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{copy.tools.label}</p>
        <ul className="flex flex-wrap gap-2" aria-label={copy.tools.label}>
          {copy.tools.items.map((t) => (
            <li key={t} className="rounded-[4px] border border-ink/70 bg-card px-3 py-1 font-mono text-[13px] font-semibold">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function Workflow() {
  return (
    <Section labelledBy="qt-title">
      <SectionHead id="qt-title" title={copy.workflow.title} intro={copy.workflow.intro} />
      <div className="grid gap-5 md:grid-cols-3">
        {copy.workflow.steps.map((s) => (
          <article key={s.n} className="rounded-[10px] border border-border bg-card p-6">
            <p className="font-mono text-sm font-bold text-ember">{s.n}</p>
            <h3 className="mb-4 mt-1 text-xl font-extrabold">{s.title}</h3>
            <ul className="space-y-2.5">
              {s.items.map((i) => (
                <Tick key={i}>{i}</Tick>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  )
}
