import { ReactNode } from 'react'

type PageHeroProps = {
  eyebrow: string
  /** Defaults to an <h1>; the home page passes its own animated heading. */
  title: ReactNode
  lede?: string
  children?: ReactNode
}

/** The opening block of every route: mono eyebrow, heading, lede. */
const PageHero = ({ eyebrow, title, lede, children }: PageHeroProps) => (
  <section className="mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-32">
    <p className="font-mono text-label uppercase tracking-label text-syn-comment">
      {eyebrow}
    </p>

    {typeof title === 'string' ? (
      <h1 className="text-h1 text-ink mt-6 max-w-3xl text-balance">{title}</h1>
    ) : (
      title
    )}

    {lede && <p className="mt-6 max-w-2xl text-ink-muted">{lede}</p>}

    {children}
  </section>
)

export default PageHero
