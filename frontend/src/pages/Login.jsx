import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    const { actions } = useApp()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!agreedToTerms) {
            toast.error('Please agree to terms and conditions')
            return
        }

        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields')
            return
        }

        setLoading(true)
        try {
            const response = await actions.login(formData.email, formData.password)

            toast.success('Login successful!')

            // Navigate based on role
            if (response.user.role === 'manager') {
                navigate('/dashboard')
            } else {
                navigate('/products')
            }
        } catch (error) {
            console.error('Login error:', error)
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const fillDemoCredentials = (type) => {
        if (type === 'manager') {
            setFormData({
                email: 'manager@slooze.com',
                password: 'password123'
            })
        } else {
            setFormData({
                email: 'keeper@slooze.com',
                password: 'password123'
            })
        }
        setAgreedToTerms(true)
        toast.success('Demo credentials filled!')
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Sign in to your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="input-field pr-12"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="agree-terms"
                                name="agree-terms"
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                I agree to the{' '}
                                <a href="#" className="text-blue-600 hover:text-blue-500">Terms</a>
                                {' '}and{' '}
                                <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500">OR</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="button"
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Continue with Google
                            </button>

                            <button
                                type="button"
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                Continue with Facebook
                            </button>
                        </div>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
                            🚀 Demo Credentials
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border">
                                <div className="flex-1">
                                    <div className="text-xs font-medium text-gray-900 dark:text-white">Manager Account</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Full dashboard access</div>
                                    <div className="text-xs text-blue-600 dark:text-blue-400 font-mono">manager@slooze.com</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fillDemoCredentials('manager')}
                                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                >
                                    Use
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border">
                                <div className="flex-1">
                                    <div className="text-xs font-medium text-gray-900 dark:text-white">Store Keeper</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Products only access</div>
                                    <div className="text-xs text-blue-600 dark:text-blue-400 font-mono">keeper@slooze.com</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fillDemoCredentials('keeper')}
                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                                >
                                    Use
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white max-w-md mx-auto p-8">
                            <div className="w-32 h-32 mx-auto mb-8 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
                                    <span className="text-2xl font-bold">S</span>
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold mb-4">Welcome to Slooze</h3>
                            <p className="text-lg opacity-90 mb-6">
                                Manage your commodity business with ease and efficiency
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                    <div className="font-semibold">Dashboard</div>
                                    <div className="opacity-75">Real-time analytics</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                    <div className="font-semibold">Products</div>
                                    <div className="opacity-75">Inventory management</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                    <div className="font-semibold">Reports</div>
                                    <div className="opacity-75">Performance insights</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                    <div className="font-semibold">Security</div>
                                    <div className="opacity-75">Role-based access</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login