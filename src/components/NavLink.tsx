import type { LinkProps } from 'next/link'
import Link from 'next/link'
import { ReactNode } from 'react'
import { FontRubik } from '@/app/fonts'
import { useI18n } from '@/context/i18nContext'
import { useSectionContext } from '@/context/sectionContext'

type NavLinkProps = {
  href: string
  title: string
  icon?: ReactNode
  onClick?: () => void
} & LinkProps

const NavLink = ({ href, title, icon, onClick }: NavLinkProps) => {
  const { visibleSection, setVisibleSection } = useSectionContext()
  const { isRTL } = useI18n()
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
      className={`${FontRubik.className} py-2 ps-3 pe-4 text-gray-700 dark:text-[#ADB7BE] sm:text-xl md:p-0 hover:text-black dark:hover:text-white flex gap-2 font-light ${selected ? 'text-black dark:text-white font-medium' : ''} ${isRTL ? 'justify-end' : 'justify-start'}`}
    >
      {icon && icon}
      {title}
    </Link>
  )
}

export default NavLink
