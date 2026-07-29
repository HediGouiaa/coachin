import { useEffect, useState } from 'react'
import { Trash2, Edit, Eye, EyeOff } from 'lucide-react'
import api from '../../services/api'
import { SpecialEvent } from '../../types'

export default function EventsManagement() {
  const [events, setEvents] = useState<SpecialEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const data = await api.getAllEvents()
      setEvents(data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async (id: string, isPublished: boolean) => {
    try {
      if (isPublished) {
        await api.unpublishEvent(id)
      } else {
        await api.publishEvent(id)
      }
      fetchEvents()
    } catch (error) {
      console.error('Failed to update event:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await api.deleteEvent(id)
        fetchEvents()
      } catch (error) {
        console.error('Failed to delete event:', error)
      }
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Events Management</h2>
        <button className="btn-primary">+ Create Event</button>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">No events created yet.</p>
          <button className="btn-primary">Create Your First Event</button>
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex gap-6 text-sm text-gray-600">
                    {event.eventDate && (
                      <span>📅 {new Date(event.eventDate).toLocaleDateString()}</span>
                    )}
                    {event.location && <span>📍 {event.location}</span>}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handlePublish(event.id, event.isPublished)}
                    className={`p-2 rounded transition-colors ${
                      event.isPublished
                        ? 'text-blue-600 hover:bg-blue-50'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {event.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.isPublished
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {event.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
