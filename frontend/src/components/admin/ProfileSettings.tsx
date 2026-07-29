import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import api from '../../services/api'
import { Coach } from '../../types'

export default function ProfileSettings() {
  const [coach, setCoach] = useState<Coach | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await api.getCoachProfile()
      setCoach(data)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCoach((prev) => prev ? { ...prev, [name]: value } : null)
  }

  const handleSave = async () => {
    if (!coach) return

    try {
      setSaving(true)
      await api.updateCoachProfile(coach)
      setMessage({ type: 'success', text: 'Profile updated successfully' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save profile' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!coach) {
    return <div className="text-center py-12">Profile not found</div>
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Profile Settings</h2>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={coach.name}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="form-label">Title / Specialization</label>
            <input
              type="text"
              name="title"
              value={coach.title}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={coach.email}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="phone"
              value={coach.phone || ''}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Bio</label>
            <textarea
              name="bio"
              value={coach.bio || ''}
              onChange={handleChange}
              rows={4}
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Photo URL</label>
            <input
              type="url"
              name="photoUrl"
              value={coach.photoUrl || ''}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="form-label">Years of Experience</label>
            <input
              type="number"
              name="yearsOfExperience"
              value={coach.yearsOfExperience || ''}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="form-label">Session Duration (minutes)</label>
            <input
              type="number"
              name="sessionDurationMinutes"
              value={coach.sessionDurationMinutes}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Expertise (comma-separated)</label>
            <input
              type="text"
              name="expertise"
              value={coach.expertise || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="Career Coaching, Personal Development, Executive Coaching"
            />
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Certifications (comma-separated)</label>
            <input
              type="text"
              name="certifications"
              value={coach.certifications || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="ICF Certified Coach, Professional Development Specialist"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
