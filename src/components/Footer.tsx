import React from 'react'

const Footer = () => {
  return (
    <footer className="relative mt-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
      <div className="container mx-auto px-4 md:px-6 lg:px-12 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Jonatan Kruszewski. All rights
            reserved.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Built with Next.js, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
