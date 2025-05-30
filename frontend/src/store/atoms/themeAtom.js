import { atom } from 'recoil'

const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('theme')
        if (stored) return stored

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
}

export const themeState = atom({
    key: 'themeState',
    default: getInitialTheme()
})
