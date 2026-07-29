import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuthToken, isAuthenticated, setAuthToken, removeAuthToken, setAdminName } from '../utils/auth'
import api from '../services/api'
import { AdminProfile } from '../types'

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null)
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getAuthToken()
    setToken(token)
    setIsAuth(!!token)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password)
      setAuthToken(response.accessToken)
      api.setAuthHeader(response.accessToken)
      setToken(response.accessToken)
      setIsAuth(true)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Login failed' }
    }
  }

  const logout = () => {
    removeAuthToken()
    api.clearAuth()
    setToken(null)
    setIsAuth(false)
  }

  return {
    token,
    isAuth,
    loading,
    login,
    logout,
  }
}

export const useAdminProfile = () => {
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated()) {
        navigate('/admin/login')
        return
      }

      try {
        const data = await api.getAdminProfile()
        setProfile(data)
        setAdminName(data.name)
        setError(null)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch profile')
        navigate('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  return { profile, loading, error }
}

export const useCoachProfile = () => {
  const [coach, setCoach] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getCoachPublicProfile()
        setCoach(data)
        setError(null)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch coach profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return { coach, loading, error }
}
