import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { DollarSign, Eye, ShoppingCart, Users, Plus, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Dashboard = () => {
    const { state, actions } = useApp()
    const [timeFilter, setTimeFilter] = useState('month')

    useEffect(() => {
        actions.fetchDashboardStats()
        actions.fetchProducts({ limit: 5 })
    }, [])

    const { stats, recentSales, loading } = state.dashboard

    // Mock chart data - in real app this would come from API
    const monthlyData = [
        { name: 'Jan', value: 1500, sales: 45 },
        { name: 'Feb', value: 1000, sales: 32 },
        { name: 'Mar', value: 800, sales: 28 },
        { name: 'Apr', value: 4500, sales: 89 },
        { name: 'May', value: 2800, sales: 67 },
        { name: 'Jun', value: 4000, sales: 78 },
        { name: 'Jul', value: 4200, sales: 82 },
        { name: 'Aug', value: 600, sales: 23 },
        { name: 'Sep', value: 3000, sales: 58 },
        { name: 'Oct', value: 1200, sales: 34 },
        { name: 'Nov', value: 2800, sales: 65 },
        { name: 'Dec', value: 3200, sales: 71 }
    ]

    const weeklyData = [
        { name: 'Mon', value: 300 },
        { name: 'Tue', value: 200 },
        { name: 'Wed', value: 350 },
        { name: 'Thu', value: 480 },
        { name: 'Fri', value: 400 },
        { name: 'Sat', value: 450 },
        { name: 'Sun', value: 320 }
    ]

    const categoryData = [
        { name: 'Electronics', value: 400, color: '#3B82F6' },
        { name: 'Fashion', value: 300, color: '#10B981' },
        { name: 'Home', value: 300, color: '#F59E0B' },
        { name: 'Sports', value: 200, color: '#EF4444' }
    ]

    if (loading) {
        return <LoadingSpinner size="lg" />
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-responsive-xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Welcome back! Here's what's happening with your store.
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="input-field text-sm"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>

                    <Link
                        to="/products/add"
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Product</span>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="responsive-grid">
                <div className="stats-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stats-card-title">Total Earning</div>
                            <div className="stats-card-value">${stats.totalEarning}</div>
                            <div className="stats-card-change flex items-center text-green-600">
                                <ArrowUp className="w-3 h-3 mr-1" />
                                +12.5% from last month
                            </div>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                            <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stats-card-title">Total Views</div>
                            <div className="stats-card-value">{stats.totalViews?.toLocaleString()}</div>
                            <div className="stats-card-change flex items-center text-green-600">
                                <ArrowUp className="w-3 h-3 mr-1" />
                                +8.2% from last month
                            </div>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                            <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stats-card-title">Total Sales</div>
                            <div className="stats-card-value">{stats.totalSales?.toLocaleString()}</div>
                            <div className="stats-card-change flex items-center text-red-600">
                                <ArrowDown className="w-3 h-3 mr-1" />
                                -2.1% from last month
                            </div>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                            <ShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stats-card-title">Active Users</div>
                            <div className="stats-card-value">{stats.subscriptions?.toLocaleString()}</div>
                            <div className="stats-card-change flex items-center text-green-600">
                                <ArrowUp className="w-3 h-3 mr-1" />
                                +15.3% from last month
                            </div>
                        </div>
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                            <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="responsive-grid-3">
                {/* Revenue Overview */}
                <div className="lg:col-span-2 card">
                    <div className="card-header">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Revenue Overview
                            </h3>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Revenue</span>
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                                    <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                                    <YAxis stroke="#6B7280" fontSize={12} />
                                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Sales */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Recent Sales
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Latest transactions from your store
                        </p>
                    </div>
                    <div className="card-body">
                        <div className="space-y-4 max-h-80 overflow-y-auto">
                            {recentSales.length > 0 ? (
                                recentSales.map((sale, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {sale.customerName?.charAt(0) || 'U'}
                      </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {sale.customerName || 'Customer'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {sale.email || 'customer@example.com'}
                                            </p>
                                        </div>
                                        <div className="text-sm font-medium text-green-600 dark:text-green-400">
                                            {sale.amount}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 dark:text-gray-400">No recent sales</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="responsive-grid-2">
                {/* Sales Trend */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Sales Trend
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Weekly performance overview
                        </p>
                    </div>
                    <div className="card-body">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                                    <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                                    <YAxis stroke="#6B7280" fontSize={12} />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#10B981"
                                        strokeWidth={3}
                                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Category Performance
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Sales by product category
                        </p>
                    </div>
                    <div className="card-body">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {categoryData.map((category, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: category.color }}
                                    ></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                    {category.name}
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="responsive-grid-3">
                {/* Quick Actions */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Quick Actions
                        </h3>
                    </div>
                    <div className="card-body">
                        <div className="space-y-3">
                            <Link
                                to="/products/add"
                                className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Add New Product
                  </span>
                                </div>
                            </Link>

                            <Link
                                to="/products"
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Manage Products
                  </span>
                                </div>
                            </Link>

                            <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    View Analytics
                  </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Top Products
                        </h3>
                    </div>
                    <div className="card-body">
                        <div className="space-y-3">
                            {state.products.items.slice(0, 5).map((product, index) => (
                                <div key={product.id} className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      #{index + 1}
                    </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            ${product.price}
                                        </p>
                                    </div>
                                    <div className="text-xs text-green-600 dark:text-green-400">
                                        {product.views || 0} views
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Performance
                        </h3>
                    </div>
                    <div className="card-body">
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Conversion Rate</span>
                                    <span className="font-medium text-gray-900 dark:text-white">3.2%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Average Order</span>
                                    <span className="font-medium text-gray-900 dark:text-white">$124</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '62%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
                                    <span className="font-medium text-gray-900 dark:text-white">4.8/5</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard