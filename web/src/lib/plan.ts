/*
 * Mô hình mặt bằng minh họa: bản vẽ CAD thô và mô hình cháy, thoát nạn.
 * Toàn bộ là hàm thuần trả về chuỗi SVG (dùng chung cho hero, khung tương tác và tải ảnh PNG).
 * Số liệu RSET/ASET chỉ để minh họa, không phải tính toán cho công trình thực.
 * Hình học (ROOMS, EXITS, FIRE) và PRNG seed 7 giống bản tĩnh để kết quả trùng khớp.
 */
import { fmtNum } from "./format.ts"

export type Pt = [number, number]

export interface Room {
  id: number
  name: string
  x: number
  y: number
  w: number
  h: number
  n: number
  door?: Pt
  exit?: Pt
  fire?: boolean
  corridor?: boolean
  fill: string
}

interface ExitDef {
  p?: Pt
  ax?: number
  end?: Pt
  rect: [number, number, number, number]
}

export interface Agent {
  id: number
  room: number
  pts: Pt[]
  cum: number[]
  len: number
  sp: number
  pre: number
  exitAt: number
}

export interface Layers {
  smoke: boolean
  people: boolean
}

export interface RoomStat {
  out: number
  total: number
}

export interface SimStats {
  out: number
  total: number
  smoke: number
  byRoom: Record<number, RoomStat>
}

const CY = 270 // trục hành lang
const PXM = 10 // 10 px = 1 m
export const FIRE = { x: 320, y: 150 }
const SMOKE_START = 45
const SMOKE_SPEED = 1.8
const ALPHA = 0.0469 // đám cháy phát triển nhanh (Q = αt²)
export const T_MAX = 300
export const K_SAFE = 1.5

export const ROOMS: Room[] = [
  { id: 1, name: "Phòng học A", x: 40, y: 40, w: 200, h: 190, n: 10, door: [140, 230], fill: "#e6edf3" },
  { id: 2, name: "Kho lưu trữ", x: 240, y: 40, w: 160, h: 190, n: 2, door: [320, 230], fire: true, fill: "#fbe9de" },
  { id: 3, name: "Văn phòng", x: 400, y: 40, w: 180, h: 190, n: 8, door: [490, 230], fill: "#e6edf3" },
  { id: 4, name: "Phòng họp", x: 580, y: 40, w: 180, h: 190, n: 8, door: [670, 230], fill: "#e6edf3" },
  { id: 5, name: "Sảnh chính", x: 40, y: 310, w: 260, h: 130, n: 6, exit: [170, 440], fill: "#e2f1ea" },
  { id: 6, name: "Phòng máy", x: 300, y: 310, w: 200, h: 130, n: 2, door: [400, 310], fill: "#ece8f3" },
  { id: 7, name: "Căn tin", x: 500, y: 310, w: 260, h: 130, n: 12, exit: [630, 440], fill: "#e2f1ea" },
  { id: 8, name: "Hành lang", x: 40, y: 230, w: 720, h: 80, n: 0, corridor: true, fill: "#f7f4ee" },
]

const EXITS: ExitDef[] = [
  { p: [40, CY], rect: [34, 250, 12, 40] },
  { p: [760, CY], rect: [754, 250, 12, 40] },
  { ax: 170, end: [170, 440], rect: [150, 434, 40, 12] },
  { ax: 630, end: [630, 440], rect: [610, 434, 40, 12] },
]

function rng(seed: number): () => number {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1])
const pathLen = (pts: Pt[]) => pts.reduce((s, p, i) => (i ? s + dist(pts[i - 1], p) : 0), 0)
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

