import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CalendarDays, Clock, User, MapPin, Calendar, X, Video } from 'lucide-react';
import Button from '../components/ui/Button';
import { format } from 'date-fns';

const MeetingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockMeeting = {
        id: id || '1',
        title: 'Technical Interview',
        startTime: new Date(Date.now() + 3600000).toISOString(),
        endTime: new Date(Date.now() + 5400000).toISOString(),
        location: 'Virtual Meeting',
        videoLink: 'https://meet.google.com/abc-defg-hij',
        description: 'This technical interview will cover fundamental programming concepts, data structures, and algorithms. Please be prepared to solve coding problems in real-time.',
        status: 'scheduled',
        with: {
          name: 'Sarah Thompson',
          email: 'sarah@example.com',
          role: 'recruiter'
        }
      };

      setMeeting(mockMeeting);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleCancelMeeting = () => {
    setCancelLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setCancelLoading(false);
      toast.success('Meeting cancelled successfully');
      if (meeting) {
        setMeeting({
          ...meeting,
          status: 'cancelled'
        });
      }
    }, 1500);
  };

  const handleAddToCalendar = () => {
    toast.success('Meeting added to your calendar');
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Meeting not found</h2>
        <p className="text-gray-600 mb-6">The meeting you're looking for doesn't exist or you don't have access to it.</p>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const startDate = new Date(meeting.startTime);
  const endDate = new Date(meeting.endTime);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{meeting.title}</h1>
          <div className="mt-1 flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              meeting.status === 'scheduled' 
                ? 'bg-blue-100 text-blue-800' 
                : meeting.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:mt-0 sm:flex-row sm:space-x-3">
          {meeting.status === 'scheduled' && (
            <>
              <Button
                variant="primary"
                onClick={handleAddToCalendar}
                icon={<Calendar size={18} />}
              >
                Add to Calendar
              </Button>
              
              <Button
                variant="outline"
                onClick={handleCancelMeeting}
                isLoading={cancelLoading}
                icon={<X size={18} />}
                className="mt-3 sm:mt-0"
              >
                Cancel Meeting
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Meeting Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about the scheduled interview.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {format(startDate, 'EEEE, MMMM d, yyyy')}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                Time
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <User className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                {meeting.with.role === 'recruiter' ? 'Recruiter' : 'Candidate'}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {meeting.with.name} ({meeting.with.email})
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                Location
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {meeting.location}
                {meeting.videoLink && (
                  <div className="mt-2">
                    <a
                      href={meeting.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Video size={16} className="mr-2" />
                      Join Video Call
                    </a>
                  </div>
                )}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {meeting.description}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetails;
