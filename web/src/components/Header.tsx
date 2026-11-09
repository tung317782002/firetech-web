import { useState } from "react"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { slotSrc } from "@/data/media"
import { useActiveSection } from "@/hooks/useActiveSection"
import { config } from "@/data/config"
import { copy } from "@/content/copy"
import { cn } from "@/lib/utils"

const NAV_IDS = copy.nav.map((n) => n.id)

export function Brand() {
  const logo = slotSrc("logo")
  return (
    <a className="inline-flex items-center gap-2.5 text-lg font-extrabold tracking-tight" href="#top" aria-label={`${config.brand.name}, về đầu trang`}>
      {logo ? (
        <img src={logo.src} alt={logo.alt ?? config.brand.name} width={logo.width} height={logo.height} className="h-8 w-auto" />
      ) : (
        <>
          <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <rect width="32" height="32" rx="6" fill="hsl(224 27% 9%)" />
            <path d="M16 5c1.5 4.2 6 6.6 6 12a6 6 0 0 1-12 0c0-2.2 1-3.6 2-4.8.3 1.6 1.2 2.4 2 2.8C13.2 11.6 14 8.2 16 5z" fill="#e8501a" />
            <path d="M16 15c.9 1.7 2.8 2.6 2.8 4.7a2.8 2.8 0 0 1-5.6 0c0-1.2.7-2 1.2-2.6.3.7.8 1 1.2 1.2-.1-1.4.1-2.6.4-3.3z" fill="#ffd166" />
          </svg>
          <span>{config.brand.name}</span>
        </>
      )}
    </a>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const active = useActiveSection(NAV_IDS)
  const { contact } = config

  return (
    <header id="top" className="sticky top-0 z-50 border-b border-border bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Brand />

        <nav
          id="main-nav"
          aria-label="Điều hướng chính"
          className={cn(
            "xl:static xl:flex xl:max-h-none xl:flex-row xl:items-center xl:gap-1 xl:overflow-visible xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none",
            open
              ? "absolute inset-x-0 top-16 flex max-h-[calc(100vh-4rem)] flex-col gap-1 overflow-y-auto border-b border-border bg-paper px-4 pb-5 pt-3 shadow-lg"
              : "hidden",
          )}
        >
          {copy.nav.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={() => setOpen(false)}
              aria-current={active === n.id ? "true" : undefined}
              className={cn(
                "rounded-full px-3 py-3 text-base font-semibold text-ink/80 hover:bg-secondary xl:py-2 xl:text-sm",
                active === n.id && "bg-ink text-primary-foreground hover:bg-ink",
              )}
            >
              {n.label}
            </a>
          ))}
          <a
            href={`tel:${contact.phoneTel}`}
            className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-ember-soft px-3 py-3 font-bold text-ember-dark hover:bg-ember-soft/70 xl:ml-2 xl:mt-0 xl:bg-transparent xl:py-2 xl:text-sm"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {contact.phoneDisplay}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="rounded-full bg-ember px-3 text-white hover:bg-ember-dark sm:px-4">
            <a href="#dang-ky" aria-label={copy.cta.register}>
              <span className="sm:hidden" aria-hidden="true">Đăng ký</span>
              <span className="hidden sm:inline">{copy.cta.register}</span>
            </a>
          </Button>
          <button
            id="menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            onClick={() => setOpen((v) => !v)}
            className="relative h-11 w-11 rounded-[8px] border border-input bg-card xl:hidden"
          >
            {[14, 21, 28].map((top, i) => (
              <span
                key={top}
                className={cn(
                  "absolute left-3 right-3 h-0.5 rounded bg-ink transition-transform",
                  open && i === 0 && "translate-y-[7px] rotate-45",
                  open && i === 1 && "opacity-0",
                  open && i === 2 && "-translate-y-[7px] -rotate-45",
                )}
                style={{ top }}
              />
            ))}
          </button>
        </div>
      </div>
    </header>
  )
}