function buildAgents(): Agent[] {
  const rand = rng(7)
  const out: Agent[] = []
  let idx = 0
  for (const r of ROOMS) {
    for (let i = 0; i < r.n; i++) {
      const start: Pt = [Math.round(r.x + 22 + rand() * (r.w - 44)), Math.round(r.y + 40 + rand() * (r.h - 56))]
      let pts: Pt[]
      if (r.exit) {
        pts = [start, r.exit]
      } else {
        const d = r.door as Pt
        const c: Pt = [d[0], CY]
        let best: Pt[] | null = null
        for (const e of EXITS) {
          const p: Pt[] = e.p
            ? [start, d, c, e.p]
            : [start, d, c, [e.ax as number, CY], [e.ax as number, 310], e.end as Pt]
          if (!best || pathLen(p) < pathLen(best)) best = p
        }
        pts = best as Pt[]
      }
      const cum = [0]
      for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + dist(pts[k - 1], pts[k]))
      const speedMs = 1.0 + rand() * 0.4
      const pre = r.fire ? 3 + rand() * 12 : 15 + rand() * 65
      const len = cum[cum.length - 1]
      const sp = speedMs * PXM
      out.push({ id: ++idx, room: r.id, pts, cum, len, sp, pre, exitAt: pre + len / sp })
    }
  }
  return out
}

export const agents: Agent[] = buildAgents()
export const RSET = Math.ceil(Math.max(...agents.map((a) => a.exitAt)))
export const ASET = Math.round(SMOKE_START + (FIRE.x - 40) / SMOKE_SPEED)

export const smokeLen = (t: number) => clamp((t - SMOKE_START) * SMOKE_SPEED, 0, 760)
export const fireSmoke = (t: number) => clamp((t - 8) / 60, 0, 1) * 0.78
export const hrr = (t: number) => ALPHA * t * t

type AgentPos = { out: true } | { out: false; x: number; y: number }

export function agentAt(a: Agent, t: number): AgentPos {
  const d = (t - a.pre) * a.sp
  if (d <= 0) return { out: false, x: a.pts[0][0], y: a.pts[0][1] }
  if (d >= a.len) return { out: true }
  for (let i = 1; i < a.cum.length; i++) {
    if (d <= a.cum[i]) {
      const f = (d - a.cum[i - 1]) / (a.cum[i] - a.cum[i - 1])
      return {
        out: false,
        x: a.pts[i - 1][0] + (a.pts[i][0] - a.pts[i - 1][0]) * f,
        y: a.pts[i - 1][1] + (a.pts[i][1] - a.pts[i - 1][1]) * f,
      }
    }
  }
  return { out: true }
}

function inSmoke(a: Agent, p: { x: number; y: number }, t: number): boolean {
  if (a.room === 2 && t > 25) return true
  const L = smokeLen(t)
  return L > 0 && p.y >= 230 && p.y <= 310 && Math.abs(p.x - FIRE.x) <= L
}

export function stats(t: number): SimStats {
  let out = 0
  let smoke = 0
  const byRoom: Record<number, RoomStat> = {}
  for (const a of agents) {
    const p = agentAt(a, t)
    const r = (byRoom[a.room] ??= { out: 0, total: 0 })
    r.total++
    if (p.out) {
      out++
      r.out++
    } else if (inSmoke(a, p, t)) {
      smoke++
    }
  }
  return { out, total: agents.length, smoke, byRoom }
}

const FONT = "Segoe UI, Roboto, Helvetica, Arial, sans-serif"
const MONO = "ui-monospace, Consolas, monospace"

