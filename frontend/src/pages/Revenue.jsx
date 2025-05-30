import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, Filter } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Revenue = () => {
    const { state } = useApp()
    const [dateRange, setDateRange] = useState('month')
    const [loading, setLoading] = useState(false)

    // Mock revenue data - in real app this would come from API
    const revenueData = [
        { month: 'Jan', revenue: 45000, profit: 12000, expenses: 33000 },
        { month: 'Feb', revenue: 38000, profit: 10500, expenses: 27500 },
        { month: 'Mar', revenue: 52000, profit: 15600, expenses: 36400 },
        { month: 'Apr', revenue: 61000, profit: 18300, expenses: 42700 },
        { month: 'May', revenue: 55000, profit: 16500, expenses: 38500 },
        { month: 'Jun', revenue: 67000, profit: 20100, expenses: 46900 },
        { month: 'Jul', revenue: 72000, profit: 21600, expenses: 50400 },
        { month: 'Aug', revenue: 58000, profit: 17400, expenses: 40600 },
        { month: 'Sep', revenue: 64000, profit: 19200, expenses: 44800 },
        { month: 'Oct', revenue: 69000, profit: 20700, expenses: 48300 },
        { month: 'Nov', revenue: 73000, profit: 21900, expenses: 51100 },
        { month: 'Dec', revenue: 78000, profit: 23400, expenses: 54600 }
    ]

    const categoryRevenue = [
        { name: 'Electronics', value: 45000, color: '#3B82F6' },
        { name: 'Gaming', value: 32000, color: '#10B981' },
        { name: 'Accessories', value: 18000, color: '#F59E0B' },
        { name: 'Software', value: 12000, color: '#EF4444' },
        { name: 'Others', value: 8000, color: '#8B5CF6' }
    ]

    const weeklyRevenue = [
        { day: 'Mon', revenue: 8500, target: 8000 },
        { day: 'Tue', revenue: 9200, target: 8000 },
        { day: 'Wed', revenue: 7800, target: 8000 },
        { day: 'Thu', revenue: 10100, target: 8000 },
        { day: 'Fri', revenue: 11200, target: 8000 },
        { day: 'Sat', revenue: 12500, target: 8000 },
        { day: 'Sun', revenue: 9800, target: 8000 }
    ]

    const handleExport = () => {
        // Create CSV data
        const csvData = revenueData.map(row =>
            `${row.month},${row.revenue},${row.profit},${row.expenses}`
        ).join('\n')

        const header = 'Month,Revenue,Profit,Expenses\n'
        const csv = header + csvData

        // Create and download file
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'revenue-report.csv'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
    const totalProfit = revenueData.reduce((sum, item) => sum + item.profit, 0)
    const avgMonthlyRevenue = totalRevenue / revenueData.length
    const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-responsive-xl font-bold text-gray-900 dark:text-white">
                        Revenue Analytics
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Track your revenue performance and trends
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="input-field text-sm"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                    </select>

                    <button
                        onClick={handleExport}
                        className="btn-secondary flex items-center space-x-2"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Revenue Stats Cards */}
            <div className="responsive-grid">
                <div className="stats-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stats-card-title">Total Revenue</div>
                            <div className="stats-card-value">${totalRevenue.toLocaleString()}</div>
                            <div className="stats-card-change flex items-center text-green-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +15.2% from last period
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
                            <div className="stats-card-title">Total Profit</div>
                            <div className="stats-card-value">${totalProfit.toLocaleString()}</div>
                            <div className="stats-card-change flex items-center text-green-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +8.7% from last period
                            </div>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stats-card-title">Avg Monthly Revenue</div>
                            <div className="stats-card-value">${avgMonthlyRevenue.toLocaleString()}</div>
                            <div className="stats-card-change flex items-center text-blue-600">
                                <Calendar className="w-3 h-3 mr-1" />
                                Monthly average
                            </div>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                            <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stats-card-title">Profit Margin</div>
                            <div className="stats-card-value">{profitMargin}%</div>
                            <div className="stats-card-change flex items-center text-green-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +2.1% from last period
                            </div>
                        </div>
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                            <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="card">
                <div className="card-header">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Revenue Overview
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Monthly revenue, profit, and expenses breakdown
                    </p>
                </div>
                <div className="card-body">
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                                <YAxis stroke="#6B7280" fontSize={12} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stackId="1"
                                    stroke="#3B82F6"
                                    fill="#3B82F6"
                                    fillOpacity={0.6}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="profit"
                                    stackId="2"
                                    stroke="#10B981"
                                    fill="#10B981"
                                    fillOpacity={0.6}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="expenses"
                                    stroke="#EF4444"
                                    strokeWidth={2}
                                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Charts */}
            <div className="responsive-grid-2">
                {/* Weekly Performance */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Weekly Performance
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Daily revenue vs targets
                        </p>
                    </div>
                    <div className="card-body">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                                    <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                                    <YAxis stroke="#6B7280" fontSize={12} />
                                    <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="target" fill="#10B981" radius={[4, 4, 0, 0]} opacity={0.5} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Category Revenue */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Revenue by Category
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Performance across product categories
                        </p>
                    </div>
                    <div className="card-body">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryRevenue}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryRevenue.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {categoryRevenue.map((category, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: category.color }}
                                        ></div>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                      {category.name}
                    </span>
                                    </div>
                                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                    ${category.value.toLocaleString()}
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Revenue
