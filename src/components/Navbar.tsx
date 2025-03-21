"use client";

import React, {useState} from "react";
import MenuOverlay from "@/components/MenuOverlay";
import NavbarLinks from "@/components/NavbarLinks";
import {SquareChevronRight, X} from 'lucide-react';

const Navbar = () => {
    const [navbarOpen, setNavbarOpen] = useState(false);

    return (
        <nav className="fixed border border-[#33353F] top-0 left-0 right-0 z-10 bg-[#121212] bg-opacity-100">

            <div className="flex w-full flex-wrap items-center justify-between px-4 py-4">
                <p>
                    jonykru<span>.</span>com
                </p>
                <div className="mobile-menu block md:hidden">
                    {!navbarOpen ? (
                        <button
                            name="Open Menu"
                            onClick={() => setNavbarOpen(true)}
                            className="cursor-pointer flex items-center px-2 py-2 border-slate-200 text-slate-200 hover:text-white hover:border-white"
                        >
                            <SquareChevronRight />
                        </button>
                    ) : (
                        <button
                            name="Close Menu"
                            onClick={() => setNavbarOpen(false)}
                            className="cursor-pointer flex items-center px-2 py-2 border-slate-200 text-slate-200 hover:text-white hover:border-white"
                        >
                            <X/>
                        </button>
                    )}
                </div>
                <div className="menu hidden md:block md:w-auto" id="navbar">
                    <ul className="flex p-4 md:p-0 md:flex-row md:space-x-8 mt-0">
                        <NavbarLinks/>
                    </ul>
                </div>
            </div>
            {navbarOpen && <MenuOverlay onClick={() => {
                setNavbarOpen(false)
            }}/>}
        </nav>
    );
};

export default Navbar;
