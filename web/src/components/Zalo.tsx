import { Button } from "@/components/ui/button"
import { MediaSlot } from "@/components/MediaSlot"
import { Section, SectionHead } from "@/components/shared"
import { config } from "@/data/config"
import { copy } from "@/content/copy"
import { cn } from "@/lib/utils"

export function Zalo() {
  const n = config.zaloGroups.length
  return (
    <Section id="zalo" labelledBy="zl-title" className="border-t border-border bg-secondary/50">
      <SectionHead id="zl-title" title={copy.zalo.title} intro={copy.zalo.intro} />
      <div id="zalo-list" data-count={n} className={cn("grid gap-5", n === 1 ? "max-w-xl" : "md:grid-cols-2 lg:grid-cols-3")}>
        {config.zaloGroups.map((g, i) => (
          <article key={g.url} className="zalo-card flex gap-5 rounded-[10px] border border-border bg-card p-6">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#0068ff] text-xl font-extrabold text-white">
                Z
              </span>
              <h3 className="text-lg font-extrabold">{g.name}</h3>
              <p className="mb-2 text-[15px] text-muted-foreground">{g.desc}</p>
              <Button asChild size="sm" className="mt-auto w-fit rounded-full">
                <a href={g.url} target="_blank" rel="noopener noreferrer">
                  {copy.zalo.join}
                </a>
              </Button>
            </div>
            {i === 0 && <MediaSlot id="zalo-qr" compact className="hidden w-28 shrink-0 self-start sm:block" />}
          </article>
        ))}
      </div>
    </Section>
  )
}
