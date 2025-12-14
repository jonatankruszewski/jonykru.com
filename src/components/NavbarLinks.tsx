'use client'

import React from 'react'
import NavLink from '@/components/NavLink'
import { useI18n } from '@/context/i18nContext'

type NavbarLinksProps = {
  onClick?: () => void
}

const NavbarLinks = ({ onClick }: NavbarLinksProps) => {
  const { t } = useI18n()

  return (
    <>
      <li>
        <NavLink href={'#about'} title={t('nav.about')} onClick={onClick} />
      </li>
      <li>
        <NavLink
          href={'#publications'}
          title={t('nav.publications')}
          onClick={onClick}
        />
      </li>
      <li>
        <NavLink
          href={'#certifications'}
          title={t('nav.certifications')}
          onClick={onClick}
        />
      </li>
      <li>
        <NavLink href={'#contact'} title={t('nav.contact')} onClick={onClick} />
      </li>
    </>
  )
}

export default NavbarLinks
