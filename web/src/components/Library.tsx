import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MediaSlot } from "@/components/MediaSlot"
import { Chips, Section, SectionHead, type ChipOption } from "@/components/shared"
import { docs, docTags, TYPE_LABEL, type ArticleDoc, type Doc, type DocType, type FormulaDoc } from "@/data/library"
import { calcs, type CalcInput } from "@/data/calcs"
import { XLSX_FILES } from "@/data/files"
import { config } from "@/data/config"
import { copy } from "@/content/copy"
import { norm } from "@/lib/format"
import { copyWithToast } from "@/lib/utils-app"
import { cn } from "@/lib/utils"

const ALL = "all"
const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
const TYPE_ICON: Record<DocType, string> = { formula: "fx", excel: "XLS", article: "Aa" }
const TYPE_TONE: Record<DocType, string> = { formula: "bg-secondary text-ink", excel: "bg-teal-soft text-teal", article: "bg-ember-soft text-ember-dark" }

const typeOpts: ChipOption<string>[] = [{ value: ALL, label: copy.topics.filters.all }, ...(Object.keys(TYPE_LABEL) as DocType[]).map((k) => ({ value: k, label: TYPE_LABEL[k] }))]
const tagOpts: ChipOption<string>[] = [{ value: ALL, label: copy.topics.filters.all }, ...docTags.map((t) => ({ value: t, label: t }))]

