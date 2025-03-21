import React from "react";
import NavbarLinks from "@/components/NavbarLinks";
import { useRef } from 'react'

import { useOnClickOutside } from 'usehooks-ts'

const MenuOverlay = ({onClick}: { onClick: () => void }) => {
    const ref = useRef<HTMLUListElement>(null)
    useOnClickOutside(ref as React.RefObject<HTMLElement>, onClick)

    return (
        <ul ref={ref} className="bg-[#121212] flex flex-col py-4 items-center">
            <NavbarLinks onClick={onClick}/>
        </ul>
    );
};

export default MenuOverlay;
