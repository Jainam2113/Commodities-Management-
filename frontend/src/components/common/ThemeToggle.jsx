import { useRecoilState } from 'recoil'
import { Sun, Moon } from 'lucide-react'
import { themeState } from '../../store/atoms/themeAtom'

const ThemeToggle = () => {
    const [theme, setTheme] = useRecoilState(themeState)

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
        </button>
    )
}

export default ThemeToggle
