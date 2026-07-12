'use client'

type FilterChipProps = {
  label: string
  active: boolean
  onClick: () => void
}

const FilterChip = ({ label, active, onClick }: FilterChipProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`px-4 py-2 font-mono text-label uppercase tracking-label border transition-colors ${
      active
        ? 'bg-accent text-accent-ink border-accent'
        : 'border-rule text-ink-muted hover:border-ink hover:text-ink'
    }`}
  >
    {label}
  </button>
)

export default FilterChip
