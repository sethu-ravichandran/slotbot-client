import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Button from '../components/ui/Button'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { setHours, setMinutes } from 'date-fns'
import { Clock, ClockFading, Sparkles } from 'lucide-react'
import InputField from '../components/ui/InputField'
import { api } from '../util/axiosConfig'

const RecruiterCandidates = () => {
  const [candidates, setCandidates] = useState([])
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [duration, setDuration] = useState(60)
  const [startTime, setStartTime] = useState(
    setHours(setMinutes(new Date(), 0), 10)
  )
  const [endTime, setEndTime] = useState(
    setHours(setMinutes(new Date(), 0), 17)
  )
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await api.get(`schedule/candidates`)

        setCandidates(response.data.candidates)
      } catch (error) {
        console.error('Error fetching candidates:', error)
        toast.error('Failed to fetch candidates.')
      }
    }
    fetchCandidates()
  }, [])

  const handleSchedule = async (candidateId) => {
    try {
      const response = await api.get(`availability/${candidateId}`)
  
      setSelectedCandidate(response.data.candidate)
      setAvailableSlots(response.data.availableSlots || [])
      setIsModalOpen(true)
  
      if (response.data.candidate.status === 'scheduled') {
        const meetingResponse = await api.get(`meetings/`)
  
        const meetingData = meetingResponse.data.meetings
  
        // Filter meetings by the selected candidate's ID
        const candidateMeetings = meetingData.filter(
          (meeting) => meeting.candidateId === candidateId
        )
  
        setAvailableSlots(candidateMeetings)
      }
    } catch (error) {
      console.error('Error fetching candidate slots or meetings:', error)
      toast.error('Failed to fetch candidate slots or meeting details.')
    }
  }
  

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCandidate(null)
    setAvailableSlots([])
  }

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  const formatTime = (date) => {
    let hours = date.getHours()
    let minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    minutes = String(minutes).padStart(2, '0')
    return `${hours}.${minutes} ${ampm}`
  }

  const handleAiSchedule = async (candidateId) => {
    const response = await api.post(`ai/match`, {
      duration,
      candidateId,
      preferences: { startTime, endTime }
    })

    if (response.status == 200) {
      navigate('/schedule')
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Scheduling Preferences
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Update your scheduling preferences.</p>

            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duration (per meeting)
                </label>
                <div className="mt-1 flex items-center">
                  <InputField
                    id="name"
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Duration in minutes"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preferred Start Time
                </label>
                <div className="mt-1 flex items-center">
                  <Clock
                    className="mr-2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <DatePicker
                    selected={startTime}
                    onChange={(time) => setStartTime(time)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preferred End Time
                </label>
                <div className="mt-1 flex items-center">
                  <Clock
                    className="mr-2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <DatePicker
                    selected={endTime}
                    onChange={(time) => setEndTime(time)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Candidates
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage your candidate interviews.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <li
                key={candidate._id}
                className="px-4 py-4 sm:px-6 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">{candidate.name}</p>
                  <p className="text-sm text-gray-500">{candidate.email}</p>
                </div>

                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      candidate.status === 'available'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {candidate.status === 'available' ? 'Pending' : 'Scheduled'}
                  </span>

                  <Button
                    variant="primary"
                    size="sm"
                    className="ml-4"
                    onClick={() => handleSchedule(candidate._id)}
                  >
                    {candidate.status === 'available' ? 'Schedule' : 'View'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">
              {selectedCandidate?.status === 'scheduled'
                ? `Scheduled Meeting with ${selectedCandidate?.name}`
                : `Available Slots for ${selectedCandidate?.name}`}
            </h2>

            {availableSlots.length > 0 ? (
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {availableSlots.map((slot, index) => {
                  const start = new Date(slot.startTime)
                  const end = new Date(slot.endTime)

                  return (
                    <li
                      key={index}
                      className="p-2 bg-gray-100 rounded flex justify-between"
                    >
                      <span>{formatDate(start)}</span>
                      <span>{`${formatTime(start)} - ${formatTime(end)}`}</span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-gray-500">No available slots found.</p>
            )}

            <div className="mt-6 space-x-4 flex justify-end">
              {selectedCandidate?.status === 'available' && (
                <Button
                  variant="primary"
                  onClick={() => handleAiSchedule(selectedCandidate._id)}
                >
                  {selectedCandidate?.status === 'scheduled'
                    ? 'Reschedule'
                    : 'Schedule'}
                  <Sparkles size={14} />
                </Button>
              )}

              <Button variant="outline" onClick={closeModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecruiterCandidates
