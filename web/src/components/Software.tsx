import { MediaSlot } from "@/components/MediaSlot"
import { Section, SectionHead, Tick } from "@/components/shared"
import { copy } from "@/content/copy"
import { cn } from "@/lib/utils"

const TONE = {
  ember: "bg-ember-soft text-ember-dark",
  teal: "bg-teal-soft text-teal",
  ink: "bg-ink text-primary-foreground",
} as const

export function Software() {
  const s = copy.software
  return (
    <Section id="cong-cu" labelledBy="pm-title" className="border-y border-border bg-secondary/50">
      <SectionHead id="pm-title" title={s.title} intro={s.intro} />
      <div className="grid gap-5 md:grid-cols-3">
        {s.items.map((it) => (
          <article key={it.name} className="flex flex-col overflow-hidden rounded-[10px] border border-border bg-card">
            <MediaSlot id={it.slot} compact />
            <div className="flex flex-1 flex-col p-5">
              <span className={cn("mb-3 w-fit rounded-[3px] px-2 py-1 text-xs font-bold", TONE[it.tone])}>{it.tag}</span>
              <h3 className="text-xl font-extrabold">{it.name}</h3>
              {it.paras.map((p) => (
                <p key={p} className="mt-2 text-[15px] text-muted-foreground">
                  {p}
                </p>
              ))}
              {it.points.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {it.points.map((p) => (
                    <Tick key={p}>{p}</Tick>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="mt-6 rounded-[10px] border border-ink/80 bg-card p-5 shadow-[6px_6px_0_0_hsl(var(--ink)/0.9)] sm:p-6">
        <h3 className="text-xl font-extrabold">{s.together.title}</h3>
        <p className="mt-2 max-w-3xl text-base">{s.together.text}</p>
      </div>
    </Section>
  )
}
