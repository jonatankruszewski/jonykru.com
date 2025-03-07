import type {Metadata} from "next";
import {Inter} from 'next/font/google'
import "./globals.css";
import {ReactNode} from "react";
import QueryProvider from "@/components/QueryProvider";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: "Jonatan Kruszewski - Web Developer | Software Engineer",
    description: "Experienced web developer, tech instructor, and Scrum consultant. Offering private lessons, tech guidance, and Agile consulting. Showcasing 24 published articles and nearly 40 certifications. Explore my work and expertise in React, TypeScript, and modern web development."
};

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <QueryProvider>
            {children}
        </QueryProvider>
        </body>
        </html>
    )
}
