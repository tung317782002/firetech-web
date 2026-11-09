import { Brand } from "@/components/Header"
import { config } from "@/data/config"
import { copy } from "@/content/copy"

function Col({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h2>
      {links.map(([id, label]) => (
        <a key={id} href={`#${id}`} className="block break-words py-1 text-ink/85 hover:text-ember-dark">
          {label}
        </a>
      ))}
    </nav>
  )
}

const YEAR = new Date().getFullYear()

export function Footer() {
  const { contact, brand } = config
  return (
    <footer className="border-t border-border bg-secondary/60 pb-6 pt-12">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Brand />
          <p className="mt-3 max-w-xs text-muted-foreground">{copy.footer.blurb}</p>
          {contact.address && <p className="mt-2 text-sm text-muted-foreground">{contact.address}</p>}
        </div>
        <Col title={copy.footer.cols.content.title} links={copy.footer.cols.content.links} />
        <Col title={copy.footer.cols.course.title} links={copy.footer.cols.course.links} />
        <div>
          <h2 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">{copy.footer.cols.contact.title}</h2>
          <a href={`tel:${contact.phoneTel}`} className="block py-1 text-ink/85 hover:text-ember-dark">
            {contact.phoneDisplay}
          </a>
          <a href={`mailto:${contact.email}`} className="block break-words py-1 text-ink/85 hover:text-ember-dark">
            {contact.email}
          </a>
        </div>
      </div>
      <div className="mx-auto mt-8 flex w-full max-w-6xl flex-wrap justify-between gap-x-6 gap-y-2 border-t border-border px-4 pt-5 text-sm text-muted-foreground sm:px-6">
        <p>
          © {YEAR} {brand.name} · {brand.domain}
        </p>
        <p>{copy.footer.legal}</p>
      </div>
    </footer>
  )
}
