import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Eye, Users, ShoppingCart, Clock, TrendingUp, BarChart3, Download, Filter } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts'

const Analytics = () => {
    const { state } = useApp()
    const [timeFilter, setTimeFilter] = useState('month')
    const [loading, setLoading] = useState(false)

    // Mock analytics data
    const trafficData = [
        { date: '2024-01', visitors: 1200, pageViews: 4800, bounceRate: 45 },
        { date: '2024-02', visitors: 1350, pageViews: 5200, bounceRate: 42 },
        { date: '2024-03', visitors: 1100, pageViews: 4200, bounceRate: 48 },
        { date: '2024-04', visitors: 1800, pageViews: 7200, bounceRate: 38 },
        { date: '2024-05', visitors: 1600, pageViews: 6400, bounceRate: 40 },
        { date: '2024-06', visitors: 2100, pageViews: 8400, bounceRate: 35 },
        { date: '2024-07', visitors: 1950, pageViews: 7800, bounceRate: 37 },
        { date: '2024-08', visitors: 1750, pageViews: 7000, bounceRate: 41 },
        { date: '2024-09', visitors: 2200, pageViews: 8800, bounceRate: 33 },
        { date: '2024-10', visitors: 2350, pageViews: 9400, bounceRate: 31 },
        { date: '2024-11', visitors: 2100, pageViews: 8400, bounceRate: 34 },
        { date: '2024-12', visitors: 2500, pageViews: 10000, bounceRate: 29 }
    ]

    const deviceData = [
        { device: 'Desktop', users: 45, sessions: 2800 },
        { device: 'Mobile', users: 35, sessions: 2200 },
        { device: 'Tablet', users: 20, sessions: 1200 }
    ]

    const topPages = [
        { page: '/products', views: 12500, bounce: 32 },
        { page: '/dashboard', views: 8900, bounce: 28 },
        { page: '/products/add', views: 5600, bounce: 45 },
        { page: '/revenue', views: 4200, bounce: 38 },
        { page: '/analytics', views: 3800, bounce: 42 }
    ]

    const userEngagement = [
        { hour: '00', users: 120 },
        { hour: '02', users: 80 },
        { hour: '04', users: 60 },
        { hour: '06', users: 140 },
        { hour: '08', users: 280 },
        { hour: '10', users: 420 },
        { hour: '12', users: 480 },
        { hour: '14', users: 520 },
        { hour: '16', users: 460 },
        { hour: '18', users: 380 },
        { hour: '20', users: 320 },
        { hour: '22', users: 220 }
    ]

    const handleExport = () => {
        const csvData = trafficData.map(row =>
            `${row.date},${row.visitors},${row.pageViews},${row.bounceRate}`
        ).join('\n')

        const header = 'Date,Visitors,Page Views,Bounce Rate\n'
        const csv = header + csvData

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'analytics-report.csv'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    const totalVisitors = trafficData.reduce((sum, item) => sum + item.visitors, 0)
    const totalPageViews = trafficData.reduce((sum, item) => sum + item.pageViews, 0)
    const avgBounceRate = (trafficData.reduce((sum, item) => sum + item.bounceRate, 0) / trafficData.length).toFixed(1)
    const avgSessionDuration = '2:34'

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-responsive-xl font-bold text-gray-900 dark:text-white">
                        Analytics Dashboard
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Analyze your website traffic and user behavior
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="input-field text-sm"
                    >
                        <option value="week">Last 7 days</option>
                        <option value="month">Last 30 days</option>
                        <option value="quarter">Last 3 months</option>
                        <option value="year">Last 12 months</option>
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

            {/* Analytics Stats Cards */}
            <div className="responsive-grid">
                <div className="stats-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stats-card-title">Total Visitors</div>
                            <div className="stats-card-value">{totalVisitors.toLocaleString()}</div>
                            <div className="stats-card-change flex items-center text-green-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +12.5% vs last period
                            </div>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stats-card-title">Page Views</div>
                            <div className="stats-card-value">{totalPageViews.toLocaleString()}</div>
                            <div className="stats-card-change flex items-center text-green-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +8.2% vs last period
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
                            <div className="stats-card-title">Bounce Rate</div>
                            <div className="stats-card-value">{avgBounceRate}%</div>
                            <div className="stats-card-change flex items-center text-green-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                -3.1% vs last period
                            </div>
                        </div>
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                            <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stats-card-title">Avg Session Duration</div>
                            <div className="stats-card-value">{avgSessionDuration}</div>
                            <div className="stats-card-change flex items-center text-green-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +0:15 vs last period
                            </div>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                            <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Traffic Overview */}
            <div className="card">
                <div className="card-header">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Traffic Overview
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Visitors and page views over time
                    </p>
                </div>
                <div className="card-body">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                                <YAxis stroke="#6B7280" fontSize={12} />
                                <Area
                                    type="monotone"
                                    dataKey="visitors"
                                    stackId="1"
                                    stroke="#3B82F6"
                                    fill="#3B82F6"
                                    fillOpacity={0.6}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pageViews"
                                    stackId="2"
                                    stroke="#10B981"
                                    fill="#10B981"
                                    fillOpacity={0.6}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Analytics */}
            <div className="responsive-grid-3">
                {/* Top Pages */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Top Pages
                        </h3>
                    </div>
                    <div className="card-body">
                        <div className="space-y-3">
                            {topPages.map((page, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {page.page}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {page.views.toLocaleString()} views
                                        </p>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {page.bounce}% bounce
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Device Breakdown */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Device Breakdown
                        </h3>
                    </div>
                    <div className="card-body">
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={deviceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                                    <XAxis dataKey="device" stroke="#6B7280" fontSize={12} />
                                    <YAxis stroke="#6B7280" fontSize={12} />
                                    <Bar dataKey="users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Hourly Traffic */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Hourly Traffic
                        </h3>
                    </div>
                    <div className="card-body">
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={userEngagement}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                                    <XAxis dataKey="hour" stroke="#6B7280" fontSize={12} />
                                    <YAxis stroke="#6B7280" fontSize={12} />
                                    <Line
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Analytics
