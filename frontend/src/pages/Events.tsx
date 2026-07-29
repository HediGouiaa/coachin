import { useEffect, useState } from 'react'
import { Calendar, MapPin, Clock } from 'lucide-react'
import api from '../services/api'
import { SpecialEvent } from '../types'
import { formatDate } from '../utils/date'

export default function Events() {
  const [events, setEvents] = useState<SpecialEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.getPublishedEvents()
        if (Array.isArray(data)) {
          setEvents(data)
        }
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Special Events</h1>
          <p className="text-xl opacity-90">
            exclusive coaching workshops and seminars
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600"></p>
            </div>
          )}

          {!loading && events.length === 0 && (
            <div className="text-center py-20">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h2>
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-12">
              </div>
            </div>
          )}

          {!loading && events.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div key={event.id} className="card hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover mb-4 rounded-lg"
                    />
                  )}

                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{event.title}</h3>

                  {event.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  )}

                  <div className="space-y-2 mb-6 text-sm text-gray-700">
                    <div className="flex items-center space-x-2">
                      <Calendar size={18} className="text-primary-600" />
                      <span>{formatDate(event.eventDate)}</span>
                    </div>

                    {event.eventTime && (
                      <div className="flex items-center space-x-2">
                        <Clock size={18} className="text-primary-600" />
                        <span>{event.eventTime}</span>
                      </div>
                    )}

                    {event.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin size={18} className="text-primary-600" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  {event.registrationLink && (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full text-center block"
                    >
                      Register Now
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
