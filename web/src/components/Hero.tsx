import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { MediaSlot } from "@/components/MediaSlot"
import { ASET, RSET, compose } from "@/lib/plan"
import { copy } from "@/content/copy"

export function Hero() {
  const svg = useMemo(() => compose({ t: 120, pos: 30, layers: { smoke: true, people: true } }), [])
  return (
    <section id="gioi-thieu" aria-labelledby="hero-title" className="border-b border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:py-20">
        <div className="lg:col-span-6">
          <p className="mb-5 inline-flex items-center gap-2 border-l-4 border-ember pl-3 text-sm font-semibold text-ink/80">{copy.hero.eyebrow}</p>
          <h1 id="hero-title" className="text-[2.1rem] font-extrabold sm:text-5xl lg:text-[3.25rem]">
            {copy.hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">{copy.hero.lead}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full bg-ember px-7 text-white hover:bg-ember-dark">
              <a href="#dang-ky">{copy.cta.register}</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-ink/30 bg-transparent px-7">
              <a href="#mo-phong">{copy.cta.simulator}</a>
            </Button>
          </div>
          <dl className="mt-10 grid gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-3">
            {copy.hero.facts.map((f) => (
              <div key={f.k}>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{f.k}</dt>
                <dd className="mt-1 text-sm font-semibold">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-4 lg:col-span-6">
          <div className="rounded-[4px] border border-ink/80 bg-card p-2.5 shadow-[6px_6px_0_0_hsl(var(--ink)/0.9)]">
            <div className="mb-2 flex items-center justify-between gap-2 px-0.5 text-[11px] font-bold">
              <span className="rounded-[3px] bg-[#0a1a2f] px-2 py-1 text-[#7fd6ff]">CAD/Revit</span>
              <span className="rounded-[3px] bg-teal-soft px-2 py-1 text-teal">PyroSim + Pathfinder</span>
            </div>
            <div
              id="hero-plan"
              role="img"
              aria-label="Mặt bằng tầng 1: nửa trái là bản vẽ CAD thô, nửa phải là mô hình mô phỏng có khói và người thoát nạn"
              className="overflow-hidden rounded-[2px] bg-[#0a1a2f] [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
            <p className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-0.5 text-xs text-muted-foreground">
              <span>{copy.hero.cardNote}</span>
              <span className="font-mono font-semibold text-foreground">
                ASET {ASET} s · RSET {RSET} s
              </span>
            </p>
          </div>
          <MediaSlot id="hero-video" className="rounded-[4px] border border-border bg-card p-2.5" eager />
        </div>
      </div>
    </section>
  )
}
