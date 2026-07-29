import { useEffect, useState } from 'react'
import api from '../../services/api'
import { getDayName } from '../../utils/date'

export default function AvailabilityManagement() {
  const [availability, setAvailability] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    try {
      const data = await api.getAvailability()
      setAvailability(data)
    } catch (error) {
      console.error('Failed to fetch availability:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Availability Management</h2>
      <p className="text-gray-600 mb-6">Set your weekly availability schedule.</p>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left py-4 px-6 font-semibold">Day</th>
              <th className="text-left py-4 px-6 font-semibold">Start Time</th>
              <th className="text-left py-4 px-6 font-semibold">End Time</th>
              <th className="text-left py-4 px-6 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {availability.map((avail) => (
              <tr key={avail.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6 font-semibold">{getDayName(avail.dayOfWeek)}</td>
                <td className="py-4 px-6">{avail.startTime}</td>
                <td className="py-4 px-6">{avail.endTime}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      avail.isAvailable
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {avail.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-700">
          💡 To update your schedule, please use the API or contact support.
        </p>
      </div>
    </div>
  )
}
