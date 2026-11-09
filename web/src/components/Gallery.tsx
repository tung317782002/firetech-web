import { MediaSlot } from "@/components/MediaSlot"
import { Section, SectionHead } from "@/components/shared"
import { copy } from "@/content/copy"

export function Gallery() {
  return (
    <Section id="ket-qua" labelledBy="kq-title" className="border-y border-border bg-secondary/50">
      <SectionHead id="kq-title" title={copy.gallery.title} intro={copy.gallery.intro} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <MediaSlot key={i} id={`result-${i + 1}`} compact className="rounded-[4px] border border-border bg-card p-1.5" />
        ))}
      </div>
    </Section>
  )
}
