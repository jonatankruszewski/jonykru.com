import { ReactNode } from 'react'

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  lede?: string
  action?: ReactNode
}

const SectionHeader = ({
  eyebrow,
  title,
  lede,
  action
}: SectionHeaderProps) => (
  <header className="border-b border-rule pb-6 mb-12">
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="font-mono text-label uppercase tracking-label text-syn-comment mb-4">
            {eyebrow}
          </p>
        )}
        <h2 className="text-h2 text-ink">{title}</h2>
        {lede && <p className="mt-4 text-ink-muted">{lede}</p>}
      </div>
      {action}
    </div>
  </header>
)

export default SectionHeader
