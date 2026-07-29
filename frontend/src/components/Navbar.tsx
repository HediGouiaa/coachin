import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import { isAuthenticated, removeAuthToken } from '../utils/auth'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../utils/translations'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const auth = isAuthenticated()
  const { language } = useLanguage()

  const handleLogout = () => {
    removeAuthToken()
    navigate('/admin/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary-600">
            <img src="/logo.png" alt="Coaching Platform" width="100rem" />
          </Link>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-semibold transition-colors ${
                isActive('/') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              {getTranslation('home', language)}
            </Link>
            <Link
              to="/booking"
              className={`font-semibold transition-colors ${
                isActive('/booking') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              {getTranslation('bookSession', language)}
            </Link>
            <Link
              to="/events"
              className={`font-semibold transition-colors ${
                isActive('/events') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              {getTranslation('events', language)}
            </Link>

            <LanguageSwitcher />

            {auth ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-semibold"
                >
                  <LogOut size={18} />
                  <span>{getTranslation('logout', language)}</span>
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-primary-600"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slideDown">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {getTranslation('home', language)}
            </Link>
            <Link
              to="/booking"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {getTranslation('bookSession', language)}
            </Link>
            <Link
              to="/events"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {getTranslation('events', language)}
            </Link>

            <div className="px-4 py-2">
              <LanguageSwitcher />
            </div>

            {auth ? (
              <button
                onClick={() => {
                  handleLogout()
                  setIsOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg font-semibold"
              >
                {getTranslation('logout', language)}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  )
}
