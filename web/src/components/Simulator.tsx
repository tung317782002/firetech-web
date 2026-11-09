import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react"
import { toast } from "sonner"
import { Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section, SectionHead } from "@/components/shared"
import { config } from "@/data/config"
import { copy } from "@/content/copy"
import { ASET, K_SAFE, ROOMS, RSET, T_MAX, agents, compose, fireSmoke, hrr, renderCad, renderSim, smokeLen, stats, type Layers } from "@/lib/plan"
import { fmtNum } from "@/lib/format"
import { saveBlob } from "@/lib/utils-app"
import { cn } from "@/lib/utils"

const DEFAULTS = { t: 90, pos: 30 }
const SVG_OPEN = '<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" focusable="false" style="display:block;width:100%;height:100%">'

const clampPos = (p: number) => Math.max(0, Math.min(100, Math.round(p)))

function roomStatus(id: number, t: number): string {
  const r = ROOMS.find((x) => x.id === id)!
  if (r.fire) return `Nguồn cháy, HRR ≈ ${fmtNum(hrr(t) / 1000, 2)} MW, khói lấp đầy ${Math.round((fireSmoke(t) / 0.78) * 100)}%`
  if (r.corridor) {
    const L = smokeLen(t)
    return L > 0 ? `Khói lan khoảng ${fmtNum(Math.min(720, 2 * L) / 10, 1)} m dọc hành lang` : "Chưa có khói"
  }
  return "Chưa bị ảnh hưởng (cửa đóng, minh họa)"
}

function RoomInfo({ sel, t }: { sel: number | null; t: number }) {
  if (sel === null) return <p className="text-muted-foreground">{copy.simulator.idle}</p>
  const r = ROOMS.find((x) => x.id === sel)!
  const st = stats(t).byRoom[r.id] ?? { out: 0, total: 0 }
  const rows: [string, string][] = [
    ["Diện tích", `${fmtNum((r.w * r.h) / 100, 0)} m²`],
    ["Số người", r.corridor ? "Chỉ là lối đi" : `${st.total} người`],
    ["Đã thoát", r.corridor ? "–" : `${st.out} / ${st.total}`],
    ["Khói", roomStatus(r.id, t)],
    ["Lối ra", r.exit ? "Ra trực tiếp ngoài công trình" : r.corridor ? "Bốn lối ra quanh hành lang" : "Qua hành lang tới lối ra gần nhất"],
  ]
  return (
    <>
      <h3 className="mb-2 text-base font-extrabold">
        {r.id}. {r.name}
      </h3>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
    </>
  )
}

