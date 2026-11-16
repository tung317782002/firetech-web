import { Button } from "@/components/ui/button"
import { Section, SectionHead } from "@/components/shared"
import { news, type NewsItem } from "@/data/news.generated"
import { copy } from "@/content/copy"
import { fmtDate } from "@/lib/format"

function Cover({ n }: { n: NewsItem }) {
  return n.image ? (
    <img src={n.image} alt={n.imageAlt} loading="lazy" decoding="async" className="aspect-video w-full object-cover sm:aspect-[2/1]" />
  ) : (
    <div aria-hidden="true" className="grid aspect-video w-full place-items-center bg-ember-soft sm:aspect-[2/1]">
      <svg width="44" height="44" viewBox="0 0 32 32" focusable="false">
        <path d="M16 5c1.5 4.2 6 6.6 6 12a6 6 0 0 1-12 0c0-2.2 1-3.6 2-4.8.3 1.6 1.2 2.4 2 2.8C13.2 11.6 14 8.2 16 5z" fill="#e8501a" />
        <path d="M16 15c.9 1.7 2.8 2.6 2.8 4.7a2.8 2.8 0 0 1-5.6 0c0-1.2.7-2 1.2-2.6.3.7.8 1 1.2 1.2-.1-1.4.1-2.6.4-3.3z" fill="#ffd166" />
      </svg>
    </div>
  )
}

function Meta({ n }: { n: NewsItem }) {
  return (
    <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      {n.label && <span className="rounded-[3px] bg-ember-soft px-2 py-0.5 font-bold text-ember-dark">{n.label}</span>}
      <time dateTime={n.date} className="font-mono font-semibold">
        {fmtDate(n.date)}
      </time>
    </p>
  )
}

/** Khối tin nổi bật: tin mới nhất cỡ lớn và các tin kế tiếp. Tin lên đầu theo ngày đăng. */
export function NewsFeatured() {
  if (news.length === 0) return null
  const [top, ...rest] = news
  const next = rest.slice(0, 4)

  return (
    <Section id="tin-tuc" labelledBy="tt-title" className="border-b border-border !py-10 sm:!py-12">
      <SectionHead id="tt-title" title={copy.news.title} intro={copy.news.intro} className="!mb-6" />
      <div className="grid gap-5 lg:grid-cols-12">
        <a
          href={`tin-tuc/${top.slug}/`}
          id="news-featured"
          className="news-card group flex flex-col overflow-hidden rounded-[10px] border border-ink/80 bg-card shadow-[6px_6px_0_0_hsl(var(--ink)/0.9)] lg:col-span-7"
        >
          <Cover n={top} />
          <div className="flex flex-1 flex-col gap-2 p-5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-ember-dark">{copy.news.latest}</p>
            <h3 className="text-xl font-extrabold leading-snug group-hover:underline sm:text-2xl">{top.title}</h3>
            <Meta n={top} />
            <p className="text-[15px] text-muted-foreground">{top.summary}</p>
            <span className="mt-auto pt-2 text-sm font-bold text-ember-dark">{copy.news.read} →</span>
          </div>
        </a>

        <div className="flex flex-col gap-3 lg:col-span-5">
          {next.map((n) => (
            <a key={n.slug} href={`tin-tuc/${n.slug}/`} className="news-card group rounded-[10px] border border-border bg-card p-4 hover:border-ink/60">
              <Meta n={n} />
              <h3 className="mt-1.5 text-base font-bold leading-snug group-hover:underline">{n.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{n.summary}</p>
            </a>
          ))}
          <Button asChild variant="outline" className="mt-auto w-fit rounded-full border-ink/30 bg-transparent">
            <a href="tin-tuc/" id="news-all">
              {copy.news.all}
            </a>
          </Button>
        </div>
      </div>
    </Section>
  )
}
