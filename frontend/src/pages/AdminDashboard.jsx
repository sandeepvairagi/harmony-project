import { useEffect, useState } from 'react';
import { Users, GraduationCap, Calendar, DollarSign } from 'lucide-react';
import api from '../services/api';
import { formatPrice, formatDate } from '../utils/formatters';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => {
      setData(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-sage-500">Loading analytics...</p>;

  const { stats, recentBookings } = data || {};

  const statCards = [
    { icon: Users, label: 'Users', value: stats?.users },
    { icon: GraduationCap, label: 'Instructors', value: stats?.instructors },
    { icon: Calendar, label: 'Bookings', value: stats?.bookings },
    { icon: DollarSign, label: 'Revenue', value: formatPrice(stats?.revenue || 0) },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-sage-900 dark:text-sage-100">
        Admin Dashboard
      </h1>
      <p className="text-sage-500 mt-1">Platform analytics and management</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {statCards.map((s) => (
          <div key={s.label} className="p-6 bg-white dark:bg-sage-800 rounded-2xl border border-sage-100 dark:border-sage-700">
            <s.icon className="text-sage-500 mb-3" size={24} />
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-sage-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-sage-800 rounded-2xl border border-sage-100 dark:border-sage-700 p-6">
          <h2 className="font-semibold mb-4">Bookings by Status</h2>
          <div className="space-y-2">
            {(stats?.bookingsByStatus || []).map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="capitalize text-sage-600 dark:text-sage-300">{item._id}</span>
                <span className="font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-sage-800 rounded-2xl border border-sage-100 dark:border-sage-700 p-6">
          <h2 className="font-semibold mb-4">Recent Bookings</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {(recentBookings || []).map((b) => (
              <div key={b._id} className="text-sm border-b border-sage-100 dark:border-sage-700 pb-2">
                <p className="font-medium">{b.user?.name} → {b.instructor?.name}</p>
                <p className="text-sage-500">
                  {formatDate(b.sessionDate)} · <span className="capitalize">{b.status}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-sage-100 dark:bg-sage-800 rounded-2xl">
        <h2 className="font-semibold mb-2">Admin Actions</h2>
        <p className="text-sm text-sage-600 dark:text-sage-400">
          Use the API endpoints to manage instructors, users, and bookings. Full CRUD is available via REST API documented in README and Postman collection.
        </p>
        <ul className="mt-3 text-sm text-sage-500 space-y-1">
          <li>POST /api/instructors — Add instructor</li>
          <li>GET /api/admin/dashboard — Analytics</li>
          <li>PUT /api/bookings/:id/status — Update booking</li>
          <li>GET /api/users — List users</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
