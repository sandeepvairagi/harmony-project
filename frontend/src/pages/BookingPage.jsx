import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format, addDays } from 'date-fns';
import { fetchInstructor } from '../redux/slices/instructorSlice';
import { checkAvailability, createBooking, clearAvailability } from '../redux/slices/bookingSlice';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { formatPrice } from '../utils/formatters';
import { YOGA_CATEGORIES } from '../utils/constants';

const BookingPage = () => {
  const { instructorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current, loading, error } = useSelector((state) => state.instructors);
  const { availability, bookingLoading } = useSelector((state) => state.bookings);
  const [selectedDate, setSelectedDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [yogaType, setYogaType] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    dispatch(fetchInstructor(instructorId));
    return () => dispatch(clearAvailability());
  }, [dispatch, instructorId]);

  useEffect(() => {
    if (selectedDate) {
      dispatch(checkAvailability({ instructorId, date: selectedDate }));
    }
  }, [dispatch, instructorId, selectedDate]);

  const handleBook = async () => {
    if (!selectedSlot || !yogaType) return;
    const result = await dispatch(
      createBooking({
        instructorId,
        sessionDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        yogaType,
        notes,
      })
    );
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/my-sessions');
    }
  };

  const dates = Array.from({ length: 14 }, (_, i) =>
    format(addDays(new Date(), i + 1), 'yyyy-MM-dd')
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-sage-500">
        Loading instructor...
      </div>
    );
  }

  if (error || !current) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="font-display text-2xl font-bold text-sage-900 dark:text-sage-100">
          Instructor not found
        </h1>
        <p className="text-sage-500 mt-2">Unable to load booking for this instructor.</p>
        <Link to="/instructors" className="inline-block mt-6">
          <Button>Browse Instructors</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-sage-900 dark:text-sage-100 mb-2">
        Book Your Session
      </h1>
      {current && (
        <p className="text-sage-500 mb-8">
          with {current.name} · {formatPrice(current.sessionPrice)}
        </p>
      )}

      <div className="space-y-8 bg-white dark:bg-sage-800 p-8 rounded-2xl border border-sage-100 dark:border-sage-700">
        <div>
          <label className="block text-sm font-medium mb-3">Select Date</label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dates.map((d) => (
              <button
                key={d}
                onClick={() => {
                  setSelectedDate(d);
                  setSelectedSlot(null);
                }}
                className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  selectedDate === d
                    ? 'bg-sage-600 text-white'
                    : 'bg-sage-100 dark:bg-sage-700 text-sage-700 dark:text-sage-200 hover:bg-sage-200'
                }`}
              >
                {format(new Date(d), 'MMM d')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Available Time Slots</label>
          {availability.slots?.length === 0 ? (
            <p className="text-sage-500 text-sm">No slots available for this date.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availability.slots?.map((slot) => (
                <button
                  key={slot.startTime}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-3 rounded-xl text-sm font-medium transition ${
                    selectedSlot?.startTime === slot.startTime
                      ? 'bg-sage-600 text-white'
                      : 'bg-sage-100 dark:bg-sage-700 hover:bg-sage-200'
                  }`}
                >
                  {slot.startTime}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Yoga Type</label>
          <select
            value={yogaType}
            onChange={(e) => setYogaType(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-sage-200 dark:border-sage-600 bg-sage-50 dark:bg-sage-900"
          >
            <option value="">Select type</option>
            {(current?.yogaTypes || YOGA_CATEGORIES.map((c) => c.name)).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-sage-200 dark:border-sage-600 bg-sage-50 dark:bg-sage-900 resize-none"
            placeholder="Any special requests..."
          />
        </div>

        <Button
          onClick={handleBook}
          loading={bookingLoading}
          disabled={!selectedSlot || !yogaType}
          className="w-full"
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  );
};

export default BookingPage;
