import Link from 'next/link'
import { ReactNode } from 'react'

type Variant = 'accent' | 'outline'

type CtaButtonProps = {
  href: string
  children: ReactNode
  variant?: Variant
  external?: boolean
  className?: string
}

// Lime is a fill, never text: ink-on-lime is 15.5:1, lime-on-cream is 1.12:1.
const VARIANTS: Record<Variant, string> = {
  accent: 'bg-accent text-accent-ink hover:bg-ink hover:text-canvas',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-canvas'
}

const BASE =
  'inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-label uppercase tracking-label transition-colors duration-100'

const CtaButton = ({
  href,
  children,
  variant = 'accent',
  external = false,
  className = ''
}: CtaButtonProps) => {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`.trim()

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}

export default CtaButton
