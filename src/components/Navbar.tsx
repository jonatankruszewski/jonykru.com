'use client'

import { Disclosure } from '@headlessui/react'
import React from 'react'
import DisclosureMenu from '@/components/DisclosureMenu'

const Navbar = () => {
  return (
    <nav>
      <div className="border-1 bg-[#121212] bg-opacity-100 border-b-gray-600 flex w-full  z-40 fixed">
        <Disclosure
          as="div"
          className="flex w-full flex-col text-white mobile-menu justify-between"
        >
          {({ open, close }) => <DisclosureMenu open={open} close={close} />}
        </Disclosure>
      </div>
    </nav>
  )
}

export default Navbar
