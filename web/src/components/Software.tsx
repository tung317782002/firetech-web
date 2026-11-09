import { MediaSlot } from "@/components/MediaSlot"
import { Section, SectionHead } from "@/components/shared"
import { copy } from "@/content/copy"
import { cn } from "@/lib/utils"

const TONE = {
  ember: "bg-ember-soft text-ember-dark",
  teal: "bg-teal-soft text-teal",
  ink: "bg-ink text-primary-foreground",
} as const

export function Software() {
  return (
    <Section id="phan-mem" labelledBy="pm-title" className="border-y border-border bg-secondary/50">
      <SectionHead id="pm-title" title={copy.software.title} intro={copy.software.intro} />
      <div className="grid gap-5 md:grid-cols-3">
        {copy.software.items.map((s) => (
          <article key={s.name} className="flex flex-col overflow-hidden rounded-[10px] border border-border bg-card">
            <MediaSlot id={s.slot} compact />
            <div className="flex flex-1 flex-col p-5">
              <span className={cn("mb-3 w-fit rounded-[3px] px-2 py-1 text-xs font-bold", TONE[s.tone])}>{s.tag}</span>
              <h3 className="text-xl font-extrabold">{s.name}</h3>
              <p className="mt-2 text-[15px] text-muted-foreground">{s.body}</p>
              <p className="mt-auto pt-3 text-sm font-semibold">{s.gives}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-6 max-w-3xl text-sm text-muted-foreground">{copy.software.legal}</p>
    </Section>
  )
}
