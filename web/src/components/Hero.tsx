import { Button } from "@/components/ui/button"
import { MediaSlot } from "@/components/MediaSlot"
import { copy } from "@/content/copy"

export function Hero() {
  return (
    <section id="gioi-thieu" aria-labelledby="hero-title" className="border-b border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:py-20">
        <div className="lg:col-span-7">
          <p className="mb-5 inline-flex items-center gap-2 border-l-4 border-ember pl-3 text-sm font-semibold text-ink/80">{copy.hero.eyebrow}</p>
          <h1 id="hero-title" className="text-[2rem] font-extrabold sm:text-5xl lg:text-[3.1rem]">
            {copy.hero.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">{copy.hero.lead}</p>

          <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{copy.hero.questionsLabel}</p>
          <ol id="hero-questions" className="grid max-w-2xl gap-2">
            {copy.hero.questions.map((q, i) => (
              <li key={q.id}>
                <a
                  href={`#${q.id}`}
                  className="flex items-start gap-3 rounded-[8px] border border-border bg-card px-4 py-3 text-[15px] font-semibold leading-snug hover:border-ink/60"
                >
                  <span aria-hidden="true" className="font-mono text-sm font-bold text-ember">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{q.text}</span>
                </a>
              </li>
            ))}
          </ol>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full bg-ember px-7 text-white hover:bg-ember-dark">
              <a href="#cau-hoi-1">{copy.cta.start}</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-ink/30 bg-transparent px-7">
              <a href="#tinh-huong">{copy.cta.scenarios}</a>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <MediaSlot id="hero-video" className="rounded-[4px] border border-ink/80 bg-card p-2.5 shadow-[6px_6px_0_0_hsl(var(--ink)/0.9)]" eager />
        </div>
      </div>
    </section>
  )
}
