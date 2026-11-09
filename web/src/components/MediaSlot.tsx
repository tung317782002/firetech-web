import { useState } from "react"
import { Image as ImageIcon, PlayCircle, QrCode, UserRound } from "lucide-react"
import { getSlot, type MediaSlotDef } from "@/data/media"
import { cn } from "@/lib/utils"

/** Chuyển liên kết YouTube thường sang dạng nhúng không theo dõi; các liên kết khác giữ nguyên. */
function toEmbedUrl(src: string): string {
  const m = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/)
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : src
}

function SlotIcon({ id, kind }: { id: string; kind: MediaSlotDef["kind"] }) {
  const cls = "h-6 w-6 shrink-0"
  if (id === "zalo-qr") return <QrCode className={cls} aria-hidden="true" />
  if (id === "instructor") return <UserRound className={cls} aria-hidden="true" />
  return kind === "image" ? <ImageIcon className={cls} aria-hidden="true" /> : <PlayCircle className={cls} aria-hidden="true" />
}

function Placeholder({ def, compact }: { def: MediaSlotDef; compact?: boolean }) {
  return (
    <div
      className="slot-empty flex h-full w-full flex-col items-center justify-center gap-1.5 border border-dashed border-ink/30 bg-secondary/60 p-3 text-center text-muted-foreground"
      data-slot-empty={def.id}
      title={`Vị trí: ${def.id}`}
    >
      <SlotIcon id={def.id} kind={def.kind} />
      <p className="line-clamp-2 text-xs font-semibold leading-snug text-foreground/80">{def.purpose}</p>
      {!compact && <p className="font-mono text-[11px] leading-snug">{def.ratio.replace("/", ":")} · {def.recommended}</p>}
    </div>
  )
}

/**
 * Một vị trí ảnh hoặc video. Chưa có `src` thì hiện khung giữ chỗ đúng tỉ lệ; có `src` thì hiện nội dung thật.
 * Tải lỗi thì quay về khung giữ chỗ (không để biểu tượng ảnh hỏng, không gây lỗi console).
 */
export function MediaSlot({
  id,
  className,
  eager = false,
  compact = false,
}: {
  id: string
  className?: string
  eager?: boolean
  compact?: boolean
}) {
  const def = getSlot(id)
  const [failed, setFailed] = useState(false)
  const has = def.src.trim() !== "" && !failed

  return (
    <figure className={cn("m-0", className)} data-media={def.id}>
      <div className="w-full overflow-hidden" style={{ aspectRatio: def.ratio }}>
        {!has && <Placeholder def={def} compact={compact} />}
        {has && def.kind === "image" && (
          <img
            src={def.src}
            alt={def.alt ?? ""}
            width={def.width}
            height={def.height}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        )}
        {has && def.kind === "video" && (
          <video
            controls
            playsInline
            preload="metadata"
            poster={def.poster}
            className="h-full w-full bg-ink object-cover"
            aria-label={def.alt}
            onError={() => setFailed(true)}
          >
            <source src={def.src} />
          </video>
        )}
        {has && def.kind === "embed" && (
          <iframe
            src={toEmbedUrl(def.src)}
            title={def.alt ?? def.purpose}
            loading="lazy"
            allow="encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-full w-full border-0"
          />
        )}
      </div>
      {has && def.caption && <figcaption className="mt-1.5 text-xs text-muted-foreground">{def.caption}</figcaption>}
    </figure>
  )
}
