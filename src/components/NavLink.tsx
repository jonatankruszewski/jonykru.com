import type { LinkProps } from 'next/link'
import Link from 'next/link'
import { ReactNode } from 'react'
import { FontRubik } from '@/app/fonts'
import { useI18n } from '@/context/i18nContext'
import { useSectionContext } from '@/context/sectionContext'
import styles from './NavLink.module.css'

type NavLinkProps = {
  href: string
  title: string
  icon?: ReactNode
  onClick?: () => void
} & LinkProps

const NavLink = ({ href, title, icon, onClick }: NavLinkProps) => {
  const { visibleSection, setVisibleSection } = useSectionContext()
  const { isRTL } = useI18n()
  // Extract section ID from href (e.g., "#about" -> "about")
  const sectionId = href.replace('#', '') as typeof visibleSection
  const selected = visibleSection === sectionId

  return (
    <Link
      onClick={() => {
        setVisibleSection(sectionId)
        if (onClick) {
          onClick()
        }
      }}
      href={href}
      className={`${FontRubik.className} py-2 ps-3 pe-4 text-gray-700 dark:text-[#ADB7BE] sm:text-xl md:p-0 hover:text-black dark:hover:text-white flex gap-2 font-light ${selected ? 'text-black dark:text-white font-medium' : ''} ${isRTL ? 'justify-end' : 'justify-start'}`}
    >
      {icon && icon}
      <span className={styles.linkText} data-text={title}>
        {title}
      </span>
    </Link>
  )
}

export default NavLink
