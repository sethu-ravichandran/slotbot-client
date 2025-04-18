import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, addWeeks, subWeeks } from 'date-fns';
import { Calendar, ArrowLeft, ArrowRight, Plus, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const RecruiterSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 1 }));
  const [weekDays, setWeekDays] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    setWeekStart(start);
    setWeekDays(
      eachDayOfInterval({
        start,
        end: endOfWeek(currentDate, { weekStartsOn: 1 }),
      })
    );

    // Simulate API call to fetch candidates
    const mockCandidates = [
      { id: '1', name: 'Alex Johnson', email: 'alex@example.com', status: 'pending' },
      { id: '2', name: 'Emma Davis', email: 'emma@example.com', status: 'scheduled' },
      { id: '3', name: 'Daniel Lee', email: 'daniel@example.com', status: 'completed' },
      { id: '4', name: 'Olivia Wilson', email: 'olivia@example.com', status: 'pending' },
    ];
    setCandidates(mockCandidates);
  }, [currentDate]);

  const handlePreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleConnectCalendar = () => {
    setIsConnecting(true);

    // Simulate Nylas API connection
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      toast.success('Calendar connected successfully!');
    }, 2000);
  };

  // Dummy schedule data for the week view
  const scheduledMeetings = [
    {
      id: '1',
      title: 'Interview with Emma Davis',
      day: addDays(weekStart, 1),
      startTime: '10:00',
      endTime: '11:00',
      candidateId: '2',
    },
    {
      id: '2',
      title: 'Technical Assessment with Daniel Lee',
      day: addDays(weekStart, 3),
      startTime: '14:00',
      endTime: '15:30',
      candidateId: '3',
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
        
        <div className="mt-2 sm:mt-0">
          {!isConnected ? (
            <Button
              variant="primary"
              onClick={handleConnectCalendar}
              isLoading={isConnecting}
              icon={<Calendar size={18} />}
            >
              Connect Calendar
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {}}
              icon={<Plus size={18} />}
            >
              Add Scheduling Preferences
            </Button>
          )}
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between bg-white p-4 shadow sm:rounded-lg">
        <button
          type="button"
          onClick={handlePreviousWeek}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          Previous
        </button>
        
        <h2 className="text-lg font-semibold text-gray-900">
          {format(weekStart, 'MMMM d')} - {format(addDays(weekStart, 6), 'MMMM d, yyyy')}
        </h2>
        
        <button
          type="button"
          onClick={handleNextWeek}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Next
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map((day) => (
            <div key={day.toString()} className="py-3 text-center border-r border-gray-200 last:border-r-0">
              <p className="text-xs font-medium text-gray-500 uppercase">{format(day, 'EEE')}</p>
              <p className={`text-lg font-semibold ${
                day.getDate() === new Date().getDate() ? 'text-primary-600' : 'text-gray-900'
              }`}>
                {format(day, 'd')}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 h-96 border-b border-gray-200">
          {weekDays.map((day) => {
            const dayMeetings = scheduledMeetings.filter(
              (meeting) => format(meeting.day, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
            );
            
            return (
              <div key={day.toString()} className="border-r border-gray-200 last:border-r-0 p-2 relative">
                {dayMeetings.map((meeting) => (
                  <div 
                    key={meeting.id}
                    className="absolute inset-x-1 bg-primary-100 border-l-4 border-primary-500 rounded p-2 text-xs"
                    style={{
                      top: `${(parseInt(meeting.startTime.split(':')[0]) - 9) * 20}%`,
                      height: `${(parseInt(meeting.endTime.split(':')[0]) - parseInt(meeting.startTime.split(':')[0])) * 20}%`,
                    }}
                  >
                    <p className="font-medium text-primary-700">{meeting.title}</p>
                    <p className="text-primary-600">{meeting.startTime} - {meeting.endTime}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidates */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Candidates</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage your candidate interviews.
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            icon={<Users size={16} />}
          >
            View All
          </Button>
        </div>
        
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <li key={candidate.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{candidate.name}</p>
                  <p className="text-sm text-gray-500">{candidate.email}</p>
                </div>
                
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    candidate.status === 'scheduled' 
                      ? 'bg-blue-100 text-blue-800' 
                      : candidate.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4"
                  >
                    {candidate.status === 'pending' ? 'Schedule' : 'View'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecruiterSchedule;
