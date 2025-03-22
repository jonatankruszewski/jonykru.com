"use client";

import React, {Fragment, useRef} from "react";
import {Menu, X} from 'lucide-react';
import {FontJetBrainsMono} from "@/app/fonts";

import NavbarLinks from "@/components/NavbarLinks";
import {DisclosureButton, DisclosurePanel} from '@headlessui/react'
import {AnimatePresence, motion} from 'framer-motion'
import {useOnClickOutside} from 'usehooks-ts'
import {useFocusTrap} from '@mantine/hooks';
import {useEscapeKey} from "@/utils/useEscape";

const DisclosureMenu = ({open, close}: {open: boolean, close: () => void}) => {
    const ref = useRef<HTMLDivElement>(null)
    useOnClickOutside(ref as React.RefObject<HTMLElement>, () => close())
    useEscapeKey(() => close(), {dependencies: [open]})
    const focusTrapRef = useFocusTrap(open);

    return (
        <>
            <div className='flex w-full flex-wrap items-center justify-between px-4 py-4'>
                <p className={`${FontJetBrainsMono.className} py-2 pl-3 pr-4 text-xl md:p-0 select-none bg-gradient-to-br from-indigo-500  to-purple-400 bg-clip-text text-transparent`}>
                    jonykru<span className="text-white">.</span>com
                </p>
                <div className="menu hidden md:block md:w-auto" id="navbar">
                    <ul className="flex p-4 md:p-0 md:flex-row md:space-x-8 mt-0">
                        <NavbarLinks/>
                    </ul>
                </div>
                <DisclosureButton
                    name={open ? 'Close' : "Menu"}
                    className="cursor-pointer px-2 py-2 text-slate-200 hover:text-white hover:border-white md:hidden ml-auto">
                    {open ? <X/> : <Menu/>}
                </DisclosureButton>
            </div>

            <div className="overflow-hidden md:hidden" ref={ref}>
                <div ref={focusTrapRef}>
                    <AnimatePresence>
                        {open && (
                            <DisclosurePanel static as={Fragment}>
                                <motion.div
                                    initial={{opacity: 0, y: -24}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -24}}
                                    transition={{duration: 0.2, ease: "easeInOut"}}
                                    className="origin-top"
                                >
                                    <ul className={`flex-1 px-4 pb-4 flex flex-col overflow-y-scroll bg-[#121212]`}>
                                        <NavbarLinks onClick={close}/>
                                    </ul>
                                </motion.div>
                            </DisclosurePanel>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    )
};

export default DisclosureMenu;
