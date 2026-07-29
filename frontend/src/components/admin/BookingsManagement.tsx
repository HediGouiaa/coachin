import { useEffect, useState } from 'react'
import { Check, X, Trash2 } from 'lucide-react'
import api from '../../services/api'
import { Booking } from '../../types'
import { formatDate, formatTime } from '../../utils/date'
import { useLanguage } from '../../contexts/LanguageContext'
import { getTranslation } from '../../utils/translations'

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('ALL')
  const [rejectionReason, setRejectionReason] = useState<string>('')
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const { language } = useLanguage()

  useEffect(() => {
    fetchBookings()
  }, [filter])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      console.log('📥 Fetching bookings with filter:', filter)
      const data = await api.getAllBookings(
        filter !== 'ALL' ? { status: filter } : undefined
      )
      console.log('✅ Bookings fetched successfully:', data)
      setBookings(data)
    } catch (error) {
      console.error('❌ Failed to fetch bookings:', error)
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    if (confirm(getTranslation('confirmApproval', language))) {
      try {
        await api.approveBooking(id)
        fetchBookings()
      } catch (error) {
        console.error('Failed to approve booking:', error)
        setError('Failed to approve booking')
      }
    }
  }

  const handleReject = async (id: string) => {
    if (confirm(getTranslation('confirmRejection', language))) {
      try {
        await api.rejectBooking(id, rejectionReason || undefined)
        setRejectionReason('')
        setSelectedBookingId(null)
        fetchBookings()
      } catch (error) {
        console.error('Failed to reject booking:', error)
        setError('Failed to reject booking')
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        await api.deleteBooking(id)
        fetchBookings()
      } catch (error) {
        console.error('Failed to delete booking:', error)
        setError('Failed to delete booking')
      }
    }
  }

  if (loading) {
    return <div className="text-center py-12">{getTranslation('loading', language)}</div>
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">{getTranslation('bookings', language)}</h2>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {bookings.length === 0 ? (
          <p className="text-center py-12 text-gray-600">No bookings found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Client</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Time</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Subject</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold">{booking.clientName}</p>
                      <p className="text-sm text-gray-600">{booking.clientEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">{formatDate(booking.sessionDate)}</td>
                  <td className="py-4 px-6">{formatTime(booking.sessionStartTime)}</td>
                  <td className="py-4 px-6">{booking.subject}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-700'
                          : booking.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      {booking.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(booking.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => setSelectedBookingId(booking.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Rejection Modal */}
      {selectedBookingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">{getTranslation('rejectBooking', language)}</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={getTranslation('rejectionReason', language)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleReject(selectedBookingId)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                {getTranslation('reject', language)}
              </button>
              <button
                onClick={() => {
                  setSelectedBookingId(null)
                  setRejectionReason('')
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold"
              >
                {getTranslation('cancel', language)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
