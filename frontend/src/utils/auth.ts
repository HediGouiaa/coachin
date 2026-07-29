export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token)
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token')
}

export const removeAuthToken = () => {
  localStorage.removeItem('token')
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

export const setAdminName = (name: string) => {
  localStorage.setItem('adminName', name)
}

export const getAdminName = (): string | null => {
  return localStorage.getItem('adminName')
}

export const clearAdminData = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('adminName')
}
