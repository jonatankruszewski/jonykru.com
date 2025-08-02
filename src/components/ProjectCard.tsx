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

  return (
    <div className="bg-[#1E1E2E] rounded-xl border border-gray-700 shadow-md transform transition duration-300 flex flex-col flex-1 h-full max-w-[450px] mx-auto ">
      <div className="md:h-72 rounded-t-xl relative group overflow-hidden aspect-square w-full">
        <img
          src={imgUrl}
          alt={`Medium article cover: ${title}`}
          className="rounded-t-xl h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20"></div>
      </div>
      <div className="text-white rounded-b-xl p-6">
        <Link
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-xl mb-2 text-center cursor-pointer text-white transition-opacity duration-200 hover:opacity-80 hover:underline"
        >
          {title}
        </Link>
      </div>
    </div>
  )
}

export default ProjectCard
