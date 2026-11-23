import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Video, X } from 'lucide-react';
import { fetchMyBookings, cancelBooking } from '../redux/slices/bookingSlice';
import Button from '../components/common/Button';
import { formatDate, formatPrice } from '../utils/formatters';

const statusColors = {
  confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-sage-100 text-sage-600',
  cancelled: 'bg-red-100 text-red-600',
};

const MySessions = () => {
  const dispatch = useDispatch();
  const { myBookings, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleCancel = (id) => {
    if (window.confirm('Cancel this booking?')) dispatch(cancelBooking(id));
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-sage-900 dark:text-sage-100">My Sessions</h1>
      <p className="text-sage-500 mt-1">View and manage your bookings</p>

      {loading ? (
        <p className="mt-8 text-sage-500">Loading...</p>
      ) : myBookings.length === 0 ? (
        <p className="mt-8 text-sage-500">No bookings yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {myBookings.map((b) => (
            <div
              key={b._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-sage-800 rounded-2xl border border-sage-100 dark:border-sage-700"
            >
              <div className="flex gap-4">
                <img
                  src={b.instructor?.avatar}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-semibold text-sage-800 dark:text-sage-100">{b.instructor?.name}</h3>
                  <p className="text-sm text-sage-500">
                    {formatDate(b.sessionDate)} · {b.startTime} - {b.endTime}
                  </p>
                  <p className="text-sm text-sage-500">{b.yogaType} · {formatPrice(b.price)}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full capitalize ${statusColors[b.status]}`}>
                    {b.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {b.meetingLink && b.status === 'confirmed' && (
                  <a
                    href={b.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-sage-600 text-white rounded-full text-sm hover:bg-sage-700 transition"
                  >
                    <Video size={16} /> Join Live
                  </a>
                )}
                {b.status === 'confirmed' && (
                  <Button variant="ghost" onClick={() => handleCancel(b._id)}>
                    <X size={16} /> Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySessions;
