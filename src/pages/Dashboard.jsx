import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MeetingCard from '../components/meetings/MeetingCard';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [pastMeetings, setPastMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch meetings - this would normally come from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockUpcoming = [
        {
          id: '1',
          title: 'Technical Interview',
          startTime: new Date(Date.now() + 3600000).toISOString(),
          endTime: new Date(Date.now() + 5400000).toISOString(),
          status: 'scheduled',
          with: {
            name: user?.role === 'candidate' ? 'Sarah Thompson' : 'Alex Johnson',
            role: user?.role === 'candidate' ? 'recruiter' : 'candidate'
          }
        },
        {
          id: '2',
          title: 'Culture Fit Discussion',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          endTime: new Date(Date.now() + 90000000).toISOString(),
          status: 'scheduled',
          with: {
            name: user?.role === 'candidate' ? 'Michael Chen' : 'Emma Davis',
            role: user?.role === 'candidate' ? 'recruiter' : 'candidate'
          }
        }
      ];

      const mockPast = [
        {
          id: '3',
          title: 'Initial Screening',
          startTime: new Date(Date.now() - 259200000).toISOString(),
          endTime: new Date(Date.now() - 255600000).toISOString(),
          status: 'completed',
          with: {
            name: user?.role === 'candidate' ? 'Jessica Williams' : 'Daniel Lee',
            role: user?.role === 'candidate' ? 'recruiter' : 'candidate'
          }
        }
      ];

      setUpcomingMeetings(mockUpcoming);
      setPastMeetings(mockPast);
      setIsLoading(false);
    }, 1000);
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        
        {user?.role === 'candidate' ? (
          <Link to="/availability">
            <Button variant="primary" icon={<Clock size={18} />}>
              Update Availability
            </Button>
          </Link>
        ) : (
          <Link to="/schedule">
            <Button variant="primary" icon={<Calendar size={18} />}>
              View My Schedule
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600">
              <CalendarClock size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Upcoming</h3>
              <p className="text-2xl font-semibold text-gray-900">{upcomingMeetings.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary-100 text-secondary-600">
              <Clock size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Past Interviews</h3>
              <p className="text-2xl font-semibold text-gray-900">{pastMeetings.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent-100 text-accent-600">
              <Calendar size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Next Interview</h3>
              {upcomingMeetings.length > 0 ? (
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(upcomingMeetings[0].startTime).toLocaleString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              ) : (
                <p className="text-gray-500">No upcoming interviews</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Meetings</h2>
          <Link to="/meetings" className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-500">
            View all
            <ArrowUpRight size={14} className="ml-1" />
          </Link>
        </div>

        {upcomingMeetings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
            <p className="text-gray-500">No upcoming meetings</p>
            {user?.role === 'candidate' && (
              <Link to="/availability">
                <Button variant="outline" className="mt-4" size="sm">
                  Set your availability
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Past Meetings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Past Meetings</h2>
          <Link to="/meetings?filter=past" className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-500">
            View all
            <ArrowUpRight size={14} className="ml-1" />
          </Link>
        </div>

        {pastMeetings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pastMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
            <p className="text-gray-500">No past meetings</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
