import NavLink from "@/components/NavLink";
import React from "react";

const NavbarLinks = () => {
    return <>
        <li>
            <NavLink href={"#about"} title="About"/>
        </li>
        <li>
            <NavLink href={"#publications"} title="Publications"/>
        </li>
        <li>
            <NavLink href={"#certifications"} title="Certifications"/>
        </li>
        <li>
            <NavLink href={"#contact"} title="Contact"/>
        </li>
    </>
}

export default NavbarLinks;
