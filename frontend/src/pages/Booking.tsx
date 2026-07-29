import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar as CalendarIcon, Clock, Check, ArrowLeft } from 'lucide-react'
import Calendar from 'react-calendar'
import api from '../services/api'
import { formatDate, formatTime, validateEmail, validatePhone } from '../utils/date'
import { TimeSlot, Coach } from '../types'

type Step = 'date' | 'time' | 'info' | 'confirm' | 'success'

export default function Booking() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('date')
  const [coach, setCoach] = useState<Coach | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    subject: '',
    clientMessage: '',
  })

  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const data = await api.getCoachPublicProfile()
        setCoach(data)
      } catch (err) {
        setError('Failed to load coach information')
      }
    }
    fetchCoach()
  }, [])

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate && step === 'time') {
      const fetchSlots = async () => {
        try {
          setLoading(true)
          const dateStr = selectedDate.toISOString().split('T')[0]
          let slots = await api.getAvailableSlots(dateStr)
          
          // If no slots returned from backend, provide default slots for all days
          if (!slots || slots.length === 0) {
            slots = [
              { startTime: '09:00', endTime: '10:00' },
              { startTime: '10:00', endTime: '11:00' },
              { startTime: '11:00', endTime: '12:00' },
              { startTime: '14:00', endTime: '15:00' },
              { startTime: '15:00', endTime: '16:00' },
              { startTime: '16:00', endTime: '17:00' },
              { startTime: '17:00', endTime: '18:00' },
            ]
          }
          
          setAvailableSlots(slots)
          setError(null)
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to load available slots')
          
          // Provide default slots on error as well
          const defaultSlots = [
            { startTime: '09:00', endTime: '10:00' },
            { startTime: '10:00', endTime: '11:00' },
            { startTime: '11:00', endTime: '12:00' },
            { startTime: '14:00', endTime: '15:00' },
            { startTime: '15:00', endTime: '16:00' },
            { startTime: '16:00', endTime: '17:00' },
            { startTime: '17:00', endTime: '18:00' },
          ]
          setAvailableSlots(defaultSlots)
        } finally {
          setLoading(false)
        }
      }
      fetchSlots()
    }
  }, [selectedDate, step])

  const handleDateSelect = (value: any) => {
    const selectedDateValue = Array.isArray(value) ? value[0] : value

    if (selectedDateValue instanceof Date) {
      setSelectedDate(selectedDateValue)
      setSelectedTime(null)
      setStep('time')
    } else {
      setSelectedDate(null)
      setSelectedTime(null)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep('info')
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = (): boolean => {
    if (!formData.clientName.trim()) {
      setError('Please enter your name')
      return false
    }
    if (!validateEmail(formData.clientEmail)) {
      setError('Please enter a valid email')
      return false
    }
    if (!validatePhone(formData.clientPhone)) {
      setError('Please enter a valid phone number')
      return false
    }
    if (!formData.subject.trim()) {
      setError('Please enter the session subject')
      return false
    }
    return true
  }

  const handleConfirmBooking = async () => {
    if (!validateForm() || !selectedDate || !selectedTime || !coach) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      const bookingData = {
        ...formData,
        sessionDate: selectedDate.toISOString().split('T')[0],
        sessionStartTime: selectedTime,
      }

      const result = await api.createBooking(bookingData)
      setBooking(result)
      setStep('success')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  if (!coach) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {['Date', 'Time', 'Info', 'Confirm'].map((label, index) => (
              <div
                key={index}
                className={`flex-1 text-center ${
                  index < ['date', 'time', 'info', 'confirm'].indexOf(step)
                    ? 'text-green-600'
                    : index === ['date', 'time', 'info', 'confirm'].indexOf(step)
                    ? 'text-primary-600'
                    : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold ${
                    index < ['date', 'time', 'info', 'confirm'].indexOf(step)
                      ? 'bg-green-600 text-white'
                      : index === ['date', 'time', 'info', 'confirm'].indexOf(step)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {index < ['date', 'time', 'info', 'confirm'].indexOf(step) ? (
                    <Check size={20} />
                  ) : (
                    index + 1
                  )}
                </div>
                <p className="text-sm font-semibold">{label}</p>
              </div>
            ))}
          </div>

          <div className="h-1 bg-gray-200 rounded-full">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-300"
              style={{
                width: `${((['date', 'time', 'info', 'confirm', 'success'].indexOf(step)) / 4) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Step 1: Date Selection */}
          {step === 'date' && (
            <div className="animate-slideUp">
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <CalendarIcon className="mr-2" /> Select Date
              </h2>
              <p className="text-gray-600 mb-2">Choose your preferred session date</p>
              <p className="text-sm text-secondary-600 font-semibold mb-6">
                ✓ All days (Monday - Sunday) are available for sessions
              </p>

              <div className="calendar-container mb-6 flex justify-center">
                <Calendar
                  value={selectedDate}
                  onChange={handleDateSelect}
                  minDate={new Date()}
                  tileDisabled={({ date }) => {
                    // Don't disable any days - all days Monday-Sunday are available
                    return date < new Date() && date.toDateString() !== new Date().toDateString()
                  }}
                  className="border border-primary-200 rounded-lg"
                />
              </div>

              {selectedDate && (
                <div className="bg-primary-50 p-4 rounded-lg">
                  <p className="text-primary-900">
                    <strong>Selected Date:</strong> {formatDate(selectedDate)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Time Selection */}
          {step === 'time' && (
            <div className="animate-slideUp">
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <Clock className="mr-2" /> Select Time
              </h2>
              <p className="text-gray-600 mb-4">
                Choose an available time slot for {selectedDate && formatDate(selectedDate)}
              </p>

              {loading && <p className="text-center text-gray-600">Loading available slots...</p>}

              {!loading && availableSlots.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeSelect(slot.startTime)}
                      className={`p-3 rounded-lg font-semibold transition-all ${
                        selectedTime === slot.startTime
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {formatTime(slot.startTime)}
                    </button>
                  ))}
                </div>
              )}

              {selectedTime && (
                <button
                  onClick={() => setStep('info')}
                  className="btn-primary w-full mt-6"
                >
                  Continue
                </button>
              )}

              <button
                onClick={() => setStep('date')}
                className="w-full mt-3 flex items-center justify-center text-primary-600 hover:text-primary-700 font-semibold"
              >
                <ArrowLeft className="mr-2" size={18} />
                Back
              </button>
            </div>
          )}

          {/* Step 3: Personal Information */}
          {step === 'info' && (
            <div className="animate-slideUp">
              <h2 className="text-2xl font-bold mb-6">Your Information</h2>
              <h2 className="text-lg mb-4">Session will be confirmed via email</h2>

              <div className="space-y-4">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleFormChange}
                    className="input-field"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleFormChange}
                    className="input-field"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleFormChange}
                    className="input-field"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Session Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    className="input-field"
                    placeholder="e.g., Career Development"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Additional Message</label>
                  <textarea
                    name="clientMessage"
                    value={formData.clientMessage}
                    onChange={handleFormChange}
                    rows={4}
                    className="input-field"
                    placeholder="Tell us more about what you want to achieve..."
                  />
                </div>
              </div>

              <button
                onClick={() => setStep('confirm')}
                className="btn-primary w-full mt-6"
              >
                Review Booking
              </button>

              <button
                onClick={() => setStep('time')}
                className="w-full mt-3 flex items-center justify-center text-primary-600 hover:text-primary-700 font-semibold"
              >
                <ArrowLeft className="mr-2" size={18} />
                Back
              </button>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 'confirm' && (
            <div className="animate-slideUp">
              <h2 className="text-2xl font-bold mb-6">Confirm Your Booking</h2>

              <div className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Coach</p>
                    <p className="font-bold text-lg">{coach.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Date</p>
                    <p className="font-bold text-lg">{selectedDate && formatDate(selectedDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Time</p>
                    <p className="font-bold text-lg">{selectedTime && formatTime(selectedTime)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Duration</p>
                    <p className="font-bold text-lg">{coach.sessionDurationMinutes} minutes</p>
                  </div>
                </div>

                <hr className="my-4" />

                <div>
                  <p className="text-gray-600 text-sm">Name</p>
                  <p className="font-semibold">{formData.clientName}</p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="font-semibold">{formData.clientEmail}</p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Phone</p>
                  <p className="font-semibold">{formData.clientPhone}</p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Subject</p>
                  <p className="font-semibold">{formData.subject}</p>
                </div>

                {formData.clientMessage && (
                  <div>
                    <p className="text-gray-600 text-sm">Message</p>
                    <p className="font-semibold">{formData.clientMessage}</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={loading}
                className="btn-primary w-full mb-3"
              >
                {loading ? 'Confirming...' : 'Confirm Booking'}
              </button>

              <button
                onClick={() => setStep('info')}
                className="w-full flex items-center justify-center text-primary-600 hover:text-primary-700 font-semibold"
              >
                <ArrowLeft className="mr-2" size={18} />
                Back
              </button>
            </div>
          )}

          {/* Success */}
          {step === 'success' && booking && (
            <div className="animate-slideUp text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-green-600" size={32} />
              </div>

              <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                A confirmation email has been sent to <strong>{formData.clientEmail}</strong>
              </p>

              <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
                <h3 className="font-bold mb-4">Session Details:</h3>
                <p className="mb-2">
                  <span className="text-gray-600">Date:</span> {selectedDate && formatDate(selectedDate)}
                </p>
                <p className="mb-2">
                  <span className="text-gray-600">Time:</span> {selectedTime && formatTime(selectedTime)}
                </p>
                <p>
                  <span className="text-gray-600">Booking ID:</span> {booking.id}
                </p>
              </div>

              <button onClick={() => navigate('/')} className="btn-primary w-full">
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .calendar-container :global(.react-calendar) {
          width: 100%;
          max-width: 400px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          font-family: Arial, Helvetica, sans-serif;
        }
        .calendar-container :global(.react-calendar button) {
          color: #333;
        }
        .calendar-container :global(.react-calendar button:hover) {
          background-color: #e8f0fe;
        }
        .calendar-container :global(.react-calendar__tile--active) {
          background-color: #5b6618;
          color: white;
        }
      `}</style>
    </div>
  )
}
