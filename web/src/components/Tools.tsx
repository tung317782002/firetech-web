import { copy } from "@/content/copy"

/** Hàng phần mềm và tiêu chuẩn dưới hero. */
export function Tools() {
  return (
    <div className="border-b border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{copy.tools.label}</p>
        <ul className="flex flex-wrap gap-2" aria-label={copy.tools.label}>
          {copy.tools.items.map((t) => (
            <li key={t} className="rounded-[4px] border border-ink/70 bg-card px-3 py-1 font-mono text-[13px] font-semibold">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
