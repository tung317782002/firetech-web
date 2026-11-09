import { toast } from "sonner"

/** Sao chép vào bộ nhớ tạm, có phương án dự phòng khi trình duyệt không cho dùng Clipboard API. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* thử phương án dự phòng */
  }
  const ta = document.createElement("textarea")
  ta.value = text
  ta.setAttribute("readonly", "")
  ta.style.cssText = "position:fixed;left:-9999px;top:0"
  document.body.appendChild(ta)
  ta.select()
  let ok = false
  try {
    ok = document.execCommand("copy")
  } catch {
    ok = false
  }
  document.body.removeChild(ta)
  return ok
}

export async function copyWithToast(text: string) {
  const ok = await copyText(text)
  if (ok) toast.success("Đã sao chép vào bộ nhớ tạm")
  else toast.error("Không sao chép được, hãy bôi đen và sao chép thủ công")
}

/** Tải một Blob xuống máy với tên file cho trước. */
export function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = name
  a.style.display = "none"
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 1000)
}
