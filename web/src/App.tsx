import { useCallback, useState } from "react"
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/components/Header"
import { NewsTicker } from "@/components/NewsTicker"
import { NewsFeatured } from "@/components/NewsFeatured"
import { Hero } from "@/components/Hero"
import { Tools } from "@/components/Tools"
import { Concepts } from "@/components/Concepts"
import { Software } from "@/components/Software"
import { Scenarios } from "@/components/Scenarios"
import { Library } from "@/components/Library"
import { About } from "@/components/About"
import { Zalo } from "@/components/Zalo"
import { Register, type Prefill } from "@/components/Register"
import { Footer } from "@/components/Footer"

export default function App() {
  const [prefill, setPrefill] = useState<Prefill>({ nonce: 0 })

  /** Điền ghi chú (nếu có), cuộn tới form để lại thông tin rồi đưa con trỏ vào ô họ tên. */
  const goRegister = useCallback((note?: string) => {
    setPrefill((p) => ({ note, nonce: p.nonce + 1 }))
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    document.getElementById("dang-ky")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
    setTimeout(() => document.getElementById("f-name")?.focus({ preventScroll: true }), reduce ? 50 : 500)
  }, [])

  return (
    <>
      <a className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-primary-foreground" href="#noi-dung">
        Bỏ qua điều hướng
      </a>
      <Header />
      <NewsTicker />
      <main id="noi-dung">
        <NewsFeatured />
        <Hero />
        <Tools />
        <Concepts />
        <Software />
        <Scenarios />
        <Library onRegister={goRegister} />
        <About />
        <Zalo />
        <Register prefill={prefill} />
      </main>
      <Footer />
      <Toaster />
    </>
  )
}
