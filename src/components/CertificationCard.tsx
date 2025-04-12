import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { CredlyBadge } from '@/types/credly.types'
import { transformCredlyUrl } from '@/utils/transformCredlyUrl'
import { zigZagSort } from '@/utils/zigZagSort'

type CertificationCardProps = {
  badge: CredlyBadge
}

const CertificationCard: React.FC<CertificationCardProps> = ({
  badge
}: CertificationCardProps) => {
  const skillsNames = badge.badge_template.skills.map(
    (skillEntity) => skillEntity.name
  )
  const title = badge.badge_template.name
  const imgUrl = badge.image_url
  const previewUrl = badge.badge_template.url

  return (
    <li className="overflow-hidden lg:p-6 text-center flex flex-col gap-2">
      <Image
        width={200}
        height={200}
        className="w-full max-w-[200px] mx-auto p-4"
        src={transformCredlyUrl(imgUrl)}
        alt={`${title} Badge`}
      />
      <Link
        href={previewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-xl mb-2 text-center cursor-pointer text-white transition-opacity duration-200 hover:opacity-80 hover:underline"
      >
        {title}
      </Link>
      <div className="flex items-center flex-wrap justify-center">
        {zigZagSort(skillsNames)
          .slice(0, 5)
          .map((skill: string) => {
            return (
              <p
                key={skill}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                {skill}
              </p>
            )
          })}
      </div>
    </li>
  )
}

export default CertificationCard