export function renderCad(): string {
  let s = '<rect width="800" height="480" fill="#0a1a2f"/>'
  s += '<defs><pattern id="cad-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#12304f" stroke-width="0.7"/></pattern></defs>'
  s += '<rect width="800" height="480" fill="url(#cad-grid)"/>'
  s += '<rect x="40" y="40" width="720" height="400" fill="none" stroke="#5ad1ff" stroke-width="2"/>'
  s += '<rect x="46" y="46" width="708" height="388" fill="none" stroke="#2f7aa6" stroke-width="1"/>'
  for (const r of ROOMS) {
    if (!r.corridor) s += `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="none" stroke="#5ad1ff" stroke-width="1.2"/>`
  }
  for (const r of ROOMS) {
    if (!r.door) continue
    const up = r.door[1] === 230
    s += `<rect x="${r.door[0] - 14}" y="${r.door[1] - 3}" width="28" height="6" fill="#0a1a2f"/>`
    s += `<path d="M${r.door[0] - 14} ${r.door[1]} a28 28 0 0 ${up ? 1 : 0} 28 0" fill="none" stroke="#c9ecff" stroke-width="0.9" transform="translate(0 ${up ? -1 : 1})"/>`
    s += `<line x1="${r.door[0] - 14}" y1="${r.door[1]}" x2="${r.door[0] - 14}" y2="${r.door[1] + (up ? -22 : 22)}" stroke="#c9ecff" stroke-width="0.9"/>`
  }
  s += '<rect x="165" y="436" width="10" height="8" fill="#0a1a2f"/><rect x="625" y="436" width="10" height="8" fill="#0a1a2f"/>'
  s += '<line x1="40" y1="22" x2="760" y2="22" stroke="#8ab4d3" stroke-width="1"/><line x1="40" y1="16" x2="40" y2="28" stroke="#8ab4d3"/><line x1="760" y1="16" x2="760" y2="28" stroke="#8ab4d3"/>'
  s += `<text x="400" y="17" text-anchor="middle" font-size="12" fill="#8ab4d3" font-family="${MONO}">72 000</text>`
  for (const r of ROOMS) {
    s += `<text class="plan-label" x="${r.x + 42}" y="${r.y + 27}" font-size="13" fill="#7fb2d6" font-family="${MONO}">${r.name.toUpperCase()}</text>`
  }
  s += `<text x="40" y="466" font-size="12" fill="#5f8aa9" font-family="${MONO}">A-WALL · A-DOOR · A-ANNO-DIMS   (chưa có kịch bản cháy, người, lối ra)</text>`
  return s
}

const FLAME = "M0,-28 C10,-14 18,-6 14,6 C12,14 4,18 0,18 C-4,18 -12,14 -14,6 C-18,-6 -8,-14 0,-28Z"

