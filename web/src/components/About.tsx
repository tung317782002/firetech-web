import { MediaSlot } from "@/components/MediaSlot"
import { Section, Tick } from "@/components/shared"
import { copy } from "@/content/copy"

const a = copy.about

export function About() {
  return (
    <Section id="chung-toi" labelledBy="ct-title" className="border-t border-border">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
        <div>
          <p className="mb-3 border-l-4 border-ember pl-3 text-sm font-semibold text-ink/80">{a.label}</p>
          <h2 id="ct-title" className="text-3xl font-extrabold sm:text-4xl">
            {a.title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">{a.lead}</p>
          <h3 className="mb-2 mt-7 text-xl font-extrabold">{a.doTitle}</h3>
          <ul className="space-y-2.5">
            {a.does.map((d) => (
              <Tick key={d}>{d}</Tick>
            ))}
          </ul>
          <MediaSlot id="about-team" className="mt-7 max-w-xl rounded-[4px] border border-border bg-card p-2" />
        </div>

        <div className="grid content-start gap-4">
          {[a.mission, a.vision].map((m) => (
            <div key={m.label} className="rounded-[10px] border border-ink/80 bg-card p-5 shadow-[4px_4px_0_0_hsl(var(--ink)/0.9)]">
              <p className="text-xs font-bold uppercase tracking-wider text-ember-dark">{m.label}</p>
              <p className="mt-1.5 text-[17px] font-semibold leading-snug">{m.text}</p>
            </div>
          ))}
          <div className="rounded-[10px] border border-border bg-card p-5">
            <h3 className="mb-3 text-xl font-extrabold">{a.valuesTitle}</h3>
            <ul className="space-y-3">
              {a.values.map((v) => (
                <Tick key={v.term}>
                  <strong>{v.term}:</strong> {v.text}
                </Tick>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  )
}
