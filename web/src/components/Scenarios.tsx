import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MediaSlot } from "@/components/MediaSlot"
import { Section, SectionHead, Tick } from "@/components/shared"
import { scenarios, type Scenario } from "@/data/scenarios"
import { method } from "@/data/method"
import { copy } from "@/content/copy"

const c = copy.scenarios

/** Bảng số liệu: cuộn ngang bên trong khung trên màn hình hẹp, không làm trang cuộn ngang. */
interface TableData {
  caption: string
  head: readonly string[]
  rows: readonly (readonly string[])[]
}

function DataTable({ t, className }: { t: TableData; className?: string }) {
  return (
    <div role="region" aria-label={t.caption} tabIndex={0} className={className ?? "overflow-x-auto rounded-[6px] border border-border"}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <caption className="border-b border-border bg-secondary/60 px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.caption}</caption>
        <thead>
          <tr className="bg-ink text-primary-foreground">
            {t.head.map((h) => (
              <th key={h} scope="col" className="px-3 py-2 text-[13px] font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {t.rows.map((r) => (
            <tr key={r[0]} className="border-t border-border align-top">
              {r.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="px-3 py-2.5 font-semibold">
                    {cell}
                  </th>
                ) : (
                  <td key={i} className="px-3 py-2.5">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-extrabold uppercase tracking-wider text-muted-foreground">{title}</h4>
      <ul className="space-y-2">
        {items.map((i) => (
          <Tick key={i}>{i}</Tick>
        ))}
      </ul>
    </div>
  )
}

function Detail({ s }: { s: Scenario }) {
  return (
    <div className="grid gap-6 pb-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-8">
      <div className="grid min-w-0 gap-6">
        <div>
          <h4 className="mb-2 text-sm font-extrabold uppercase tracking-wider text-muted-foreground">{c.context}</h4>
          <p className="text-[15px]">{s.context}</p>
        </div>
        <Block title={c.simulation} items={s.simulation} />
        <Block title={c.observations} items={s.observations} />
        <Block title={c.lessons} items={s.lessons} />
        {s.extra && (
          <p className="border-l-4 border-ember pl-4 text-[15px]">
            <strong>{c.extra}:</strong> {s.extra}
          </p>
        )}
        <Block title={c.basis} items={s.basis} />
        {s.table && (
          <div className="min-w-0">
            <DataTable t={s.table} />
            {s.table.note && <p className="mt-3 text-[15px] text-muted-foreground">{s.table.note}</p>}
          </div>
        )}
      </div>
      <div>
        <MediaSlot id={`scenario-${s.id}`} className="rounded-[4px] border border-border bg-card p-2" />
        <p className="mt-2 text-xs text-muted-foreground">{c.mediaLabel}</p>
      </div>
    </div>
  )
}

function Method() {
  return (
    <div id="phuong-phap" className="mt-12 grid gap-8 border-t border-border pt-10 lg:grid-cols-2 lg:gap-12">
      <div>
        <h3 className="text-2xl font-extrabold">{method.title}</h3>
        <p className="mt-3 text-[15px] text-muted-foreground">{method.intro}</p>
        <ol className="mt-4 grid gap-2.5">
          {method.stages.map((st, i) => (
            <li key={st.name} className="flex gap-3 rounded-[8px] border border-border bg-card px-4 py-3 text-[15px]">
              <span aria-hidden="true" className="font-mono text-sm font-bold text-ember">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <strong>{st.name}:</strong> {st.text}
              </span>
            </li>
          ))}
        </ol>
        <h4 className="mb-2 mt-7 text-sm font-extrabold uppercase tracking-wider text-muted-foreground">{method.rsetTitle}</h4>
        <p className="rounded-[6px] bg-ink px-3.5 py-3 font-mono text-sm text-primary-foreground">{method.rsetFormula}</p>
        <ul className="mt-3 space-y-2">
          {method.rsetParts.map((p) => (
            <Tick key={p.name}>
              <strong>{p.name}:</strong> {p.text}
            </Tick>
          ))}
        </ul>
      </div>
      <div className="min-w-0">
        <h4 className="mb-2 text-sm font-extrabold uppercase tracking-wider text-muted-foreground">{c.criteriaTitle}</h4>
        <DataTable t={method.criteria} />
        <p className="mt-4 text-[15px]">
          <strong>{c.safetyFactor}:</strong> {method.safetyFactor}
        </p>
        <p className="mt-3 text-[15px]">
          <strong>{c.references}:</strong> {method.references}
        </p>
        <p className="mt-3 text-[15px]">
          <strong>{c.software}:</strong> {method.software}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">{method.source}</p>
      </div>
    </div>
  )
}

export function Scenarios() {
  return (
    <Section id="tinh-huong" labelledBy="th-title">
      <SectionHead id="th-title" title={c.title} intro={c.intro} />
      <Accordion type="single" collapsible className="grid gap-3">
        {scenarios.map((s, i) => (
          <AccordionItem key={s.id} value={s.id} id={`th-${s.id}`} className="scenario rounded-[10px] border border-border bg-card px-4 sm:px-6">
            <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline">
              <span className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:gap-6">
                <span className="flex shrink-0 items-baseline gap-3 sm:w-64">
                  <span aria-hidden="true" className="font-mono text-sm font-bold text-ember">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg font-extrabold leading-snug">{s.name}</span>
                </span>
                <span className="grid min-w-0 flex-1 gap-1 text-[14px] font-normal text-muted-foreground">
                  <span>
                    <strong className="font-semibold text-foreground">{c.overviewContent}:</strong> {s.overview.content}
                  </span>
                  <span>
                    <strong className="font-semibold text-foreground">{c.overviewConclusion}:</strong> {s.overview.conclusion}
                  </span>
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <Detail s={s} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Method />
    </Section>
  )
}
