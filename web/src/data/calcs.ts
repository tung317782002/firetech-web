/* Máy tính nhanh trong thư viện công thức. Số liệu đã đối chiếu với bản tĩnh và bảng tính Excel. */

export interface CalcOption {
  v: string
  t: string
}

export interface CalcInput {
  id: string
  label: string
  unit?: string
  type?: "select"
  value: number | string
  min?: number
  max?: number
  step?: number
  options?: CalcOption[]
}

export interface CalcResult {
  label: string
  value: string
  status?: "ok" | "bad"
}

export interface CalcSpec {
  inputs: CalcInput[]
  run: (v: Record<string, number>) => CalcResult[]
}

/** Làm tròn d chữ số thập phân và định dạng kiểu Việt Nam (dấu phẩy thập phân). */
function round(v: number, d: number): string {
  const k = 10 ** d
  const r = Math.round(v * k) / k
  try {
    return r.toLocaleString("vi-VN", { maximumFractionDigits: d })
  } catch {
    return String(r)
  }
}

export const calcs: Record<string, CalcSpec> = {
  hrr: {
    inputs: [
      {
        id: "alpha",
        label: "Tốc độ phát triển đám cháy",
        type: "select",
        value: "0.0469",
        options: [
          { v: "0.00293", t: "Chậm (α = 0,00293)" },
          { v: "0.01172", t: "Trung bình (α = 0,01172)" },
          { v: "0.0469", t: "Nhanh (α = 0,0469)" },
          { v: "0.1876", t: "Rất nhanh (α = 0,1876)" },
        ],
      },
      { id: "t", label: "Thời gian t", unit: "s", value: 120, min: 0, step: 10 },
    ],
    run: (v) => {
      const q = v.alpha * v.t * v.t
      return [
        { label: "Q", value: `${round(q, 1)} kW` },
        { label: "Q", value: `${round(q / 1000, 3)} MW` },
      ]
    },
  },
  dstar: {
    inputs: [{ id: "q", label: "Công suất cháy Q", unit: "kW", value: 1000, min: 1, step: 100 }],
    run: (v) => {
      // ρ∞ = 1,204 kg/m³; cp = 1,005 kJ/(kg·K); T∞ = 293 K; g = 9,81 m/s²
      const d = Math.pow(v.q / (1.204 * 1.005 * 293 * Math.sqrt(9.81)), 0.4)
      return [
        { label: "D*", value: `${round(d, 3)} m` },
        { label: "dx (D*/16 → D*/4)", value: `${round(d / 16, 3)} m → ${round(d / 4, 3)} m` },
      ]
    },
  },
  rset: {
    inputs: [
      { id: "det", label: "Phát hiện cháy", unit: "s", value: 30, min: 0, step: 5 },
      { id: "alarm", label: "Báo động", unit: "s", value: 15, min: 0, step: 5 },
      { id: "pre", label: "Nhận biết và phản ứng", unit: "s", value: 60, min: 0, step: 5 },
      { id: "travel", label: "Di chuyển (từ Pathfinder)", unit: "s", value: 90, min: 0, step: 5 },
      { id: "aset", label: "ASET (từ FDS)", unit: "s", value: 300, min: 0, step: 10 },
      { id: "k", label: "Hệ số an toàn", unit: "×", value: 1.5, min: 1, step: 0.1 },
    ],
    run: (v) => {
      const rset = v.det + v.alarm + v.pre + v.travel
      const margin = v.aset - v.k * rset
      return [
        { label: "RSET", value: `${round(rset, 1)} s` },
        { label: "k × RSET", value: `${round(v.k * rset, 1)} s` },
        {
          label: "Kết luận",
          value:
            margin >= 0
              ? `ASET ≥ k × RSET (đạt, dư ${round(margin, 1)} s)`
              : `ASET < k × RSET (chưa đạt, thiếu ${round(-margin, 1)} s)`,
          status: margin >= 0 ? "ok" : "bad",
        },
      ]
    },
  },
  flow: {
    inputs: [{ id: "d", label: "Mật độ người D", unit: "người/m²", value: 1.5, min: 0, max: 3.7, step: 0.1 }],
    run: (v) => {
      const s = Math.max(0, 1.4 * (1 - 0.266 * v.d))
      return [
        { label: "Vận tốc S", value: `${round(s, 3)} m/s` },
        { label: "Lưu lượng riêng Fs", value: `${round(s * v.d, 3)} người/(m·s)` },
      ]
    },
  },
  vis: {
    inputs: [
      {
        id: "c",
        label: "Loại vật thể quan sát",
        type: "select",
        value: "3",
        options: [
          { v: "3", t: "Biển hiệu phát sáng (C = 3)" },
          { v: "8", t: "Vật phản xạ ánh sáng (C = 8)" },
        ],
      },
      { id: "k", label: "Hệ số tắt dần K", unit: "1/m", value: 0.3, min: 0.001, step: 0.05 },
    ],
    run: (v) => [{ label: "Tầm nhìn S", value: `${round(v.c / v.k, 2)} m` }],
  },
}
