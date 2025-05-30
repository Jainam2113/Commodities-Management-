import { atom } from 'recoil'

export const productsState = atom({
    key: 'productsState',
    default: {
        products: [],
        loading: false,
        pagination: {
            page: 1,
            limit: 10,
            total: 0,
            pages: 0
        }
    }
})

export const dashboardStatsState = atom({
    key: 'dashboardStatsState',
    default: {
        stats: {
            totalEarning: '0.00',
            totalViews: 0,
            totalSales: 0,
            subscriptions: 0
        },
        recentSales: [],
        loading: false
    }
})