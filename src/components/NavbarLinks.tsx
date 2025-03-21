import NavLink from "@/components/NavLink";
import React from "react";
import {CircleUser, Newspaper, ShieldCheck, UserPen} from 'lucide-react';

type NavbarLinksProps = {
    onClick?: () => void
}

const NavbarLinks = ({onClick}: NavbarLinksProps) => {
    return <>
        <li>
            <NavLink href={"#about"} title="About" icon={<CircleUser/>} onClick={onClick}/>
        </li>
        <li>
            <NavLink href={"#publications"} title="Publications" icon={<Newspaper/>} onClick={onClick}/>
        </li>
        <li>
            <NavLink href={"#certifications"} title="Certifications" icon={<ShieldCheck/>} onClick={onClick}/>
        </li>
        <li>
            <NavLink href={"#contact"} title="Contact" icon={<UserPen/>} onClick={onClick}/>
        </li>
    </>
}

export default NavbarLinks;
