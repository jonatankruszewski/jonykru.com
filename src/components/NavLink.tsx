import Link from "next/link";
import type { LinkProps } from 'next/link'
import {ReactNode} from "react";

type NavLinkProps = {
    href: string;
    title: string;
    icon?: ReactNode;
    onClick?: () => void;
} & LinkProps;

const NavLink = ({ href, title, icon, onClick} : NavLinkProps) => {
    return (
        <Link
            onClick={onClick}
            href={href}
            className="py-2 pl-3 pr-4 text-[#ADB7BE] sm:text-xl rounded md:p-0 hover:text-white flex gap-2"
        >
            {icon && icon}
            {title}
        </Link>
    );
};

export default NavLink;
