import { useState } from "react"
import { Pause, Play } from "lucide-react"
import { news } from "@/data/news.generated"
import { copy } from "@/content/copy"
import { fmtDate } from "@/lib/format"

const MAX = 10

function Items({ dup }: { dup?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" {...(dup ? { "aria-hidden": true, inert: true } : {})}>
      {news.slice(0, MAX).map((n) => (
        <li key={n.slug} className="shrink-0 pr-10">
          <a href={`tin-tuc/${n.slug}/`} className="inline-flex items-center gap-2 whitespace-nowrap py-2.5 text-sm font-semibold hover:underline">
            <span className="font-mono text-xs font-bold text-ember">{fmtDate(n.date)}</span>
            {n.title}
          </a>
        </li>
      ))}
    </ul>
  )
}

/** Băng tin một dòng chạy ngang liên tục; dừng khi rê chuột, focus, chạm giữ hoặc bấm nút. */
export function NewsTicker() {
  const [paused, setPaused] = useState(false)
  const [touching, setTouching] = useState(false)
  if (news.length === 0) return null

  return (
    <div
      id="news-ticker"
      role="region"
      aria-label={copy.news.tickerRegion}
      data-paused={paused || touching}
      className="news-ticker border-b border-ink bg-ink text-primary-foreground"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <span className="shrink-0 rounded-[3px] bg-ember px-2 py-0.5 text-xs font-extrabold text-white">{copy.news.tickerLabel}</span>
        <div
          className="news-viewport min-w-0 flex-1 overflow-hidden"
          onPointerDown={(e) => e.pointerType === "touch" && setTouching(true)}
          onPointerUp={() => setTouching(false)}
          onPointerCancel={() => setTouching(false)}
        >
          <div className="news-track flex w-max" style={{ "--news-dur": `${Math.max(30, Math.min(news.length, MAX) * 9)}s` } as React.CSSProperties}>
            <Items />
            <span className="news-dup flex">
              <Items dup />
            </span>
          </div>
        </div>
        <button
          id="news-ticker-pause"
          type="button"
          aria-pressed={paused}
          aria-label={paused ? copy.news.play : copy.news.pause}
          onClick={() => setPaused((v) => !v)}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/30 hover:bg-white/10"
        >
          {paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
    </div>
  )
}
