import { Navigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import LoadingSpinner from './LoadingSpinner'

const ProtectedRoute = ({ children, requiredRoles = null }) => {
    const { state } = useApp()

    if (state.auth.loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (!state.auth.isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (requiredRoles && !requiredRoles.includes(state.auth.user?.role)) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Access Denied
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        You don't have permission to access this page.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Required role: {requiredRoles?.join(', ')}
                    </p>
                </div>
            </div>
        )
    }

    return children
}

export default ProtectedRoute
