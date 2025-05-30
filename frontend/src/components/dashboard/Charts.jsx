import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts'

const mockBarData = [
    { name: 'Jan', value: 1500 },
    { name: 'Feb', value: 1000 },
    { name: 'Mar', value: 800 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 2800 },
    { name: 'Jun', value: 4000 },
    { name: 'Jul', value: 4200 },
    { name: 'Aug', value: 600 },
    { name: 'Sep', value: 3000 },
    { name: 'Oct', value: 1200 },
    { name: 'Nov', value: 2800 },
    { name: 'Dec', value: 3200 }
]

const mockLineData = [
    { name: 'Jan', value: 2000 },
    { name: 'Feb', value: 1800 },
    { name: 'Mar', value: 2200 },
    { name: 'Apr', value: 4800 },
    { name: 'May', value: 3200 },
    { name: 'Jun', value: 2800 },
    { name: 'Jul', value: 3600 },
    { name: 'Aug', value: 4200 },
    { name: 'Sep', value: 3800 },
    { name: 'Oct', value: 4000 },
    { name: 'Nov', value: 4500 },
    { name: 'Dec', value: 4800 }
]

const weeklyData = [
    { name: 'Mo', value: 300 },
    { name: 'Tu', value: 200 },
    { name: 'We', value: 350 },
    { name: 'Th', value: 480 },
    { name: 'Fr', value: 400 },
    { name: 'Sa', value: 450 },
    { name: 'Su', value: 320 }
]

export const OverviewChart = () => (
    <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overview</h3>
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
)

export const EarningsChart = () => (
    <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Earning</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$112,893.00</p>
                <p className="text-sm text-gray-500">This Week</p>
            </div>
        </div>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockLineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
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
)

export const WeeklyChart = () => (
    <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Earning</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$112,893.00</p>
                <p className="text-sm text-gray-500">This Week</p>
            </div>
        </div>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
)

