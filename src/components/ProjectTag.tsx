import React from "react";

type ProjectTagProps = {
    label: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    isSelected: boolean;
};

const ProjectTag = ({ label, onClick, isSelected }: ProjectTagProps) => {
    const buttonStyles = isSelected
        ? "text-white border-primary-500"
        : "text-[#ADB7BE] border-slate-600 hover:border-white";
    return (
        <button
            className={`${buttonStyles} rounded-full border-2 px-6 py-3 text-xl cursor-pointer`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default ProjectTag;
