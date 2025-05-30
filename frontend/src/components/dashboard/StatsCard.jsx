const StatsCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
    const colorClasses = {
        blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
        green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
        purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
        orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
    }

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                    {change && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">{change}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StatsCard
