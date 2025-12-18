'use client'

import { Disclosure } from '@headlessui/react'
import React from 'react'
import DisclosureMenu from '@/components/DisclosureMenu'

const Navbar = () => {
  return (
    // Force LTR layout for navbar to maintain consistent order across languages
    <nav dir="ltr">
      <div className="bg-white dark:bg-[#121212] border-b border-b-gray-300 dark:border-b-gray-600 flex w-full z-40 fixed">
        <Disclosure
          as="div"
          className="flex w-full flex-col text-gray-900 dark:text-white mobile-menu justify-between"
        >
          {({ open, close }) => <DisclosureMenu open={open} close={close} />}
        </Disclosure>
      </div>
    </nav>
  )
}

export default Navbar
