import { Button } from "@/components/ui/button"
import { MediaSlot } from "@/components/MediaSlot"
import { Section, SectionHead, Tick } from "@/components/shared"
import { config } from "@/data/config"
import { copy } from "@/content/copy"
import { fmtVND } from "@/lib/format"
import { cn } from "@/lib/utils"

export function Pricing({ onRegister }: { onRegister: (planId: string) => void }) {
  const n = config.plans.length
  return (
    <Section id="hoc-phi" labelledBy="hp-title">
      <SectionHead id="hp-title" title={copy.pricing.title} intro={copy.pricing.intro} />
      <div id="plans" data-count={n} className={cn("grid gap-6 md:grid-cols-2", n >= 3 && "lg:grid-cols-3")}>
        {config.plans.map((p) => (
          <article
            key={p.id}
            className={cn(
              "plan relative flex flex-col overflow-hidden rounded-[10px] border bg-card",
              p.featured ? "hot border-2 border-ember shadow-[6px_6px_0_0_hsl(var(--ember)/0.85)]" : "border-border",
            )}
          >
            <MediaSlot id={`course-${p.id}`} compact />
            {p.featured && p.badge && <span className="plan-badge absolute left-4 top-4 rounded-[3px] bg-ember px-2.5 py-1 text-xs font-bold text-white">{p.badge}</span>}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-2xl font-extrabold">{p.name}</h3>
              <p className="mt-1.5 text-[15px] text-muted-foreground">{p.tagline}</p>
              <p className="price mt-5 text-4xl font-extrabold leading-none tracking-tight sm:text-[2.6rem]">
                {fmtVND(p.price)} <small className="text-base font-semibold tracking-normal text-muted-foreground">{copy.pricing.unit}</small>
              </p>
              <p className="sched mt-2.5 font-mono text-sm font-semibold">{p.schedule}</p>
              <ul className="my-6 space-y-2.5">
                {p.features.map((f) => (
                  <Tick key={f}>{f}</Tick>
                ))}
              </ul>
              <Button type="button" size="lg" className={cn("mt-auto rounded-full", p.featured && "bg-ember text-white hover:bg-ember-dark")} onClick={() => onRegister(p.id)}>
                {copy.pricing.pick}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
