export type Stat = {
  value: number
  label: string
}

type StatListProps = {
  stats: Stat[]
  className?: string
}

/**
 * Numbers first, label under. Rendered column-reverse so the DOM keeps the
 * <dt>/<dd> order a description list requires while the number reads on top.
 */
const StatList = ({ stats, className = '' }: StatListProps) => (
  <dl className={className}>
    {stats.map((stat) => (
      <div key={stat.label} className="flex flex-col-reverse">
        <dt className="font-mono text-label uppercase tracking-label text-syn-comment mt-2">
          {stat.label}
        </dt>
        <dd className="font-mono text-h1 text-syn-number tabular-nums">
          {stat.value}
        </dd>
      </div>
    ))}
  </dl>
)

export default StatList
