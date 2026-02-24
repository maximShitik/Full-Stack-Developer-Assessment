/**
 * useDebouncedValue
 * -----------------
 * Returns a debounced version of a value.
 * Used to avoid triggering expensive operations
 * (like filtering) on every keystroke.
 */

import { useEffect,useState } from "react";


export function useDebouncedValue(value,delayMs){
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => 
            setDebounced(value) ,delayMs);
        
        return () => clearTimeout(timer);
    }, [value,delayMs]);

    return debounced;
}