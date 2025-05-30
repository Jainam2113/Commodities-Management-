import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/authService'
import { productService } from '../services/productService'

const AppContext = createContext()

const initialState = {
    // Auth State
    auth: {
        isAuthenticated: false,
        user: null,
        token: null,
        loading: true
    },
    // Theme State
    theme: localStorage.getItem('theme') || 'light',
    // Products State
    products: {
        items: [],
        loading: false,
        pagination: {
            page: 1,
            limit: 10,
            total: 0,
            pages: 0
        }
    },
    // Dashboard State
    dashboard: {
        stats: {
            totalEarning: '0.00',
            totalViews: 0,
            totalSales: 0,
            subscriptions: 0
        },
        recentSales: [],
        loading: false
    }
}

function appReducer(state, action) {
    switch (action.type) {
        case 'SET_AUTH':
            return {
                ...state,
                auth: { ...state.auth, ...action.payload }
            }
        case 'SET_THEME':
            localStorage.setItem('theme', action.payload)
            return {
                ...state,
                theme: action.payload
            }
        case 'SET_PRODUCTS':
            return {
                ...state,
                products: { ...state.products, ...action.payload }
            }
        case 'SET_DASHBOARD':
            return {
                ...state,
                dashboard: { ...state.dashboard, ...action.payload }
            }
        case 'LOGOUT':
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            return {
                ...state,
                auth: {
                    isAuthenticated: false,
                    user: null,
                    token: null,
                    loading: false
                }
            }
        default:
            return state
    }
}

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState)

    // Initialize auth on app load
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token')
            const userData = localStorage.getItem('user')

            if (token && userData) {
                try {
                    const response = await authService.getProfile()
                    dispatch({
                        type: 'SET_AUTH',
                        payload: {
                            isAuthenticated: true,
                            user: response.user,
                            token,
                            loading: false
                        }
                    })
                } catch (error) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    dispatch({
                        type: 'SET_AUTH',
                        payload: { loading: false }
                    })
                }
            } else {
                dispatch({
                    type: 'SET_AUTH',
                    payload: { loading: false }
                })
            }
        }

        initAuth()
    }, [])

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(state.theme)
    }, [state.theme])

    const actions = {
        // Auth Actions
        login: async (email, password) => {
            try {
                const response = await authService.login(email, password)

                localStorage.setItem('token', response.token)
                localStorage.setItem('user', JSON.stringify(response.user))

                dispatch({
                    type: 'SET_AUTH',
                    payload: {
                        isAuthenticated: true,
                        user: response.user,
                        token: response.token,
                        loading: false
                    }
                })

                return response
            } catch (error) {
                throw error
            }
        },

        logout: async () => {
            try {
                await authService.logout()
                dispatch({ type: 'LOGOUT' })
            } catch (error) {
                console.error('Logout error:', error)
                dispatch({ type: 'LOGOUT' })
            }
        },

        // Theme Actions
        toggleTheme: () => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light'
            dispatch({ type: 'SET_THEME', payload: newTheme })
        },

        // Product Actions
        fetchProducts: async (params = {}) => {
            dispatch({
                type: 'SET_PRODUCTS',
                payload: { loading: true }
            })

            try {
                const data = await productService.getProducts(params)
                dispatch({
                    type: 'SET_PRODUCTS',
                    payload: {
                        items: data.products,
                        pagination: data.pagination,
                        loading: false
                    }
                })
            } catch (error) {
                console.error('Fetch products error:', error)
                dispatch({
                    type: 'SET_PRODUCTS',
                    payload: { loading: false }
                })
            }
        },

        createProduct: async (productData) => {
            try {
                const product = await productService.createProduct(productData)
                // Refresh products list
                actions.fetchProducts()
                return product
            } catch (error) {
                throw error
            }
        },

        updateProduct: async (id, productData) => {
            try {
                const product = await productService.updateProduct(id, productData)
                // Refresh products list
                actions.fetchProducts()
                return product
            } catch (error) {
                throw error
            }
        },

        deleteProduct: async (id) => {
            try {
                await productService.deleteProduct(id)
                // Refresh products list
                actions.fetchProducts()
            } catch (error) {
                throw error
            }
        },

        // Dashboard Actions
        fetchDashboardStats: async () => {
            dispatch({
                type: 'SET_DASHBOARD',
                payload: { loading: true }
            })

            try {
                const data = await productService.getDashboardStats()
                dispatch({
                    type: 'SET_DASHBOARD',
                    payload: {
                        stats: data.stats,
                        recentSales: data.recentSales,
                        loading: false
                    }
                })
            } catch (error) {
                console.error('Fetch dashboard error:', error)
                dispatch({
                    type: 'SET_DASHBOARD',
                    payload: { loading: false }
                })
            }
        }
    }

    return (
        <AppContext.Provider value={{ state, actions }}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useApp must be used within AppProvider')
    }
    return context
}
