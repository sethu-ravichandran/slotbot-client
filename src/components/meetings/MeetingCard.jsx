import React from 'react';
import { Link } from 'react-router-dom';
import { format, isAfter } from 'date-fns';
import { CalendarDays, Clock, User, ArrowRight } from 'lucide-react';

const MeetingCard = ({ meeting }) => {
  const startDate = new Date(meeting.startTime);
  const endDate = new Date(meeting.endTime);
  const isUpcoming = isAfter(startDate, new Date());

  const getStatusColor = () => {
    switch (meeting.status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="p-5">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{meeting.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
          </span>
        </div>
        
        <div className="space-y-3 mt-3">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarDays size={16} className="mr-2 text-gray-400" />
            {format(startDate, 'EEEE, MMMM d, yyyy')}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2 text-gray-400" />
            {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <User size={16} className="mr-2 text-gray-400" />
            <span>
              With <span className="font-medium">{meeting.with.name}</span> 
              <span className="text-xs text-gray-500 ml-1">({meeting.with.role})</span>
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-5 py-3">
        <Link
          to={`/meetings/${meeting.id}`}
          className="flex w-full items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          View details
          <ArrowRight size={14} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default MeetingCard;
