import { useEffect, useRef, useState, type FormEvent } from "react"
import { AtSign, MessageCircle, Phone } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { MediaSlot } from "@/components/MediaSlot"
import { Section } from "@/components/shared"
import { config } from "@/data/config"
import { copy } from "@/content/copy"
import { fmtVND } from "@/lib/format"
import { copyWithToast } from "@/lib/utils-app"
import { cn } from "@/lib/utils"

const PHONE_RE = /^(\+84|84|0)(3|5|7|8|9)\d{8}$/
const UNSURE = "tu-van"

export interface Prefill {
  planId?: string
  note?: string
  nonce: number
}

interface Done {
  msg: string
  sent: boolean
}

const inputCls = "min-h-12 w-full rounded-[8px] border border-input bg-card px-3.5 py-2.5"

export function Register({ prefill }: { prefill: Prefill }) {
  const { contact } = config
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [course, setCourse] = useState(config.plans[0].id)
  const [note, setNote] = useState("")
  const [errName, setErrName] = useState("")
  const [errPhone, setErrPhone] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<Done | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const doneRef = useRef<HTMLDivElement>(null)

  // Đồng bộ khi người dùng bấm chọn gói hoặc đề tài ở nơi khác: điều chỉnh state ngay trong lúc render
  const [seenNonce, setSeenNonce] = useState(0)
  if (prefill.nonce !== seenNonce) {
    setSeenNonce(prefill.nonce)
    if (prefill.planId) setCourse(prefill.planId)
    if (prefill.note !== undefined) setNote(prefill.note)
    setDone(null)
  }

  const courseLabel = (id: string) => {
    const p = config.plans.find((x) => x.id === id)
    return p ? `${p.name} – ${fmtVND(p.price)}` : copy.register.unsure
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    let ok = true
    const digits = phone.replace(/[\s.\-()]/g, "")
    if (!name.trim()) {
      setErrName("Vui lòng nhập họ và tên.")
      ok = false
    }
    if (!PHONE_RE.test(digits)) {
      setErrPhone("Số điện thoại chưa đúng. Ví dụ: 0912345678.")
      ok = false
    }
    if (!ok) {
      ;(!name.trim() ? nameRef : phoneRef).current?.focus()
      return
    }

    const payload = { name: name.trim(), phone: digits, course: courseLabel(course), note: note.trim(), createdAt: new Date().toISOString() }
    const msg = [`Đăng ký khóa học – ${config.brand.name}`, `Họ tên: ${payload.name}`, `Số điện thoại: ${payload.phone}`, `Khóa học: ${payload.course}`, ...(payload.note ? [`Ghi chú: ${payload.note}`] : [])].join("\n")

    if (!config.registerEndpoint) {
      setDone({ msg, sent: false })
      return
    }
    setBusy(true)
    try {
      const r = await fetch(config.registerEndpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
      if (!r.ok) throw new Error(`http ${r.status}`)
      setDone({ msg, sent: true })
    } catch {
      toast.error("Chưa gửi được, hãy dùng nội dung bên dưới để liên hệ.")
      setDone({ msg, sent: false })
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (done) doneRef.current?.focus()
  }, [done])

  const contactLines = [
    { href: `tel:${contact.phoneTel}`, icon: Phone, title: contact.phoneDisplay, sub: copy.register.call, ext: false },
    { href: contact.zalo, icon: MessageCircle, title: copy.register.zalo, sub: copy.register.zaloNote, ext: true },
    { href: `mailto:${contact.email}`, icon: AtSign, title: contact.email, sub: copy.register.mail, ext: false },
  ]

  return (
    <Section id="dang-ky" labelledBy="dk-title" className="border-t border-border">
      <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,480px)] lg:gap-16">
        <div>
          <h2 id="dk-title" className="text-3xl font-extrabold sm:text-4xl">
            {copy.register.title}
          </h2>
          <p className="mb-6 mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">{copy.register.intro}</p>
          <div className="grid max-w-xl gap-2.5">
            {contactLines.map((c) => (
              <a
                key={c.title}
                href={c.href}
                {...(c.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex min-w-0 items-center gap-4 rounded-[8px] border border-border bg-card px-4 py-3.5 hover:border-ink/60"
              >
                <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-[6px] bg-ink text-primary-foreground">
                  <c.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <strong className="block break-words text-lg">{c.title}</strong>
                  <small className="text-muted-foreground">{c.sub}</small>
                </span>
              </a>
            ))}
          </div>
          <div className="mt-8 flex max-w-xl items-center gap-4">
            <MediaSlot id="instructor" compact className="w-28 shrink-0" />
            <p className="text-sm font-semibold text-muted-foreground">{copy.register.instructor}</p>
          </div>
        </div>

        <div className="min-w-0 rounded-[10px] border border-ink/80 bg-card p-5 shadow-[6px_6px_0_0_hsl(var(--ink)/0.9)] sm:p-6">
          {!done ? (
            <form id="reg-form" noValidate onSubmit={submit}>
              <div className="mb-4">
                <label htmlFor="f-name" className="mb-1.5 block text-sm font-semibold">
                  Họ và tên
                </label>
                <input
                  id="f-name"
                  ref={nameRef}
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  aria-invalid={errName ? true : undefined}
                  aria-describedby="e-name"
                  onChange={(e) => {
                    setName(e.target.value)
                    if (e.target.value.trim()) setErrName("")
                  }}
                  className={cn(inputCls, errName && "border-destructive")}
                />
                <p id="e-name" role="alert" className="mt-1.5 text-sm text-destructive empty:hidden">
                  {errName}
                </p>
              </div>
              <div className="mb-4">
                <label htmlFor="f-phone" className="mb-1.5 block text-sm font-semibold">
                  Số điện thoại
                </label>
                <input
                  id="f-phone"
                  ref={phoneRef}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Ví dụ: 0912 345 678"
                  required
                  value={phone}
                  aria-invalid={errPhone ? true : undefined}
                  aria-describedby="e-phone"
                  onChange={(e) => {
                    setPhone(e.target.value)
                    setErrPhone("")
                  }}
                  className={cn(inputCls, errPhone && "border-destructive")}
                />
                <p id="e-phone" role="alert" className="mt-1.5 text-sm text-destructive empty:hidden">
                  {errPhone}
                </p>
              </div>
              <div className="mb-4">
                <label htmlFor="f-course" className="mb-1.5 block text-sm font-semibold">
                  Khóa học quan tâm
                </label>
                <select id="f-course" name="course" value={course} onChange={(e) => setCourse(e.target.value)} className={inputCls}>
                  {config.plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {courseLabel(p.id)}
                    </option>
                  ))}
                  <option value={UNSURE}>{copy.register.unsure}</option>
                </select>
              </div>
              <div className="mb-5">
                <label htmlFor="f-note" className="mb-1.5 block text-sm font-semibold">
                  Đề tài hoặc ghi chú <span className="font-normal text-muted-foreground">(không bắt buộc)</span>
                </label>
                <textarea id="f-note" name="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} className={cn(inputCls, "min-h-[88px] resize-y")} />
              </div>
              <Button id="reg-submit" type="submit" size="lg" disabled={busy} className="w-full rounded-full bg-ember text-white hover:bg-ember-dark">
                {busy ? copy.register.sending : copy.register.submit}
              </Button>
            </form>
          ) : (
            <div id="reg-done" ref={doneRef} tabIndex={-1} className="outline-none">
              <h3 id="reg-done-title" className="mb-2 text-2xl font-extrabold">
                {done.sent ? "Đã gửi đăng ký" : "Thông tin đã sẵn sàng"}
              </h3>
              <p id="reg-done-text" className="text-[15px] text-muted-foreground">
                {done.sent
                  ? "Cảm ơn bạn. Đơn vị sẽ liên hệ qua số điện thoại đã nhập."
                  : "Thông tin chưa được gửi đi: trang chưa kết nối máy chủ nhận đăng ký. Hãy gửi nội dung dưới đây qua Zalo, email hoặc gọi điện."}
              </p>
              <textarea id="reg-msg" readOnly rows={5} value={done.msg} aria-label="Nội dung đăng ký" className="my-3.5 w-full resize-y rounded-[8px] border border-border bg-secondary p-3" />
              <div className="mb-3 flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" className="rounded-full border-ink/30 bg-transparent" onClick={() => copyWithToast(done.msg)}>
                  Sao chép nội dung
                </Button>
                {!done.sent && (
                  <>
                    <Button asChild size="sm" className="rounded-full">
                      <a href={contact.zalo} target="_blank" rel="noopener noreferrer">
                        Mở Zalo
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="rounded-full border-ink/30 bg-transparent">
                      <a href={`mailto:${contact.email}?subject=${encodeURIComponent("Đăng ký khóa học")}&body=${encodeURIComponent(done.msg)}`}>Gửi email</a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="rounded-full border-ink/30 bg-transparent">
                      <a href={`tel:${contact.phoneTel}`}>Gọi {contact.phoneDisplay}</a>
                    </Button>
                  </>
                )}
              </div>
              <button
                id="reg-again"
                type="button"
                onClick={() => {
                  setDone(null)
                  setTimeout(() => nameRef.current?.focus(), 0)
                }}
                className="text-sm font-semibold text-ember-dark underline underline-offset-4"
              >
                Nhập lại
              </button>
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
