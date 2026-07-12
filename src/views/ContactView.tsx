'use client'

import { ArrowUpRight } from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import CtaButton from '@/components/ui/CtaButton'
import PageHero from '@/components/ui/PageHero'
import { useI18n } from '@/context/i18nContext'
import { BOOK_A_CALL_URL, SOCIALS } from '@/data/site'

const SOCIAL_LINKS = [
  { label: 'GitHub', href: SOCIALS.github },
  { label: 'LinkedIn', href: SOCIALS.linkedin },
  { label: 'Medium', href: SOCIALS.medium },
  { label: 'Stack Overflow', href: SOCIALS.stackOverflow }
]

const ContactView = () => {
  const { t } = useI18n()

  return (
    <PageHero
      eyebrow={t('contact.title')}
      title={t('contact.title')}
      lede={t('contact.lede')}
    >
      {/* The call is the primary path; the form is the fallback under it. */}
      <div className="mt-10">
        <CtaButton href={BOOK_A_CALL_URL} external>
          {t('contact.bookACall')}
        </CtaButton>
      </div>

      <div className="mt-24 grid gap-16 border-t border-rule pt-16 md:grid-cols-[1fr_20rem]">
        <div>
          <h2 className="text-h2 text-ink">{t('contact.orWrite')}</h2>
          <p className="mt-3 mb-8 text-ink-muted">{t('contact.formNote')}</p>
          <ContactForm />
        </div>

        <div>
          <h2 className="font-mono text-label uppercase tracking-label text-ink-muted">
            {t('contact.elsewhere')}
          </h2>
          <ul className="mt-6 flex flex-col gap-4">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link inline-flex items-center gap-1"
                >
                  {social.label}
                  <ArrowUpRight size={14} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageHero>
  )
}

export default ContactView
