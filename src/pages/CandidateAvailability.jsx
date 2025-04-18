import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes, addDays, format, isWithinInterval, isAfter } from 'date-fns';
import { Calendar, Clock, Plus, Check, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';

const CandidateAvailability = () => {
  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 1));
  const [startTime, setStartTime] = useState(setHours(setMinutes(new Date(), 0), 9));
  const [endTime, setEndTime] = useState(setHours(setMinutes(new Date(), 0), 10));
  const [timeSlots, setTimeSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTimeSlot = () => {
    const slotStartTime = new Date(selectedDate);
    slotStartTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

    const slotEndTime = new Date(selectedDate);
    slotEndTime.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

    if (!isAfter(slotEndTime, slotStartTime)) {
      toast.error('End time must be after start time');
      return;
    }

    const hasOverlap = timeSlots.some(slot => {
      const existingStart = new Date(slot.startTime);
      const existingEnd = new Date(slot.endTime);

      return (
        isWithinInterval(slotStartTime, { start: existingStart, end: existingEnd }) ||
        isWithinInterval(slotEndTime, { start: existingStart, end: existingEnd }) ||
        (isAfter(slotEndTime, existingStart) && isAfter(existingEnd, slotStartTime))
      );
    });

    if (hasOverlap) {
      toast.error('This time slot overlaps with an existing one');
      return;
    }

    setTimeSlots([
      ...timeSlots,
      {
        id: Math.random().toString(36).substring(2, 9),
        date: selectedDate,
        startTime: slotStartTime,
        endTime: slotEndTime
      }
    ]);

    toast.success('Time slot added');
  };

  const handleRemoveTimeSlot = (id) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
    toast.success('Time slot removed');
  };

  const handleSubmitAvailability = () => {
    if (timeSlots.length === 0) {
      toast.error('Please add at least one time slot');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      toast.success('Your availability has been submitted');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Availability</h1>

        <Button
          variant="primary"
          onClick={handleSubmitAvailability}
          isLoading={isSubmitting}
          icon={<Check size={18} />}
          className="mt-2 sm:mt-0"
        >
          Submit Availability
        </Button>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Add Available Time Slots</h3>
          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <div className="mt-1 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  minDate={new Date()}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  dateFormat="MMMM d, yyyy"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <div className="mt-1 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
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
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <div className="mt-1 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
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

          <div className="mt-5">
            <Button
              onClick={handleAddTimeSlot}
              variant="outline"
              icon={<Plus size={18} />}
            >
              Add Time Slot
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Your Available Time Slots</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            These times will be used to match you with recruiters.
          </p>
        </div>

        {timeSlots.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {timeSlots.map((slot) => (
              <li key={slot.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span className="font-medium text-gray-900">
                      {format(slot.date, 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveTimeSlot(slot.id)}
                    icon={<Trash2 size={16} />}
                  >
                    Remove
                  </Button>
                </div>

                <div className="mt-2 ml-7 text-sm text-gray-500">
                  <Clock className="mr-2 inline-block h-4 w-4 text-gray-400" aria-hidden="true" />
                  {format(slot.startTime, 'h:mm a')} - {format(slot.endTime, 'h:mm a')}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-5 text-center text-sm text-gray-500 sm:px-6">
            You haven't added any available time slots yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateAvailability;
