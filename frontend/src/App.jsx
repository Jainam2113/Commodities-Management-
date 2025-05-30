import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Layout from './components/common/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import AddProduct from './pages/AddProduct'
import Revenue from './pages/Revenue'
import Analytics from './pages/Analytics'
import ProtectedRoute from './components/common/ProtectedRoute'
import LoadingSpinner from './components/common/LoadingSpinner'

function App() {
    const { state } = useApp()

    if (state.auth.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Routes>
                <Route
                    path="/login"
                    element={state.auth.isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
                />
                <Route
                    path="/"
                    element={<Navigate to={state.auth.isAuthenticated ? "/dashboard" : "/login"} />}
                />

                <Route element={<Layout />}>
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute requiredRoles={['manager']}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/products"
                        element={
                            <ProtectedRoute>
                                <Products />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/products/add"
                        element={
                            <ProtectedRoute>
                                <AddProduct />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/products/edit/:id"
                        element={
                            <ProtectedRoute>
                                <AddProduct />
                            </ProtectedRoute>
                        }          />
                    <Route
                        path="/revenue"
                        element={
                            <ProtectedRoute requiredRoles={['manager']}>
                                <Revenue />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/analytics"
                        element={
                            <ProtectedRoute requiredRoles={['manager']}>
                                <Analytics />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </div>
    )
}

export default App