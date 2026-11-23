import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Heart, Sparkles, Bell } from 'lucide-react';
import { fetchMyBookings } from '../redux/slices/bookingSlice';
import { fetchRecommendations } from '../redux/slices/instructorSlice';
import InstructorCard from '../components/instructors/InstructorCard';
import api from '../services/api';
import { formatDate, formatPrice } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { myBookings } = useSelector((state) => state.bookings);
  const { recommendations } = useSelector((state) => state.instructors);
  const [notifications, setNotifications] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    dispatch(fetchMyBookings());
    dispatch(fetchRecommendations());
    api.get('/users/recently-viewed').then(({ data }) => setRecentlyViewed(data.data || []));
    api.get('/notifications').then(({ data }) => setNotifications(data.data?.slice(0, 5) || []));
  }, [dispatch]);

  const upcoming = myBookings.filter(
    (b) => b.status === 'confirmed' && new Date(b.sessionDate) >= new Date()
  );

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-sage-900 dark:text-sage-100">
        Hello, {user?.name?.split(' ')[0]} 👋
      </h1>
      <p className="text-sage-500 mt-1">Your wellness dashboard</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[
          { icon: Calendar, label: 'Upcoming', value: upcoming.length },
          { icon: Heart, label: 'Favorites', value: user?.favorites?.length || 0 },
          { icon: Sparkles, label: 'AI Matches', value: recommendations.length },
          { icon: Bell, label: 'Notifications', value: notifications.filter((n) => !n.isRead).length },
        ].map((stat) => (
          <div key={stat.label} className="p-5 bg-white dark:bg-sage-800 rounded-2xl border border-sage-100 dark:border-sage-700">
            <stat.icon className="text-sage-500 mb-2" size={22} />
            <p className="text-2xl font-bold text-sage-800 dark:text-sage-100">{stat.value}</p>
            <p className="text-sm text-sage-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Upcoming Sessions</h2>
          <Link to="/my-sessions" className="text-sm text-sage-600 hover:underline">View all</Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="p-8 bg-white dark:bg-sage-800 rounded-2xl border border-dashed border-sage-200 dark:border-sage-600 text-center">
            <p className="text-sage-500">No upcoming sessions</p>
            <Link to="/instructors" className="inline-block mt-4 text-sage-600 font-medium hover:underline">
              Book your first session →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 3).map((b) => (
              <div key={b._id} className="flex items-center justify-between p-4 bg-white dark:bg-sage-800 rounded-xl border border-sage-100 dark:border-sage-700">
                <div>
                  <p className="font-medium">{b.instructor?.name}</p>
                  <p className="text-sm text-sage-500">
                    {formatDate(b.sessionDate)} · {b.startTime} · {b.yogaType}
                  </p>
                </div>
                <span className="text-sm font-medium text-sage-600">{formatPrice(b.price)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {recommendations.length > 0 && (
        <section className="mt-12">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-coral-500" /> AI Recommendations
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {recommendations.slice(0, 2).map((inst) => (
              <InstructorCard key={inst._id} instructor={inst} />
            ))}
          </div>
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section className="mt-12">
          <h2 className="font-semibold text-lg mb-4">Recently Viewed</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {recentlyViewed.slice(0, 2).map((item) =>
              item.instructor ? (
                <InstructorCard key={item.instructor._id} instructor={item.instructor} />
              ) : null
            )}
          </div>
        </section>
      )}

      {notifications.length > 0 && (
        <section className="mt-12">
          <h2 className="font-semibold text-lg mb-4">Recent Notifications</h2>
          <div className="space-y-2">
            {notifications.map((n) => (
              <div key={n._id} className={`p-4 rounded-xl border ${n.isRead ? 'bg-sage-50 dark:bg-sage-800/50 border-sage-100' : 'bg-white dark:bg-sage-800 border-sage-200'}`}>
                <p className="font-medium text-sm">{n.title}</p>
                <p className="text-sm text-sage-500">{n.message}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