function Calculator({ doc }: { doc: FormulaDoc }) {
  const spec = calcs[doc.calc]
  const [raw, setRaw] = useState<Record<string, string>>(() => Object.fromEntries(spec.inputs.map((i) => [i.id, String(i.value)])))

  const parsed = useMemo(() => {
    const vals: Record<string, number> = {}
    for (const i of spec.inputs) {
      const v = parseFloat(raw[i.id].replace(",", "."))
      if (!Number.isFinite(v) || (i.min !== undefined && v < i.min) || (i.max !== undefined && v > i.max)) return null
      vals[i.id] = v
    }
    return vals
  }, [raw, spec])

  const results = parsed ? spec.run(parsed) : null

  const field = (i: CalcInput) => {
    const id = `calc-${doc.id}-${i.id}`
    return (
      <label key={i.id} htmlFor={id} className="grid gap-1 text-[13px] font-semibold">
        {i.label}
        {i.unit ? ` (${i.unit})` : ""}
        {i.type === "select" ? (
          <select id={id} value={raw[i.id]} onChange={(e) => setRaw((r) => ({ ...r, [i.id]: e.target.value }))} className="min-h-[42px] w-full min-w-0 rounded-[6px] border border-input bg-card px-2.5">
            {i.options!.map((o) => (
              <option key={o.v} value={o.v}>
                {o.t}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type="number"
            inputMode="decimal"
            value={raw[i.id]}
            min={i.min}
            max={i.max}
            step={i.step}
            onChange={(e) => setRaw((r) => ({ ...r, [i.id]: e.target.value }))}
            className="min-h-[42px] w-full min-w-0 rounded-[6px] border border-input bg-card px-2.5"
          />
        )}
      </label>
    )
  }

  return (
    <details className="rounded-[6px] border border-border px-3.5 py-2.5">
      <summary className="cursor-pointer text-sm font-bold">Tính nhanh</summary>
      <div className="mt-3 grid gap-2.5">
        {spec.inputs.map(field)}
        <div className="calc-out grid gap-1.5 rounded-[6px] bg-teal-soft px-3 py-2.5 text-sm" aria-live="polite">
          {results ? (
            results.map((r, idx) => (
              <div key={idx} className="flex flex-wrap justify-between gap-x-3">
                <span>{r.label}</span>
                <strong className={cn("break-words", r.status === "ok" && "text-teal", r.status === "bad" && "text-destructive")}>{r.value}</strong>
              </div>
            ))
          ) : (
            <div>Hãy nhập số trong khoảng cho phép.</div>
          )}
        </div>
      </div>
    </details>
  )
}

function DocCard({ doc, onRead }: { doc: Doc; onRead: (d: ArticleDoc) => void }) {
  return (
    <article className="doc flex min-w-0 flex-col overflow-hidden rounded-[10px] border border-border bg-card">
      {doc.type === "article" && <MediaSlot id={`article-${doc.id}`} compact />}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-[6px] text-sm font-extrabold", TYPE_TONE[doc.type])}>
            {TYPE_ICON[doc.type]}
          </span>
          <h3 className="text-[17px] font-bold leading-snug">{doc.title}</h3>
        </div>
        <p className="text-[15px] text-muted-foreground">{doc.desc}</p>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-[3px] bg-secondary px-2 py-0.5 text-xs font-bold">{TYPE_LABEL[doc.type]}</span>
          {doc.tags.map((t) => (
            <span key={t} className="rounded-[3px] bg-secondary px-2 py-0.5 text-xs font-semibold">
              {t}
            </span>
          ))}
        </div>

        {doc.type === "formula" && (
          <>
            <pre className="m-0 overflow-x-auto whitespace-pre-wrap break-words rounded-[6px] bg-ink px-3.5 py-3 font-mono text-sm text-primary-foreground">{doc.formula}</pre>
            <p className="text-sm text-muted-foreground">{doc.note}</p>
            <Calculator doc={doc} />
            <div className="mt-auto pt-1">
              <Button type="button" variant="outline" size="sm" className="rounded-full border-ink/30 bg-transparent" onClick={() => copyWithToast(`${doc.formula}\n(${doc.title} – ${config.brand.domain})`)}>
                Sao chép công thức
              </Button>
            </div>
          </>
        )}
        {doc.type === "excel" && (
          <div className="mt-auto pt-1">
            <Button asChild size="sm" className="rounded-full">
              <a href={`data:${XLSX_MIME};base64,${XLSX_FILES[doc.file]}`} download={doc.file}>
                Tải xuống .xlsx
              </a>
            </Button>
          </div>
        )}
        {doc.type === "article" && (
          <div className="mt-auto pt-1">
            <Button type="button" size="sm" className="rounded-full" onClick={() => onRead(doc)}>
              Đọc bài viết ({doc.read})
            </Button>
          </div>
        )}
      </div>
    </article>
  )
}

export function Library() {
  const [q, setQ] = useState("")
  const [type, setType] = useState(ALL)
  const [tag, setTag] = useState(ALL)
  const [reading, setReading] = useState<ArticleDoc | null>(null)

  const nq = norm(q.trim())
  const shown = docs.filter((d) => {
    if (type !== ALL && d.type !== type) return false
    if (tag !== ALL && !d.tags.includes(tag as Doc["tags"][number])) return false
    if (!nq) return true
    const hay = [d.title, d.desc, d.tags.join(" "), TYPE_LABEL[d.type], d.type === "formula" ? d.formula : ""].join(" ")
    return norm(hay).includes(nq)
  })
  const filtered = q !== "" || type !== ALL || tag !== ALL

  return (
    <Section id="thu-vien" labelledBy="tv-title">
      <SectionHead id="tv-title" title={copy.library.title} intro={copy.library.intro} />

      <div className="mb-6 flex flex-col gap-3">
        <div className="relative w-full max-w-md">
          <label htmlFor="lib-search" className="sr-only">
            Tìm trong thư viện
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="lib-search"
            type="search"
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={copy.library.search}
            className="min-h-12 w-full rounded-full border border-input bg-card pl-10 pr-4"
          />
        </div>
        <Chips id="lib-type" label="Loại" options={typeOpts} value={type} onChange={setType} />
        <Chips id="lib-tag" label="Chủ đề" options={tagOpts} value={tag} onChange={setTag} />
        <div className="flex items-center gap-4">
          <p id="lib-count" role="status" aria-live="polite" className="text-sm text-muted-foreground">
            Hiển thị {shown.length} / {docs.length} tài liệu
          </p>
          <button
            id="lib-clear"
            type="button"
            hidden={!filtered}
            onClick={() => {
              setQ("")
              setType(ALL)
              setTag(ALL)
            }}
            className="text-sm font-semibold text-ember-dark underline underline-offset-4"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      <div id="lib-list" className="grid gap-5 md:grid-cols-2">
        {shown.map((d) => (
          <DocCard key={d.id} doc={d} onRead={setReading} />
        ))}
      </div>
      <p id="lib-empty" hidden={shown.length > 0} className="py-8 text-muted-foreground">
        {copy.library.empty}
      </p>

      <Dialog open={reading !== null} onOpenChange={(o) => !o && setReading(null)}>
        <DialogContent id="article-dialog" className="max-h-[calc(100vh-2rem)] w-[calc(100vw-1.5rem)] max-w-2xl overflow-y-auto">
          {reading && (
            <>
              <DialogHeader className="text-left">
                <DialogDescription id="article-meta">
                  Bài viết · {reading.read} · {reading.tags.join(", ")}
                </DialogDescription>
                <DialogTitle id="article-title" className="text-2xl font-extrabold">
                  {reading.title}
                </DialogTitle>
              </DialogHeader>
              <div id="article-body" className="space-y-4 text-[16px] leading-relaxed text-foreground/90">
                {reading.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  )
}
