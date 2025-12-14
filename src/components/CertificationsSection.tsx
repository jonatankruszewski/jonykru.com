'use client'
import React, { useState } from 'react'
import CertificationCard from '@/components/CertificationCard'
import ProjectTag from '@/components/ProjectTag'
import { useI18n } from '@/context/i18nContext'
import { CredlyData } from '@/types/credly.types'
import Section from '@/utils/Section'

type CertificationsSectionProps = {
  credlyData: CredlyData
}

const CertificationsSection = ({ credlyData }: CertificationsSectionProps) => {
  const { t } = useI18n()
  const { data } = credlyData
  const uniqueSkills = [
    ...new Set(
      data.flatMap((badge) => badge.issuer.entities[0].entity.name || '')
    )
  ].filter(Boolean)
  const providersMap = Object.fromEntries(
    uniqueSkills.map((skill) => [
      skill.replaceAll(' ', '_').toLowerCase(),
      {
        value: false,
        label: skill.split(' ', 3).join(' '),
        key: skill.replaceAll(' ', '_').toLowerCase()
      }
    ])
  )

  const [selectedProviders, setSelectedProviders] = useState(providersMap)
  const [all, setAll] = useState(true)

  const handleToggleAll = () => {
    if (all) {
      return
    }

    setSelectedProviders(providersMap)
    setAll(true)
  }

  const handleToggleProvider = (providerKey: string) => {
    const content = { ...selectedProviders[providerKey] }
    content.value = !content.value
    const newProviders = { ...selectedProviders, [providerKey]: content }

    const isAllSelected = Object.values(newProviders).every(
      (providerObj) => providerObj.value
    )
    const isNoneSelected = Object.values(newProviders).every(
      (providerObj) => !providerObj.value
    )

    if (isAllSelected) {
      setAll(true)
      setSelectedProviders(providersMap)
      return
    }

    if (isNoneSelected) {
      setAll(true)
      setSelectedProviders(providersMap)
      return
    }

    setAll(false)
    setSelectedProviders(newProviders)
  }

  const filteredBadges = data
    .filter((badge) => {
      const providersList = Object.values(selectedProviders)
      return (
        providersList.some(
          (provider) =>
            provider.value &&
            provider.key ===
              badge.issuer.entities[0].entity.name
                .toLowerCase()
                .replaceAll(' ', '_')
        ) || all
      )
    })
    .reverse()

  return (
    <Section id="certifications">
      <div className="text-center mb-8 mt-20">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t('certifications.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('certifications.subtitle')}
        </p>
      </div>

      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 rounded-2xl p-6 md:p-8 mb-8 border border-violet-100 dark:border-violet-900/30">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('certifications.whyHire.title')}
        </h3>
        <div className="space-y-3 text-gray-600 dark:text-gray-300">
          <p>{t('certifications.whyHire.p1')}</p>
          <p>{t('certifications.whyHire.p2')}</p>
          <p>{t('certifications.whyHire.p3')}</p>
        </div>
      </div>

      <div className="flex flex-row flex-wrap justify-center items-center gap-2 py-6 max-w-[900px] mx-auto">
        <ProjectTag
          label={t('certifications.filterAll')}
          isSelected={all}
          onClick={handleToggleAll}
        />
        {Object.values(selectedProviders)
          .sort((a, b) => a.label.localeCompare(b.label))
          .map(({ value, label, key }) => (
            <ProjectTag
              key={key}
              isSelected={value && !all}
              label={label}
              onClick={() => handleToggleProvider(key)}
            />
          ))}
      </div>
      <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {filteredBadges.map((badge) => (
          <CertificationCard badge={badge} key={badge.id} />
        ))}
      </ul>
    </Section>
  )
}

export default CertificationsSection
