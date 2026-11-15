import { useEffect, useState } from "react"

/** Trả về id của mục đang nằm giữa màn hình, dùng để tô sáng liên kết trên thanh điều hướng. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState("")
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [ids])
  return active
}
