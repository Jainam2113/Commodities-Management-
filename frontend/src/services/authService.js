import api from './api'

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password })
        return response.data
    },

    register: async (email, password, role = 'store_keeper') => {
        const response = await api.post('/auth/register', { email, password, role })
        return response.data
    },

    getProfile: async () => {
        const response = await api.get('/auth/me')
        return response.data
    },

    logout: async () => {
        await api.post('/auth/logout')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }
}