export function renderSim(t: number, layers: Layers): string {
  const L = smokeLen(t)
  let s =
    "<defs>" +
    '<filter id="sim-blur" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>' +
    '<radialGradient id="sim-heat"><stop offset="0" stop-color="#e8501a" stop-opacity="0.75"/><stop offset="0.55" stop-color="#ffb020" stop-opacity="0.35"/><stop offset="1" stop-color="#ffb020" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="sim-glow"><stop offset="0" stop-color="#ffd166" stop-opacity="0.95"/><stop offset="1" stop-color="#e8501a" stop-opacity="0"/></radialGradient>' +
    '<clipPath id="sim-clip-corr"><rect x="40" y="230" width="720" height="80"/></clipPath>' +
    '<clipPath id="sim-clip-fire"><rect x="240" y="40" width="160" height="190"/></clipPath>' +
    "</defs>"
  s += '<rect width="800" height="480" fill="#efeadf"/>'
  for (const r of ROOMS) s += `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${r.fill}" stroke="#1f2a44" stroke-width="3"/>`
  for (const r of ROOMS) {
    if (r.door) s += `<rect x="${r.door[0] - 14}" y="${r.door[1] - 3}" width="28" height="6" fill="#f7f4ee"/>`
  }
  EXITS.forEach((e, i) => {
    s += `<rect x="${e.rect[0]}" y="${e.rect[1]}" width="${e.rect[2]}" height="${e.rect[3]}" rx="3" fill="#0f8f6f"/>`
    const tx = i === 0 ? 20 : i === 1 ? 780 : e.rect[0] + 20
    const ty = i < 2 ? 274 : 458
    s += `<text class="plan-label" x="${tx}" y="${ty}" text-anchor="middle" font-size="11" font-weight="700" fill="#0b7a5b" font-family="${FONT}">${i < 2 ? "RA" : "LỐI RA"}</text>`
  })
  for (const r of ROOMS) {
    s += `<text class="plan-label" x="${r.x + 42}" y="${r.y + 27}" font-size="13" font-weight="600" fill="#44506b" font-family="${FONT}">${r.name}</text>`
  }

  if (layers.smoke) {
    const heatR = 40 + Math.min(120, t * 0.6)
    s += `<g clip-path="url(#sim-clip-fire)"><circle cx="${FIRE.x}" cy="${FIRE.y}" r="${heatR}" fill="url(#sim-heat)"/></g>`
    const fa = fireSmoke(t)
    if (fa > 0) s += `<g clip-path="url(#sim-clip-fire)"><rect x="210" y="10" width="220" height="250" fill="#262a36" opacity="${fa.toFixed(3)}" filter="url(#sim-blur)"/></g>`
    if (L > 0) {
      const x0 = Math.max(10, FIRE.x - L)
      const x1 = Math.min(790, FIRE.x + L)
      s += `<g clip-path="url(#sim-clip-corr)"><rect x="${x0.toFixed(1)}" y="215" width="${(x1 - x0).toFixed(1)}" height="110" fill="#333847" opacity="0.66" filter="url(#sim-blur)"/></g>`
    }
  }

  const sc = Math.min(1.5, 0.35 + t / 110)
  s += `<circle cx="${FIRE.x}" cy="${FIRE.y}" r="${(24 + sc * 22).toFixed(1)}" fill="url(#sim-glow)"/>`
  s += `<g transform="translate(${FIRE.x} ${FIRE.y + 6}) scale(${sc.toFixed(2)})"><path d="${FLAME}" fill="#e8501a"/><path d="${FLAME}" fill="#ffd166" transform="translate(0 7) scale(0.55)"/></g>`

  if (layers.people) {
    for (const a of agents) {
      const p = agentAt(a, t)
      if (p.out) continue
      const smoky = layers.smoke && inSmoke(a, p, t)
      s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.6" fill="${smoky ? "#ffb020" : "#0f8f6f"}" stroke="#fff" stroke-width="1.3"/>`
    }
  }
  return s
}

export interface ComposeState {
  t: number
  pos: number
  layers: Layers
}

/** Ghép bản CAD (trái) và mô hình mô phỏng (phải) thành một SVG độc lập, dùng cho hero và tải ảnh. */
export function compose(st: ComposeState, caption?: { brand: string; domain: string }): string {
  const h = caption ? 536 : 480
  const x = st.pos * 8
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ${h}" width="800" height="${h}" font-family="${FONT}">`
  s += `<g>${renderCad()}</g>`
  s += `<defs><clipPath id="cmp-clip"><rect x="${x}" y="0" width="${800 - x}" height="480"/></clipPath></defs>`
  s += `<g clip-path="url(#cmp-clip)">${renderSim(st.t, st.layers)}</g>`
  s += `<line x1="${x}" y1="0" x2="${x}" y2="480" stroke="#fff" stroke-width="3"/>`
  s += `<circle cx="${x}" cy="240" r="20" fill="#fff" stroke="#0b1020" stroke-opacity="0.35"/>`
  s += `<path d="M${x - 9} 240l6-6v12zM${x + 9} 240l-6-6v12z" fill="#0b1020"/>`
  if (caption) {
    s += '<rect y="480" width="800" height="56" fill="#10131c"/>'
    s += `<text x="20" y="505" font-size="17" font-weight="700" fill="#fff">${caption.brand} · t = ${Math.round(st.t)} s · HRR ≈ ${fmtNum(hrr(st.t) / 1000, 2)} MW</text>`
    s += `<text x="20" y="526" font-size="13" fill="#9aa4cc">Trái: bản vẽ CAD/Revit · Phải: PyroSim + Pathfinder (số liệu minh họa) · ${caption.domain}</text>`
  }
  return s + "</svg>"
}
