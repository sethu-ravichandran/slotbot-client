import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, addWeeks, subWeeks } from 'date-fns';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import axios from 'axios';

const RecruiterSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 0 }));
  const [weekDays, setWeekDays] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [scheduledMeetings, setScheduledMeetings] = useState([]);
  const baseURL = 'http://localhost:3500/';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nylasStatus = params.get("nylas_connected");
    if (nylasStatus) {
      setIsConnected(true);
    }

    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`${baseURL}api/nylas/events`, {
          withCredentials: true,
        });

        const events = response.data.events.data;

        console.log(events)

        const formattedMeetings = events.map(event => {
          const start = new Date(event.when.startTime * 1000);
          const end = new Date(event.when.endTime * 1000);

          return {
            id: event.id,
            title: event.title,
            day: start,
            startTime: format(start, 'HH:mm'),
            endTime: format(end, 'HH:mm'),
            candidateId: null, // Optional, if not available from event
          };
        });

        setScheduledMeetings(formattedMeetings);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        toast.error('Failed to fetch schedule.');
      }
    };

    fetchSchedule();

    const start = startOfWeek(currentDate, { weekStartsOn: 0 }); // Start the week on Sunday
    setWeekStart(start);
    setWeekDays(
      eachDayOfInterval({
        start,
        end: endOfWeek(currentDate, { weekStartsOn: 0 }), // End the week on Saturday
      })
    );
  }, [currentDate]);

  const handlePreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleConnectCalendar = async () => {
    setIsConnecting(true);
    try {
      const response = await axios.post(
        `${baseURL}api/nylas/connect`,
        {},
        { withCredentials: true }
      );
      const { authUrl } = response.data;
      console.log(authUrl)
      window.location.href = authUrl;
      setIsConnected(true)
    } catch (error) {
      console.error('Error connecting calendar:', error);
      toast.error('Failed to connect calendar. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

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
            <Button variant="outline">
              Calendar connected!
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
            <div
              key={day.toString()}
              className={`py-3 text-center border-r border-gray-200 last:border-r-0 ${
                day.getDay() === 0 || day.getDay() === 6 // Sunday or Saturday
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : ''
              }`}
            >
              <p className="text-xs font-medium text-gray-500 uppercase">{format(day, 'EEE')}</p>
              <p
                className={`text-lg font-semibold ${
                  day.getDate() === new Date().getDate() ? 'text-primary-600' : 'text-gray-900'
                }`}
              >
                {format(day, 'd')}
              </p>
            </div>
          ))}
        </div>

        <div className="max-h-[550px] overflow-y-auto border-b border-gray-200">
          <div className="grid grid-cols-7 min-h-[550px]">
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
      </div>
    </div>
  );
};

export default RecruiterSchedule;
