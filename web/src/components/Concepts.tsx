import { MediaSlot } from "@/components/MediaSlot"
import { Section, SectionHead, Tick } from "@/components/shared"
import { copy } from "@/content/copy"

const c = copy.concepts

function Q({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <article id={id} aria-labelledby={`${id}-t`} className="scroll-mt-24 border-t border-border py-10 first:border-t-0 first:pt-0">
      <p className="font-mono text-sm font-bold text-ember">Câu hỏi {n}</p>
      <h3 id={`${id}-t`} className="mb-4 mt-1 text-2xl font-extrabold sm:text-[1.7rem]">
        {title}
      </h3>
      {children}
    </article>
  )
}

export function Concepts() {
  return (
    <Section id="mo-phong-chay" labelledBy="mp-title">
      <SectionHead id="mp-title" title={c.title} />

      <Q id="cau-hoi-1" n="1" title={c.q1.title}>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="max-w-xl">
            <p className="text-base sm:text-lg">{c.q1.lead}</p>
            <p className="mb-2 mt-5 text-sm font-bold">{c.q1.answersLabel}</p>
            <ul className="space-y-2">
              {c.q1.answers.map((a) => (
                <Tick key={a}>{a}</Tick>
              ))}
            </ul>
            <p className="mb-3 mt-6 text-sm font-bold">{c.q1.clocksLabel}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {c.q1.clocks.map((k) => (
                <li key={k.term} className="rounded-[10px] border border-border bg-card p-4 text-[15px]">
                  <strong className="font-mono text-lg font-extrabold text-ember-dark">{k.term}</strong> {k.text}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[15px] text-muted-foreground">{c.q1.closing}</p>
          </div>
          <div>
            <MediaSlot id="concepts-aset-rset" className="overflow-hidden rounded-[8px] border border-border bg-card" />
            <p className="mt-2 text-xs text-muted-foreground">{c.figureNote}</p>
          </div>
        </div>
      </Q>

      <Q id="cau-hoi-2" n="2" title={c.q2.title}>
        <p className="max-w-2xl text-base sm:text-lg">{c.q2.lead}</p>
        <ul className="my-5 grid gap-3 sm:grid-cols-2">
          {c.q2.items.map((it, i) => (
            <li key={it.term} className="rounded-[10px] border border-border bg-card p-5">
              <p className="font-mono text-xs font-bold text-ember">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-1 text-[15px]">
                <strong>{it.term}:</strong> {it.text}
              </p>
            </li>
          ))}
        </ul>
        <p className="max-w-2xl border-l-4 border-ember pl-4 text-base font-semibold">{c.q2.closing}</p>
      </Q>

      <Q id="cau-hoi-3" n="3" title={c.q3.title}>
        <p className="mb-5 max-w-2xl text-base sm:text-lg">{c.q3.lead}</p>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <MediaSlot id="concepts-video" className="self-start overflow-hidden rounded-[8px] border border-border bg-card" />
          <ul className="grid grid-cols-2 gap-3">
            {c.q3.items.map((it) => (
              <li key={it.slot} className="relative flex overflow-hidden rounded-[8px] border border-border bg-card">
                <MediaSlot id={it.slot} compact className="w-full lg:h-full lg:[&>div]:!aspect-auto lg:[&>div]:h-full" />
                <span className="absolute bottom-2 left-2 rounded-[4px] bg-ink/85 px-2 py-1 text-xs font-bold text-primary-foreground">{it.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.q3.items.map((it) => (
            <li key={it.slot} className="text-sm">
              <strong className="block">{it.label}</strong>
              <span className="text-muted-foreground">{it.text}</span>
            </li>
          ))}
        </ul>
      </Q>
    </Section>
  )
}
