import { useEffect, useRef, useState } from "react"
import { docs } from "@/data/library"
import { topics } from "@/data/topics"
import { copy } from "@/content/copy"

const ITEMS = [
  { n: docs.length, l: "tài liệu mở" },
  { n: docs.filter((d) => d.type === "excel").length, l: "bảng tính Excel" },
  { n: topics.length, l: "đề tài gợi ý" },
  { n: 3, l: "phần mềm: PyroSim, FDS, Pathfinder" },
]

const REDUCE_MOTION = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

function useCountUp(target: number, start: boolean): number {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!start || REDUCE_MOTION) return
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 900)
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, start])
  return start && REDUCE_MOTION ? target : v
}

function Stat({ n, l, start }: { n: number; l: string; start: boolean }) {
  const v = useCountUp(n, start)
  return (
    <div className="flex flex-col-reverse justify-end border-t border-white/25 pt-4">
      <dt className="mt-2 font-semibold text-white/70">{l}</dt>
      <dd className="text-5xl font-extrabold leading-none tracking-tight sm:text-6xl">
        {v}
      </dd>
    </div>
  )
}

export function Stats() {
  const ref = useRef<HTMLDListElement>(null)
  const [start, setStart] = useState(!("IntersectionObserver" in window))
  useEffect(() => {
    const el = ref.current
    if (!el || start) return
    const io = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) {
        setStart(true)
        io.disconnect()
      }
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [start])

  return (
    <section aria-labelledby="stat-title" className="bg-ink py-16 text-primary-foreground sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <p className="mb-3 border-l-4 border-ember pl-3 text-sm font-semibold text-white/75">{copy.stats.eyebrow}</p>
        <h2 id="stat-title" className="max-w-xl text-3xl font-extrabold sm:text-4xl">
          {copy.stats.title}
        </h2>
        <dl id="stats" ref={ref} className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {ITEMS.map((i) => (
            <Stat key={i.l} n={i.n} l={i.l} start={start} />
          ))}
        </dl>
      </div>
    </section>
  )
}
