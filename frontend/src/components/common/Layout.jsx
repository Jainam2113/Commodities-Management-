import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Sidebar from './Sidebar'
import Header from './Header'
import LoadingSpinner from './LoadingSpinner'

const Layout = () => {
    const { state } = useApp()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    if (state.auth.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 lg:flex">
            {/* Sidebar */}
            <Sidebar
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            />

            {/* Main content */}
            <div className="flex-1 lg:ml-0 flex flex-col min-h-screen">
                {/* Header */}
                <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Layout