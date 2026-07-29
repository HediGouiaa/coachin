import { useEffect, useState } from 'react'
import { TrendingUp, Calendar, CheckCircle, Clock } from 'lucide-react'
import api from '../../services/api'
import { BookingStats, Booking } from '../../types'

export default function DashboardOverview() {
  const [stats, setStats] = useState<BookingStats | null>(null)
  const [todayBookings, setTodayBookings] = useState<Booking[]>([])
  const [allBookings, setAllBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [weekOffset, setWeekOffset] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, bookingsData, allBookingsData] = await Promise.all([
          api.getBookingStats(),
          api.getTodayBookings(),
          api.getAllBookings(),
        ])
        setStats(statsData)
        setTodayBookings(bookingsData)
        setAllBookings(allBookingsData)
        console.log('Fetched bookings:', allBookingsData)
        console.log('Total bookings count:', allBookingsData?.length || 0)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        setAllBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  // Helper functions for weekly schedule
  const getDaysForWeek = (offset: number) => {
    const today = new Date()
    const firstDay = new Date(today)
    firstDay.setDate(today.getDate() - today.getDay() + offset * 7)
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDay)
      date.setDate(firstDay.getDate() + i)
      days.push(date)
    }
    return days
  }

  const getBookingsForDayHour = (date: Date, hour: number): Booking[] => {
    const dateStr = date.toISOString().split('T')[0]
    
    return allBookings.filter((booking) => {
      // Handle different date formats (ISO, etc.)
      const bookingDate = booking.sessionDate.split('T')[0] // Remove time if present
      
      if (bookingDate !== dateStr) return false
      
      const startHour = parseInt(booking.sessionStartTime.split(':')[0])
      return startHour === hour
    })
  }

  const days = getDaysForWeek(weekOffset)
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const statCards = [
    { label: 'Total Bookings', value: stats?.total || 0, icon: TrendingUp, color: 'primary' },
    { label: 'Upcoming', value: stats?.upcoming || 0, icon: Calendar, color: 'secondary' },
    { label: 'Confirmed', value: stats?.confirmed || 0, icon: CheckCircle, color: 'green' },
    { label: 'Pending', value: stats?.pending || 0, icon: Clock, color: 'yellow' },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Welcome Back!</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon
          const colorClasses = {
            primary: 'bg-primary-100 text-primary-600',
            secondary: 'bg-secondary-100 text-secondary-600',
            green: 'bg-green-100 text-green-600',
            yellow: 'bg-yellow-100 text-yellow-600',
          }

          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">{card.label}</p>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${colorClasses[card.color as keyof typeof colorClasses]}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Today's Bookings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Today's Sessions</h3>

        {todayBookings.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No sessions scheduled for today.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Client</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Subject</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {todayBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">{booking.sessionStartTime}</td>
                    <td className="py-4 px-4">{booking.clientName}</td>
                    <td className="py-4 px-4">{booking.subject}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Weekly Schedule Table */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Weekly Schedule - Booked Sessions</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-semibold"
            >
              ← Previous Week
            </button>
            <button
              onClick={() => setWeekOffset(0)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-semibold"
            >
              Today
            </button>
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-semibold"
            >
              Next Week →
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Week of {days[0].toLocaleDateString()} - {days[6].toLocaleDateString()}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-2 py-2 bg-gray-100 text-left text-sm font-semibold text-gray-700 w-24">
                  Day
                </th>
                {hours.map((hour) => (
                  <th
                    key={hour}
                    className="border px-1 py-2 bg-gray-100 text-center text-xs font-semibold text-gray-700 w-12"
                  >
                    {hour.toString().padStart(2, '0')}:00
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day, dayIndex) => (
                <tr key={dayIndex}>
                  <td className="border px-2 py-2 bg-gray-50 font-semibold text-sm text-gray-700 w-24">
                    <div>{dayNames[day.getDay()]}</div>
                    <div className="text-xs text-gray-600">{day.toLocaleDateString()}</div>
                  </td>
                  {hours.map((hour) => {
                    const bookings = getBookingsForDayHour(day, hour)
                    const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED')
                    const pendingBookings = bookings.filter((b) => b.status === 'PENDING')
                    
                    // Determine cell background color based on bookings
                    let cellBgColor = ''
                    let indicatorBgColor = ''
                    let displayBooking = null
                    
                    if (confirmedBookings.length > 0) {
                      cellBgColor = 'bg-green-100'
                      indicatorBgColor = 'bg-green-500'
                      displayBooking = confirmedBookings[0]
                    } else if (pendingBookings.length > 0) {
                      cellBgColor = 'bg-yellow-100'
                      indicatorBgColor = 'bg-yellow-500'
                      displayBooking = pendingBookings[0]
                    }
                    
                    return (
                      <td
                        key={`${dayIndex}-${hour}`}
                        className={`border px-1 py-2 text-center w-12 relative transition-colors ${cellBgColor} ${cellBgColor ? 'hover:opacity-75' : 'hover:bg-blue-50'}`}
                      >
                        {displayBooking && (
                          <div className="relative group">
                            <div className={`${indicatorBgColor} text-white text-xs rounded px-1 py-1 font-semibold`}>
                              ✓
                            </div>
                            {/* Tooltip */}
                            <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                              {displayBooking.clientName} - {displayBooking.subject} ({displayBooking.status})
                            </div>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
          <p className="font-semibold mb-2">Legend:</p>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">✓</span>
              <span>= Confirmed booking (green cell)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">✓</span>
              <span>= Pending booking (yellow cell)</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Hover over a checkmark to see client name and subject</p>
          <p className="text-xs text-gray-500 mt-3 font-mono">
            📊 Loaded bookings: {allBookings.length} | Status: {allBookings.length === 0 ? '⚠️ No data' : '✓ Data loaded'}
          </p>
        </div>
      </div>
    </div>
  )
}
