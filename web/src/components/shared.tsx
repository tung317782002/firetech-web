import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Section({ id, className, children, labelledBy }: { id?: string; className?: string; children: ReactNode; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("py-16 sm:py-20", className)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  )
}

/** Tiêu đề mục căn trái, kèm đoạn dẫn. */
export function SectionHead({ id, title, intro, className }: { id: string; title: string; intro?: string; className?: string }) {
  return (
    <header className={cn("mb-8 max-w-2xl sm:mb-10", className)}>
      <h2 id={id} className="text-3xl font-extrabold sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-3 text-base text-muted-foreground sm:text-lg">{intro}</p>}
    </header>
  )
}

export interface ChipOption<T extends string> {
  value: T
  label: string
}

/** Nhóm nút lọc chọn một giá trị. Gắn id cho vùng chứa để dễ kiểm thử. */
export function Chips<T extends string>({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string
  label: string
  options: ChipOption<T>[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span id={`${id}-label`} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div id={id} role="group" aria-labelledby={`${id}-label`} className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "min-h-9 rounded-full border px-3.5 text-sm font-semibold transition-colors",
              value === o.value ? "border-ink bg-ink text-primary-foreground" : "border-input bg-card hover:border-ink/60",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Tick({ children }: { children: ReactNode }) {
  return (
    <li className="relative pl-6 text-[15px] leading-relaxed">
      <span aria-hidden="true" className="absolute left-0 top-[0.45em] h-3 w-3 rounded-full bg-teal-soft ring-1 ring-teal/60" />
      <span aria-hidden="true" className="absolute left-[3px] top-[calc(0.45em+3px)] h-1.5 w-1.5 rounded-full bg-teal" />
      {children}
    </li>
  )
}
