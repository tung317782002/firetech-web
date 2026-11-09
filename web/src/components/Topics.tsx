import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { MediaSlot } from "@/components/MediaSlot"
import { Chips, Section, SectionHead, type ChipOption } from "@/components/shared"
import { topics, type Topic } from "@/data/topics"
import { config } from "@/data/config"
import { copy } from "@/content/copy"
import { copyWithToast } from "@/lib/utils-app"
import { cn } from "@/lib/utils"

const ALL = "all"

function opts(values: string[]): ChipOption<string>[] {
  return [{ value: ALL, label: copy.topics.filters.all }, ...values.map((v) => ({ value: v, label: v }))]
}

const uniq = <T,>(a: T[]) => a.filter((v, i) => a.indexOf(v) === i)

function topicText(t: Topic): string {
  return [
    `Đề tài: ${t.title}`,
    `Lĩnh vực: ${t.field} · Cấp: ${t.level}`,
    `Phần mềm: ${t.tools.join(", ")}`,
    `Nội dung: ${t.summary}`,
    `Kết quả cần đạt: ${t.outcomes.join("; ")}`,
    `Tiêu chuẩn tham chiếu: ${t.standards}`,
    `Nguồn: ${config.brand.domain}`,
  ].join("\n")
}

export function Topics({ onRegister }: { onRegister: (planId: string, note: string) => void }) {
  const [field, setField] = useState(ALL)
  const [level, setLevel] = useState(ALL)
  const [tool, setTool] = useState(ALL)

  const fieldOpts = useMemo(() => opts(uniq(topics.map((t) => t.field))), [])
  const levelOpts = useMemo(() => opts(uniq(topics.map((t) => t.level))), [])
  const toolOpts = useMemo(() => opts(uniq(topics.flatMap((t) => t.tools))), [])

  const shown = topics.filter(
    (t) => (field === ALL || t.field === field) && (level === ALL || t.level === level) && (tool === ALL || t.tools.includes(tool as Topic["tools"][number])),
  )

  return (
    <Section id="de-tai" labelledBy="dt-title">
      <SectionHead id="dt-title" title={copy.topics.title} intro={copy.topics.intro} />

      <div className="flex flex-col gap-3" role="group" aria-label="Lọc đề tài">
        <Chips id="topic-field" label={copy.topics.filters.field} options={fieldOpts} value={field} onChange={setField} />
        <Chips id="topic-level" label={copy.topics.filters.level} options={levelOpts} value={level} onChange={setLevel} />
        <Chips id="topic-tool" label={copy.topics.filters.tool} options={toolOpts} value={tool} onChange={setTool} />
      </div>
      <p id="topic-count" role="status" aria-live="polite" className="my-5 min-h-6 text-sm text-muted-foreground">
        {shown.length ? `Hiển thị ${shown.length} / ${topics.length} đề tài` : copy.topics.none}
      </p>

      <div id="topic-list" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((t) => (
          <article key={t.id} className="topic flex flex-col overflow-hidden rounded-[10px] border border-border bg-card transition-shadow hover:shadow-[4px_4px_0_0_hsl(var(--ink)/0.85)]">
            <MediaSlot id={`topic-${t.id}`} compact />
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-3 flex flex-wrap gap-1.5">
                <span className={cn("rounded-[3px] px-2 py-0.5 text-xs font-bold", t.field === "PCCC" ? "bg-ember-soft text-ember-dark" : "bg-teal-soft text-teal")}>{t.field}</span>
                <span className="rounded-[3px] bg-secondary px-2 py-0.5 text-xs font-bold">{t.level}</span>
                {t.tools.map((x) => (
                  <span key={x} className="rounded-[3px] bg-secondary px-2 py-0.5 font-mono text-xs font-semibold">
                    {x}
                  </span>
                ))}
              </div>
              <h3 className="text-[17px] font-bold leading-snug">{t.title}</h3>
              <p className="mt-2 text-[15px] text-muted-foreground">{t.summary}</p>
              <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{copy.topics.outcomes}</p>
              <ul className="list-disc space-y-0.5 pl-5 text-sm">
                {t.outcomes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                {copy.topics.standards}
                {t.standards}
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                <Button type="button" variant="outline" size="sm" className="rounded-full border-ink/30 bg-transparent" onClick={() => copyWithToast(topicText(t))}>
                  {copy.topics.copy}
                </Button>
                <Button type="button" size="sm" className="rounded-full" onClick={() => onRegister(config.plans[0].id, copy.topics.prefix + t.title)}>
                  {copy.topics.enroll}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
