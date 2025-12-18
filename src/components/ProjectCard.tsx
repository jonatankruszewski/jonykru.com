/* eslint-disable @next/next/no-img-element */
'use client'
import Link from 'next/link'
import React from 'react'
import { useI18n } from '@/context/i18nContext'

type ProjectCardProps = {
  imgUrl?: string
  title: string
  previewUrl: string
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  imgUrl,
  title,
  previewUrl
}) => {
  const { t } = useI18n()

  if (!imgUrl) {
    return null
  }

  const isValidUrl =
    previewUrl && previewUrl.trim() !== '' && previewUrl.startsWith('http')

  const ImageContent = (
    <>
      <img
        src={imgUrl}
        alt={`Medium article cover: ${title}`}
        className="rounded-t-xl h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20"></div>
      {isValidUrl && (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
          <span className="bg-white text-gray-900 font-semibold px-4 py-2 rounded-full text-sm shadow-lg">
            {t('publications.readOnMedium')}
          </span>
        </div>
      )}
    </>
  )

  return (
    <div className="bg-gray-100 dark:bg-[#1E1E2E] rounded-xl border border-gray-300 dark:border-gray-700 shadow-md transform transition duration-300 flex flex-col flex-1 h-full max-w-[450px] mx-auto">
      {isValidUrl ? (
        <Link
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-t-xl relative group overflow-hidden aspect-square w-full block"
        >
          {ImageContent}
        </Link>
      ) : (
        <div className="rounded-t-xl relative group overflow-hidden aspect-square w-full">
          {ImageContent}
        </div>
      )}
      {/* Force LTR for English article titles */}
      <div className="text-gray-900 dark:text-white rounded-b-xl p-6" dir="ltr">
        {isValidUrl ? (
          <Link
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-xl mb-2 text-left block cursor-pointer text-gray-900 dark:text-white transition-opacity duration-200 hover:opacity-80 hover:underline"
          >
            {title}
          </Link>
        ) : (
          <span className="font-bold text-xl mb-2 text-left block text-gray-900 dark:text-white">
            {title}
          </span>
        )}
      </div>
    </div>
  )
}

export default ProjectCard
