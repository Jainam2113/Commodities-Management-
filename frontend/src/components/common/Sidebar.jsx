import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import {
    Home,
    LayoutDashboard,
    Package,
    Plus,
    BarChart3,
    DollarSign,
    CreditCard,
    Settings,
    Shield,
    HelpCircle,
    X
} from 'lucide-react'

const iconMap = {
    Home,
    LayoutDashboard,
    Package,
    Plus,
    BarChart3,
    DollarSign,
    CreditCard,
    Settings,
    Shield,
    HelpCircle
}

const Sidebar = ({ isOpen, onClose }) => {
    const { state } = useApp()
    const location = useLocation()
    const user = state.auth.user

    const getMenuItems = () => {
        const menuSections = []

        // Main Navigation
        const mainItems = []

        if (user?.role === 'manager') {
            mainItems.push({
                name: 'Dashboard',
                path: '/dashboard',
                icon: 'LayoutDashboard'
            })
        }

        mainItems.push({
            name: 'Products',
            path: '/products',
            icon: 'Package'
        })

        menuSections.push({
            title: null,
            items: mainItems
        })

        // Store Section
        menuSections.push({
            title: 'Store',
            items: [{
                name: 'Add Product',
                path: '/products/add',
                icon: 'Plus'
            }]
        })

        // Analytics Section (Manager only)
        if (user?.role === 'manager') {
            menuSections.push({
                title: 'Analytics',
                items: [
                    {
                        name: 'Analytics',
                        path: '/analytics',
                        icon: 'BarChart3'
                    },
                    {
                        name: 'Revenue',
                        path: '/revenue',
                        icon: 'DollarSign'
                    }
                ]
            })
        }

        // Settings Section
        menuSections.push({
            title: 'Account',
            items: [
                {
                    name: 'Settings',
                    path: '/settings',
                    icon: 'Settings'
                },
                {
                    name: 'Security',
                    path: '/security',
                    icon: 'Shield'
                }
            ]
        })

        // Help Section
        menuSections.push({
            title: 'Support',
            items: [{
                name: 'Help & Support',
                path: '/help',
                icon: 'HelpCircle'
            }]
        })

        return menuSections
    }

    const menuSections = getMenuItems()

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col h-full
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">Bitstore</span>
                    </div>

                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                    {menuSections.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                            {section.title && (
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                    {section.title}
                                </h3>
                            )}
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = iconMap[item.icon] || Package
                                    const isActive = location.pathname === item.path

                                    return (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            onClick={onClose}
                                            className={`sidebar-item ${isActive ? 'active' : ''}`}
                                        >
                                            <Icon className="w-5 h-5 mr-3" />
                                            <span className="font-medium">{item.name}</span>
                                        </NavLink>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User info */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user?.email}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {user?.role === 'manager' ? 'Manager' : 'Store Keeper'}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
