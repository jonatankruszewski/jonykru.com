import type { LinkProps } from 'next/link'
import Link from 'next/link'
import { ReactNode } from 'react'
import { FontJetBrainsMono } from '@/app/fonts'
import { useSectionContext } from '@/context/sectionContext'

type NavLinkProps = {
  href: string
  title: string
  icon?: ReactNode
  onClick?: () => void
} & LinkProps

const NavLink = ({ href, title, icon, onClick }: NavLinkProps) => {
  const { visibleSection, setVisibleSection } = useSectionContext()
  const selected = visibleSection === title

  return (
    <Link
      onClick={() => {
        setVisibleSection(title)
        if (onClick) {
          onClick()
        }
      }}
      href={href}
      className={`${FontJetBrainsMono.className} py-2 pl-3 pr-4 text-gray-700 dark:text-[#ADB7BE] sm:text-xl md:p-0 hover:text-black dark:hover:text-white flex gap-2 font-extralight ${selected ? 'text-black dark:text-white font-normal' : ''}`}
    >
      {icon && icon}
      {title}
    </Link>
  )
}

export default NavLink
