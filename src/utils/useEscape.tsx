import {useEffect} from "react";

const ESCAPE_KEY = 27;

export const useEscapeKey = (callback: (e: { keyCode: any }) => void, {
    dependencies = [],
    window: customWindow = window
}: { dependencies?: any[]; window?: Window | null } = {}) => {
    useEffect(() => {
        if (!customWindow || !customWindow.document || !callback) {
            return;
        }

        if (!Array.isArray(dependencies)) {
            return;
        }

        const onKeyPress = (event: { keyCode: any; }) => event.keyCode === ESCAPE_KEY && callback(event);
        window.document.addEventListener('keydown', onKeyPress);
        return () => {
            window.document.removeEventListener('keydown', onKeyPress);
        };
    }, dependencies);
};

export default useEscapeKey;
