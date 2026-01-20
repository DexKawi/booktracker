import { useState, useEffect } from "react"

export function useDebounce(value, delay) {
    const [debounceValue, setDebounceValue] = useState(value)

    delay = 500

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounceValue(value)
        }, delay)

        return () => clearTimeout(timeout)
    }, [value, delay])

    return debounceValue
}