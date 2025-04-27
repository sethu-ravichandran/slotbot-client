import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes, addDays, addHours, format, isWeekend } from 'date-fns';
import { Calendar, Clock, Plus, Check, Trash2, X } from 'lucide-react';
import Button from '../components/ui/Button';

const MAX_SLOTS = 5;

const CandidateAvailability = () => {
  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 1));
  const [startTime, setStartTime] = useState(setHours(setMinutes(new Date(), 0), 9));
  const [endTime, setEndTime] = useState(addHours(setHours(setMinutes(new Date(), 0), 9), 1));
  const [existingTimeSlots, setExistingTimeSlots] = useState([]);
  const [newTimeSlots, setNewTimeSlots] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [slotToDelete, setSlotToDelete] = useState(null); // for modal confirmation
  const [isDeleting, setIsDeleting] = useState(false); // loading for delete button

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  useEffect(() => {
    setEndTime(addHours(startTime, 1));
  }, [startTime]);

  const fetchTimeSlots = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get('http://localhost:3500/api/availability/', {
        withCredentials: true,
        params: { status: 'available' }
      });
      setExistingTimeSlots(response.data.timeSlots || []);
    } catch (error) {
      toast.error('Failed to fetch availability.');
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddTimeSlot = () => {
    if (existingTimeSlots.length + newTimeSlots.length >= MAX_SLOTS) {
      toast.error(`You can only add up to ${MAX_SLOTS} time slots.`);
      return;
    }

    if (isWeekend(selectedDate)) {
      toast.error('Cannot select a Saturday or Sunday.');
      return;
    }

    const slotStartTime = new Date(selectedDate);
    slotStartTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

    const slotEndTime = new Date(selectedDate);
    slotEndTime.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

    const durationMinutes = (slotEndTime - slotStartTime) / (1000 * 60);
    if (durationMinutes !== 60) {
      toast.error('Slot must be exactly 1 hour.');
      return;
    }

    const hasOverlap = [...existingTimeSlots, ...newTimeSlots].some(slot => {
      const existingStart = new Date(slot.startTime);
      const existingEnd = new Date(slot.endTime);

      return (
        (slotStartTime > existingStart && slotStartTime < existingEnd) ||
        (slotEndTime > existingStart && slotEndTime < existingEnd) ||
        (slotStartTime <= existingStart && slotEndTime >= existingEnd)
      );
    });

    if (hasOverlap) {
      toast.error('This time slot overlaps with an existing one.');
      return;
    }

    setNewTimeSlots(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        startTime: slotStartTime,
        endTime: slotEndTime,
      }
    ]);

    toast.success('Time slot added.');
  };

  const handleConfirmDelete = async () => {
    if (!slotToDelete) return;

    setIsDeleting(true);
    try {
      if (slotToDelete._id) {
        // existing slot, call DELETE API
        await axios.delete(`http://localhost:3500/api/availability/${slotToDelete._id}`, {
          withCredentials: true
        });
        setExistingTimeSlots(prev => prev.filter(s => s._id !== slotToDelete._id));
        toast.success('Time slot deleted.');
      } else {
        // new slot, just remove locally
        setNewTimeSlots(prev => prev.filter(s => s.id !== slotToDelete.id));
        toast.success('Time slot removed.');
      }
    } catch (error) {
      toast.error('Failed to delete time slot.');
      console.error(error);
    } finally {
      setIsDeleting(false);
      setSlotToDelete(null);
    }
  };

  const handleSubmitAvailability = async () => {
    if (newTimeSlots.length === 0) {
      toast.error('Please add at least one new time slot.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = newTimeSlots.map(slot => ({
        startTime: slot.startTime.toISOString(),
        endTime: slot.endTime.toISOString()
      }));

      await axios.post('http://localhost:3500/api/availability/', payload, {
        withCredentials: true
      });

      toast.success('Your availability has been submitted.');

      // Refresh the data
      fetchTimeSlots();
      setNewTimeSlots([]);
    } catch (error) {
      toast.error('Failed to submit availability.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading availability...
      </div>
    );
  }

  const allSlots = [...existingTimeSlots, ...newTimeSlots];

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
                  filterDate={(date) => !isWeekend(date)}
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
              <label className="block text-sm font-medium text-gray-700">End Time (Auto)</label>
              <div className="mt-1 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <input
                  type="text"
                  value={format(endTime, 'h:mm aa')}
                  disabled
                  className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm cursor-not-allowed"
                  readOnly
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
              Add Time Slot ({existingTimeSlots.length + newTimeSlots.length}/{MAX_SLOTS})
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

        {allSlots.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {allSlots.map((slot) => (
              <li key={slot._id || slot.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span className="font-medium text-gray-900">
                      {format(new Date(slot.startTime), 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSlotToDelete(slot)}
                    icon={<Trash2 size={16} />}
                  >
                    Remove
                  </Button>
                </div>

                <div className="mt-2 ml-7 text-sm text-gray-500">
                  <Clock className="mr-2 inline-block h-4 w-4 text-gray-400" aria-hidden="true" />
                  {format(new Date(slot.startTime), 'h:mm a')} - {format(new Date(slot.endTime), 'h:mm a')}
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

      {/* Modal for confirmation */}
      {slotToDelete && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Confirm Deletion</h2>
            <p className="text-gray-600">Are you sure you want to delete this time slot?</p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setSlotToDelete(null)} icon={<X size={18} />}>
                Cancel
              </Button>
              <Button variantClasses="danger" onClick={handleConfirmDelete} isLoading={isDeleting}>
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateAvailability;
