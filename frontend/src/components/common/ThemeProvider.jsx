import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { themeState } from '../../store/atoms/themeAtom'

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useRecoilState(themeState)

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    return children
}
