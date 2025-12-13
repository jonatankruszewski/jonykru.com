import { Button } from '@headlessui/react'
import React from 'react'

type ProjectTagProps = {
  label: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
  isSelected: boolean
}

const ProjectTag = ({ label, onClick, isSelected }: ProjectTagProps) => {
  const buttonStyles = isSelected
    ? 'text-white dark:text-white bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-500 font-semibold shadow-md'
    : 'text-gray-700 dark:text-[#ADB7BE] border-gray-500 dark:border-slate-600 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-opacity-10'

  return (
    <Button
      name={label}
      className={`${buttonStyles} rounded-full border-2 px-4 py-2 text-sm md:px-6 md:py-3 md:text-xl cursor-pointer transition-all duration-300 ease-in-out`}
      onClick={onClick}
    >
      <span className="relative">
        <span className="invisible font-semibold">{label}</span>
        <span className="absolute inset-0 flex items-center justify-center">
          {label}
        </span>
      </span>
    </Button>
  )
}

export default ProjectTag
