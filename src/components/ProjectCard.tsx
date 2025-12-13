/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React from 'react'

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
  if (!imgUrl) {
    return null
  }

  const isValidUrl =
    previewUrl && previewUrl.trim() !== '' && previewUrl.startsWith('http')

  return (
    <div className="bg-gray-100 dark:bg-[#1E1E2E] rounded-xl border border-gray-300 dark:border-gray-700 shadow-md transform transition duration-300 flex flex-col flex-1 h-full max-w-[450px] mx-auto ">
      <div className="md:h-72 rounded-t-xl relative group overflow-hidden aspect-square w-full">
        <img
          src={imgUrl}
          alt={`Medium article cover: ${title}`}
          className="rounded-t-xl h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20"></div>
      </div>
      <div className="text-gray-900 dark:text-white rounded-b-xl p-6">
        {isValidUrl ? (
          <Link
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-xl mb-2 text-center cursor-pointer text-gray-900 dark:text-white transition-opacity duration-200 hover:opacity-80 hover:underline"
          >
            {title}
          </Link>
        ) : (
          <span className="font-bold text-xl mb-2 text-center text-gray-900 dark:text-white">
            {title}
          </span>
        )}
      </div>
    </div>
  )
}

export default ProjectCard
