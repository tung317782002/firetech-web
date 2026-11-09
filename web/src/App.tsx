import { useCallback, useState } from "react"
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/components/Header"
import { Hero } from "@/components/Hero"
import { Tools, Workflow } from "@/components/Workflow"
import { Software } from "@/components/Software"
import { Topics } from "@/components/Topics"
import { Simulator } from "@/components/Simulator"
import { Library } from "@/components/Library"
import { Gallery } from "@/components/Gallery"
import { Stats } from "@/components/Stats"
import { Pricing } from "@/components/Pricing"
import { Zalo } from "@/components/Zalo"
import { Register, type Prefill } from "@/components/Register"
import { Faq } from "@/components/Faq"
import { Footer } from "@/components/Footer"

export default function App() {
  const [prefill, setPrefill] = useState<Prefill>({ nonce: 0 })

  /** Chọn gói (và ghi chú), cuộn tới form đăng ký rồi đưa con trỏ vào ô họ tên. */
  const goRegister = useCallback((planId?: string, note?: string) => {
    setPrefill((p) => ({ planId, note, nonce: p.nonce + 1 }))
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
      <main id="noi-dung">
        <Hero />
        <Tools />
        <Workflow />
        <Software />
        <Topics onRegister={goRegister} />
        <Simulator />
        <Library />
        <Gallery />
        <Stats />
        <Pricing onRegister={(id) => goRegister(id)} />
        <Zalo />
        <Register prefill={prefill} />
        <Faq />
      </main>
      <Footer />
      <Toaster />
    </>
  )
}
