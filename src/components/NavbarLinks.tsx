import NavLink from "@/components/NavLink";
import React from "react";

type NavbarLinksProps = {
    onClick?: () => void
}

const NavbarLinks = ({onClick}: NavbarLinksProps) => {
    return <>
        <li>
            <NavLink href={"#about"} title="about" onClick={onClick}/>
        </li>
        <li>
            <NavLink href={"#publications"} title="publications" onClick={onClick}/>
        </li>
        <li>
            <NavLink href={"#certifications"} title="certifications" onClick={onClick}/>
        </li>
        <li>
            <NavLink href={"#contact"} title="contact" onClick={onClick}/>
        </li>
    </>
}

export default NavbarLinks;
