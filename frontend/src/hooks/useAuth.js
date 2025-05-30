import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { authState } from '../store/atoms/authAtom'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

export const useAuth = () => {
    const [auth, setAuth] = useRecoilState(authState)

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token')
            const userData = localStorage.getItem('user')

            if (token && userData) {
                try {
                    // Verify token is still valid
                    const response = await authService.getProfile()
                    setAuth({
                        isAuthenticated: true,
                        user: response.user,
                        token,
                        loading: false
                    })
                } catch (error) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    setAuth(prev => ({ ...prev, loading: false }))
                }
            } else {
                setAuth(prev => ({ ...prev, loading: false }))
            }
        }

        initAuth()
    }, [setAuth])

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password)

            localStorage.setItem('token', response.token)
            localStorage.setItem('user', JSON.stringify(response.user))

            setAuth({
                isAuthenticated: true,
                user: response.user,
                token: response.token,
                loading: false
            })

            toast.success('Login successful!')
            return response
        } catch (error) {
            throw error
        }
    }

    const logout = async () => {
        try {
            await authService.logout()
            setAuth({
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false
            })
            toast.success('Logged out successfully!')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return {
        ...auth,
        login,
        logout
    }
}
