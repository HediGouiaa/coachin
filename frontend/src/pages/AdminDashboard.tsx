import { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { BarChart3, Calendar, Settings, LogOut, Users, Zap } from 'lucide-react'
import { useAdminProfile } from '../hooks/useAuth'
import { isAuthenticated, clearAdminData } from '../utils/auth'
import DashboardOverview from '../components/admin/DashboardOverview'
import BookingsManagement from '../components/admin/BookingsManagement'
import AvailabilityManagement from '../components/admin/AvailabilityManagement'
import EventsManagement from '../components/admin/EventsManagement'
import ProfileSettings from '../components/admin/ProfileSettings'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useAdminProfile()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login')
    }
  }, [navigate])

  const handleLogout = () => {
    clearAdminData()
    navigate('/admin/login')
  }

  const isActive = (path: string) => location.pathname.includes(path)

  const menuItems = [
    { icon: BarChart3, label: 'Overview', path: '/admin/dashboard' },
    { icon: Users, label: 'Bookings', path: '/admin/dashboard/bookings' },
    { icon: Calendar, label: 'Availability', path: '/admin/dashboard/availability' },
    { icon: Zap, label: 'Events', path: '/admin/dashboard/events' },
    { icon: Settings, label: 'Profile', path: '/admin/dashboard/profile' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 fixed h-screen overflow-y-auto`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center font-bold">
              C
            </div>
            {sidebarOpen && <span className="font-bold">Admin</span>}
          </Link>
        </div>

        <nav className="mt-8">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center space-x-3 px-6 py-4 transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-600 border-l-4 border-primary-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300`}>
        {/* Header */}
        <div className="bg-white shadow">
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              {profile && <span className="text-gray-700">Welcome, {profile.name}!</span>}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          <Routes>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/dashboard/bookings" element={<BookingsManagement />} />
            <Route path="/dashboard/availability" element={<AvailabilityManagement />} />
            <Route path="/dashboard/events" element={<EventsManagement />} />
            <Route path="/dashboard/profile" element={<ProfileSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
