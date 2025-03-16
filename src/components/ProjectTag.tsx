import React from "react";

type ProjectTagProps = {
    label: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    isSelected: boolean;
};

const ProjectTag = ({ label, onClick, isSelected }: ProjectTagProps) => {
    const buttonStyles = isSelected
        ? "text-white bg-primary-500 border-primary-500"
        : "text-[#ADB7BE] border-slate-600 hover:border-white hover:text-white hover:bg-opacity-10";

    return (
        <button
            className={`${buttonStyles} rounded-full border-2 px-4 py-2 text-sm md:px-6 md:py-3 md:text-xl cursor-pointer transition-all duration-300 ease-in-out`} // Adjusted padding and text size, added responsive modifiers, and transition
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default ProjectTag;
