/** Định dạng số kiểu Việt Nam (dấu phẩy thập phân). */
export function fmtNum(n: number, maxDigits = 2): string {
  try {
    return n.toLocaleString("vi-VN", { maximumFractionDigits: maxDigits })
  } catch {
    return String(Math.round(n * 100) / 100)
  }
}

export function fmtVND(n: number): string {
  return `${fmtNum(n, 0)} ₫`
}

/** Bỏ dấu tiếng Việt và đưa về chữ thường để tìm kiếm không phân biệt dấu. */
export function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
}
