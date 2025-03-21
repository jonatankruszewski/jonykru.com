import {useEffect} from "react";

const ESCAPE_KEY = 27;

export const useEscapeKey = (callback: (e: { keyCode: number }) => void, {
    dependencies = [],
    window: customWindow = null
}: { dependencies?: (string | number | boolean)[]; window?: Window | null } = {}) => {
    useEffect(() => {
        if (!customWindow || !customWindow.document || !callback) {
            return;
        }

        if (!Array.isArray(dependencies)) {
            return;
        }

        const onKeyPress = (event: { keyCode: number; }) => event.keyCode === ESCAPE_KEY && callback(event);
        window.document.addEventListener('keydown', onKeyPress);
        return () => {
            window.document.removeEventListener('keydown', onKeyPress);
        };
    }, dependencies);
};

export default useEscapeKey;
