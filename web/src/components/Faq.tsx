import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Section, SectionHead } from "@/components/shared"
import { copy } from "@/content/copy"

export function Faq() {
  return (
    <Section id="hoi-dap" labelledBy="faq-title" className="border-t border-border bg-secondary/50">
      <div className="max-w-3xl">
        <SectionHead id="faq-title" title={copy.faq.title} />
        <Accordion type="single" collapsible className="grid gap-2.5">
          {copy.faq.items.map((f, i) => (
            <AccordionItem key={f.q} value={`q${i}`} className="rounded-[8px] border border-border bg-card px-5">
              <AccordionTrigger className="py-4 text-left text-base font-bold hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-[15px] text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  )
}
