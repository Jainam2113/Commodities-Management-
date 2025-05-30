import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Search, Bell, Grid3X3, Menu, X, Sun, Moon, User } from 'lucide-react'

const Header = ({ onMobileMenuToggle }) => {
    const { state, actions } = useApp()
    const [searchTerm, setSearchTerm] = useState('')
    const [showUserMenu, setShowUserMenu] = useState(false)

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            actions.fetchProducts({ search: searchTerm })
        }
    }

    const handleLogout = () => {
        actions.logout()
        setShowUserMenu(false)
    }

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Mobile menu button */}
                    <button
                        onClick={onMobileMenuToggle}
                        className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Search */}
                    <div className="flex items-center flex-1 max-w-md mx-4">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-10 pr-20"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Theme toggle */}
                        <button
                            onClick={actions.toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            title="Toggle theme"
                        >
                            {state.theme === 'light' ? (
                                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            ) : (
                                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            )}
                        </button>

                        {/* Notifications */}
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
                            <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Grid menu */}
                        <button className="hidden sm:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <Grid3X3 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </button>

                        {/* User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {state.auth.user?.email?.charAt(0).toUpperCase()}
                  </span>
                                </div>
                                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {state.auth.user?.role === 'manager' ? 'Manager' : 'Store Keeper'}
                </span>
                            </button>

                            {/* User dropdown */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {state.auth.user?.email}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {state.auth.user?.role}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
