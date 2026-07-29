import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle className="text-primary-600" size={64} />
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</p>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the page you are looking for does not exist. Let's get you back on track.
        </p>

        <Link to="/" className="btn-primary inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
