import React, {useRef} from "react";
import NavbarLinks from "@/components/NavbarLinks";
import {Dialog, DialogBackdrop, DialogPanel} from '@headlessui/react'

const MenuOverlay = ({onClick, isOpen}: { onClick: () => void; isOpen: boolean }) => {

    return (
        <Dialog open={isOpen} onClose={onClick} className="absolute bottom-0">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-900/90 transition-opacity duration-300 ease-in-out data-closed:opacity-0"
            />
            <div className="pointer-events-none w-full fixed inset-0 overflow-hidden">
                <DialogPanel
                    transition
                    className="text-white pointer-events-auto w-full transform transition duration-300 ease-in-out data-closed:-translate-y-full sm:duration-300"
                >
                    hello
                    {/*<ul*/}
                    {/*    ref={ref}*/}
                    {/*    className={`flex-1 px-4 sm:px-6 py-4 items-center flex flex-col overflow-y-scroll bg-[#121212]`}*/}
                    {/*>*/}
                    {/*    <NavbarLinks onClick={onClick}/>*/}
                    {/*</ul>*/}
                </DialogPanel>
            </div>
        </Dialog>
    )
};

export default MenuOverlay;