export function Simulator() {
  const [t, setT] = useState(DEFAULTS.t)
  const [pos, setPos] = useState(DEFAULTS.pos)
  const [layers, setLayers] = useState<Layers>({ smoke: true, people: true })
  const [sel, setSel] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [dragging, setDragging] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef(false)
  const tRef = useRef(t)
  const updateT = (n: number) => {
    tRef.current = n
    setT(n)
  }

  const cadHtml = useMemo(() => `${SVG_OPEN}${renderCad()}</svg>`, [])
  const simHtml = useMemo(() => `${SVG_OPEN}${renderSim(t, layers)}</svg>`, [t, layers])
  const st = useMemo(() => stats(t), [t])
  const roundT = Math.round(t)
  const ok = ASET >= K_SAFE * RSET

  // Phát: tăng thời gian mô phỏng 15 giây mỗi giây thực
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const n = Math.min(T_MAX, tRef.current + ((now - last) / 1000) * 15)
      last = now
      tRef.current = n
      setT(n)
      if (n >= T_MAX) setPlaying(false)
      else raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  const select = (id: number) => setSel((cur) => (cur === id ? null : id))

  const posFrom = (e: PointerEvent) => {
    const r = stageRef.current!.getBoundingClientRect()
    return ((e.clientX - r.left) / r.width) * 100
  }
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    dragRef.current = true
    setDragging(true)
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* trình duyệt không hỗ trợ: vẫn kéo được qua pointermove */
    }
    e.currentTarget.focus({ preventScroll: true })
  }
  const onMove = (e: PointerEvent) => {
    if (dragRef.current) setPos(clampPos(posFrom(e)))
  }
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    dragRef.current = false
    setDragging(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* bỏ qua */
    }
  }
  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") setPos((p) => clampPos(p - step))
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") setPos((p) => clampPos(p + step))
    else if (e.key === "Home") setPos(0)
    else if (e.key === "End") setPos(100)
    else return
    e.preventDefault()
  }

  const togglePlay = () => {
    if (!playing && tRef.current >= T_MAX) updateT(0)
    setPlaying((p) => !p)
  }

  const reset = () => {
    setPlaying(false)
    updateT(DEFAULTS.t)
    setPos(DEFAULTS.pos)
    setLayers({ smoke: true, people: true })
    setSel(null)
    toast("Đã đặt lại trình mô phỏng")
  }

  const downloadPng = () => {
    const svg = compose({ t, pos, layers }, { brand: config.brand.name, domain: config.brand.domain })
    const img = new Image()
    img.onload = () => {
      const c = document.createElement("canvas")
      c.width = 1600
      c.height = 1072
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height)
      c.toBlob((b) => {
        if (b) {
          saveBlob(b, `mo-phong-thoat-nan-t${roundT}s.png`)
          toast.success("Đã tải ảnh PNG")
        } else toast.error("Không tạo được ảnh PNG")
      }, "image/png")
    }
    img.onerror = () => toast.error("Không tạo được ảnh PNG")
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  }

  const downloadCsv = () => {
    const name = (id: number) => ROOMS.find((r) => r.id === id)!.name
    const r1 = (n: number) => Math.round(n * 10) / 10
    const rows: (string | number)[][] = [["Ma nguoi", "Phong", "Tre truoc khi di chuyen (s)", "Quang duong (m)", "Van toc (m/s)", "Thoi diem thoat (s)"]]
    for (const a of agents) rows.push([a.id, name(a.room), r1(a.pre), r1(a.len / 10), Math.round(a.sp) / 10, r1(a.exitAt)])
    rows.push([], ["RSET (s)", RSET], ["ASET minh hoa (s)", ASET])
    const csv = rows.map((r) => r.join(",")).join("\r\n")
    saveBlob(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }), "ket-qua-thoat-nan-minh-hoa.csv")
    toast.success("Đã tải file CSV")
  }

  return (
    <Section id="mo-phong" labelledBy="mp-title" className="border-y border-border bg-secondary/50">
      <SectionHead id="mp-title" title={copy.simulator.title} intro={copy.simulator.intro} />

      <div id="sim" className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
        <div className="min-w-0 rounded-[4px] border border-ink/80 bg-card p-3 shadow-[6px_6px_0_0_hsl(var(--ink)/0.9)] sm:p-4">
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-3">
            <Button id="sim-play" type="button" size="sm" aria-pressed={playing} onClick={togglePlay} className="rounded-full">
              {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
              <span id="sim-play-label">{playing ? "Dừng" : "Phát"}</span>
            </Button>
            <label htmlFor="sim-time" className="flex min-w-[200px] flex-1 basis-full items-center gap-3 text-sm font-semibold sm:basis-0">
              <span>Thời gian</span>
              <input
                id="sim-time"
                type="range"
                min={0}
                max={T_MAX}
                step={1}
                value={roundT}
                aria-describedby="sim-hud"
                onChange={(e) => updateT(Number(e.target.value))}
                className="h-7 min-w-0 flex-1 accent-ember"
              />
              <output id="sim-time-out" htmlFor="sim-time" className="min-w-[3.25rem] text-right font-mono font-bold">
                {roundT} s
              </output>
            </label>
          </div>

          <div
            id="sim-stage"
            ref={stageRef}
            style={{ "--pos": `${pos}%` } as React.CSSProperties}
            className="relative aspect-[800/480] touch-pan-y select-none overflow-hidden rounded-[2px] bg-[#0a1a2f]"
          >
            <div id="sim-cad" role="img" aria-label="Bản vẽ CAD/Revit thô, chưa có kịch bản cháy" className="absolute inset-0" dangerouslySetInnerHTML={{ __html: cadHtml }} />
            <div
              id="sim-top"
              role="img"
              aria-label="Mô hình PyroSim và Pathfinder có khói và người thoát nạn"
              className="absolute inset-0 [clip-path:inset(0_0_0_var(--pos))]"
              dangerouslySetInnerHTML={{ __html: simHtml }}
            />
            <div id="sim-hit" className="absolute inset-0 z-[2]">
              <svg viewBox="0 0 800 480" focusable="false" className="absolute inset-0 h-full w-full">
                {ROOMS.map((r) => (
                  <rect
                    key={r.id}
                    className={cn("hit-room", sel === r.id && "sel")}
                    data-room={r.id}
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={r.h}
                    tabIndex={0}
                    role="button"
                    aria-pressed={sel === r.id}
                    aria-label={`Phòng ${r.id}: ${r.name}`}
                    onClick={() => select(r.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        select(r.id)
                      }
                    }}
                  />
                ))}
                {ROOMS.map((r) => (
                  <g key={r.id} className="hit-badge">
                    <circle cx={r.x + 22} cy={r.y + 22} r={16} fill="#10131c" stroke="#fff" strokeWidth={2} />
                    <text x={r.x + 22} y={r.y + 28} textAnchor="middle" fontSize={17} fontWeight={700} fill="#fff">
                      {r.id}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <span className="pointer-events-none absolute left-2 top-2 z-[3] max-w-[46%] rounded-[3px] border border-[#7fd6ff]/40 bg-[#0a1a2f]/90 px-2 py-1 text-[10px] font-bold text-[#7fd6ff] sm:left-2.5 sm:top-2.5 sm:text-xs">
              {copy.simulator.left}
            </span>
            <span className="pointer-events-none absolute right-2 top-2 z-[3] max-w-[46%] rounded-[3px] bg-white/95 px-2 py-1 text-[10px] font-bold text-teal sm:right-2.5 sm:top-2.5 sm:text-xs">
              {copy.simulator.right}
            </span>
            <div
              id="sim-handle"
              role="slider"
              tabIndex={0}
              aria-label="So sánh bản vẽ thô và mô hình mô phỏng"
              aria-orientation="horizontal"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pos}
              aria-valuetext={`Hiển thị ${100 - pos}% mô hình mô phỏng`}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onKeyDown={onKey}
              className="absolute inset-y-0 z-[4] flex w-11 -translate-x-1/2 cursor-ew-resize touch-none items-center justify-center outline-none"
              style={{ left: "var(--pos)" }}
            >
              <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(16,19,28,0.4)]" />
              <span
                aria-hidden="true"
                className={cn(
                  "relative grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-[0_4px_16px_rgba(16,19,28,0.45)] transition-transform",
                  dragging && "scale-110 bg-ember text-white",
                )}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" focusable="false">
                  <path fill="currentColor" d="M8 7l-5 5 5 5V7zm8 0v10l5-5-5-5z" />
                </svg>
              </span>
            </div>
          </div>

          <div id="sim-rooms" role="group" aria-label="Chọn phòng" className="mt-3 flex flex-wrap gap-1.5">
            {ROOMS.map((r) => (
              <button
                key={r.id}
                type="button"
                data-room={r.id}
                aria-pressed={sel === r.id}
                onClick={() => select(r.id)}
                className={cn(
                  "room-btn inline-flex min-h-9 items-center gap-1.5 rounded-full border border-input bg-card py-0 pl-1.5 pr-3 text-sm font-semibold",
                  sel === r.id && "border-ink bg-ember-soft",
                )}
              >
                <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-ink text-xs text-primary-foreground">{r.id}</span>
                {r.name}
              </button>
            ))}
          </div>
        </div>

        <aside aria-label="Thông tin mô phỏng" className="grid min-w-0 gap-4 rounded-[4px] border border-border bg-card p-3 sm:p-4">
          <p id="sim-hud" className="break-words rounded-[3px] bg-ink px-3 py-2.5 font-mono text-sm font-bold text-primary-foreground">
            t = {roundT} s · HRR ≈ {fmtNum(hrr(t) / 1000, 2)} MW · {st.smoke} người trong khói
          </p>

          <div id="sim-metrics" className="grid grid-cols-3 gap-2" title={ok ? `ASET ≥ ${K_SAFE} × RSET: đạt (minh họa)` : `ASET < ${K_SAFE} × RSET: chưa đạt (minh họa)`}>
            {[
              { k: "RSET", v: `${RSET} s`, c: "" },
              { k: "ASET", v: `${ASET} s`, c: ok ? "text-teal" : "text-destructive" },
              { k: "Đã thoát", v: `${st.out}/${st.total}`, c: "" },
            ].map((m) => (
              <div key={m.k} className="min-w-0 rounded-[3px] bg-secondary p-2.5">
                <span className="block text-[11px] font-bold text-muted-foreground">{m.k}</span>
                <strong className={cn("text-lg tracking-tight", m.c)}>{m.v}</strong>
              </div>
            ))}
          </div>

          <fieldset className="grid gap-2 rounded-[4px] border border-border px-3.5 pb-3 pt-1.5">
            <legend className="px-1.5 text-xs font-bold text-muted-foreground">Lớp hiển thị</legend>
            {(
              [
                ["layer-smoke", "smoke", "Khói và nhiệt (PyroSim/FDS)"],
                ["layer-people", "people", "Người thoát nạn (Pathfinder)"],
              ] as const
            ).map(([id, key, label]) => (
              <label key={id} className="flex cursor-pointer items-center gap-2.5 text-sm">
                <input id={id} type="checkbox" checked={layers[key]} onChange={(e) => setLayers((l) => ({ ...l, [key]: e.target.checked }))} className="h-[18px] w-[18px] shrink-0 accent-ember" />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>

          <div id="sim-info" aria-live="polite" className="min-h-[124px] rounded-[4px] bg-secondary p-3.5 text-sm">
            <RoomInfo sel={sel} t={t} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button id="sim-reset" type="button" variant="outline" size="sm" className="flex-1 rounded-full border-ink/30 bg-transparent" onClick={reset}>
              Đặt lại
            </Button>
            <Button id="sim-png" type="button" size="sm" className="flex-1 rounded-full" onClick={downloadPng}>
              Tải ảnh PNG
            </Button>
            <Button id="sim-csv" type="button" variant="outline" size="sm" className="flex-1 rounded-full border-ink/30 bg-transparent" onClick={downloadCsv}>
              Tải CSV
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{copy.simulator.legend}</p>
        </aside>
      </div>
    </Section>
  )
}
