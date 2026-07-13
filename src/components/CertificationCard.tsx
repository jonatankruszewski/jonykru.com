/* eslint-disable @next/next/no-img-element */
'use client'

import { useI18n } from '@/context/i18nContext'
import type { CredlyBadge } from '@/types/credly.types'

type CertificationCardProps = {
  badge: CredlyBadge
}

const CertificationCard = ({ badge }: CertificationCardProps) => {
  const { t } = useI18n()
  const title = badge.badge_template.name
  const href = badge.badge_template.url
  const isValidUrl = href?.trim().startsWith('http')

  const content = (
    <>
      <img
        width={200}
        height={200}
        loading="lazy"
        decoding="async"
        src={badge.image_url}
        alt=""
        aria-hidden
        className="w-20 h-20 object-contain shrink-0"
      />
      <div className="min-w-0">
        <h3 className="text-ink font-semibold leading-snug">{title}</h3>
        <p className="font-mono text-label uppercase tracking-label text-syn-comment mt-2">
          {badge.issuer_linked_in_name}
        </p>
      </div>
    </>
  )

  return (
    <li className="border border-rule p-5 hover:border-ink transition-colors">
      {isValidUrl ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-5"
        >
          {content}
          {/* The accessible name now derives from the visible title + issuer
              (so it satisfies Label-in-Name), with the action spelled out for
              screen readers. */}
          <span className="sr-only">{t('certifications.viewCredential')}</span>
        </a>
      ) : (
        <div className="flex items-center gap-5">{content}</div>
      )}
    </li>
  )
}

export default CertificationCard
