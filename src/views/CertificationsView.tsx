'use client'

import { useMemo, useState } from 'react'
import CertificationCard from '@/components/CertificationCard'
import FilterChip from '@/components/FilterChip'
import CtaBand from '@/components/ui/CtaBand'
import PageHero from '@/components/ui/PageHero'
import { useI18n } from '@/context/i18nContext'
import credly from '@/dataFetchers/credly.backup.json'
import { dedupeBadges, filterByIssuer, issuersOf } from '@/lib/certifications'
import type { CredlyBadge } from '@/types/credly.types'

const CertificationsView = () => {
  const { t } = useI18n()
  const [issuer, setIssuer] = useState<string | null>(null)

  const badges = useMemo(() => dedupeBadges(credly.data as CredlyBadge[]), [])
  const issuers = useMemo(() => issuersOf(badges), [badges])
  const scrumCount = useMemo(
    () => filterByIssuer(badges, 'Scrum.org').length,
    [badges]
  )
  const visible = useMemo(
    () => filterByIssuer(badges, issuer),
    [badges, issuer]
  )

  return (
    <>
      <PageHero
        eyebrow={t('certifications.title')}
        lede={t('certifications.lede', {
          total: badges.length,
          scrum: scrumCount
        })}
        title={
          <h1 className="text-h1 text-ink mt-6 flex items-baseline gap-4">
            <span className="font-mono tabular-nums bg-accent text-accent-ink px-3">
              {badges.length}
            </span>
            <span>{t('certifications.title')}</span>
          </h1>
        }
      />

      <section className="mx-auto max-w-6xl px-6">
        <div
          role="group"
          aria-label={t('certifications.filterLabel')}
          className="flex flex-wrap gap-2 border-y border-rule py-6"
        >
          <FilterChip
            label={t('certifications.filterAll')}
            active={issuer === null}
            onClick={() => setIssuer(null)}
          />
          {issuers.map((name) => (
            <FilterChip
              key={name}
              label={name}
              active={issuer === name}
              onClick={() => setIssuer(name)}
            />
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="py-16 text-ink-muted">{t('certifications.empty')}</p>
        ) : (
          <ul className="grid gap-4 py-12 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((badge) => (
              <CertificationCard key={badge.id} badge={badge} />
            ))}
          </ul>
        )}
      </section>

      <CtaBand />
    </>
  )
}

export default CertificationsView
